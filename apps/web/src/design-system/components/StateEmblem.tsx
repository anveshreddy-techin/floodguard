'use client';

import React from 'react';

interface StateEmblemProps {
  className?: string;
  size?: number;
}

export const StateEmblem: React.FC<StateEmblemProps> = ({ className = '', size = 52 }) => {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-slate-800 ${className}`}
      aria-label="State Emblem of India"
      role="img"
    >
      {/* Central Lion Head */}
      <path
        d="M 50 12 C 45 12, 41 15, 41 20 C 41 22, 42 24, 43 25 C 40 26, 38 29, 39 33 C 40 37, 43 39, 46 40 C 45 42, 46 45, 49 46 C 49.5 46.2, 50.5 46.2, 51 46 C 54 45, 55 42, 54 40 C 57 39, 60 37, 61 33 C 62 29, 60 26, 57 25 C 58 24, 59 22, 59 20 C 59 15, 55 12, 50 12 Z"
        fill="currentColor"
      />
      {/* Central Lion Facial Detail */}
      <circle cx="47" cy="22" r="1.5" fill="#ffffff" />
      <circle cx="53" cy="22" r="1.5" fill="#ffffff" />
      <path d="M 48 27 Q 50 29 52 27" stroke="#ffffff" strokeWidth="0.8" fill="none" />
      <path d="M 46 32 Q 50 35 54 32" stroke="#ffffff" strokeWidth="1" fill="none" />
      
      {/* Left Lion Head (Profile) */}
      <path
        d="M 37 18 C 33 18, 30 20, 29 24 C 28 27, 29 30, 31 32 C 28 34, 27 38, 28 41 C 29 45, 33 47, 36 47 C 36 49, 38 52, 42 53 C 43 49, 41 45, 40 43 C 38 41, 37 38, 38 35 C 37 33, 37 31, 38 29 C 39 25, 39 21, 37 18 Z"
        fill="currentColor"
      />
      <circle cx="32" cy="25" r="1.2" fill="#ffffff" />

      {/* Right Lion Head (Profile) */}
      <path
        d="M 63 18 C 67 18, 70 20, 71 24 C 72 27, 71 30, 69 32 C 72 34, 73 38, 72 41 C 71 45, 67 47, 64 47 C 64 49, 62 52, 58 53 C 57 49, 59 45, 60 43 C 62 41, 63 38, 62 35 C 63 33, 63 31, 62 29 C 61 25, 61 21, 63 18 Z"
        fill="currentColor"
      />
      <circle cx="68" cy="25" r="1.2" fill="#ffffff" />

      {/* Lion Bodies & Torso */}
      <path
        d="M 36 47 C 33 50, 30 56, 31 64 C 33 72, 38 75, 43 76 L 57 76 C 62 75, 67 72, 69 64 C 70 56, 67 50, 64 47 L 57 52 C 55 54, 53 54, 50 54 C 47 54, 45 54, 43 52 Z"
        fill="currentColor"
      />

      {/* Mane & Fur Textures */}
      <path d="M 45 44 Q 47 52 50 54 Q 53 52 55 44" stroke="#ffffff" strokeWidth="0.8" fill="none" />
      <path d="M 42 55 Q 45 64 50 67 Q 55 64 58 55" stroke="#ffffff" strokeWidth="0.8" fill="none" />
      <path d="M 38 65 Q 44 72 50 73 Q 56 72 62 65" stroke="#ffffff" strokeWidth="0.8" fill="none" />

      {/* Abacus / Base Platform */}
      <rect x="20" y="78" width="60" height="15" rx="2" fill="currentColor" />
      
      {/* Central Ashoka Chakra on Abacus */}
      <circle cx="50" cy="85.5" r="5.5" fill="#ffffff" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="50" cy="85.5" r="1.2" fill="currentColor" />
      <line x1="50" y1="80.5" x2="50" y2="90.5" stroke="currentColor" strokeWidth="0.6" />
      <line x1="45" y1="85.5" x2="55" y2="85.5" stroke="currentColor" strokeWidth="0.6" />
      <line x1="46.5" y1="82" x2="53.5" y2="89" stroke="currentColor" strokeWidth="0.6" />
      <line x1="46.5" y1="89" x2="53.5" y2="82" stroke="currentColor" strokeWidth="0.6" />

      {/* Horse on Left of Abacus */}
      <path
        d="M 28 87 C 26 86, 25 84, 27 82 C 29 82, 31 84, 33 85 C 34 87, 33 89, 30 88 Z"
        fill="#ffffff"
      />
      <circle cx="36" cy="85.5" r="2" fill="none" stroke="#ffffff" strokeWidth="0.5" />

      {/* Bull on Right of Abacus */}
      <path
        d="M 72 87 C 74 86, 75 84, 73 82 C 71 82, 69 84, 67 85 C 66 87, 67 89, 70 88 Z"
        fill="#ffffff"
      />
      <circle cx="64" cy="85.5" r="2" fill="none" stroke="#ffffff" strokeWidth="0.5" />

      {/* Bell-shaped Lotus Foundation */}
      <path
        d="M 24 95 C 30 99, 40 102, 50 102 C 60 102, 70 99, 76 95 L 73 99 C 68 103, 59 106, 50 106 C 41 106, 32 103, 27 99 Z"
        fill="currentColor"
      />
      <rect x="22" y="107" width="56" height="3" rx="1" fill="currentColor" />

      {/* Devanagari Inscription: सत्यमेव जयते */}
      <text
        x="50"
        y="122"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="bold"
        fontFamily="'Tiro Devanagari Sanskrit', 'Noto Sans Devanagari', 'Mangal', 'Arial', sans-serif"
        fill="currentColor"
        letterSpacing="0.5"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
};
