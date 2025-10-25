
import { Coin, AssetPair } from "./assets";

export type { AssetPair } from "./assets";

export interface PortfolioHolding {
  id: string;
  coin: Coin;
  price: number;
  holdings: number;
  value: number;
  change24h: number;
}

export interface PortfolioStats {
  currentBalance: number;
  totalEarning: number;
  carbonExtracted: number;
  topPerformer: {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    change24h: number;
  };
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface HoldingsChartData {
  name: string;
  value: number;
  color: string;
}

// ===== STATIC DATA (placeholder for real API) =====
export const coins: Coin[] = [
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '/assets/usdc.png',
    decimals: 6,
    color: '#2775CA',
    price: 1.0,
    change24h: 0.0,
    volume24h: 1234567890,
    marketCap: 50000000000,
    chartData: [
      { time: "2024-01-01", value: 1.0 },
      { time: "2024-01-02", value: 1.0 },
      { time: "2024-01-03", value: 1.0 },
      { time: "2024-01-04", value: 1.0 },
      { time: "2024-01-05", value: 1.0 },
      { time: "2024-01-06", value: 1.0 },
      { time: "2024-01-07", value: 1.0 },
    ]
  },
  {
    id: 'cf-wind1',
    name: 'Campfire Wind Energy',
    symbol: 'CF-WIND1',
    icon: '/assets/cf-wind1.avif',
    decimals: 18,
    color: '#10B981',
    price: 0.85,
    change24h: 0.05,
    volume24h: 1234567,
    marketCap: 50000000,
    chartData: [
      { time: "2024-01-01", value: 0.8 },
      { time: "2024-01-02", value: 0.82 },
      { time: "2024-01-03", value: 0.85 },
      { time: "2024-01-04", value: 0.83 },
      { time: "2024-01-05", value: 0.86 },
      { time: "2024-01-06", value: 0.84 },
      { time: "2024-01-07", value: 0.85 },
    ]
  },
  {
    id: 'cf-solar1',
    name: 'Campfire Solar Energy',
    symbol: 'CF-SOLAR1',
    icon: '/assets/cf-solar1.png',
    decimals: 18,
    color: '#F59E0B',
    price: 1.25,
    change24h: -0.02,
    volume24h: 2345678,
    marketCap: 75000000,
    chartData: [
      { time: "2024-01-01", value: 1.27 },
      { time: "2024-01-02", value: 1.26 },
      { time: "2024-01-03", value: 1.25 },
      { time: "2024-01-04", value: 1.24 },
      { time: "2024-01-05", value: 1.25 },
      { time: "2024-01-06", value: 1.26 },
      { time: "2024-01-07", value: 1.25 },
    ]
  },
  {
    id: 'cf-bio1',
    name: 'Campfire Bio Energy',
    symbol: 'CF-BIO1',
    icon: '/assets/cf-bio1.png',
    decimals: 18,
    color: '#8B5CF6',
    price: 0.95,
    change24h: 0.03,
    volume24h: 3456789,
    marketCap: 60000000,
    chartData: [
      { time: "2024-01-01", value: 0.92 },
      { time: "2024-01-02", value: 0.94 },
      { time: "2024-01-03", value: 0.95 },
      { time: "2024-01-04", value: 0.96 },
      { time: "2024-01-05", value: 0.94 },
      { time: "2024-01-06", value: 0.95 },
      { time: "2024-01-07", value: 0.95 },
    ]
  },
  {
    id: 'cf-hydro1',
    name: 'Campfire Hydro Energy',
    symbol: 'CF-HYDRO1',
    icon: '/assets/cf-hydro1.png',
    decimals: 18,
    color: '#3B82F6',
    price: 1.15,
    change24h: 0.01,
    volume24h: 4567890,
    marketCap: 70000000,
    chartData: [
      { time: "2024-01-01", value: 1.14 },
      { time: "2024-01-02", value: 1.15 },
      { time: "2024-01-03", value: 1.16 },
      { time: "2024-01-04", value: 1.14 },
      { time: "2024-01-05", value: 1.15 },
      { time: "2024-01-06", value: 1.16 },
      { time: "2024-01-07", value: 1.15 },
    ]
  }
];

export const dashboardAssets: AssetPair[] = [
  {
    id: 'cf-wind1-usdc',
    baseCoin: coins.find(c => c.id === 'cf-wind1')!,
    quoteCoin: coins.find(c => c.id === 'usdc')!,
    price: 1246.65,
    yield: 11.14,
    volume24h: 9798245,
    marketCap: 3851156,
  },
  {
    id: 'cf-bio1-usdc',
    baseCoin: coins.find(c => c.id === 'cf-bio1')!,
    quoteCoin: coins.find(c => c.id === 'usdc')!,
    price: 1246.65,
    yield: 11.14,
    volume24h: 9798245,
    marketCap: 3851156,
  },
  {
    id: 'cf-hydro1-usdc',
    baseCoin: coins.find(c => c.id === 'cf-hydro1')!,
    quoteCoin: coins.find(c => c.id === 'usdc')!,
    price: 1246.65,
    yield: 11.14,
    volume24h: 9798245,
    marketCap: 3851156,
  },
  {
    id: 'cf-hydro1-bio1',
    baseCoin: coins.find(c => c.id === 'cf-hydro1')!,
    quoteCoin: coins.find(c => c.id === 'cf-bio1')!,
    price: 1246.65,
    yield: 11.14,
    volume24h: 9798245,
    marketCap: 3851156,
  }
];

export const portfolioHoldings: PortfolioHolding[] = [
  {
    id: 'cf-wind1-holding',
    coin: coins.find(c => c.id === 'cf-wind1')!,
    price: 1246.65,
    holdings: 500,
    value: 623325,
    change24h: 12.5
  },
  {
    id: 'cf-bio1-holding',
    coin: coins.find(c => c.id === 'cf-bio1')!,
    price: 1246.65,
    holdings: 300,
    value: 373995,
    change24h: -8.2
  },
  {
    id: 'cf-hydro1-holding',
    coin: coins.find(c => c.id === 'cf-hydro1')!,
    price: 1246.65,
    holdings: 750,
    value: 934987.5,
    change24h: 5.7
  }
];

export const portfolioStats: PortfolioStats = {
  currentBalance: 7296.72,
  totalEarning: -373.15,
  carbonExtracted: 1423,
  topPerformer: {
    id: 'cf-wind1',
    name: 'Campfire Wind Token',
    symbol: 'CF-WIND1',
    icon: 'assets/8886ea5ab739f6165d6667d1cdc80724_11516.png',
    change24h: 12.5
  }
};

export const performanceChartData: Record<string, ChartDataPoint[]> = {
  '24H': [
    { time: '00:00', value: 100 },
    { time: '04:00', value: 105 },
    { time: '08:00', value: 98 },
    { time: '12:00', value: 112 },
    { time: '16:00', value: 108 },
    { time: '20:00', value: 115 },
    { time: '24:00', value: 120 }
  ],
  '7D': [
    { time: 'Mon', value: 100 },
    { time: 'Tue', value: 105 },
    { time: 'Wed', value: 98 },
    { time: 'Thu', value: 112 },
    { time: 'Fri', value: 108 },
    { time: 'Sat', value: 115 },
    { time: 'Sun', value: 120 }
  ],
  '1M': [
    { time: 'Week 1', value: 100 },
    { time: 'Week 2', value: 105 },
    { time: 'Week 3', value: 98 },
    { time: 'Week 4', value: 112 }
  ],
  '3M': [
    { time: 'Month 1', value: 100 },
    { time: 'Month 2', value: 105 },
    { time: 'Month 3', value: 98 }
  ],
  '1Y': [
    { time: 'Q1', value: 100 },
    { time: 'Q2', value: 105 },
    { time: 'Q3', value: 98 },
    { time: 'Q4', value: 112 }
  ]
};

// ===== HELPER FUNCTIONS =====
export const generateHoldingsChartData = (holdings: PortfolioHolding[]): HoldingsChartData[] => {
  return holdings.map(holding => ({
    name: holding.coin.symbol,
    value: holding.value,
    color: holding.coin.color
  }));
};

export const createPair = (baseCoinId: string, quoteCoinId: string, pairData: Omit<AssetPair, 'id' | 'baseCoin' | 'quoteCoin'>): AssetPair => {
  const baseCoin = coins.find(c => c.id === baseCoinId);
  const quoteCoin = coins.find(c => c.id === quoteCoinId);
  
  if (!baseCoin || !quoteCoin) {
    throw new Error(`Coin not found: ${baseCoinId} or ${quoteCoinId}`);
  }
  
  return {
    id: `${baseCoinId}-${quoteCoinId}`,
    baseCoin,
    quoteCoin,
    ...pairData
  };
};

// ===== LIQUIDITY POOL DATA =====
export interface LiquidityPoolData {
  tvl: number; // Total Value Locked in millions
  progress: number; // Progress percentage (0-100)
  fees: number; // Fee percentage
  poolLiquidity: number; // Pool liquidity amount
  pooledBase: number; // Amount of base coin pooled
  pooledQuote: number; // Amount of quote coin pooled
  lockedPercentage: number; // Percentage permanently locked
}

// Centralized TVL data for different coin pairs
export const liquidityPoolData: Record<string, LiquidityPoolData> = {
  'usdc-cf-wind1': {
    tvl: 12.4,
    progress: 85,
    fees: 46.25,
    poolLiquidity: 6531229,
    pooledBase: 2500000, // USDC
    pooledQuote: 2000, // CF-WIND1
    lockedPercentage: 99.9
  },
  'usdc-cf-bio1': {
    tvl: 8.7,
    progress: 72,
    fees: 38.15,
    poolLiquidity: 4200000,
    pooledBase: 1800000, // USDC
    pooledQuote: 1500, // CF-BIO1
    lockedPercentage: 95.5
  },
  'usdc-cf-hydro1': {
    tvl: 15.2,
    progress: 92,
    fees: 52.8,
    poolLiquidity: 8900000,
    pooledBase: 3200000, // USDC
    pooledQuote: 2500, // CF-HYDRO1
    lockedPercentage: 98.7
  },
  'usdc-cf-solar1': {
    tvl: 6.3,
    progress: 58,
    fees: 35.2,
    poolLiquidity: 2800000,
    pooledBase: 1200000, // USDC
    pooledQuote: 800, // CF-SOLAR1
    lockedPercentage: 92.3
  },
  'cf-wind1-cf-bio1': {
    tvl: 4.1,
    progress: 45,
    fees: 28.7,
    poolLiquidity: 1800000,
    pooledBase: 1200, // CF-WIND1
    pooledQuote: 900, // CF-BIO1
    lockedPercentage: 88.9
  },
  'cf-hydro1-cf-bio1': {
    tvl: 7.8,
    progress: 68,
    fees: 41.3,
    poolLiquidity: 3400000,
    pooledBase: 1800, // CF-HYDRO1
    pooledQuote: 1400, // CF-BIO1
    lockedPercentage: 94.2
  }
};

// ===== LIQUIDITY POOL HELPER FUNCTIONS =====
export const getPairKey = (coin1: string, coin2: string): string => {
  // Sort coins alphabetically to ensure consistent key generation
  const sorted = [coin1, coin2].sort();
  return `${sorted[0]}-${sorted[1]}`;
};

export const getLiquidityPoolData = (coin1: string, coin2: string): LiquidityPoolData => {
  const pairKey = getPairKey(coin1, coin2);
  const data = liquidityPoolData[pairKey];
  
  if (!data) {
    // Return default values if pair not found
    return {
      tvl: 0,
      progress: 0,
      fees: 0,
      poolLiquidity: 0,
      pooledBase: 0,
      pooledQuote: 0,
      lockedPercentage: 0
    };
  }
  
  return data;
};

export const getFormattedTVL = (coin1: string, coin2: string): string => {
  const data = getLiquidityPoolData(coin1, coin2);
  return `$${data.tvl}M`;
};

export const getFormattedPoolLiquidity = (coin1: string, coin2: string): string => {
  const data = getLiquidityPoolData(coin1, coin2);
  return data.poolLiquidity.toLocaleString('en-US');
};

export const getFormattedFees = (coin1: string, coin2: string): string => {
  const data = getLiquidityPoolData(coin1, coin2);
  return `${data.fees}%`;
};

export const getFormattedLockedPercentage = (coin1: string, coin2: string): string => {
  const data = getLiquidityPoolData(coin1, coin2);
  return `${data.lockedPercentage}%`;
};

export const getPooledAmount = (coin1: string, coin2: string, targetCoin: string): number => {
  const data = getLiquidityPoolData(coin1, coin2);
  
  // Determine which coin is base and which is quote
  const sorted = [coin1, coin2].sort();
  const isBase = targetCoin === sorted[0];
  
  return isBase ? data.pooledBase : data.pooledQuote;
};

// ===== COIN HELPER FUNCTIONS =====
export const getCoinById = (id: string): Coin | undefined => {
  return coins.find(coin => coin.id === id);
};

export const getCoinBySymbol = (symbol: string): Coin | undefined => {
  return coins.find(coin => coin.symbol === symbol);
};

export const getAllCoins = (): Coin[] => {
  return coins;
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const formatVolume = (volume: number): string => {
  return `$${volume.toLocaleString()}`;
};

export const formatMarketCap = (marketCap: number): string => {
  return `$${marketCap.toLocaleString()}`;
};

export const getPriceChangeColor = (change: number): string => {
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-gray-500';
};


