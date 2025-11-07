'use client';

import React from 'react';

interface BoosterProProps {
  value: { percentage: number, value: number };
  total?: number;
}

const BoosterPro = ({ value, total = 100 }: BoosterProProps) => {
  const size = 200;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const percent = value.percentage / total;
  const offset = circumference * (1 - percent);
  return (
    <div className={`relative w-[${size}] h-[${size}]`}>
      <svg
        className="transform rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--foreground)" />
            <stop offset="80%" stopColor="var(--card)" />
          </linearGradient>
          <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="80%" stopColor="var(--card)" />
          </linearGradient>
        </defs>
        <circle
          cx={size/2}
          cy={size/2}
          r={normalizedRadius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
        />
        <circle
          cx={size/2}
          cy={size/2}
          r={normalizedRadius}
          fill="none"
          stroke="url(#activeGradient)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 font-semibold flex flex-col items-center justify-center text-foreground gap-1">
        <span className='text-3xl'>{Math.round(value.value)}%</span>
        <span className='text-sm'>Booster</span>
      </div>
    </div>
  );
};

export default BoosterPro;
