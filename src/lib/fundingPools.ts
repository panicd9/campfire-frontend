import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { Crowdfunding, CrowdfundingIDL } from "../../solana/crowdfunding/crowdfunding-exports";
import { BN, Program } from "@coral-xyz/anchor";

export interface FundingPool {
  chainData?: {
    id: anchor.BN;
    creator: anchor.web3.PublicKey;
    depositMint: anchor.web3.PublicKey;
    depositVault: anchor.web3.PublicKey;
    depositLimit: anchor.BN;
    totalDeposited: anchor.BN;
    issued: boolean;
    rwaMint: anchor.web3.PublicKey | null;
    rwaVault: anchor.web3.PublicKey | null;
    rwaTotalSupply: anchor.BN;
    rwaTransferHookProgram?: anchor.web3.PublicKey | null;
  };
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  image: string;
  fundingTarget: number;
  fundingRaised: number;
  fundingProgress: number;
  currency: string;
  features: string[];
  team: {
    name: string;
    role: string;
    image: string;
  }[];
  overview: {
    title: string;
    content: string;
  }[];
  details: {
    title: string;
    content: string;
  }[];
  impact: {
    title: string;
    content: string;
  }[];
  calculator: {
    initialInvestment: number;
    investmentDuration: number;
    expectedYield: number;
    description: string;
  };
  summary: {
    projectedAnnually: string;
    duration: string;
    beingRaised: number;
    instalments: string;
    description: string;
    payoutDate: string;
  };
}

export const fundingPools: FundingPool[] = [
  {
    id: "0",
    name: "Wind Farm - Single Income",
    description: "Campfire has agreed to purchase a 40% stake in ESBs Ballybrack wind farm located in county Galway. This asset went live in 2020 and has approx 25 years left on the manufacturers lifespan.",
    location: "Ballybrack, Galway, Ireland",
    category: "Commercial Wind",
    image: "/assets/wind-farm.avif",
    fundingTarget: 6000000,
    fundingRaised: 4200000,
    fundingProgress: 70,
    currency: "USDC",
    features: [
      "15MW of Commercial Wind",
      "8 Horizontal Axis Wind Turbines",
      "1.9MW per Turbine Capacity",
      "25 Year Lifespan Remaining"
    ],
    team: [],
    overview: [
      {
        title: "Project Overview",
        content: "Campfire has agreed to purchase a 40% stake in ESBs Ballybrack wind farm located in county Galway. This asset went live in 2020 and has approx 25 years left on the manufacturers lifespan. ESB are Ireland's primary grid operator and they are technical experts in energy infrastructure. The site contains 8 horizontal axis wind turbines which have a capacity of 1.9MW each, giving the site just over 15MW of potential capacity."
      },
      {
        title: "Operating History",
        content: "The O&M contract will be maintained by ESB and this contract is signed until 2030. The Ballybrack site outputs approximately 2.35 GWh per year and has had 5 years of operating history with an average of only 2 days of downtime per year."
      },
      {
        title: "Partnership & Operations",
        content: "ESB Energy serves as our technical partner and grid operator, bringing decades of expertise in energy infrastructure. Campfire Engineering collaborates on efficiency and durability optimization to maximize returns. ESB Maintenance maintains the O&M contract until 2030, ensuring reliable operations with their comprehensive maintenance services."
      }
    ],
    details: [
      {
        title: "Technical Specifications",
        content: "ESB and Campfire are collaborating with our engineers for efficiency and durability while reducing risks and increasing returns on the Ballycrack wind farm. ESB offers a comprehensive PPM schedule (planned preventive maintenance) as well as corrective and predictive maintenance services to ensure the continuous performance of our wind farms and minimising downtime, by utilising technology like remote monitoring. By adopting our solutions, companies can transform operational expenses into sustainable investments, contributing to a greener future."
      },
      {
        title: "Business Model",
        content: "Diversified revenue streams prioritising personalised solutions. Contract and Offtaker: ESB is an ideal partner for this asset because their systems for commercial and industrial clients are built on longterms contracts generating revenue from power intensive clients like commercial offices and national infrastructure like street lights and government owned EVs and misc equipment. ESB revenue strategy is grounded in feasibility studies tailored to the specific energy needs of each client and the location they are in. When there is surplus energy during periods of low demand ESB ensures none of that energy goes to waste by partnering with nearby pumped storage energy stations to ensure we get maximum profit from the natural resources the wind farm generates. ESB is driven by direct sales channels, strategic partnerships, participation in industry events, and an active digital presence that raises awareness about the benefits of wind energy."
      }
    ],
    impact: [
      {
        title: "Environmental Impact",
        content: "Throughout the next 25 year lifespan of the project, Ballybrack will produce: 15,722 GWh of renewable energy for the Irish residential market which is distributed by ESB themselves as the grid connectors and offtaker client. Ballybrack will avert 668,200 tonnes of CO2. Calculated as 157,220 MWh * 0.425 tCO2 / MWh = 6,682 tonnes of CO2 averted. This figure corresponds to the amount of CO2 avoided based on the electrical energy generated during a specific period that Campfire investors are purchasing this minority share in the asset (measured in MWh). The average CO2 emission factor of the SIN (National Interconnected System) for the same period"
      },
      {
        title: "UN Sustainable Development Goals",
        content: "Concrete contributions to a greener planet and the UN's SDG. ESBs projects generate renewable energy that directly replaces fossil fuel-based energy within the grid, significantly reducing CO₂ emissions. These efforts align with the following UN Sustainable Development Goals (SDGs)."
      }
    ],
    calculator: {
      initialInvestment: 1000,
      investmentDuration: 25,
      expectedYield: 11.5,
      description: "The total yield generated throughout your investment in Ballybrack wind farm project, based on the 11.5% annual yield over the 25-year project lifespan."
    },
    summary: {
      projectedAnnually: "11.5% APY",
      duration: "25 Years",
      beingRaised: 6000000,
      instalments: "Daily",
      description: "Campfire has agreed to purchase a 40% stake in ESBs Ballybrack wind farm located in county Galway. This asset went live in 2020 and has approx 25 years left on the manufacturers lifespan.",
      payoutDate: "First investor payout expected 1st February 2025"
    }
  }
];

export async function getFundingPoolById(id: string): Promise<FundingPool | undefined> {
  return (await getAllFundingPools()).find(pool => pool.id === id);
}

export const u64LE = (value: number | bigint) => {
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setBigUint64(0, BigInt(value), true); // true = little-endian
  return new Uint8Array(buf);
};

export async function getAllFundingPools(): Promise<FundingPool[]> {
  try {
    const connection = new Connection("http://127.0.0.1:8899");
    const program: Program<Crowdfunding> = new anchor.Program(CrowdfundingIDL, { connection });

    const [pool0Pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), u64LE(0)],
      program.programId,
    );

    const pool = await program.account.fundingPool.fetch(pool0Pda);

    const demoFundingPools = [...fundingPools];
    demoFundingPools[0].chainData = pool;

    return demoFundingPools;
  } catch (error) {
    console.warn("Failed to fetch funding pools from chain, using static data:", error);
    return fundingPools;
  }
}
