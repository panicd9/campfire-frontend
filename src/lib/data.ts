
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
    volume24h: 955000000,
    marketCap: 26200000000,
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
    price: 1.08,
    change24h: 2.1,
    volume24h: 1580000,
    marketCap: 14500000,
    chartData: [
      { time: "2024-01-01", value: 0.65 },
      { time: "2024-01-02", value: 0.68 },
      { time: "2024-01-03", value: 0.64 },
      { time: "2024-01-04", value: 0.71 },
      { time: "2024-01-05", value: 0.69 },
      { time: "2024-01-06", value: 0.75 },
      { time: "2024-01-07", value: 0.78 },
      { time: "2024-01-08", value: 0.74 },
      { time: "2024-01-09", value: 0.81 },
      { time: "2024-01-10", value: 0.85 },
      { time: "2024-01-11", value: 0.82 },
      { time: "2024-01-12", value: 0.88 },
      { time: "2024-01-13", value: 0.91 },
      { time: "2024-01-14", value: 0.87 },
      { time: "2024-01-15", value: 0.93 },
      { time: "2024-01-16", value: 0.96 },
      { time: "2024-01-17", value: 0.99 },
      { time: "2024-01-18", value: 0.95 },
      { time: "2024-01-19", value: 1.02 },
      { time: "2024-01-20", value: 1.05 },
      { time: "2024-01-21", value: 1.08 },
    ]
  },
  {
    id: 'cf-solar1',
    name: 'Campfire Solar Energy',
    symbol: 'CF-SOLAR1',
    icon: '/assets/cf-solar1.png',
    decimals: 18,
    color: '#F59E0B',
    price: 0.92,
    change24h: -1.2,
    volume24h: 910000,
    marketCap: 9800000,
    chartData: [
      { time: "2024-01-01", value: 0.58 },
      { time: "2024-01-02", value: 0.62 },
      { time: "2024-01-03", value: 0.59 },
      { time: "2024-01-04", value: 0.64 },
      { time: "2024-01-05", value: 0.61 },
      { time: "2024-01-06", value: 0.67 },
      { time: "2024-01-07", value: 0.71 },
      { time: "2024-01-08", value: 0.68 },
      { time: "2024-01-09", value: 0.73 },
      { time: "2024-01-10", value: 0.76 },
      { time: "2024-01-11", value: 0.72 },
      { time: "2024-01-12", value: 0.78 },
      { time: "2024-01-13", value: 0.82 },
      { time: "2024-01-14", value: 0.79 },
      { time: "2024-01-15", value: 0.84 },
      { time: "2024-01-16", value: 0.87 },
      { time: "2024-01-17", value: 0.90 },
      { time: "2024-01-18", value: 0.86 },
      { time: "2024-01-19", value: 0.89 },
      { time: "2024-01-20", value: 0.93 },
      { time: "2024-01-21", value: 0.92 },
    ]
  },
  {
    id: 'cf-bio1',
    name: 'Campfire Bio Energy',
    symbol: 'CF-BIO1',
    icon: '/assets/cf-bio1.png',
    decimals: 18,
    color: '#8B5CF6',
    price: 1.35,
    change24h: 1.8,
    volume24h: 720000,
    marketCap: 12500000,
    chartData: [
      { time: "2024-01-01", value: 0.82 },
      { time: "2024-01-02", value: 0.85 },
      { time: "2024-01-03", value: 0.81 },
      { time: "2024-01-04", value: 0.88 },
      { time: "2024-01-05", value: 0.86 },
      { time: "2024-01-06", value: 0.92 },
      { time: "2024-01-07", value: 0.96 },
      { time: "2024-01-08", value: 0.93 },
      { time: "2024-01-09", value: 0.99 },
      { time: "2024-01-10", value: 1.03 },
      { time: "2024-01-11", value: 1.00 },
      { time: "2024-01-12", value: 1.06 },
      { time: "2024-01-13", value: 1.10 },
      { time: "2024-01-14", value: 1.07 },
      { time: "2024-01-15", value: 1.13 },
      { time: "2024-01-16", value: 1.17 },
      { time: "2024-01-17", value: 1.21 },
      { time: "2024-01-18", value: 1.18 },
      { time: "2024-01-19", value: 1.25 },
      { time: "2024-01-20", value: 1.31 },
      { time: "2024-01-21", value: 1.35 },
    ]
  },
  {
    id: 'cf-hydro1',
    name: 'Campfire Hydro Energy',
    symbol: 'CF-HYDRO1',
    icon: '/assets/cf-hydro1.png',
    decimals: 18,
    color: '#3B82F6',
    price: 0.76,
    change24h: 0.4,
    volume24h: 510000,
    marketCap: 8300000,
    chartData: [
      { time: "2024-01-01", value: 0.48 },
      { time: "2024-01-02", value: 0.51 },
      { time: "2024-01-03", value: 0.49 },
      { time: "2024-01-04", value: 0.54 },
      { time: "2024-01-05", value: 0.52 },
      { time: "2024-01-06", value: 0.56 },
      { time: "2024-01-07", value: 0.59 },
      { time: "2024-01-08", value: 0.57 },
      { time: "2024-01-09", value: 0.61 },
      { time: "2024-01-10", value: 0.64 },
      { time: "2024-01-11", value: 0.62 },
      { time: "2024-01-12", value: 0.66 },
      { time: "2024-01-13", value: 0.69 },
      { time: "2024-01-14", value: 0.67 },
      { time: "2024-01-15", value: 0.71 },
      { time: "2024-01-16", value: 0.73 },
      { time: "2024-01-17", value: 0.75 },
      { time: "2024-01-18", value: 0.72 },
      { time: "2024-01-19", value: 0.74 },
      { time: "2024-01-20", value: 0.77 },
      { time: "2024-01-21", value: 0.76 },
    ]
  }
];

export const dashboardAssets: AssetPair[] = [
  {
    id: 'cf-wind1-usdc',
    baseCoin: coins.find(c => c.id === 'cf-wind1')!,
    quoteCoin: coins.find(c => c.id === 'usdc')!,
    price: 1.08,
    yield: 7.9,
    volume24h: 1580000,
    marketCap: 14500000,
  },
  {
    id: 'cf-solar1-usdc',
    baseCoin: coins.find(c => c.id === 'cf-solar1')!,
    quoteCoin: coins.find(c => c.id === 'usdc')!,
    price: 0.92,
    yield: 6.4,
    volume24h: 910000,
    marketCap: 9800000,
  },
  {
    id: 'cf-bio1-usdc',
    baseCoin: coins.find(c => c.id === 'cf-bio1')!,
    quoteCoin: coins.find(c => c.id === 'usdc')!,
    price: 1.35,
    yield: 9.2,
    volume24h: 720000,
    marketCap: 12500000,
  },
  {
    id: 'cf-hydro1-usdc',
    baseCoin: coins.find(c => c.id === 'cf-hydro1')!,
    quoteCoin: coins.find(c => c.id === 'usdc')!,
    price: 0.76,
    yield: 5.6,
    volume24h: 510000,
    marketCap: 8300000,
  }
];

export const portfolioHoldings: PortfolioHolding[] = [
  {
    id: 'cf-wind1-holding',
    coin: coins.find(c => c.id === 'cf-wind1')!,
    price: 1.08,
    holdings: 12000,
    value: 12960,
    change24h: 2.1
  },
  {
    id: 'cf-bio1-holding',
    coin: coins.find(c => c.id === 'cf-bio1')!,
    price: 1.35,
    holdings: 4000,
    value: 5400,
    change24h: 1.8
  },
  {
    id: 'cf-hydro1-holding',
    coin: coins.find(c => c.id === 'cf-hydro1')!,
    price: 0.76,
    holdings: 8000,
    value: 6080,
    change24h: 0.4
  }
];

export const portfolioStats: PortfolioStats = {
  currentBalance: 24440.0,
  totalEarning: 1185.45,
  carbonExtracted: 184,
  topPerformer: {
    id: 'cf-bio1',
    name: 'Campfire Bio Energy',
    symbol: 'CF-BIO1',
    icon: '/assets/cf-bio1.png',
    change24h: 1.8
  }
};

export const performanceChartData: Record<string, ChartDataPoint[]> = {
  '24H': [
    { time: '00:00', value: 23800 },
    { time: '04:00', value: 24100 },
    { time: '08:00', value: 23900 },
    { time: '12:00', value: 24300 },
    { time: '16:00', value: 24200 },
    { time: '20:00', value: 24500 },
    { time: '24:00', value: 24440 }
  ],
  '7D': [
    { time: 'Mon', value: 22800 },
    { time: 'Tue', value: 23100 },
    { time: 'Wed', value: 22900 },
    { time: 'Thu', value: 23400 },
    { time: 'Fri', value: 23600 },
    { time: 'Sat', value: 23900 },
    { time: 'Sun', value: 24440 }
  ],
  '1M': [
    { time: 'Week 1', value: 21500 },
    { time: 'Week 2', value: 22200 },
    { time: 'Week 3', value: 21800 },
    { time: 'Week 4', value: 23100 },
    { time: 'Week 5', value: 24440 }
  ],
  '3M': [
    { time: 'Month 1', value: 19200 },
    { time: 'Month 2', value: 20800 },
    { time: 'Month 3', value: 24440 }
  ],
  '1Y': [
    { time: 'Q1', value: 15000 },
    { time: 'Q2', value: 17500 },
    { time: 'Q3', value: 20200 },
    { time: 'Q4', value: 24440 }
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
    tvl: 5.8,
    progress: 68,
    fees: 36.2,
    poolLiquidity: 3120000,
    pooledBase: 1450000, // USDC
    pooledQuote: 1240000, // CF-WIND1
    lockedPercentage: 93.2
  },
  'usdc-cf-bio1': {
    tvl: 4.6,
    progress: 61,
    fees: 32.4,
    poolLiquidity: 2570000,
    pooledBase: 1120000, // USDC
    pooledQuote: 960000, // CF-BIO1
    lockedPercentage: 91.1
  },
  'usdc-cf-hydro1': {
    tvl: 3.1,
    progress: 54,
    fees: 27.8,
    poolLiquidity: 1880000,
    pooledBase: 910000, // USDC
    pooledQuote: 740000, // CF-HYDRO1
    lockedPercentage: 89.5
  },
  'usdc-cf-solar1': {
    tvl: 4.2,
    progress: 63,
    fees: 34.1,
    poolLiquidity: 2260000,
    pooledBase: 1020000, // USDC
    pooledQuote: 820000, // CF-SOLAR1
    lockedPercentage: 90.7
  },
  'cf-wind1-cf-bio1': {
    tvl: 2.5,
    progress: 48,
    fees: 22.6,
    poolLiquidity: 1430000,
    pooledBase: 680000, // CF-WIND1
    pooledQuote: 610000, // CF-BIO1
    lockedPercentage: 87.3
  },
  'cf-hydro1-cf-bio1': {
    tvl: 2.9,
    progress: 52,
    fees: 25.4,
    poolLiquidity: 1650000,
    pooledBase: 720000, // CF-HYDRO1
    pooledQuote: 650000, // CF-BIO1
    lockedPercentage: 88.6
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

// ===== TRADING PAIR CHART DATA =====
export const getTradingPairChartData = (fromCoinId: string, toCoinId: string): ChartDataPoint[] => {
  
  let baseCoinId = fromCoinId;
  if (fromCoinId === 'usdc') {
    baseCoinId = toCoinId;
  }
  
  const baseCoin = getCoinById(baseCoinId);
  const usdcCoin = getCoinById('usdc');
  
  if (!baseCoin || !usdcCoin) {
    return [];
  }
  
  const baseData = baseCoin.chartData;
  const usdcData = usdcCoin.chartData;
  
  // Calculate base coin price in USDC
  const pairData: ChartDataPoint[] = [];
  
  for (let i = 0; i < Math.min(baseData.length, usdcData.length); i++) {
    // Calculate how much USDC you need to buy 1 unit of base coin
    const priceInUsdc = baseData[i].value / usdcData[i].value;
    pairData.push({
      time: baseData[i].time,
      value: priceInUsdc
    });
  }
  
  return pairData;
};

// ===== CHART HEADER HELPER =====
export const getChartHeaderInfo = (fromCoinId: string, toCoinId: string): { baseCoin: Coin | undefined, baseSymbol: string, quoteSymbol: string } => {
  // Determine base coin (non-USDC coin)
  let baseCoinId = fromCoinId;
  if (fromCoinId === 'usdc') {
    baseCoinId = toCoinId;
  }
  
  const baseCoin = getCoinById(baseCoinId);
  
  return {
    baseCoin,
    baseSymbol: baseCoin?.symbol || '',
    quoteSymbol: 'USDC'
  };
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


