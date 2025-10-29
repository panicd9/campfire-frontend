import { portfolioStats } from "@/lib/data";
import { animations } from "@/lib/animations";
import CounterAnimation from "@/components/Global/CounterAnimation";

export default function PortfolioStats() {
  const { currentBalance, totalEarning, carbonExtracted, topPerformer } =
    portfolioStats;

  return (
    <div
      className={`grid-4 ${animations.cardEntrance(0.2).className}`}
      style={animations.cardEntrance(0.2).style}
    >
      <div className="protfolio-top-item border-radius-12">
        <span className="text-18">Current Balance</span>
        <CounterAnimation
          endValue={currentBalance}
          duration={1000}
          delay={0}
          className="text-32"
          formatter="currency"
        />
        <div className="horisontal-flex-8">
          <span className="percent-change">+12.5%</span>
        </div>
      </div>
      <div className="protfolio-top-item border-radius-12">
        <span className="text-18">Total Earning</span>
        <CounterAnimation
          endValue={totalEarning}
          duration={1000}
          delay={0.1}
          className="text-32 text-red"
          formatter="number"
        />
        <div className="horisontal-flex-8">
          <span className="text-12">24h Portfolio Change</span>
          <span className="percent-change percent-red">-12.5%</span>
        </div>
      </div>
      <div className="protfolio-top-item border-radius-12">
        <span className="text-18">Total Carbon Extracted</span>
        <CounterAnimation
          endValue={carbonExtracted}
          duration={1000}
          delay={0.2}
          className="text-32"
          formatter="tons"
        />
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
