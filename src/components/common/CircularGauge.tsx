import React from 'react';

interface CircularGaugeProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  statusText?: string;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  size = 180,
  strokeWidth = 14,
  label = 'HEALTH',
  sublabel = '/ 100',
  statusText
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = '#00e676'; // green
  let glowClass = 'shadow-glow-green';
  if (value < 65) {
    color = '#ff1744'; // red
    glowClass = 'shadow-glow-red';
  } else if (value < 85) {
    color = '#ffb300'; // amber
    glowClass = 'shadow-glow-amber';
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#121d36"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated value arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.4s ease'
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
            {label}
          </span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-white" style={{ textShadow: `0 0 15px ${color}66` }}>
              {value}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {sublabel}
            </span>
          </div>
        </div>
      </div>

      {statusText && (
        <div 
          className="mt-2.5 px-3 py-1 rounded-full text-xs font-medium font-mono text-center tracking-tight border"
          style={{ 
            color,
            borderColor: `${color}44`,
            backgroundColor: `${color}14`
          }}
        >
          {statusText}
        </div>
      )}
    </div>
  );
};
