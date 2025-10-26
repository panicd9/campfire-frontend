"use client";

import { useMemo } from "react";
import type { Program } from "@coral-xyz/anchor";

import { getCrowdfundingProgram, getCrowdfundingProgramId } from "./crowdfunding-exports";
import type { Crowdfunding } from "../types/crowdfunding";
import { useAnchorProvider } from "../useAnchorProvider";
import type { CrowdfundingCluster } from "./crowdfunding-exports";

export function useCrowdfundingProgram(cluster: CrowdfundingCluster = "localnet") {
  const provider = useAnchorProvider();

  const programId = useMemo(() => getCrowdfundingProgramId(cluster), [cluster]);

  const program = useMemo<Program<Crowdfunding> | null>(() => {
    if (!provider) {
      return null;
    }

    return getCrowdfundingProgram(provider, programId);
  }, [provider, programId]);

  return {
    program,
    programId,
    provider,
  } as const;
}
