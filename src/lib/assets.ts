export interface Coin {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  color: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  chartData: {
    time: string;
    value: number;
  }[];
}

export interface AssetPair {
  id: string;
  baseCoin: Coin;
  quoteCoin: Coin;
  price: number;
  yield: number;
  volume24h: number;
  marketCap: number;
  holdings?: number; 
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  yield: number;
  volume24h: number;
  marketCap: number;
  icon1: string;
  icon2: string;
  swapIcon: string;
}

