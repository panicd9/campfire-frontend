import { Metadata } from "next";
import Navbar from "@/components/Global/Navbar";
import Footer from "@/components/Global/Footer";
import AssetCard from "@/components/dashboard/AssetCard";
import { dashboardAssets, portfolioStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dashboard | Campfire",
};

export default function Dashboard() {
  const totalValueLocked = dashboardAssets.reduce(
    (sum, asset) => sum + asset.marketCap,
    0,
  );
  const tvlFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  });
  const formattedTvl = tvlFormatter.format(totalValueLocked);
  const formattedCarbonOffset = `${portfolioStats.carbonExtracted.toLocaleString("en-US")} tons`;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="bottom-logo-box">
        <section className="screen-wrapper">
          <div className="container">
            <div className="gap-32">
              <div className="gap-16">
                <h1>Dashboard</h1>
                <p>
                  Explore all available renewable energy assets and discover
                  investment opportunities.
                </p>
              </div>
              <div className="grey-box border-radius-12">
                <div className="gap-48">
                  <div className="grid-3">
                    <div className="info-item border-radius-12">
                      <span className="text-18 text-black">
                        Total Value Locked
                      </span>
                          <span className="text-32">{formattedTvl}</span>
                    </div>
                    <div className="info-item border-radius-12">
                      <span className="text-18 text-black">
                        Available Assets
                      </span>
                          <span className="text-32">{dashboardAssets.length}</span>
                    </div>
                    <div className="info-item border-radius-12">
                      <span className="text-18 text-black">Carbon Offset</span>
                          <span className="text-32">{formattedCarbonOffset}</span>
                    </div>
                  </div>
                  <div className="tablet-overflow-auto">
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
