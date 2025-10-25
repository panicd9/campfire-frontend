import { AssetPair } from "@/lib/data";

interface AssetCardProps {
  asset: AssetPair;
}

export default function AssetCard({ asset }: AssetCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="table-row">
      <div className="table-item-20">
        <div className="icons-wrapper">
          <img
            loading="lazy"
            alt={asset.baseCoin.name}
            className="icon-1"
            src={asset.baseCoin.icon}
          />
          <img
            loading="lazy"
            alt={asset.quoteCoin.name}
            className="icon-2"
            src={asset.quoteCoin.icon}
          />
        </div>
        <span className="table-text">
          {asset.baseCoin.symbol} - {asset.quoteCoin.symbol}
        </span>
      </div>
      <div className="table-item-16">
        <span className="table-text">{formatCurrency(asset.price)}</span>
      </div>
      <div className="table-item-16">
        <span className="table-text">{asset.yield}%</span>
      </div>
      <div className="table-item-16">
        <span className="table-text">{formatNumber(asset.volume24h)}</span>
      </div>
      <div className="table-item-16">
        <span className="table-text">{formatNumber(asset.marketCap)}</span>
      </div>
      <div className="table-item-16">
        <div className="cta-flex jusify-end">
          <a
            href={`/swap?from=${asset.baseCoin.id}&to=${asset.quoteCoin.id}`}
            link-type="page"
            className="cta-green bg-linear-green border-radius-12"
          >
            <img
              loading="eager"
              alt="Swap"
              src="assets/bb17507d3019bdefd41027315f8ba131_667.svg"
            />
            <span>Swap</span>
          </a>
        </div>
      </div>
    </div>
  );
}
