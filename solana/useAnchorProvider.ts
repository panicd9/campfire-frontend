"use client";

import { AnchorProvider } from "@coral-xyz/anchor";
import type { AnchorWallet } from "@solana/wallet-adapter-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const { connected, publicKey, signTransaction, signAllTransactions } = wallet;

  return useMemo(() => {
    if (
      !connected ||
      !publicKey ||
      !signTransaction ||
      !signAllTransactions
    ) {
      return null;
    }

    const anchorWallet: AnchorWallet = {
      publicKey,
      signTransaction,
      signAllTransactions,
    };

    return new AnchorProvider(connection, anchorWallet, {
      commitment: "confirmed",
    });
  }, [connection, connected, publicKey, signTransaction, signAllTransactions]);
}
