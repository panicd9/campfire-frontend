import Navbar from "@/components/Global/Navbar";
import Footer from "@/components/Global/Footer";
import ProgressBar from "@/components/Global/ProgressBar";
import { getAllFundingPools } from "@/lib/fundingPools";
import {
  parseTokenAmountUI,
  PRECISION,
  PRECISSION_BN,
} from "../../../solana/utils";
import { animations } from "@/lib/animations";

export default async function FundingPoolPage() {
  const fundingPools = await getAllFundingPools();

  return (
    <>
      <Navbar />
      <div className="bottom-logo-box">
        <section className="screen-wrapper">
          <div className="container">
            <div className="gap-32">
              <div
                className={`gap-16 ${animations.fadeIn(0).className}`}
                style={animations.fadeIn(0).style}
              >
                <h1>Funding Pool</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt{" "}
                </p>
              </div>
              <div
                className={`grid-3 ${animations.slideUp(0.1).className}`}
                style={animations.slideUp(0.1).style}
              >
                {fundingPools.map((pool, index) => (
                  <div
                    key={pool.id}
                    className={`funding-item border-radius-12 ${
                      animations.cardEntrance(0.2 + index * 0.1).className
                    }`}
                    style={animations.cardEntrance(0.2 + index * 0.1).style}
                  >
                    <div className="gap-16">
                      <img
                        src={pool.image}
                        loading="lazy"
                        alt={pool.name}
                        className="funding-item-image border-radius-12"
                      />
                      <div className="gap-12 padding-12">
                        <div className="gap-6">
                          <h2>{pool.name}</h2>
                          <span className="text-14">{pool.location}</span>
                        </div>
                        <div className="custom-list-wrapper">
                          <span className="text-14 text-black">
                            {pool.category}
                          </span>
                          <ul>
                            {pool.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        <ProgressBar
                          progress={
                            pool.chainData
                              ? (pool.chainData.totalDeposited
                                  .mul(PRECISSION_BN)
                                  .div(pool.chainData.depositLimit)
                                  .toNumber() /
                                  PRECISION) *
                                100
                              : pool.fundingProgress
                          }
                          label="Funding Progress"
                          size="medium"
                        />
                        <div className="grid-2">
                          <div className="grey-item border-radius-12">
                            <span className="text-12">Funding Target</span>
                            <span className="text-black">
                              {pool.chainData
                                ? `${parseTokenAmountUI(
                                    pool.chainData.depositLimit,
                                    6,
                                    0
                                  )} ${pool.currency}`
                                : `${pool.fundingTarget.toLocaleString()} ${
                                    pool.currency
                                  }`}
                            </span>
                          </div>
                          <div className="grey-item border-radius-12">
                            <span className="text-12">Raised</span>
                            <span className="text-black">
                              {pool.chainData
                                ? `${parseTokenAmountUI(
                                    pool.chainData.totalDeposited,
                                    6,
                                    0
                                  )} ${pool.currency}`
                                : `${pool.fundingRaised.toLocaleString()} ${
                                    pool.currency
                                  }`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="padding-12">
                      <a
                        href={`/funding-pool/${pool.id}`}
                        link-type="page"
                        className="cta-dark-blue border-radius-12"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
