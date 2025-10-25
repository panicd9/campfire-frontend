interface ProgressBarProps {
  progress: number; // 0-100
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

export default function ProgressBar({
  progress,
  showPercentage = true,
  showLabel = true,
  label = "Progress",
  className = "",
  size = "medium",
}: ProgressBarProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Size classes
  const sizeClasses = {
    small: "progress-smaller",
    medium: "",
    large: "progress-large",
  };

  return (
    <div className={`progress-wrapper ${className}`}>
      {showLabel && (
        <div className="content-wrapper">
          <span className="text-black">{label}</span>
          {showPercentage && (
            <span className="text-black">{clampedProgress}%</span>
          )}
        </div>
      )}
      <div className={`progress-line ${sizeClasses[size]}`}>
        <div
          className={`progress-line-active bg-linear-green ${sizeClasses[size]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
