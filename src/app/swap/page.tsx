"use client";

import React, { useState, useEffect, useRef } from "react";
import { createChart, ColorType, LineSeries } from "lightweight-charts";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Navbar from "@/components/Global/Navbar";
import Footer from "@/components/Global/Footer";
import {
  getAllCoins,
  getCoinById,
  getTradingPairChartData,
  getChartHeaderInfo,
} from "@/lib/data";
import { animations } from "@/lib/animations";

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

// Chart Component - Lightweight Charts
const TradingChart = ({
  data,
  height = 300,
}: {
  data: { time: string; value: number }[];
  height?: number;
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: "#f0f0f0",
      },
      timeScale: {
        borderColor: "#f0f0f0",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: "#10B981",
      lineWidth: 2,
    });

    // Set data
    const formattedData = data.map((item) => ({
      time: item.time,
      value: item.value,
    }));

    lineSeries.setData(formattedData);
    chart.timeScale().fitContent();

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, height]);

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <span style={{ color: "#666" }}>No chart data available</span>
      </div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: `${height}px` }}
    />
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

export default function SwapPage() {
  const [fromCoin, setFromCoin] = useState("usdc");
  const [toCoin, setToCoin] = useState("cf-wind1");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [isSlippagePopupOpen, setIsSlippagePopupOpen] = useState(false);

  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  const handleWalletClick = () => {
    setVisible(true);
  };

  // Helper function to format numbers with commas
  const formatNumberWithCommas = (value: number): string => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Handle URL parameters for auto-selection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const fromParam = urlParams.get("from");
      const toParam = urlParams.get("to");

      if (fromParam && toParam) {
        const fromCoinData = getCoinById(fromParam);
        const toCoinData = getCoinById(toParam);

        if (fromCoinData && toCoinData) {
          const timer = setTimeout(() => {
            setFromCoin(fromParam);
            setToCoin(toParam);
          }, 0);
          return () => clearTimeout(timer);
        }
      }
    }
  }, []);

  const fromCoinData = getCoinById(fromCoin);
  const toCoinData = getCoinById(toCoin);
  const chartHeaderInfo = getChartHeaderInfo(fromCoin, toCoin);

  const handleSwapCoins = () => {
    const tempCoin = fromCoin;
    const tempAmount = fromAmount;
    setFromCoin(toCoin);
    setToCoin(tempCoin);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers and one decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    const validValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    setFromAmount(validValue);

    if (validValue && fromCoinData && toCoinData) {
      const convertedAmount = (
        (parseFloat(validValue) * fromCoinData.price) /
        toCoinData.price
      ).toFixed(6);
      setToAmount(convertedAmount);
    } else {
      setToAmount("");
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow numbers and one decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    const validValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    setToAmount(validValue);

    if (validValue && fromCoinData && toCoinData) {
      const convertedAmount = (
        (parseFloat(validValue) * toCoinData.price) /
        fromCoinData.price
      ).toFixed(6);
      setFromAmount(convertedAmount);
    } else {
      setFromAmount("");
    }
  };

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
                <h1>Swap</h1>
              </div>
              <div
                className={`grey-box border-radius-12 ${
                  animations.slideUp(0.1).className
                }`}
                style={animations.slideUp(0.1).style}
              >
                <div className="swap-wrapper">
                  <div
                    className={`swap-left border-radius-12 ${
                      animations.cardEntrance(0.2).className
                    }`}
                    style={animations.cardEntrance(0.2).style}
                  >
                    <div className="swap-header">
                      <div className="swap-pair-wrapper">
                        <div className="icons-wrapper">
                          <img
                            src={chartHeaderInfo.baseCoin?.icon}
                            loading="lazy"
                            alt="Base Coin"
                            className="icon-1"
                          />
                          <img
                            src="/assets/usdc.png"
                            loading="lazy"
                            alt="USDC"
                            className="icon-2"
                          />
                        </div>
                        <span className="text-dark text-medium">
                          {chartHeaderInfo.baseSymbol} /{" "}
                          {chartHeaderInfo.quoteSymbol}
                        </span>
                      </div>
                      <img
                        src="/assets/789c07bb19743d70246755a2ebcb6fe6_1359.svg"
                        loading="lazy"
                        alt="Chart Icon"
                        className="icon-12"
                      />
                      <span id="real-time" className="text-12 text-medium">
                        25/10/05 15:10
                      </span>
                    </div>
                    <div className="swap-chart-wrapper">
                      <TradingChart
                        data={getTradingPairChartData(fromCoin, toCoin)}
                        height={300}
                      />
                    </div>
                  </div>

                  <div
                    className={`swap-right border-radius-12 ${
                      animations.cardEntrance(0.3).className
                    }`}
                    style={animations.cardEntrance(0.3).style}
                  >
                    <div className="gap-12">
                      <div className="swap-item border-radius-12">
                        <div className="swap-item-header">
                          <span className="text-14">From</span>
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
                        <div className="swipe-item-body">
                          <div className="cta-flex">
                            <CoinSelector
                              selectedCoin={fromCoin}
                              onSelectCoin={setFromCoin}
                              className=""
                            />
                            <input
                              type="number"
                              step="any"
                              className="swap-input"
                              value={fromAmount}
                              onChange={handleFromAmountChange}
                              placeholder="0.00"
                            />
                          </div>
                          <span className="swap-dollar-text text-medium text-14">
                            $
                            {fromAmount
                              ? formatNumberWithCommas(
                                  parseFloat(fromAmount) *
                                    (fromCoinData?.price || 0)
                                )
                              : "0.00"}
                          </span>
                        </div>
                        <div
                          className="swap-icon-wrapper"
                          onClick={handleSwapCoins}
                        >
                          <img
                            src="/assets/b30e7793f9683233d120adfca13892dc_552.svg"
                            loading="lazy"
                            alt="Arrow"
                            className="swap-arrow-icon"
                          />
                          <img
                            src="/assets/a1193ee3366066c9cf975a1f9f92174a_1343.svg"
                            loading="lazy"
                            alt="Swap"
                            className="swap-swap-icon"
                          />
                        </div>
                      </div>

                      <div className="swap-item border-radius-12">
                        <div className="swap-item-header">
                          <span className="text-14">To</span>
                        </div>
                        <div className="swipe-item-body">
                          <div className="cta-flex">
                            <CoinSelector
                              selectedCoin={toCoin}
                              onSelectCoin={setToCoin}
                              className=""
                            />
                            <input
                              type="number"
                              step="any"
                              className="swap-input"
                              value={toAmount}
                              onChange={handleToAmountChange}
                              placeholder="0.00"
                            />
                          </div>
                          <span className="swap-dollar-text text-medium text-14">
                            $
                            {toAmount
                              ? formatNumberWithCommas(
                                  parseFloat(toAmount) *
                                    (toCoinData?.price || 0)
                                )
                              : "0.00"}
                          </span>
                        </div>
                      </div>

                      {connected ? (
                        <button
                          className="connect-wallet border-radius-12 bg-linear-green"
                          style={{
                            border: "none",
                            cursor: "pointer",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <span>Swap</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleWalletClick}
                          className="connect-wallet border-radius-12 bg-linear-green"
                          style={{
                            border: "none",
                            cursor: "pointer",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <img
                            src="/assets/4f69a02f6b03e70ca74774ae4741bc3a_1413.svg"
                            loading="lazy"
                            alt="Wallet Icon"
                            className="connect-con"
                          />
                          <span>Connect Wallet</span>
                        </button>
                      )}
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
