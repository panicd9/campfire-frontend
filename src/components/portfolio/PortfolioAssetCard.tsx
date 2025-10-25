import { PortfolioHolding } from "@/lib/data";

interface PortfolioAssetCardProps {
  holding: PortfolioHolding;
}

export default function PortfolioAssetCard({
  holding,
}: PortfolioAssetCardProps) {
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
            alt={holding.coin.name}
            className="icon-1"
            src={holding.coin.icon}
          />
        </div>
        <span className="table-text">{holding.coin.symbol}</span>
      </div>
      <div className="table-item-16">
        <span className="table-text">{formatCurrency(holding.price)}</span>
      </div>
      <div className="table-item-16">
        <span
          className={`table-text ${
            holding.change24h >= 0 ? "text-green" : "text-red"
          }`}
        >
          {holding.change24h >= 0 ? "+" : ""}
          {holding.change24h}%
        </span>
      </div>
      <div className="table-item-16">
        <span className="table-text">{formatNumber(holding.value)}</span>
      </div>
      <div className="table-item-16">
        <span className="table-text">
          {holding.holdings} {holding.coin.symbol}
        </span>
      </div>
      <div className="table-item-16">
        <div className="cta-flex jusify-end">
          <a
            href={`/swap?from=${holding.coin.id}&to=usdc`}
            link-type="page"
            className="cta-green bg-linear-green border-radius-12"
          >
            <img
              loading="eager"
              alt="Trade"
              src="assets/bb17507d3019bdefd41027315f8ba131_667.svg"
            />
            <span>Trade</span>
          </a>
        </div>
      </div>
    </div>
  );
}
