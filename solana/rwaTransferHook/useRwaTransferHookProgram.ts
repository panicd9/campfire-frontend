"use client";

import { useMemo } from "react";
import type { Program } from "@coral-xyz/anchor";

import {
  getRwaTransferHookProgram,
  getRwaTransferHookProgramId,
} from "./rwaTransferHook-exports";
import type { RwaTransferHook } from "../types/rwa_transfer_hook";
import type { RwaTransferHookCluster } from "./rwaTransferHook-exports";
import { useAnchorProvider } from "../useAnchorProvider";

export function useRwaTransferHookProgram(
  cluster: RwaTransferHookCluster = "localnet",
) {
  const provider = useAnchorProvider();

  const programId = useMemo(
    () => getRwaTransferHookProgramId(cluster),
    [cluster],
  );

  const program = useMemo<Program<RwaTransferHook> | null>(() => {
    if (!provider) {
      return null;
    }

    return getRwaTransferHookProgram(provider, programId);
  }, [provider, programId]);

  return {
    program,
    programId,
    provider,
  } as const;
}
