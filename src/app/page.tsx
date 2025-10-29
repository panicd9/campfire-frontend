import { Metadata } from "next";
import Navbar from "@/components/Global/Navbar";
import Footer from "@/components/Global/Footer";
import AssetCard from "@/components/dashboard/AssetCard";
import { dashboardAssets, portfolioStats } from "@/lib/data";
import { animations } from "@/lib/animations";
import CounterAnimation from "@/components/Global/CounterAnimation";

export const metadata: Metadata = {
  title: "Dashboard | Campfire",
};

export default function Dashboard() {
  const totalValueLocked = dashboardAssets.reduce(
    (sum, asset) => sum + asset.marketCap,
    0
  );
  const tvlFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  });
  const formattedTvl = tvlFormatter.format(totalValueLocked);
  const formattedCarbonOffset = `${portfolioStats.carbonExtracted.toLocaleString(
    "en-US"
  )} tons`;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="bottom-logo-box">
        <section className="screen-wrapper">
          <div className="container">
            <div className="gap-32">
              <div
                className={`gap-16 ${animations.fadeIn(0).className}`}
                style={animations.fadeIn(0).style}
              >
                <h1>Dashboard</h1>
                <p>
                  Explore all available renewable energy assets and discover
                  investment opportunities.
                </p>
              </div>
              <div
                className={`grey-box border-radius-12 ${
                  animations.slideUp(0.1).className
                }`}
                style={animations.slideUp(0.1).style}
              >
                <div className="gap-48">
                  <div className="grid-3">
                    <div
                      className={`info-item border-radius-12 ${
                        animations.cardEntrance(0.2).className
                      }`}
                      style={animations.cardEntrance(0.2).style}
                    >
                      <span className="text-18 text-black">
                        Total Value Locked
                      </span>
                      <CounterAnimation
                        endValue={totalValueLocked}
                        duration={1000}
                        delay={0}
                        className="text-32"
                        formatter="currency"
                      />
                    </div>
                    <div
                      className={`info-item border-radius-12 ${
                        animations.cardEntrance(0.3).className
                      }`}
                      style={animations.cardEntrance(0.3).style}
                    >
                      <span className="text-18 text-black">
                        Available Assets
                      </span>
                      <CounterAnimation
                        endValue={dashboardAssets.length}
                        duration={1000}
                        delay={0.1}
                        className="text-32"
                      />
                    </div>
                    <div
                      className={`info-item border-radius-12 ${
                        animations.cardEntrance(0.4).className
                      }`}
                      style={animations.cardEntrance(0.4).style}
                    >
                      <span className="text-18 text-black">Carbon Offset</span>
                      <CounterAnimation
                        endValue={portfolioStats.carbonExtracted}
                        duration={1000}
                        delay={0.2}
                        className="text-32"
                        formatter="tons"
                      />
                    </div>
                  </div>
                  <div
                    className={`tablet-overflow-auto ${
                      animations.slideUp(0.5).className
                    }`}
                    style={animations.slideUp(0.5).style}
                  >
                    <div className="dashboard-table">
                      <div className="dahboard-header border-radius-12">
                        <div className="table-item-20">
                          <span>Asset</span>
                        </div>
                        <div className="table-item-16">
                          <span>Price</span>
                        </div>
                        <div className="table-item-16">
                          <span>Yield</span>
                        </div>
                        <div className="table-item-16">
                          <span>24h Volume</span>
                        </div>
                        <div className="table-item-16">
                          <span>Market Cap</span>
                        </div>
                      </div>
                      <div className="dashboard-table-body border-radius-12">
                        {dashboardAssets.map((asset) => (
                          <AssetCard key={asset.id} asset={asset} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
