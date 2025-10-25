"use client";

import Navbar from "@/components/Global/Navbar";
import Footer from "@/components/Global/Footer";
import ProgressBar from "@/components/Global/ProgressBar";
import RangeSlider from "@/components/Global/RangeSlider";
import { useState, use } from "react";
import { getFundingPoolById } from "@/lib/fundingPools";
import { getCoinById } from "@/lib/data";
import Image from "next/image";

interface FundingPoolPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FundingPoolDetailPage({
  params,
}: FundingPoolPageProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [initialInvestment, setInitialInvestment] = useState(100);
  const [investmentDuration, setInvestmentDuration] = useState(100);
  const [depositAmount, setDepositAmount] = useState("");
  const resolvedParams = use(params);
  const pool = getFundingPoolById(resolvedParams.id);
  const usdcCoin = getCoinById("usdc");

  if (!pool) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="bottom-logo-box">
          <section className="screen-wrapper">
            <div className="container">
              <h1>Funding Pool Not Found</h1>
              <p>The requested funding pool does not exist.</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const tabs = ["Overview", "Details", "Impact", "Calculate Your Returns"];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="bottom-logo-box">
        <section className="screen-wrapper">
          <div className="container">
            <div className="gap-32">
              <div className="gap-16">
                <h1>{pool.name}</h1>
                <p>{pool.description}</p>
              </div>

              <div className="asset-content-wrapper grey-box border-radius-12">
                <div className="asset-content-left">
                  <div className="gap-12">
                    <Image
                      src={pool.image}
                      loading="lazy"
                      alt={pool.name}
                      className="assets-single-image border-radius-12"
                      width={100}
                      height={100}
                    />
                    <div className="asset-tabs">
                      <div className="asset-tab-links border-radius-12">
                        {tabs.map((tab) => (
                          <span
                            key={tab}
                            className={`asset-tab-link ${
                              activeTab === tab ? "asset-tab-active" : ""
                            }`}
                            onClick={() => setActiveTab(tab)}
                            style={{ cursor: "pointer" }}
                          >
                            {tab}
                          </span>
                        ))}
                      </div>

                      <div className="asset-tabs-content-wrapper">
                        {activeTab === "Overview" && (
                          <div className="asset-tab">
                            {pool.overview.map((section, index) => (
                              <div key={index} className="gap-12">
                                <h2 className="text-20">{section.title}</h2>
                                <p>{section.content}</p>
                              </div>
                            ))}
                            <div className="grid-2 grid-gap-20">
                              {pool.team.map((member, i) => (
                                <div
                                  key={i}
                                  className="asset-tea-item border-radius-12"
                                >
                                  <Image
                                    src={member.image}
                                    loading="lazy"
                                    alt={member.name}
                                    className="asset-team-image"
                                    width={50}
                                    height={50}
                                  />
                                  <div className="gap-12">
                                    <span className="text-20">
                                      {member.name}
                                    </span>
                                    <span>{member.role}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {activeTab === "Details" && (
                          <div className="asset-tab">
                            {pool.details.map((section, index) => (
                              <div key={index} className="gap-12">
                                <h2 className="text-20">{section.title}</h2>
                                <p>{section.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeTab === "Impact" && (
                          <div className="asset-tab">
                            {pool.impact.map((section, index) => (
                              <div key={index} className="gap-12">
                                <h2 className="text-20">{section.title}</h2>
                                <p>{section.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeTab === "Calculate Your Returns" && (
                          <div className="asset-tab">
                            <div className="investment-calculator-wrapper">
                              <div className="investment-calculator-left">
                                <RangeSlider
                                  label="Initial Investment"
                                  value={initialInvestment}
                                  min={10}
                                  max={10000}
                                  step={10}
                                  onChange={setInitialInvestment}
                                />
                                <RangeSlider
                                  label="Investment Duration"
                                  value={investmentDuration}
                                  min={1}
                                  max={120}
                                  step={1}
                                  onChange={setInvestmentDuration}
                                />
                              </div>
                              <div className="asset-calculator-result border-radius-12">
                                <div className="gap-8">
                                  <span className="text-14 text-medium">
                                    Expected Yield Generated
                                  </span>
                                  <span
                                    id="asset-result"
                                    className="summary-yield"
                                  >
                                    $
                                    {(
                                      initialInvestment *
                                      (investmentDuration / 12) *
                                      0.1
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                <div className="result-bottom-text">
                                  <p>{pool.calculator.description}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="asset-content-right">
                  <div className="asset-sticky-info border-radius-12">
                    <span className="text-dark text-bold">
                      Investment summary
                    </span>
                    <div className="gap-32">
                      <div className="gap-16 w-100">
                        <div className="gap-8 align-center">
                          <span className="text-14 text-medium">
                            Projected Annually
                          </span>
                          <span className="summary-yield">
                            {pool.summary.projectedAnnually}
                          </span>
                        </div>
                        <div className="summary-list">
                          <div className="content-wrapper">
                            <span className="text-14 text-medium">
                              Duration
                            </span>
                            <span className="text-12 text-bold text-dark">
                              {pool.summary.duration}
                            </span>
                          </div>
                          <div className="content-wrapper">
                            <span className="text-14 text-medium">
                              Being raised
                            </span>
                            <span className="text-12 text-bold text-dark">
                              ${pool.summary.beingRaised.toLocaleString()}
                            </span>
                          </div>
                          <div className="content-wrapper">
                            <span className="text-14 text-medium">
                              Instalments
                            </span>
                            <span className="text-12 text-bold text-dark">
                              {pool.summary.instalments}
                            </span>
                          </div>
                        </div>
                        <p className="text-14 text-medium">
                          {pool.summary.description}
                          <br />
                        </p>
                        <p className="text-14 text-medium">
                          {pool.summary.payoutDate}
                          <br />
                        </p>
                      </div>
                      <div className="gap-10">
                        <span>
                          <span className="text-14 text-bold text-dark">
                            ${pool.fundingRaised.toLocaleString()} raised{" "}
                          </span>
                          <span className="text-medium text-14">
                            of ${pool.fundingTarget.toLocaleString()}
                          </span>
                        </span>
                        <ProgressBar
                          progress={pool.fundingProgress}
                          label=""
                          showLabel={false}
                          size="small"
                        />
                        <span className="text-14 text-medium margin-left-auto">
                          {pool.fundingProgress}%
                        </span>
                      </div>

                      {/* Invest Section */}
                      <div className="invest-section">
                        <div className="invest-header">
                          <span className="text-dark text-bold">Invest</span>
                          <span className="text-14 text-medium">
                            Min: 1 USDC
                          </span>
                        </div>

                        <div className="invest-input-section">
                          <div className="invest-input-wrapper">
                            <input
                              type="number"
                              step="0.01"
                              min="1"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              placeholder="0.00"
                              className="invest-amount-input"
                            />
                            <div className="coin-selector-invest">
                              <div className="coin-icon-wrapper">
                                <img
                                  src={usdcCoin?.icon || "/assets/usdc.png"}
                                  alt="USDC"
                                  className="coin-icon-img"
                                />
                              </div>
                              <span className="coin-symbol">USDC</span>
                            </div>
                          </div>

                          <div className="balance-info">
                            <span className="balance-text">0.000000 USDC</span>
                            <button className="max-button">Max</button>
                          </div>
                        </div>

                        <button className="deposit-button bg-linear-green">
                          Deposit
                        </button>
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
