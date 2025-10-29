"use client";

import React, { useState, useEffect } from "react";

interface CounterAnimationProps {
  endValue: number;
  duration?: number;
  delay?: number;
  className?: string;
  formatter?: "currency" | "number" | "tons" | "default";
}

export default function CounterAnimation({
  endValue,
  duration = 1000,
  delay = 0,
  className = "",
  formatter = "default",
}: CounterAnimationProps) {
  const [count, setCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const timer = setTimeout(() => {
      const startTime = Date.now();
      const startValue = 0;

      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(
          startValue + (endValue - startValue) * easeOutCubic
        );

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [endValue, duration, delay, isClient]);

  const formatValue = (value: number) => {
    if (!isClient) {
      switch (formatter) {
        case "currency":
          return "$0";
        case "tons":
          return "0 tons";
        case "number":
          return "0";
        default:
          return "0";
      }
    }

    switch (formatter) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
          maximumFractionDigits: 2,
        }).format(value);
      case "tons":
        return `${value.toLocaleString("en-US")} tons`;
      case "number":
        return value.toLocaleString("en-US");
      default:
        return value.toLocaleString();
    }
  };

  return <span className={className}>{formatValue(count)}</span>;
}
