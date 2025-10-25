"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Global/Navbar";
import Footer from "@/components/Global/Footer";
import {
  getAllCoins,
  getCoinById,
  getLiquidityPoolData,
  getFormattedTVL,
  getFormattedPoolLiquidity,
  getFormattedFees,
  getFormattedLockedPercentage,
  getPooledAmount,
} from "@/lib/data";

// Slippage Tolerance Popup Component
const SlippageTolerancePopup = ({
  isOpen,
  onClose,
  slippageTolerance,
  onSlippageChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  slippageTolerance: number;
  onSlippageChange: (value: number) => void;
}) => {
  const [customValue, setCustomValue] = useState(slippageTolerance.toString());
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setCustomValue(slippageTolerance.toString());
        if (slippageTolerance === 0.1) setSelectedPreset(0.1);
        else if (slippageTolerance === 0.5) setSelectedPreset(0.5);
        else if (slippageTolerance === 1) setSelectedPreset(1);
        else setSelectedPreset(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, slippageTolerance]);

  const handlePresetClick = (value: number) => {
    setSelectedPreset(value);
    setCustomValue(value.toString());
    onSlippageChange(value);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);
    setSelectedPreset(null);

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      onSlippageChange(numericValue);
    }
  };

  const handleSave = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="slippage-modal-overlay">
      <div className="slippage-modal" ref={modalRef}>
        <div className="slippage-modal-header">
          <h3>Swap slippage tolerance</h3>
          <button className="slippage-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="slippage-modal-content">
          <div className="slippage-presets">
            <button
              className={`slippage-preset-btn ${
                selectedPreset === 0.1 ? "selected" : ""
              }`}
              onClick={() => handlePresetClick(0.1)}
            >
              0.1%
            </button>
            <button
              className={`slippage-preset-btn ${
                selectedPreset === 0.5 ? "selected" : ""
              }`}
              onClick={() => handlePresetClick(0.5)}
            >
              0.5%
            </button>
            <button
              className={`slippage-preset-btn ${
                selectedPreset === 1 ? "selected" : ""
              }`}
              onClick={() => handlePresetClick(1)}
            >
              1%
            </button>
          </div>

          <div className="slippage-custom">
            <label>Custom</label>
            <div className="slippage-custom-input-wrapper">
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={customValue}
                onChange={handleCustomChange}
                className="slippage-custom-input"
              />
              <span className="slippage-percent">%</span>
            </div>
          </div>
        </div>

        <div className="slippage-modal-footer">
          <button className="slippage-save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Coin Selector Component
const CoinSelector = ({
  selectedCoin,
  onSelectCoin,
  className = "",
}: {
  selectedCoin: string;
  onSelectCoin: (coinId: string) => void;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const coins = getAllCoins();
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCoinData = getCoinById(selectedCoin);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCoinSelect = (coinId: string) => {
    onSelectCoin(coinId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <>
      <div className={`coin-selector-wrapper ${className}`}>
        <div className="coin-selector" onClick={() => setIsOpen(true)}>
          {selectedCoinData && (
            <>
              <img
                src={selectedCoinData.icon}
                alt={selectedCoinData.name}
                className="coin-icon-selector"
              />
              <span>{selectedCoinData.symbol}</span>
              <img
                src="/assets/3ac41bc969194f54c49a5d8b4172d0ae_484.svg"
                loading="lazy"
                alt="Selector Arrow"
                className="selector-arrow"
              />
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="coin-modal-overlay">
          <div className="coin-modal" ref={modalRef}>
            <div className="coin-modal-header">
              <h3>Select Token</h3>
              <button
                className="coin-modal-close"
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                ×
              </button>
            </div>

            <div className="coin-modal-search">
              <input
                type="text"
                placeholder="Search tokens..."
                className="coin-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="coin-modal-list">
              {filteredCoins.map((coin) => (
                <div
                  key={coin.id}
                  className={`coin-modal-option ${
                    selectedCoin === coin.id ? "selected" : ""
                  }`}
                  onClick={() => handleCoinSelect(coin.id)}
                >
                  <div className="coin-modal-option-left">
                    <img
                      src={coin.icon}
                      alt={coin.name}
                      className="coin-modal-icon"
                    />
                    <div className="coin-modal-info">
                      <span className="coin-modal-symbol">{coin.symbol}</span>
                      <span className="coin-modal-name">{coin.name}</span>
                    </div>
                  </div>
                  <div className="coin-modal-option-right">
                    <span className="coin-modal-price">
                      ${coin.price.toFixed(2)}
                    </span>
                    <span
                      className={`coin-modal-change ${
                        coin.change24h >= 0 ? "positive" : "negative"
                      }`}
                    >
                      {coin.change24h >= 0 ? "+" : ""}
                      {coin.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function LiquidityPage() {
  const [firstCoin, setFirstCoin] = useState("usdc");
  const [secondCoin, setSecondCoin] = useState("cf-wind1");
  const [firstAmount, setFirstAmount] = useState("");
  const [secondAmount, setSecondAmount] = useState("");
  const [activeTrigger, setActiveTrigger] = useState("Max");
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [isSlippagePopupOpen, setIsSlippagePopupOpen] = useState(false);

  // Helper function to format numbers with commas
  const formatNumberWithCommas = (value: number): string => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const firstCoinData = getCoinById(firstCoin);
  const secondCoinData = getCoinById(secondCoin);

  // Get dynamic liquidity pool data
  const poolData = getLiquidityPoolData(firstCoin, secondCoin);

  const handleFirstAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers and one decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    const validValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    setFirstAmount(validValue);

    if (validValue && firstCoinData && secondCoinData) {
      const convertedAmount = (
        (parseFloat(validValue) * firstCoinData.price) /
        secondCoinData.price
      ).toFixed(6);
      setSecondAmount(convertedAmount);
    } else {
      setSecondAmount("");
    }
  };

  const handleSecondAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers and one decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    const validValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    setSecondAmount(validValue);

    if (validValue && firstCoinData && secondCoinData) {
      const convertedAmount = (
        (parseFloat(validValue) * secondCoinData.price) /
        firstCoinData.price
      ).toFixed(6);
      setFirstAmount(convertedAmount);
    } else {
      setFirstAmount("");
    }
  };

  const handleTriggerClick = (trigger: string) => {
    setActiveTrigger(trigger);
    if (trigger === "Max" && firstCoinData) {
      const maxAmount = "1000";
      setFirstAmount(maxAmount);
      if (secondCoinData) {
        const convertedAmount = (
          (parseFloat(maxAmount) * firstCoinData.price) /
          secondCoinData.price
        ).toFixed(6);
        setSecondAmount(convertedAmount);
      }
    } else if (trigger === "50%") {
      const halfAmount = (parseFloat(firstAmount || "0") / 2).toString();
      setFirstAmount(halfAmount);
      if (secondCoinData && firstCoinData) {
        const convertedAmount = (
          (parseFloat(halfAmount) * firstCoinData.price) /
          secondCoinData.price
        ).toFixed(6);
        setSecondAmount(convertedAmount);
      }
    }
  };
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="bottom-logo-box">
        <section className="screen-wrapper">
          <div className="container">
            <div className="gap-32">
              <div className="gap-16">
                <h1>Liquidity</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt
                </p>
              </div>
              <div className="swap-wrapper">
                <div className="swap-left border-radius-12 liquidity-left">
                  <div className="gap-24">
                    <div className="gap-12">
                      <div className="liquidity-item border-radius-12">
                        <div className="liquidity-item-header">
                          <span
                            className={`quantity-trigger ${
                              activeTrigger === "Max" ? "quantity-acitve" : ""
                            }`}
                            onClick={() => handleTriggerClick("Max")}
                          >
                            Max
                          </span>
                          <span
                            className={`quantity-trigger ${
                              activeTrigger === "50%" ? "quantity-acitve" : ""
                            }`}
                            onClick={() => handleTriggerClick("50%")}
                          >
                            50%
                          </span>
                        </div>
                        <div className="swipe-item-body">
                          <div className="cta-flex">
                            <CoinSelector
                              selectedCoin={firstCoin}
                              onSelectCoin={setFirstCoin}
                              className=""
                            />
                            <input
                              type="number"
                              step="any"
                              className="swap-input"
                              value={firstAmount}
                              onChange={handleFirstAmountChange}
                              placeholder="0.00"
                            />
                          </div>
                          <span className="swap-dollar-text text-medium text-14">
                            $
                            {firstAmount
                              ? formatNumberWithCommas(
                                  parseFloat(firstAmount) *
                                    (firstCoinData?.price || 0)
                                )
                              : "0.00"}
                          </span>
                        </div>
                      </div>

                      <div className="liquidity-item border-radius-12">
                        <div className="liquidity-item-header">
                          <span
                            className={`quantity-trigger ${
                              activeTrigger === "Max" ? "quantity-acitve" : ""
                            }`}
                            onClick={() => handleTriggerClick("Max")}
                          >
                            Max
                          </span>
                          <span
                            className={`quantity-trigger ${
                              activeTrigger === "50%" ? "quantity-acitve" : ""
                            }`}
                            onClick={() => handleTriggerClick("50%")}
                          >
                            50%
                          </span>
                        </div>
                        <div className="swipe-item-body">
                          <div className="cta-flex">
                            <CoinSelector
                              selectedCoin={secondCoin}
                              onSelectCoin={setSecondCoin}
                              className=""
                            />
                            <input
                              type="number"
                              step="any"
                              className="swap-input"
                              value={secondAmount}
                              onChange={handleSecondAmountChange}
                              placeholder="0.00"
                            />
                          </div>
                          <span className="swap-dollar-text text-medium text-14">
                            $
                            {secondAmount
                              ? formatNumberWithCommas(
                                  parseFloat(secondAmount) *
                                    (secondCoinData?.price || 0)
                                )
                              : "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="content-wrapper">
                      <span className="text-dark text-medium">
                        Total Deposit
                      </span>
                      <span id="deposit-no" className="text-medium text-dark">
                        $
                        {firstAmount && secondAmount
                          ? formatNumberWithCommas(
                              parseFloat(firstAmount) *
                                (firstCoinData?.price || 0) +
                                parseFloat(secondAmount) *
                                  (secondCoinData?.price || 0)
                            )
                          : "0.00"}
                      </span>
                    </div>

                    <div className="content-wrapper">
                      <div className="horisontal-flex-6">
                        <span className="text-14">
                          1 {firstCoinData?.symbol} ={" "}
                          {secondCoinData && firstCoinData
                            ? (
                                secondCoinData.price / firstCoinData.price
                              ).toFixed(2)
                            : "0.00"}{" "}
                          {secondCoinData?.symbol}
                        </span>
                        <img
                          src="/assets/789c07bb19743d70246755a2ebcb6fe6_1359.svg"
                          loading="lazy"
                          alt="null"
                          className="icon-12"
                        />
                      </div>
                      <div
                        className="slippage-triger"
                        onClick={() => setIsSlippagePopupOpen(true)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src="/assets/da559c191ca098400a903d3333fae928_2145.svg"
                          loading="lazy"
                          alt="null"
                          className="icon-15"
                        />
                        <span className="text-14 text-medium text-dark">
                          {slippageTolerance}%
                        </span>
                      </div>
                    </div>

                    <a
                      href="#"
                      link-type="page"
                      className="connect-wallet border-radius-12 bg-linear-green"
                    >
                      <span>Enter Token Amount</span>
                    </a>
                  </div>
                </div>

                <div className="liquidity-right">
                  <div className="liquidity-right-item border-radius-12">
                    <div className="gap-24">
                      <div className="gap-6">
                        <span className="text-12">Total Value Locked</span>
                        <span className="text-dark text-bold">
                          {getFormattedTVL(firstCoin, secondCoin)}
                        </span>
                        <div className="progress-line progress-smaller">
                          <div
                            className="progress-line-active bg-linear-green progress-smaller"
                            style={{ width: `${poolData.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="gap-8">
                        <div className="content-wrapper">
                          <div className="horisontal-flex-8">
                            <img
                              src="/assets/49c289fdac69a51e86dc6528395ea3b9_412.svg"
                              loading="lazy"
                              alt="null"
                              className="green-dot"
                            />
                            <span className="text-14 text-medium">Fees</span>
                          </div>
                          <span className="text-dark text-12 text-bold">
                            {getFormattedFees(firstCoin, secondCoin)}
                          </span>
                        </div>

                        <div className="tvl-info">
                          <div className="content-wrapper">
                            <span className="text-14 text-bold text-dark">
                              Pool Liquidity
                            </span>
                            <span className="text-12 text-medium">
                              $
                              {getFormattedPoolLiquidity(firstCoin, secondCoin)}
                            </span>
                          </div>

                          <div className="content-wrapper">
                            <div className="horisontal-flex-6">
                              <span className="text-14 text-medium">
                                Pooled {firstCoinData?.symbol}
                              </span>
                              <img
                                src={
                                  firstCoinData?.icon ||
                                  "/assets/23a14b210e8d1223709b03a240447a20_5725.avif"
                                }
                                loading="lazy"
                                alt="null"
                                className="coin-icon-16"
                              />
                            </div>
                            <span className="text-12 text-bold text-dark">
                              {getPooledAmount(
                                firstCoin,
                                secondCoin,
                                firstCoin
                              ).toLocaleString("en-US")}
                            </span>
                          </div>

                          <div className="content-wrapper">
                            <div className="horisontal-flex-6">
                              <span className="text-14 text-medium">
                                Pooled {secondCoinData?.symbol}
                              </span>
                              <img
                                src={
                                  secondCoinData?.icon ||
                                  "/assets/23a14b210e8d1223709b03a240447a20_5725.avif"
                                }
                                loading="lazy"
                                alt="null"
                                className="coin-icon-16"
                              />
                            </div>
                            <span className="text-12 text-bold text-dark">
                              {getPooledAmount(
                                firstCoin,
                                secondCoin,
                                secondCoin
                              ).toLocaleString("en-US")}
                            </span>
                          </div>
                        </div>

                        <div className="locked-bottom">
                          <img
                            src="/assets/d9c6082c582c6a8f1dc843819828ae2c_1512.svg"
                            loading="lazy"
                            alt="null"
                            className="icon-12"
                          />
                          <p className="text-12 text-medium">
                            {getFormattedLockedPercentage(
                              firstCoin,
                              secondCoin
                            )}{" "}
                            permanently locked
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="liquidity-right-item border-radius-12">
                    <div className="gap-24">
                      <div className="gap-8">
                        <div className="content-wrapper">
                          <div className="horisontal-flex-8">
                            <span className="text-14 text-bold text-dark">
                              My Position
                            </span>
                          </div>
                          <span className="text-dark text-12 text-medium">
                            $0
                          </span>
                        </div>

                        <div className="position-info padding-top-12">
                          <div className="content-wrapper">
                            <span className="text-14 text-bold text-dark">
                              LP Token Balances
                            </span>
                          </div>

                          <div className="content-wrapper margin-top-10">
                            <div className="horisontal-flex-6">
                              <span className="text-14 text-medium">
                                Staked
                              </span>
                            </div>
                            <span className="text-12 text-bold text-dark">
                              0
                            </span>
                          </div>

                          <div className="content-wrapper">
                            <div className="horisontal-flex-6">
                              <span className="text-14 text-medium">
                                Unstaked
                              </span>
                            </div>
                            <span className="text-12 text-bold text-dark">
                              --
                            </span>
                          </div>
                        </div>
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

      <SlippageTolerancePopup
        isOpen={isSlippagePopupOpen}
        onClose={() => setIsSlippagePopupOpen(false)}
        slippageTolerance={slippageTolerance}
        onSlippageChange={setSlippageTolerance}
      />
    </div>
  );
}
