import { Metadata } from "next";
import Navbar from "@/components/Global/Navbar";
import Footer from "@/components/Global/Footer";
import PortfolioAssetCard from "@/components/portfolio/PortfolioAssetCard";
import PortfolioStats from "@/components/portfolio/PortfolioStats";
import PortfolioCharts from "@/components/portfolio/PortfolioCharts";
import { portfolioHoldings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfolio | Campfire",
};

export default function Portfolio() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="bottom-logo-box">
        <section className="screen-wrapper">
          <div className="container">
            <div className="gap-32">
              <div className="gap-16">
                <h1>Portfolio</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt
                </p>
              </div>
              <div className="grey-box border-radius-12">
                <div className="gap-8">
                  <PortfolioStats />
                  <PortfolioCharts />
                  <div className="tablet-overflow-auto">
                    <div className="dashboard-table gap-8">
                      <div className="dahboard-header border-radius-12">
                        <div className="table-item-20">
                          <span>Asset</span>
                        </div>
                        <div className="table-item-16">
                          <span>Price</span>
                        </div>
                        <div className="table-item-16">
                          <span>24h Change</span>
                        </div>
                        <div className="table-item-16">
                          <span>Value</span>
                        </div>
                        <div className="table-item-16">
                          <span>Holdings</span>
                        </div>
                      </div>
                      <div className="dashboard-table-body border-radius-12">
                        {portfolioHoldings.map((holding) => (
                          <PortfolioAssetCard
                            key={holding.id}
                            holding={holding}
                          />
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
