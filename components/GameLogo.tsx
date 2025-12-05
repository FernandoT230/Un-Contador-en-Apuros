import React from 'react';

interface GameLogoProps {
  className?: string;
}

const GameLogo: React.FC<GameLogoProps> = ({ className }) => {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>
      </defs>

      {/* 1. Background Circle (Dark Navy Blue) */}
      <circle cx="100" cy="100" r="95" fill="#020617" stroke="#1e293b" strokeWidth="4" />
      
      {/* 2. Stars/Decorations in background */}
      <circle cx="30" cy="100" r="4" fill="white" />
      <circle cx="170" cy="100" r="4" fill="white" />
      <circle cx="120" cy="40" r="6" fill="#1e293b" opacity="0.5" />

      {/* 3. The Accountant */}
      <g transform="translate(50, 60)">
        {/* Body (Suit) */}
        <path d="M 10 140 Q 50 130 90 140 V 180 H 10 Z" fill="#1e293b" />
        <path d="M 50 140 L 50 180" stroke="#334155" strokeWidth="1" /> {/* Jacket split */}
        
        {/* Shirt & Tie */}
        <path d="M 50 135 L 35 150 H 65 Z" fill="white" />
        <path d="M 50 135 L 45 180 L 50 190 L 55 180 Z" fill="#94a3b8" />
        <line x1="48" y1="150" x2="52" y2="160" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="48" y1="165" x2="52" y2="175" stroke="#cbd5e1" strokeWidth="1" />

        {/* Head */}
        <ellipse cx="50" cy="90" rx="35" ry="40" fill="url(#skinGrad)" />
        
        {/* Ears */}
        <circle cx="16" cy="90" r="7" fill="url(#skinGrad)" />
        <circle cx="84" cy="90" r="7" fill="url(#skinGrad)" />

        {/* Hair (Swoosh style) */}
        <path d="M 15 80 Q 50 30 90 70 C 95 60 90 50 50 50 Q 20 50 15 80 Z" fill="#3f2e3e" />
        <path d="M 15 80 Q 10 90 15 100" fill="none" stroke="#3f2e3e" strokeWidth="2" /> {/* Sideburn */}

        {/* Glasses (Round, thick black frames) */}
        <g stroke="#0f172a" strokeWidth="4" fill="rgba(255,255,255,0.8)">
          <circle cx="35" cy="90" r="12" />
          <circle cx="65" cy="90" r="12" />
          <line x1="47" y1="90" x2="53" y2="90" strokeWidth="3" />
        </g>
        {/* Eyes (Dots) */}
        <circle cx="35" cy="90" r="3" fill="#0f172a" />
        <circle cx="65" cy="90" r="3" fill="#0f172a" />

        {/* Smile */}
        <path d="M 40 110 Q 50 120 60 110" stroke="white" strokeWidth="3" strokeLinecap="round" fill="white" />

        {/* Hand holding Calculator (Extended out) */}
        <g transform="translate(90, 80) rotate(-10)">
           {/* Arm */}
           <path d="M -10 60 L 30 50" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
           {/* Hand */}
           <circle cx="30" cy="50" r="10" fill="url(#skinGrad)" />
           
           {/* Calculator */}
           <rect x="20" y="20" width="30" height="40" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
           {/* Calc Screen */}
           <rect x="24" y="24" width="22" height="10" fill="#94a3b8" />
           {/* Calc Buttons */}
           <rect x="24" y="38" width="6" height="6" fill="#cbd5e1" />
           <rect x="32" y="38" width="6" height="6" fill="#cbd5e1" />
           <rect x="40" y="38" width="6" height="6" fill="#cbd5e1" />
           <rect x="24" y="48" width="6" height="6" fill="#cbd5e1" />
           <rect x="32" y="48" width="6" height="6" fill="#cbd5e1" />
           <rect x="40" y="48" width="6" height="6" fill="#f97316" /> {/* Orange button */}
        </g>
      </g>

      {/* 4. Thought Bubble */}
      <g transform="translate(110, 20)">
         {/* Cloud Shape */}
         <path d="M 30 40 Q 10 40 10 25 Q 10 5 35 5 Q 50 -5 65 5 Q 90 5 90 25 Q 90 40 70 40 Q 60 50 50 40 Z" fill="white" stroke="#0ea5e9" strokeWidth="3" />
         {/* Little bubbles connecting to head */}
         <circle cx="20" cy="50" r="4" fill="white" stroke="#0ea5e9" strokeWidth="2" />
         <circle cx="10" cy="60" r="2" fill="white" stroke="#0ea5e9" strokeWidth="2" />
         
         {/* Question Mark */}
         <text x="50" y="35" textAnchor="middle" fontFamily="sans-serif" fontSize="30" fontWeight="bold" fill="#eab308" filter="url(#glow)">?</text>
      </g>
    </svg>
  );
};

export default GameLogo;