// Anchor helpers for the crowdfunding program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";

import CrowdfundingIDL from "../idls/crowdfunding.json";
import type { Crowdfunding } from "../types/crowdfunding";

// Re-export the generated IDL and type.
export { Crowdfunding, CrowdfundingIDL };

// Program ID pulled from the generated IDL.
export const CROWDFUNDING_PROGRAM_ID = new PublicKey(CrowdfundingIDL.address);

export type CrowdfundingCluster = Cluster | "localnet";

// Returns a Program instance with an optional override for the program address.
export function getCrowdfundingProgram(
	provider: AnchorProvider,
	address?: PublicKey,
): Program<Crowdfunding> {
	return new Program(
		{
			...CrowdfundingIDL,
			address: address ? address.toBase58() : CrowdfundingIDL.address,
		} as Crowdfunding,
		provider,
	);
}

// Resolves the program ID to use for a given cluster.
export function getCrowdfundingProgramId(cluster: CrowdfundingCluster) {
	switch (cluster) {
		case "localnet":
		case "devnet":
		case "testnet":
		case "mainnet-beta":
		default:
			return CROWDFUNDING_PROGRAM_ID;
	}
}
