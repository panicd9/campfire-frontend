"use client";

import Navbar from "@/components/Global/Navbar";
import Footer from "@/components/Global/Footer";
import ProgressBar from "@/components/Global/ProgressBar";
import RangeSlider from "@/components/Global/RangeSlider";
import { useState, use, useEffect } from "react";
import { getFundingPoolById } from "@/lib/fundingPools";
import type { FundingPool } from "@/lib/fundingPools";
import { getCoinById } from "@/lib/data";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { BN, utils } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  getExtraAccountMetaAddress,
  getMint,
} from "@solana/spl-token";
import {
  AccountMeta,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { useCrowdfundingProgram } from "../../../../solana/crowdfunding/useCrowdfundingProgram";
import { useRwaTransferHookProgram } from "../../../../solana/rwaTransferHook/useRwaTransferHookProgram";
import {
  PRECISION,
  PRECISSION_BN,
  amountToRawAmount,
  parseTokenAmountUI,
  shortenSignature,
} from "../../../../solana/utils";
import { animations } from "@/lib/animations";

const RWA_SYMBOL = "CF-WIND1";

const formatTokenAmountPlain = (rawAmount: BN, decimals: number): string => {
  if (decimals === 0) {
    return rawAmount.toString();
  }

  const base = new BN(10).pow(new BN(decimals));
  const whole = rawAmount.div(base).toString();
  const fraction = rawAmount.mod(base).toString().padStart(decimals, "0");
  const trimmedFraction = fraction.replace(/0+$/, "");

  return trimmedFraction.length > 0 ? `${whole}.${trimmedFraction}` : whole;
};

const isAccountMissingError = (error: unknown) => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("account does not exist") ||
      message.includes("could not find account") ||
      message.includes("account not found")
    );
  }

  return false;
};

const SCALE_BIGINT = BigInt("1000000000000");

// Simulate settle_holder logic from Solana program
interface MintStateSim {
  global_index: bigint;
  acc_reward_per_index: bigint;
}

interface HolderLedgerSim {
  last_index: bigint;
  pending_index_credits: bigint;
  last_acc_per_index_applied: bigint;
  pending_rewards: bigint;
}

function simulateSettleHolder(
  mintState: MintStateSim,
  holderLedger: HolderLedgerSim,
  userTokenBalance: bigint
): { claimableYield: bigint; updatedLedger: HolderLedgerSim } {
  // Clone ledger to avoid mutating input
  let ledger = { ...holderLedger };

  // 1) Push index credits
  const d_index = mintState.global_index - ledger.last_index;
  if (d_index > 0n) {
    ledger.pending_index_credits += userTokenBalance * d_index;
    ledger.last_index = mintState.global_index;
  }

  // 2) Apply new rewards-per-index
  const d_acc = mintState.acc_reward_per_index - ledger.last_acc_per_index_applied;
  if (d_acc > 0n && ledger.pending_index_credits > 0n) {
    ledger.pending_rewards += (ledger.pending_index_credits * d_acc) / SCALE_BIGINT;
    ledger.pending_index_credits = 0n;
    ledger.last_acc_per_index_applied = mintState.acc_reward_per_index;
  }

  // 3) Claimable yield (integer division)
  const claimableYield = ledger.pending_rewards;

  return { claimableYield, updatedLedger: ledger };
}

const toBigInt = (value: BN | bigint | number | string | null | undefined) => {
  if (value === null || value === undefined) {
    return BigInt(0);
  }

  if (typeof value === "bigint") {
    return value;
  }

  if (typeof value === "number") {
    return BigInt(value);
  }

  if (typeof value === "string") {
    return BigInt(value);
  }

  return BigInt(value.toString());
};

interface DepositorInfoStats {
  depositedUsdc: BN;
  claimableRwa: BN;
  claimableYield: BN;
}

interface FundingPoolPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FundingPoolDetailPage({
  params,
}: FundingPoolPageProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [initialInvestment, setInitialInvestment] = useState(5000);
  const [investmentDuration, setInvestmentDuration] = useState(3);
  const [depositAmount, setDepositAmount] = useState("");
  const [claimMode, setClaimMode] = useState<"rwa" | "yield">("rwa");
  const [claimRwaAmount, setClaimRwaAmount] = useState("");
  const [claimYieldAmount, setClaimYieldAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [depositSignature, setDepositSignature] = useState<string | null>(null);
  const [userDepositBalance, setUserDepositBalance] = useState("0.000000");
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [depositorInfoStats, setDepositorInfoStats] =
    useState<DepositorInfoStats>({
      depositedUsdc: new BN(0),
      claimableRwa: new BN(0),
      claimableYield: new BN(0),
    });
  const [depositMintDecimals, setDepositMintDecimals] = useState(6);
  const [rwaMintDecimalsState, setRwaMintDecimalsState] = useState(6);
  const [isDepositorInfoLoading, setIsDepositorInfoLoading] = useState(false);
  const [pool, setPool] = useState<FundingPool | null>(null);
  const [isLoadingPool, setIsLoadingPool] = useState(true);
  const [poolError, setPoolError] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSignature, setRedeemSignature] = useState<string | null>(null);
  const resolvedParams = use(params);
  const { program, provider } = useCrowdfundingProgram();
  const { program: rwaProgram } = useRwaTransferHookProgram();
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const usdcCoin = getCoinById("usdc");
  const cfWindCoin = getCoinById("cf-wind1");

  useEffect(() => {
    let isActive = true;

    const loadPool = async () => {
      setIsLoadingPool(true);
      setPoolError(null);

      try {
        const pool = await getFundingPoolById(resolvedParams.id);
        if (!isActive) return;
        setPool(pool ?? null);
      } catch (error) {
        console.error("Failed to load funding pool", error);
        if (!isActive) return;
        setPool(null);
        setPoolError("We couldn't load this funding pool. Please try again.");
      } finally {
        if (isActive) setIsLoadingPool(false);
      }
    };

    void loadPool();

    return () => {
      isActive = false;
    };
  }, [resolvedParams.id]);

  useEffect(() => {
    let isActive = true;

    const fetchUserBalance = async () => {
      if (!connected || !publicKey || !program || !provider) {
        if (isActive) {
          setUserDepositBalance("0.000000");
        }
        return;
      }

      if (!pool) {
        if (isActive) {
          setUserDepositBalance("0.000000");
        }
        return;
      }

      const poolIdString = resolvedParams.id;

      if (!/^\d+$/.test(poolIdString)) {
        if (isActive) {
          setUserDepositBalance("0.000000");
        }
        return;
      }

      setIsBalanceLoading(true);

      try {
        const poolId = new BN(poolIdString);
        const poolIdSeed = poolId.toArrayLike(Uint8Array, "le", 8);
        const poolSeed = utils.bytes.utf8.encode("pool");

        let depositMintPublicKey: PublicKey;

        if (pool.chainData?.depositMint) {
          depositMintPublicKey = new PublicKey(pool.chainData.depositMint);
        } else {
          const [poolPda] = PublicKey.findProgramAddressSync(
            [poolSeed, poolIdSeed],
            program.programId
          );

          const onChainPool = await program.account.fundingPool.fetch(poolPda);
          depositMintPublicKey = new PublicKey(onChainPool.depositMint);
        }

        const userDepositAta = getAssociatedTokenAddressSync(
          depositMintPublicKey,
          publicKey
        );

        const userAtaInfo = await provider.connection.getAccountInfo(
          userDepositAta
        );

        if (!userAtaInfo) {
          if (isActive) {
            setUserDepositBalance("0.000000");
          }
          return;
        }

        const tokenBalance = await provider.connection.getTokenAccountBalance(
          userDepositAta
        );

        if (!isActive) {
          return;
        }

        const decimals = tokenBalance.value.decimals;
        const formatted = parseTokenAmountUI(
          new BN(tokenBalance.value.amount),
          decimals,
          2
        );

        setUserDepositBalance(formatted);
      } catch (error) {
        console.error("Failed to fetch deposit balance", error);

        if (isActive) {
          setUserDepositBalance("0.000000");
        }
      } finally {
        if (isActive) {
          setIsBalanceLoading(false);
        }
      }
    };

    void fetchUserBalance();

    return () => {
      isActive = false;
    };
  }, [
    connected,
    publicKey,
    program,
    provider,
    resolvedParams.id,
    pool,
    depositSignature,
  ]);

  useEffect(() => {
    let isActive = true;

    const resetDepositorInfo = () => {
      if (!isActive) {
        return;
      }

      setDepositorInfoStats({
        depositedUsdc: new BN(0),
        claimableRwa: new BN(0),
        claimableYield: new BN(0),
      });
      console.log("[DEBUG] resetDepositorInfo: claimableYield set to 0");
      setDepositMintDecimals(6);
      setRwaMintDecimalsState(6);
      setClaimRwaAmount("");
      setClaimYieldAmount("");
      setClaimMode("rwa");
    };

    const fetchDepositorInfo = async () => {
      if (!connected || !publicKey || !program || !provider) {
        resetDepositorInfo();
        if (isActive) {
          setIsDepositorInfoLoading(false);
        }
        return;
      }

      if (!pool) {
        resetDepositorInfo();
        if (isActive) {
          setIsDepositorInfoLoading(false);
        }
        return;
      }

      const poolIdString = resolvedParams.id;

      if (!/^\d+$/.test(poolIdString)) {
        resetDepositorInfo();
        if (isActive) {
          setIsDepositorInfoLoading(false);
        }
        return;
      }

      setIsDepositorInfoLoading(true);

      try {
        const poolId = new BN(poolIdString);
        const poolIdSeed = poolId.toArrayLike(Uint8Array, "le", 8);
        const poolSeed = utils.bytes.utf8.encode("pool");
        const depositorInfoSeed = utils.bytes.utf8.encode("depositor-info");

        const [poolPda] = PublicKey.findProgramAddressSync(
          [poolSeed, poolIdSeed],
          program.programId
        );

        const onChainPool = await program.account.fundingPool.fetch(poolPda);

        const depositMintPublicKey = pool.chainData?.depositMint
          ? pool.chainData.depositMint
          : new PublicKey(onChainPool.depositMint);

        const depositMintInfo = await getMint(
          provider.connection,
          depositMintPublicKey
        );
        setDepositMintDecimals(depositMintInfo.decimals);

        const [depositorInfoPda] = PublicKey.findProgramAddressSync(
          [depositorInfoSeed, publicKey.toBuffer(), poolIdSeed],
          program.programId
        );

        let depositorInfo: { deposited: BN; claimed: BN } | null = null;

        try {
          depositorInfo = await program.account.depositorInfo.fetch(
            depositorInfoPda
          );
        } catch (error) {
          if (!isAccountMissingError(error)) {
            throw error;
          }
        }

        const depositedRaw = depositorInfo?.deposited ?? new BN(0);
        const claimedRwaRaw = depositorInfo?.claimed ?? new BN(0);

        const rwaMintPublicKey = (onChainPool.rwaMint ??
          null) as PublicKey | null;
        const rwaVaultPublicKey = (onChainPool.rwaVault ??
          null) as PublicKey | null;

  let rwaMintDecimals: number | null = null;
  let claimableRwaRaw = new BN(0);
  let claimableYieldRawBigInt = BigInt(0);
  let rwaMintInfo: Awaited<ReturnType<typeof getMint>> | null = null;
        // Debug: log all relevant state
        console.log("[DEBUG] DepositorInfo: depositedRaw", depositedRaw.toString());
        console.log("[DEBUG] DepositorInfo: claimedRwaRaw", claimedRwaRaw.toString());

        console.log(
          "RWA Mint Public Key:",
          rwaMintPublicKey?.toBase58() ?? "null"
        );
        if (rwaMintPublicKey) {
          try {
            rwaMintInfo = await getMint(
              provider.connection,
              rwaMintPublicKey,
              "confirmed",
              TOKEN_2022_PROGRAM_ID
            );
            rwaMintDecimals = rwaMintInfo.decimals;

            const totalDepositedRaw = onChainPool.totalDeposited as BN;
            const totalRwaSupplyRaw = onChainPool.rwaTotalSupply as BN;

            console.log("[DEBUG] RWA Mint Decimals:", rwaMintDecimals);
            console.log("[DEBUG] Total Deposited Raw:", totalDepositedRaw.toString());
            console.log("[DEBUG] Total RWA Supply Raw:", totalRwaSupplyRaw.toString());

            if (!totalDepositedRaw.isZero()) {
              const entitlement = totalRwaSupplyRaw
                .mul(depositedRaw)
                .div(totalDepositedRaw);
              claimableRwaRaw = entitlement.sub(claimedRwaRaw);
              if (claimableRwaRaw.isNeg()) {
                claimableRwaRaw = new BN(0);
              }
              console.log("[DEBUG] Entitlement:", entitlement.toString());
              console.log("[DEBUG] Claimable RWA Raw:", claimableRwaRaw.toString());
              if (rwaVaultPublicKey) {
                try {
                  const vaultBalance =
                    await provider.connection.getTokenAccountBalance(
                      rwaVaultPublicKey
                    );
                  const vaultBalanceRaw = new BN(vaultBalance.value.amount);
                  console.log("[DEBUG] RWA Vault Balance Raw:", vaultBalanceRaw.toString());
                  if (claimableRwaRaw.gt(vaultBalanceRaw)) {
                    claimableRwaRaw = vaultBalanceRaw;
                  }
                } catch (error) {
                  if (!isAccountMissingError(error)) {
                    console.error("Failed to fetch RWA vault balance", error);
                  }
                }
              }
            }
            // Always set claimableYieldRawBigInt to simulated value if available
            // This ensures UI matches backend simulation
            if (typeof claimableYieldRawBigInt === "bigint" && claimableYieldRawBigInt >= 0n) {
              // Already set by simulation above, nothing to do
            } else {
              claimableYieldRawBigInt = BigInt(0);
            }

            if (rwaProgram) {

              try {
                const mintStateSeed = utils.bytes.utf8.encode("state");
                const ledgerSeed = utils.bytes.utf8.encode("ledger");
                const vaultSeed = utils.bytes.utf8.encode("vault");

                const [mintStatePda] = PublicKey.findProgramAddressSync(
                  [mintStateSeed, rwaMintPublicKey.toBuffer()],
                  rwaProgram.programId
                );

                const mintState = await rwaProgram.account.mintState.fetch(
                  mintStatePda
                );

                const [holderLedgerPda] = PublicKey.findProgramAddressSync(
                  [
                    ledgerSeed,
                    publicKey.toBuffer(),
                    rwaMintPublicKey.toBuffer(),
                  ],
                  rwaProgram.programId
                );

                let holderLedger: Awaited<
                  ReturnType<typeof rwaProgram.account.holderLedger.fetch>
                > | null = null;

                try {
                  holderLedger = await rwaProgram.account.holderLedger.fetch(
                    holderLedgerPda
                  );
                } catch (error) {
                  if (!isAccountMissingError(error)) {
                    throw error;
                  }
                }

                console.log("[DEBUG] RWA Mint Public Key:", rwaMintPublicKey.toBase58());
                console.log("[DEBUG] My Public Key:", publicKey.toBase58());
                console.log("[DEBUG] HolderLedger:", holderLedger);

                // Ensure holderTokenAta and holderTokenAmount are defined before use
                const holderTokenAta = getAssociatedTokenAddressSync(
                  rwaMintPublicKey,
                  publicKey,
                  false,
                  TOKEN_2022_PROGRAM_ID
                );
                let holderTokenAmount = BigInt(0);

                try {
                  const holderTokenBalance =
                    await provider.connection.getTokenAccountBalance(
                      holderTokenAta
                    );
                  holderTokenAmount = BigInt(holderTokenBalance.value.amount);
                  console.log("[DEBUG] Holder Token Amount:", holderTokenAmount.toString());
                } catch (error) {
                  if (!isAccountMissingError(error)) {
                    console.error("Failed to load holder token balance", error);
                  }
                }

                const mintSupplyBigInt = toBigInt(
                  rwaMintInfo ? rwaMintInfo.supply : 0
                );
                console.log("[DEBUG] Mint Supply BigInt:", mintSupplyBigInt.toString());

                // --- Simulate settle_holder for claimable yield ---
                if (holderLedger && mintState) {
                  // Log index and reward fields for debugging
                  console.log("MintState.global_index:", mintState.globalIndex.toString());
                  console.log("HolderLedger.lastIndex:", holderLedger.lastIndex.toString());
                  console.log("MintState.acc_reward_per_index:", mintState.accRewardPerIndex.toString());
                  console.log("HolderLedger.lastAccPerIndexApplied:", holderLedger.lastAccPerIndexApplied.toString());

                  const mintStateSim: MintStateSim = {
                    global_index: toBigInt(mintState.globalIndex),
                    acc_reward_per_index: toBigInt(mintState.accRewardPerIndex),
                  };
                  const holderLedgerSim: HolderLedgerSim = {
                    last_index: toBigInt(holderLedger.lastIndex),
                    pending_index_credits: toBigInt(holderLedger.pendingIndexCredits),
                    last_acc_per_index_applied: toBigInt(holderLedger.lastAccPerIndexApplied),
                    pending_rewards: toBigInt(holderLedger.pendingRewards),
                  };
                  const userTokenBalanceBigInt = holderTokenAmount;
                  const { claimableYield } = simulateSettleHolder(
                    mintStateSim,
                    holderLedgerSim,
                    userTokenBalanceBigInt
                  );
                  // Assign simulated value to outer variable
                  claimableYieldRawBigInt = claimableYield;
                  console.log("[DEBUG] Simulated Claimable Yield:", claimableYieldRawBigInt.toString());
                }

                // Cap claimable yield to vault balance
                const [yieldVaultPda] = PublicKey.findProgramAddressSync(
                  [vaultSeed, rwaMintPublicKey.toBuffer()],
                  rwaProgram.programId
                );
                try {
                  const vaultBalance =
                    await provider.connection.getTokenAccountBalance(
                      yieldVaultPda
                    );
                  const vaultBalanceRaw = BigInt(vaultBalance.value.amount);
                  console.log("[DEBUG] Yield Vault Balance Raw:", vaultBalanceRaw.toString());
                  if (claimableYieldRawBigInt > vaultBalanceRaw) {
                    claimableYieldRawBigInt = vaultBalanceRaw;
                  }
                } catch (error) {
                  if (!isAccountMissingError(error)) {
                    console.error("Failed to fetch yield vault balance", error);
                  }
                }
                console.log("[DEBUG] Final Claimable Yield Raw:", claimableYieldRawBigInt.toString());
              } catch (error) {
                if (!isAccountMissingError(error)) {
                  console.error("Failed to compute yield claimable", error);
                }
              }
            }
          } catch (error) {
            console.error("Failed to load RWA mint info", error);
          }
        }

        if (!isActive) {
          return;
        }

        const effectiveRwaDecimals =
          rwaMintDecimals ?? depositMintInfo.decimals;
        setRwaMintDecimalsState(effectiveRwaDecimals);

        // Use the simulated claimableYield value (from simulation and vault cap)
        const claimableYieldRawBn = new BN(claimableYieldRawBigInt.toString());
        setDepositorInfoStats({
          depositedUsdc: depositedRaw,
          claimableRwa: claimableRwaRaw,
          claimableYield: claimableYieldRawBn,
        });
        console.log("[DEBUG] setDepositorInfoStats: claimableYield set to", claimableYieldRawBn.toString());
      } catch (error) {
        if (!isAccountMissingError(error)) {
          console.error("Failed to fetch depositor info", error);
        }

        resetDepositorInfo();
      } finally {
        if (isActive) {
          setIsDepositorInfoLoading(false);
        }
      }
    };

    void fetchDepositorInfo();

    return () => {
      isActive = false;
    };
  }, [
    connected,
    publicKey,
    program,
    provider,
    resolvedParams.id,
    pool,
    depositSignature,
    rwaProgram,
  ]);

  if (isLoadingPool) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="bottom-logo-box">
          <section className="screen-wrapper">
            <div className="container">
              <p>Loading funding pool...</p>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }

  if (poolError) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="bottom-logo-box">
          <section className="screen-wrapper">
            <div className="container">
              <h1>Something went wrong</h1>
              <p>{poolError}</p>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }

  const handleDeposit = async () => {
    if (!connected || !publicKey) {
      setDepositError("Connect your wallet to deposit.");
      setDepositSignature(null);
      setVisible(true);
      return;
    }

    if (!program || !provider) {
      setDepositError(
        "Wallet provider is not ready. Please reconnect and try again."
      );
      return;
    }

    const poolIdString = resolvedParams.id;

    if (!/^\d+$/.test(poolIdString)) {
      setDepositError("Invalid funding pool identifier.");
      return;
    }

    const rawInput = depositAmount.trim();

    if (!rawInput) {
      setDepositError("Enter an amount to deposit.");
      return;
    }

    setIsDepositing(true);
    setDepositError(null);
    setDepositSignature(null);

    try {
      const poolId = new BN(poolIdString);
      const poolIdSeed = poolId.toArrayLike(Uint8Array, "le", 8);
      const poolSeed = utils.bytes.utf8.encode("pool");
      const poolAuthoritySeed = utils.bytes.utf8.encode("pool-authority");
      const depositorInfoSeed = utils.bytes.utf8.encode("depositor-info");

      const [poolPda] = PublicKey.findProgramAddressSync(
        [poolSeed, poolIdSeed],
        program.programId
      );

      const [poolAuthority] = PublicKey.findProgramAddressSync(
        [poolAuthoritySeed, poolIdSeed],
        program.programId
      );

      const [depositorInfo] = PublicKey.findProgramAddressSync(
        [depositorInfoSeed, publicKey.toBytes(), poolIdSeed],
        program.programId
      );

      const poolAccount = await program.account.fundingPool.fetch(poolPda);
      const depositMintPublicKey = new PublicKey(poolAccount.depositMint);

      const mintInfo = await getMint(provider.connection, depositMintPublicKey);
      const rawAmount = amountToRawAmount(rawInput, mintInfo.decimals);

      const depositVaultAta = getAssociatedTokenAddressSync(
        depositMintPublicKey,
        poolAuthority,
        true,
      );

      const userDepositAta = getAssociatedTokenAddressSync(
        depositMintPublicKey,
        publicKey
      );

      const instructions: TransactionInstruction[] = [];

      const userAtaInfo = await provider.connection.getAccountInfo(
        userDepositAta
      );

      if (!userAtaInfo) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userDepositAta,
            publicKey,
            depositMintPublicKey
          )
        );
      }

      console.log("Depositing raw amount:", rawAmount.toString());

      const method = program.methods.deposit(poolId, rawAmount).accountsStrict({
        user: publicKey,
        pool: poolPda,
        poolAuthority,
        depositVault: depositVaultAta,
        userDepositAta,
        depositorInfo,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        depositMint: depositMintPublicKey,
      });

      if (instructions.length > 0) {
        method.preInstructions(instructions);
      }

      const signature = await method.rpc();

      setDepositSignature(signature);
      setDepositAmount("");
    } catch (error) {
      console.error("Deposit failed", error);
      let message = "Deposit failed. Please try again.";

      if (error instanceof Error && error.message) {
        message = error.message;
      }

      setDepositError(message);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleRedeem = async () => {
    if (!connected || !publicKey) {
      setRedeemError("Connect your wallet to redeem.");
      setRedeemSignature(null);
      setVisible(true);
      return;
    }

    if (!program || !provider) {
      setRedeemError(
        "Wallet provider is not ready. Please reconnect and try again."
      );
      return;
    }

    if (!rwaProgram) {
      setRedeemError(
        "RWA transfer hook program is not ready. Please reconnect and try again."
      );
      return;
    }

    if (!pool) {
      setRedeemError("Pool information not loaded.");
      return;
    }

    // Handle yield claim
    if (claimMode === "yield") {
      // Only allow if there is claimable yield
      if (!hasClaimableYield) {
        setRedeemError("No claimable yield available.");
        return;
      }
      setIsRedeeming(true);
      setRedeemError(null);
      setRedeemSignature(null);
      try {
        // Derive all required accounts and PDAs
        const poolIdString = resolvedParams.id;
        const poolId = new BN(poolIdString);
        const poolIdSeed = poolId.toArrayLike(Uint8Array, "le", 8);
        const poolSeed = utils.bytes.utf8.encode("pool");
        const [poolPda] = PublicKey.findProgramAddressSync(
          [poolSeed, poolIdSeed],
          program.programId
        );
        const poolAccount = await program.account.fundingPool.fetch(poolPda);
        if (!poolAccount.rwaMint) {
          setRedeemError("RWA tokens not yet issued for this pool.");
          setIsRedeeming(false);
          return;
        }
        const rwaMint = poolAccount.rwaMint as PublicKey;
        // Yield mint is USDC (depositMint)
        const yieldMint = new PublicKey(poolAccount.depositMint);

        // Derive PDAs for rwa_transfer_hook program
        const mintStateSeed = utils.bytes.utf8.encode("state");
        const ledgerSeed = utils.bytes.utf8.encode("ledger");
        const vaultSeed = utils.bytes.utf8.encode("vault");
        const [mintStatePda] = PublicKey.findProgramAddressSync(
          [mintStateSeed, rwaMint.toBuffer()],
          rwaProgram.programId
        );
        const [holderLedgerPda] = PublicKey.findProgramAddressSync(
          [ledgerSeed, publicKey.toBuffer(), rwaMint.toBuffer()],
          rwaProgram.programId
        );
        const [vaultPda] = PublicKey.findProgramAddressSync(
          [vaultSeed, rwaMint.toBuffer()],
          rwaProgram.programId
        );

        // Holder's RWA token account
        const holderTokenAta = getAssociatedTokenAddressSync(
          rwaMint,
          publicKey,
          false,
          TOKEN_2022_PROGRAM_ID
        );
        // Claimant's yield ATA (USDC)
        const claimantYieldAta = getAssociatedTokenAddressSync(
          yieldMint,
          publicKey
        );
        // Check if claimantYieldAta exists, create if missing
        const claimantYieldAtaInfo = await provider.connection.getAccountInfo(claimantYieldAta);
        const instructions: TransactionInstruction[] = [];
        if (!claimantYieldAtaInfo) {
          instructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              claimantYieldAta,
              publicKey,
              yieldMint
            )
          );
        }

        // Log all accounts for debugging
        console.log("Yield Claim Accounts:", {
          claimant: publicKey?.toBase58(),
          rwaMint: rwaMint?.toBase58(),
          mintState: mintStatePda?.toBase58(),
          holderToken: holderTokenAta?.toBase58(),
          holderLedger: holderLedgerPda?.toBase58(),
          vault: vaultPda?.toBase58(),
          yieldMint: yieldMint?.toBase58(),
          claimantYieldAta: claimantYieldAta?.toBase58(),
          tokenProgram: TOKEN_PROGRAM_ID?.toBase58?.() ?? TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId?.toBase58?.() ?? SystemProgram.programId,
        });

        // Build claim instruction
        const method = rwaProgram.methods.claim().accounts({
          claimant: publicKey,
          rwaMint,
          mintState: mintStatePda,
          holderToken: holderTokenAta,
          holderLedger: holderLedgerPda,
          vault: vaultPda,
          yieldMint,
          claimantYieldAta,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        });
        if (instructions.length > 0) {
          method.preInstructions(instructions);
        }
        const signature = await method.rpc();
        setRedeemSignature(signature);
        setRedeemError(null);
        setTimeout(() => {
          setIsDepositorInfoLoading(true);
        }, 1000);
        setIsRedeeming(false);
        return;
      } catch (error) {
        console.error("Yield claim failed", error);
        let message = "Yield claim failed. Please try again.";
        if (error instanceof Error && error.message) {
          message = error.message;
        }
        setRedeemError(message);
        setIsRedeeming(false);
        return;
      }
    }

    const poolIdString = resolvedParams.id;

    if (!/^\d+$/.test(poolIdString)) {
      setRedeemError("Invalid funding pool identifier.");
      return;
    }

    setIsRedeeming(true);
    setRedeemError(null);
    setRedeemSignature(null);

    try {
      const poolId = new BN(poolIdString);
      const poolIdSeed = poolId.toArrayLike(Uint8Array, "le", 8);
      const poolSeed = utils.bytes.utf8.encode("pool");
      const poolAuthoritySeed = utils.bytes.utf8.encode("pool-authority");
      const depositorInfoSeed = utils.bytes.utf8.encode("depositor-info");

      // Derive PDAs
      const [poolPda] = PublicKey.findProgramAddressSync(
        [poolSeed, poolIdSeed],
        program.programId
      );

      const [poolAuthorityPda] = PublicKey.findProgramAddressSync(
        [poolAuthoritySeed, poolIdSeed],
        program.programId
      );

      const [depositorInfoPda] = PublicKey.findProgramAddressSync(
        [depositorInfoSeed, publicKey.toBuffer(), poolIdSeed],
        program.programId
      );

      // Fetch pool to get RWA mint address
      const poolAccount = await program.account.fundingPool.fetch(poolPda);

      if (!poolAccount.rwaMint) {
        setRedeemError("RWA tokens not yet issued for this pool.");
        setIsRedeeming(false);
        return;
      }

      const rwaMint = poolAccount.rwaMint as PublicKey;

      // Derive token accounts
      const rwaVaultAta = getAssociatedTokenAddressSync(
        rwaMint,
        poolAuthorityPda,
        true, // allowOwnerOffCurve (PDA)
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const userRwaAta = getAssociatedTokenAddressSync(
        rwaMint,
        publicKey,
        false, // User wallet is not off-curve
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const extraMetasAccount = getExtraAccountMetaAddress(
        rwaMint,
        rwaProgram.programId
      );

      const mintStateSeed = utils.bytes.utf8.encode("state");
      const ledgerSeed = utils.bytes.utf8.encode("ledger");

      const [mintStatePda] = PublicKey.findProgramAddressSync(
        [mintStateSeed, rwaMint.toBuffer()],
        rwaProgram.programId
      );

      const [sourceLedgerPda] = PublicKey.findProgramAddressSync(
        [ledgerSeed, poolAuthorityPda.toBuffer(), rwaMint.toBuffer()],
        rwaProgram.programId
      );

      const [destinationLedgerPda] = PublicKey.findProgramAddressSync(
        [ledgerSeed, publicKey.toBuffer(), rwaMint.toBuffer()],
        rwaProgram.programId
      );

      const remainingAccounts: AccountMeta[] = [
        { pubkey: rwaProgram.programId, isSigner: false, isWritable: false },
        { pubkey: rwaVaultAta, isSigner: false, isWritable: true },
        { pubkey: rwaMint, isSigner: false, isWritable: false },
        { pubkey: userRwaAta, isSigner: false, isWritable: true },
        { pubkey: poolAuthorityPda, isSigner: false, isWritable: false },
        { pubkey: extraMetasAccount, isSigner: false, isWritable: false },
        { pubkey: mintStatePda, isSigner: false, isWritable: true },
        { pubkey: sourceLedgerPda, isSigner: false, isWritable: true },
        { pubkey: destinationLedgerPda, isSigner: false, isWritable: true },
      ];

      // Execute redeem
      const signature = await program.methods
        .redeem(poolId)
        .accountsStrict({
          pool: poolPda,
          poolAuthority: poolAuthorityPda,
          rwaVault: rwaVaultAta,
          rwaMint: rwaMint,
          userRwaAta: userRwaAta,
          depositorInfo: depositorInfoPda,
          user: publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .remainingAccounts(remainingAccounts)
        .rpc({
          // skipPreflight: true,
        });

      setRedeemSignature(signature);
      console.log("Redeem successful! Transaction:", signature);

      // Refresh depositor info after successful redeem
      setTimeout(() => {
        // Trigger re-fetch by calling the effect dependencies
        setIsDepositorInfoLoading(true);
      }, 1000);
    } catch (error) {
      console.error("Redeem failed", error);
      let message = "Redeem failed. Please try again.";

      if (error instanceof Error && error.message) {
        message = error.message;
      }

      setRedeemError(message);
    } finally {
      setIsRedeeming(false);
    }
  };

  if (!pool) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="bottom-logo-box">
          <section className="screen-wrapper">
            <div className="container">
              <h1>Funding Pool Not Found</h1>
              <p>The requested funding pool does not exist.</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const poolDepositLimit = pool.chainData?.depositLimit;
  const poolTotalDeposited = pool.chainData?.totalDeposited;
  console.log("Pool: ", pool);
  console.log("Pool Deposit Limit:", poolDepositLimit?.toString());
  console.log("Pool Total Deposited:", poolTotalDeposited?.toString());

  const raisedDisplay = poolTotalDeposited
    ? `${parseTokenAmountUI(poolTotalDeposited, 6, 0)} ${pool.currency}`
    : `$${pool.fundingRaised.toLocaleString()}`;

  const targetDisplay = poolDepositLimit
    ? `${parseTokenAmountUI(poolDepositLimit, 6, 0)} ${pool.currency}`
    : `$${pool.fundingTarget.toLocaleString()}`;

  const poolProgress =
    poolDepositLimit && poolTotalDeposited && !poolDepositLimit.isZero()
      ? (Number(
        poolTotalDeposited.mul(PRECISSION_BN).div(poolDepositLimit).toString()
      ) /
        PRECISION) *
      100
      : pool.fundingProgress;

  const progressPercentage = Math.max(0, Math.min(100, poolProgress));
  const progressLabel =
    Number.isFinite(progressPercentage) && progressPercentage % 1 !== 0
      ? progressPercentage.toFixed(2)
      : progressPercentage.toFixed(0);

  const tabs = ["Overview", "Details", "Impact", "Calculate Your Returns"];

  const hasRedeemableRwa = depositorInfoStats.claimableRwa.gt(new BN(0));
  const hasClaimableYield = depositorInfoStats.claimableYield.gt(new BN(0));
  const isClaimAvailable =
    claimMode === "rwa" ? hasRedeemableRwa : hasClaimableYield;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="bottom-logo-box">
        <section className="screen-wrapper">
          <div className="container">
            <div className="gap-32">
              <div
                className={`gap-16 ${animations.fadeIn(0).className}`}
                style={animations.fadeIn(0).style}
              >
                <h1>{pool.name}</h1>
                <p>{pool.description}</p>
              </div>

              <div
                className={`asset-content-wrapper grey-box border-radius-12 ${animations.slideUp(0.1).className
                  }`}
                style={animations.slideUp(0.1).style}
              >
                <div
                  className={`asset-content-left ${animations.cardEntrance(0.2).className
                    }`}
                  style={animations.cardEntrance(0.2).style}
                >
                  <div className="gap-12">
                    <img
                      src={pool.image}
                      loading="lazy"
                      alt={pool.name}
                      className="assets-single-image border-radius-12"
                    />
                    <div className="asset-tabs">
                      <div className="asset-tab-links border-radius-12">
                        {tabs.map((tab) => (
                          <span
                            key={tab}
                            className={`asset-tab-link ${activeTab === tab ? "asset-tab-active" : ""
                              }`}
                            onClick={() => setActiveTab(tab)}
                            style={{ cursor: "pointer" }}
                          >
                            {tab}
                          </span>
                        ))}
                      </div>

                      <div className="asset-tabs-content-wrapper">
                        {activeTab === "Overview" && (
                          <div className="asset-tab">
                            {pool.overview.map((section, index) => (
                              <div key={index} className="gap-12">
                                <h2 className="text-20">{section.title}</h2>
                                <p>{section.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeTab === "Details" && (
                          <div className="asset-tab">
                            {pool.details.map((section, index) => (
                              <div key={index} className="gap-12">
                                <h2 className="text-20">{section.title}</h2>
                                <p>{section.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeTab === "Impact" && (
                          <div className="asset-tab">
                            {pool.impact.map((section, index) => (
                              <div key={index} className="gap-12">
                                <h2 className="text-20">{section.title}</h2>
                                <p>{section.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeTab === "Calculate Your Returns" && (
                          <div className="asset-tab">
                            <div className="investment-calculator-wrapper">
                              <div className="investment-calculator-left">
                                <RangeSlider
                                  label="Initial Investment"
                                  value={initialInvestment}
                                  min={100}
                                  max={100000}
                                  step={100}
                                  onChange={setInitialInvestment}
                                />
                                <RangeSlider
                                  label="Investment Duration (Years)"
                                  value={investmentDuration}
                                  min={1}
                                  max={25}
                                  step={1}
                                  onChange={setInvestmentDuration}
                                />
                              </div>
                              <div className="asset-calculator-result border-radius-12">
                                <div className="gap-8">
                                  <span className="text-14 text-medium">
                                    Expected Yield Generated
                                  </span>
                                  <span
                                    id="asset-result"
                                    className="summary-yield"
                                  >
                                    $
                                    {(
                                      initialInvestment *
                                      investmentDuration *
                                      (pool.calculator.expectedYield / 100)
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                <div className="result-bottom-text">
                                  <p>{pool.calculator.description}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`asset-content-right ${animations.cardEntrance(0.3).className
                    }`}
                  style={animations.cardEntrance(0.3).style}
                >
                  <div className="asset-sticky-info border-radius-12">
                    <span className="text-dark text-bold">
                      Investment summary
                    </span>
                    <div className="gap-32">
                      <div className="gap-16 w-100">
                        <div className="gap-8 align-center">
                          <span className="text-14 text-medium">
                            Projected Annually
                          </span>
                          <span className="summary-yield">
                            {pool.summary.projectedAnnually}
                          </span>
                        </div>
                        <div className="summary-list">
                          <div className="content-wrapper">
                            <span className="text-14 text-medium">
                              Duration
                            </span>
                            <span className="text-12 text-bold text-dark">
                              {pool.summary.duration}
                            </span>
                          </div>
                          <div className="content-wrapper">
                            <span className="text-14 text-medium">
                              Being raised
                            </span>
                            <span className="text-12 text-bold text-dark">
                              ${pool.summary.beingRaised.toLocaleString()}
                            </span>
                          </div>
                          <div className="content-wrapper">
                            <span className="text-14 text-medium">
                              Instalments
                            </span>
                            <span className="text-12 text-bold text-dark">
                              {pool.summary.instalments}
                            </span>
                          </div>
                        </div>
                        <p className="text-14 text-medium">
                          {pool.summary.description}
                          <br />
                        </p>
                        <p className="text-14 text-medium">
                          {pool.summary.payoutDate}
                          <br />
                        </p>
                      </div>
                      <div className="gap-10">
                        <span>
                          <span className="text-14 text-bold text-dark">
                            {raisedDisplay} raised{" "}
                          </span>
                          <span className="text-medium text-14">
                            of {targetDisplay}
                          </span>
                        </span>
                        <ProgressBar
                          progress={progressPercentage}
                          label=""
                          showLabel={false}
                          size="small"
                        />
                        <span className="text-14 text-medium margin-left-auto">
                          {progressLabel}%
                        </span>
                      </div>

                      {/* 1. INVEST SECTION - Always on top */}
                      <div className="sidebar-section">
                        <div className="section-header">
                          <span className="text-16 text-bold text-dark">Invest</span>
                          <span className="text-14 text-medium">Min: 1 USDC</span>
                        </div>

                        <div className="invest-input-section">
                          <div className="invest-input-wrapper">
                            <input
                              type="number"
                              step="0.01"
                              min="1"
                              value={depositAmount}
                              onChange={(e) => {
                                setDepositAmount(e.target.value);
                                if (depositError) {
                                  setDepositError(null);
                                }
                                if (depositSignature) {
                                  setDepositSignature(null);
                                }
                              }}
                              placeholder="0.00"
                              className="invest-amount-input"
                            />
                            <div className="coin-selector-invest">
                              <div className="coin-icon-wrapper">
                                <img
                                  src={usdcCoin?.icon || "/assets/usdc.png"}
                                  alt="USDC"
                                  className="coin-icon-img"
                                />
                              </div>
                              <span className="coin-symbol">USDC</span>
                            </div>
                          </div>

                          <div className="balance-info">
                            <span className="balance-text">
                              {connected
                                ? isBalanceLoading
                                  ? "Loading balance..."
                                  : `${userDepositBalance} ${usdcCoin?.symbol ?? "USDC"
                                  }`
                                : "0.000000 USDC"}
                            </span>
                            <button className="max-button">Max</button>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="deposit-button bg-linear-green"
                          onClick={handleDeposit}
                          disabled={
                            isDepositing ||
                            (connected && depositAmount.trim() === "")
                          }
                        >
                          {connected
                            ? isDepositing
                              ? "Depositing..."
                              : "Invest Now"
                            : "Connect Wallet"}
                        </button>
                        {depositError && (
                          <p
                            className="text-12 text-medium"
                            style={{
                              color: "#DC2626",
                              marginTop: "0.5rem",
                            }}
                          >
                            {depositError}
                          </p>
                        )}
                        {depositSignature && (
                          <p
                            className="text-12 text-medium"
                            style={{ marginTop: "0.5rem" }}
                          >
                            Deposit submitted. Signature:{" "}
                            {shortenSignature(depositSignature)}
                          </p>
                        )}
                      </div>

                      {/* 2. HOLDINGS SECTION - Redeem */}
                      <div className="sidebar-section">
                        <div className="section-header">
                          <span className="text-16 text-bold text-dark">Holdings</span>
                        </div>

                        <div className="holdings-info-section">
                          <div className="holdings-info-item">
                            <span className="text-14 text-medium">
                              Invested
                            </span>
                            <span className="text-14 text-bold text-dark">
                              {isDepositorInfoLoading
                                ? "Loading..."
                                : `${parseTokenAmountUI(
                                  depositorInfoStats.depositedUsdc,
                                  depositMintDecimals,
                                  2
                                )} ${usdcCoin?.symbol ?? "USDC"}`}
                            </span>
                          </div>
                          <div className="holdings-info-item">
                            <span className="text-14 text-medium">
                              Redeemable
                            </span>
                            <span className="text-14 text-bold text-dark">
                              {isDepositorInfoLoading
                                ? "Loading..."
                                : `${parseTokenAmountUI(
                                  depositorInfoStats.claimableRwa,
                                  rwaMintDecimalsState,
                                  2
                                )} ${RWA_SYMBOL}`}
                            </span>
                          </div>
                        </div>

                        <div className="invest-input-section">
                          <div className="invest-input-wrapper">
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={claimRwaAmount}
                              onChange={(e) => {
                                setClaimRwaAmount(e.target.value);
                              }}
                              placeholder="0.00"
                              className="invest-amount-input"
                            />
                            <div className="coin-selector-invest">
                              <div className="coin-icon-wrapper">
                                <img
                                  src={
                                    cfWindCoin?.icon ||
                                    pool?.image ||
                                    "/assets/cf-wind1.avif"
                                  }
                                  alt={cfWindCoin?.symbol ?? RWA_SYMBOL}
                                  className="coin-icon-img"
                                />
                              </div>
                              <span className="coin-symbol">{RWA_SYMBOL}</span>
                            </div>
                          </div>

                          <div className="balance-info">
                            <span className="balance-text">
                              {isDepositorInfoLoading
                                ? "Loading availability..."
                                : `${parseTokenAmountUI(
                                  depositorInfoStats.claimableRwa,
                                  rwaMintDecimalsState,
                                  2
                                )} ${RWA_SYMBOL} available`}
                            </span>
                            <button
                              className="max-button"
                              onClick={() => {
                                if (isDepositorInfoLoading) {
                                  return;
                                }
                                setClaimRwaAmount(
                                  formatTokenAmountPlain(
                                    depositorInfoStats.claimableRwa,
                                    rwaMintDecimalsState
                                  )
                                );
                              }}
                            >
                              Max
                            </button>
                          </div>
                        </div>

                        <button
                          className={`deposit-button bg-linear-green ${isClaimAvailable ? "" : "claim-button-disabled"
                            }`}
                          disabled={!isClaimAvailable || isRedeeming || claimMode !== "rwa"}
                          onClick={() => {
                            setClaimMode("rwa");
                            handleRedeem();
                          }}
                        >
                          {!isClaimAvailable && (
                            <img
                              src="/assets/Locked.svg"
                              alt="Locked"
                              className="claim-button-icon"
                            />
                          )}
                          {isRedeeming && claimMode === "rwa" ? "Redeeming..." : "Redeem Tokens"}
                        </button>
                        {redeemError && claimMode === "rwa" && (
                          <p
                            className="text-12 text-medium"
                            style={{
                              color: "#DC2626",
                              marginTop: "0.5rem",
                            }}
                          >
                            {redeemError}
                          </p>
                        )}
                        {redeemSignature && claimMode === "rwa" && (
                          <p
                            className="text-12 text-medium"
                            style={{ marginTop: "0.5rem" }}
                          >
                            Redeem successful! Signature:{" "}
                            {shortenSignature(redeemSignature)}
                          </p>
                        )}
                      </div>

                      {/* 3. EARNINGS SECTION - Claim Yield */}
                      <div className="sidebar-section">
                        <div className="section-header">
                          <span className="text-16 text-bold text-dark">Earnings</span>
                        </div>

                        <div className="holdings-info-section">
                          <div className="holdings-info-item">
                            <span className="text-14 text-medium">
                              Claimable Yield
                            </span>
                            <span className="text-14 text-bold text-green">
                              {isDepositorInfoLoading
                                ? "Loading..."
                                : `${depositorInfoStats.claimableYield.gt(new BN(0))
                                  ? parseTokenAmountUI(
                                    depositorInfoStats.claimableYield,
                                    depositMintDecimals,
                                    2
                                  )
                                  : "0.00"
                                } ${usdcCoin?.symbol ?? "USDC"}`}
                            </span>
                          </div>
                          <div className="holdings-info-item">
                            <span className="text-14 text-medium">
                              Next Payout
                            </span>
                            <span className="text-14 text-bold text-dark">
                              {pool.summary.payoutDate || "TBA"}
                            </span>
                          </div>
                        </div>

                        <div className="invest-input-section">
                          <div className="invest-input-wrapper">
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={claimYieldAmount}
                              onChange={(e) => {
                                setClaimYieldAmount(e.target.value);
                              }}
                              placeholder="0.00"
                              className="invest-amount-input"
                            />
                            <div className="coin-selector-invest">
                              <div className="coin-icon-wrapper">
                                <img
                                  src={usdcCoin?.icon || "/assets/usdc.png"}
                                  alt={usdcCoin?.symbol ?? "USDC"}
                                  className="coin-icon-img"
                                />
                              </div>
                              <span className="coin-symbol">{usdcCoin?.symbol ?? "USDC"}</span>
                            </div>
                          </div>

                          <div className="balance-info">
                            <span className="balance-text">
                              {isDepositorInfoLoading
                                ? "Loading availability..."
                                : `${parseTokenAmountUI(
                                  depositorInfoStats.claimableYield,
                                  depositMintDecimals,
                                  2
                                )} ${usdcCoin?.symbol ?? "USDC"} available`}
                            </span>
                            <button
                              className="max-button"
                              onClick={() => {
                                if (isDepositorInfoLoading) {
                                  return;
                                }
                                setClaimYieldAmount(
                                  formatTokenAmountPlain(
                                    depositorInfoStats.claimableYield,
                                    depositMintDecimals
                                  )
                                );
                              }}
                            >
                              Max
                            </button>
                          </div>
                        </div>

                        <button
                          className={`deposit-button bg-linear-green ${isClaimAvailable ? "" : "claim-button-disabled"
                            }`}
                          disabled={!isClaimAvailable || isRedeeming || claimMode !== "yield"}
                          onClick={() => {
                            setClaimMode("yield");
                            handleRedeem();
                          }}
                        >
                          {!isClaimAvailable && (
                            <img
                              src="/assets/Locked.svg"
                              alt="Locked"
                              className="claim-button-icon"
                            />
                          )}
                          {isRedeeming && claimMode === "yield" ? "Claiming..." : "Claim Yield"}
                        </button>
                        {redeemError && claimMode === "yield" && (
                          <p
                            className="text-12 text-medium"
                            style={{
                              color: "#DC2626",
                              marginTop: "0.5rem",
                            }}
                          >
                            {redeemError}
                          </p>
                        )}
                        {redeemSignature && claimMode === "yield" && (
                          <p
                            className="text-12 text-medium"
                            style={{ marginTop: "0.5rem" }}
                          >
                            Claim successful! Signature:{" "}
                            {shortenSignature(redeemSignature)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
