import Navbar from "@/components/Global/Navbar";
import Footer from "@/components/Global/Footer";
import ProgressBar from "@/components/Global/ProgressBar";
import { getAllFundingPools } from "@/lib/fundingPools";

export default function FundingPoolPage() {
  const fundingPools = getAllFundingPools();

  return (
    <>
      <Navbar />
      <div className="bottom-logo-box">
        <section className="screen-wrapper">
          <div className="container">
            <div className="gap-32">
              <div className="gap-16">
                <h1>Funding Pool</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt{" "}
                </p>
              </div>
              <div className="grid-3">
                {fundingPools.map((pool) => (
                  <div key={pool.id} className="funding-item border-radius-12">
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
                          progress={pool.fundingProgress}
                          label="Funding Progress"
                          size="medium"
                        />
                        <div className="grid-2">
                          <div className="grey-item border-radius-12">
                            <span className="text-12">Funding Target</span>
                            <span className="text-black">
                              {pool.fundingTarget.toLocaleString()}{" "}
                              {pool.currency}
                            </span>
                          </div>
                          <div className="grey-item border-radius-12">
                            <span className="text-12">Raised</span>
                            <span className="text-black">
                              {pool.fundingRaised.toLocaleString()}{" "}
                              {pool.currency}
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
