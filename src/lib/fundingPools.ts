export interface FundingPool {
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
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    location: "Galway, Ireland",
    category: "Commercial Wind",
    image: "/assets/683468326de746c20d499e7a7aebf413_163.svg",
    fundingTarget: 6000000,
    fundingRaised: 5400000,
    fundingProgress: 90,
    currency: "USDC",
    features: [
      "15MW of Commercial Wind",
    ],
    team: [
      { name: "John Doe", role: "CEO & Founder", image: "/assets/683468326de746c20d499e7a7aebf413_163.svg" },
      { name: "Jane Smith", role: "CTO", image: "/assets/683468326de746c20d499e7a7aebf413_163.svg" },
      { name: "Mike Johnson", role: "CFO", image: "/assets/683468326de746c20d499e7a7aebf413_163.svg" },
      { name: "Sarah Wilson", role: "Head of Operations", image: "/assets/683468326de746c20d499e7a7aebf413_163.svg" },
      { name: "David Brown", role: "Lead Engineer", image: "/assets/683468326de746c20d499e7a7aebf413_163.svg" },
      { name: "Lisa Davis", role: "Marketing Director", image: "/assets/683468326de746c20d499e7a7aebf413_163.svg" }
    ],
    overview: [
      {
        title: "What is Lorem Ipsum?",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      },
      {
        title: "Why do we use it?",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      }
    ],
    details: [
      {
        title: "Technical Specifications",
        content: "Detailed technical information about the wind farm project including turbine specifications, grid connection details, and maintenance protocols."
      },
      {
        title: "Financial Structure",
        content: "Complete breakdown of the financial structure, revenue sharing model, and investment terms."
      }
    ],
    impact: [
      {
        title: "Environmental Impact",
        content: "This project will generate clean energy equivalent to powering 15,000 homes annually, reducing CO2 emissions by 45,000 tons per year."
      },
      {
        title: "Economic Impact",
        content: "The project will create 50+ local jobs during construction and 15 permanent positions for ongoing operations."
      }
    ],
    calculator: {
      initialInvestment: 100,
      investmentDuration: 100,
      expectedYield: 43.25,
      description: "The total yield generated throughout your investment in Surya project, based on the predicted annual yields."
    },
    summary: {
      projectedAnnually: "43% Yield",
      duration: "3+ Years",
      beingRaised: 150000,
      instalments: "Monthly",
      description: "DeCharge operates a Solana-powered EV charging network with AI-driven placement. $150K funds 19 chargers across three stations on several busy Indian highways.",
      payoutDate: "First investor payout expected 20th January 2026"
    }
  },
  {
    id: "1",
    name: "Solar Farm - Green Energy",
    description: "Advanced solar energy project with cutting-edge technology",
    location: "Madrid, Spain",
    category: "Solar Energy",
    image: "/assets/683468326de746c20d499e7a7aebf413_163.svg",
    fundingTarget: 8000000,
    fundingRaised: 6400000,
    fundingProgress: 80,
    currency: "USDC",
    features: [
      "50MW Solar Installation",
      "Battery Storage System"
    ],
    team: [
      { name: "Carlos Rodriguez", role: "Project Manager", image: "/assets/683468326de746c20d499e7a7aebf413_163.svg" },
      { name: "Ana Garcia", role: "Technical Lead", image: "/assets/683468326de746c20d499e7a7aebf413_163.svg" }
    ],
    overview: [
      {
        title: "Project Overview",
        content: "This solar farm project represents the future of renewable energy in Spain."
      }
    ],
    details: [
      {
        title: "Solar Panel Specifications",
        content: "High-efficiency monocrystalline panels with 25-year warranty."
      }
    ],
    impact: [
      {
        title: "Carbon Reduction",
        content: "Expected to reduce CO2 emissions by 60,000 tons annually."
      }
    ],
    calculator: {
      initialInvestment: 100,
      investmentDuration: 100,
      expectedYield: 38.50,
      description: "Expected returns based on current energy prices and government incentives."
    },
    summary: {
      projectedAnnually: "38% Yield",
      duration: "5+ Years",
      beingRaised: 200000,
      instalments: "Quarterly",
      description: "State-of-the-art solar farm with advanced tracking systems and energy storage.",
      payoutDate: "First payout expected 15th March 2026"
    }
  }
];

export function getFundingPoolById(id: string): FundingPool | undefined {
  return fundingPools.find(pool => pool.id === id);
}

export function getAllFundingPools(): FundingPool[] {
  return fundingPools;
}
