"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import {
  generateHoldingsChartData,
  performanceChartData,
  portfolioHoldings,
} from "@/lib/data";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

export default function PortfolioCharts() {
  const [activeTimeframe, setActiveTimeframe] = useState("24H");

  // Pie chart data
  const holdingsChartData = generateHoldingsChartData(portfolioHoldings);
  const pieData = {
    labels: holdingsChartData.map((item) => item.name),
    datasets: [
      {
        data: holdingsChartData.map((item) => item.value),
        backgroundColor: holdingsChartData.map((item) => item.color),
        borderWidth: 0,
        hoverBorderWidth: 0,
        hoverOffset: 0,
      },
    ],
  };

  // Line chart data
  const currentData =
    performanceChartData[activeTimeframe as keyof typeof performanceChartData];
  const lineData = {
    labels: currentData.map((item) => item.time),
    datasets: [
      {
        data: currentData.map((item) => item.value),
        borderColor: "#29b05c",
        backgroundColor: "rgba(41, 176, 92, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#29b05c",
        pointBorderColor: "#29b05c",
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: "#f0f0f0",
          drawBorder: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: "#f0f0f0",
          drawBorder: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context: { parsed: number }) {
            return `$${context.parsed.toLocaleString()}`;
          },
        },
      },
    },
    cutout: "60%",
    interaction: {
      intersect: false,
    },
  };

  return (
    <div className="grid-2 mobile-flex">
      <div className="portfolio-mid-item border-radius-12">
        <h2>Holdings</h2>
        <div className="holdings-pie-chart-wrapper" style={{ height: "300px" }}>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
      <div className="portfolio-mid-item border-radius-12">
        <div className="content-wrapper mb-[20px]">
          <h2>Performance</h2>
          <div className="chart-triggers-wrapper">
            {["24H", "7D", "1M", "3M", "1Y"].map((timeframe) => (
              <span
                key={timeframe}
                className={`chart-trigger ${
                  activeTimeframe === timeframe ? "chart-trigger-active" : ""
                }`}
                onClick={() => setActiveTimeframe(timeframe)}
              >
                {timeframe}
              </span>
            ))}
          </div>
        </div>
        <div className="holdings-pie-chart-wrapper" style={{ height: "300px" }}>
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
