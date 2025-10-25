import { portfolioStats } from "@/lib/data";

export default function PortfolioStats() {
  const { currentBalance, totalEarning, carbonExtracted, topPerformer } =
    portfolioStats;

  return (
    <div className="grid-4">
      <div className="protfolio-top-item border-radius-12">
        <span className="text-18">Current Balance</span>
        <span className="text-32">${currentBalance.toLocaleString()}</span>
        <div className="horisontal-flex-8">
          <span className="percent-change">+12.5%</span>
        </div>
      </div>
      <div className="protfolio-top-item border-radius-12">
        <span className="text-18">Total Earning</span>
        <span className="text-32 text-red">
          {totalEarning.toLocaleString()}
        </span>
        <div className="horisontal-flex-8">
          <span className="text-12">24h Portfolio Change</span>
          <span className="percent-change percent-red">-12.5%</span>
        </div>
      </div>
      <div className="protfolio-top-item border-radius-12">
        <span className="text-18">Total Carbon Extracted</span>
        <span className="text-32">{carbonExtracted.toLocaleString()} tons</span>
        <div className="horisontal-flex-8">
          <span className="percent-change">+156 tons</span>
        </div>
      </div>
      <div className="protfolio-top-item border-radius-12">
        <span className="text-18">Top Performer</span>
        <div className="coin-name-wrap">
          <img
            src={topPerformer.icon}
            loading="lazy"
            alt={topPerformer.name}
            className="portfolio-coin-icon"
          />
          <span className="text-20">{topPerformer.symbol}</span>
        </div>
        <div className="horisontal-flex-8">
          <span className="text-12">Top Performer 24h</span>
          <span className="percent-change">+{topPerformer.change24h}%</span>
        </div>
      </div>
    </div>
  );
}
