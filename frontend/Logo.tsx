import React from 'react';

export const Logo: React.FC = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 200 180"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Dardja AI Voice Logo"
    role="img"
  >
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <radialGradient id="dotGlow">
        <stop offset="0%" stopColor="#5FA8FF" />
        <stop offset="100%" stopColor="#1A73E8" />
      </radialGradient>
    </defs>

    <circle cx="25" cy="80" r="1.2" fill="#1A73E8" opacity="0.7" />
    <circle cx="175" cy="80" r="1.2" fill="#1A73E8" opacity="0.7" />
    <circle cx="50" cy="40" r="0.8" fill="#FFFFFF" opacity="0.5" />
    <circle cx="150" cy="40" r="0.8" fill="#FFFFFF" opacity="0.5" />
    <circle cx="100" cy="20" r="1" fill="#1A73E8" opacity="0.9" />
    <circle cx="160" cy="110" r="0.7" fill="#FFFFFF" opacity="0.4" />
    <circle cx="40" cy="110" r="0.7" fill="#FFFFFF" opacity="0.4" />

    <g filter="url(#glow)">
      <g stroke="#1A73E8" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M 85 45 C 85 30 115 30 115 45 V 70 A 5 5 0 0 1 110 75 H 90 A 5 5 0 0 1 85 70 Z" />
        <line x1="93" y1="45" x2="107" y2="45" />
        <line x1="93" y1="55" x2="107" y2="55" />
        <line x1="93" y1="65" x2="107" y2="65" />
        <path d="M 98 75 V 85 H 102 V 75" />
        <path d="M 90 90 H 110" strokeWidth="3" />

        <path d="M 75 140 L 80 120 L 88 125 L 95 115 L 100 120 L 105 115 L 112 125 L 120 120 L 125 140 Z" opacity="0.8" />
        <path d="M 78 138 L 82 122" opacity="0.6" />
        <path d="M 122 138 L 118 122" opacity="0.6" />
        <path d="M 95 118 L 90 100" />
        <path d="M 105 118 L 110 100" />

        <path d="M 40 85 L 60 85 L 65 75 L 75 95 L 80 85 L 120 85 L 125 95 L 135 75 L 140 85 L 160 85" strokeWidth="1.5" />

        <path d="M 50 100 A 60 60 0 0 1 150 100" opacity="0.5" />
        <path d="M 65 115 A 45 45 0 0 1 135 115" opacity="0.4" />
        <path d="M 20 90 H 50" opacity="0.7" />
        <path d="M 180 90 H 150" opacity="0.7" />
        <path d="M 30 60 L 60 70" opacity="0.6" />
        <path d="M 170 60 L 140 70" opacity="0.6" />
      </g>
    </g>

    <circle cx="100" cy="55" r="4" fill="url(#dotGlow)" />
  </svg>
);
