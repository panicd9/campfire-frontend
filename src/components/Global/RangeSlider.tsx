"use client";

import React, { useState } from "react";

interface RangeSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  value,
  min = 0,
  max = 1000,
  step = 1,
  onChange,
  className = "",
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (newValue: number) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const percentage = ((localValue - min) / (max - min)) * 100;

  return (
    <div className={`calculator-item border-radius-12 ${className}`}>
      <div className="content-wrapper">
        <span className="text-dark text-bold">{label}</span>
        <span className="calculator-item-result">{localValue}</span>
      </div>
      <div className="calculator-range">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="range-slider-input"
          style={{
            background: `linear-gradient(to right, #29b05c 0%, #6fcb69 50%, #03782a 100%) 0% 0% / ${percentage}% 100% no-repeat, #e5e7eb`,
          }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
