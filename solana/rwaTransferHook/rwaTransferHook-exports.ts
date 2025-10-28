import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";

import RwaTransferHookIDL from "../idls/rwa_transfer_hook.json";
import type { RwaTransferHook } from "../types/rwa_transfer_hook";

export { RwaTransferHook, RwaTransferHookIDL };

export const RWA_TRANSFER_HOOK_PROGRAM_ID = new PublicKey(
  RwaTransferHookIDL.address,
);

export type RwaTransferHookCluster = Cluster | "localnet";

export function getRwaTransferHookProgram(
  provider: AnchorProvider,
  address?: PublicKey,
): Program<RwaTransferHook> {
  return new Program(
    {
      ...RwaTransferHookIDL,
      address: address ? address.toBase58() : RwaTransferHookIDL.address,
    } as RwaTransferHook,
    provider,
  );
}

export function getRwaTransferHookProgramId(
  cluster: RwaTransferHookCluster,
): PublicKey {
  switch (cluster) {
    case "localnet":
    case "devnet":
    case "testnet":
    case "mainnet-beta":
    default:
      return RWA_TRANSFER_HOOK_PROGRAM_ID;
  }
}
