
import React from 'react';
import { MAX_LIVES, ShopItem } from '../types';

interface HangmanFigureProps {
  wrongGuesses: number;
  isWinner: boolean;
  equippedSuit: ShopItem;
  equippedTie: ShopItem;
  equippedDecor: ShopItem;
  equippedAccessory: ShopItem;
  children?: React.ReactNode; // Allow children for overlay buttons
}

const HangmanFigure: React.FC<HangmanFigureProps> = ({ 
  wrongGuesses, 
  isWinner, 
  equippedSuit, 
  equippedTie,
  equippedDecor,
  equippedAccessory,
  children
}) => {
  // Determine animations based on state
  let containerClass = "relative flex justify-center items-center h-96 w-full bg-white rounded-xl shadow-realistic border border-slate-200 overflow-hidden transition-all duration-500";
  
  if (isWinner) {
    containerClass += " animate-bounce ring-4 ring-green-400 ring-offset-2";
  } else if (wrongGuesses >= MAX_LIVES) {
    containerClass += " animate-shake grayscale-[0.8] opacity-90 border-red-300 ring-4 ring-red-200";
  }

  return (
    <div className={containerClass}>
      {children}
      <svg viewBox="0 0 400 300" className="h-full w-full overflow-visible z-0">
        <defs>
          {/* Gradients for Realism */}
          <linearGradient id="gradSuit" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={equippedSuit.primaryColor} /> 
            <stop offset="50%" stopColor={equippedSuit.secondaryColor} /> 
            <stop offset="100%" stopColor={equippedSuit.primaryColor} />
          </linearGradient>
          
          <linearGradient id="gradTie" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={equippedTie.secondaryColor} />
            <stop offset="50%" stopColor={equippedTie.primaryColor} />
            <stop offset="100%" stopColor={equippedTie.secondaryColor} />
          </linearGradient>

          <linearGradient id="gradSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fcd34d" />
          </linearGradient>
          <linearGradient id="gradDesk" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ba8a66" />
            <stop offset="100%" stopColor="#8d634a" />
          </linearGradient>
          <linearGradient id="gradLeather" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
           <filter id="shadowDrop" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* --- Background / Decor Layer --- */}
        {/* Wall Color */}
        <rect x="0" y="0" width="400" height="250" fill="#f8fafc" />

        {/* Dynamic Decor Items */}
        {equippedDecor.id === 'decor_window' && (
           <g transform="translate(50, 40)">
             <rect x="0" y="0" width="100" height="120" fill="#bfdbfe" stroke="#e2e8f0" strokeWidth="4" />
             <line x1="50" y1="0" x2="50" y2="120" stroke="white" strokeWidth="4" />
             <line x1="0" y1="60" x2="100" y2="60" stroke="white" strokeWidth="4" />
             {/* Clouds */}
             <path d="M 20 30 Q 30 10 40 30 T 60 30" fill="none" stroke="white" strokeWidth="3" opacity="0.6" />
           </g>
        )}

        {equippedDecor.id === 'decor_diploma' && (
          <g transform="translate(80, 50) rotate(-2)">
            <rect x="0" y="0" width="60" height="40" fill={equippedDecor.primaryColor} stroke={equippedDecor.secondaryColor} strokeWidth="3" />
            <line x1="10" y1="10" x2="50" y2="10" stroke="#000" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="10" y1="20" x2="50" y2="20" stroke="#000" strokeWidth="1" />
            <line x1="10" y1="25" x2="30" y2="25" stroke="#000" strokeWidth="1" />
            <circle cx="45" cy="30" r="5" fill="red" opacity="0.5" />
          </g>
        )}

        {equippedDecor.id === 'decor_clock' && (
          <g transform="translate(100, 70)">
             <circle cx="0" cy="0" r="20" fill="white" stroke={equippedDecor.primaryColor} strokeWidth="3" />
             <line x1="0" y1="0" x2="0" y2="-12" stroke="black" strokeWidth="1.5" />
             <line x1="0" y1="0" x2="8" y2="0" stroke="black" strokeWidth="1.5" />
             <circle cx="0" cy="0" r="2" fill="red" />
          </g>
        )}

        {equippedDecor.id === 'decor_plant' && (
          <g transform="translate(50, 210)">
            {/* Pot */}
            <path d="M 0 0 L 10 40 L 40 40 L 50 0 Z" fill={equippedDecor.secondaryColor} />
            {/* Leaves */}
            <path d="M 25 0 Q 10 -40 0 -10" fill="none" stroke={equippedDecor.primaryColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M 25 0 Q 40 -50 50 -20" fill="none" stroke={equippedDecor.primaryColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M 25 0 Q 25 -60 25 -30" fill="none" stroke={equippedDecor.primaryColor} strokeWidth="6" strokeLinecap="round" />
          </g>
        )}

        {/* Floor */}
        <rect x="0" y="250" width="400" height="50" fill="#f1f5f9" />
        <line x1="0" y1="250" x2="400" y2="250" stroke="#cbd5e1" strokeWidth="1" />

        {/* Desk (Behind character) */}
        <g transform="translate(0, 10)">
             {/* Desk Legs */}
             <rect x="225" y="210" width="10" height="70" fill="#64748b" />
             <rect x="365" y="210" width="10" height="70" fill="#64748b" />
             
             {/* Desk Body */}
             <rect x="210" y="210" width="180" height="60" fill="#e2e8f0" stroke="#cbd5e1" />
             <rect x="220" y="220" width="160" height="15" fill="white" stroke="#cbd5e1" rx="2" />
             <circle cx="300" cy="227.5" r="2" fill="#94a3b8" />
             <rect x="220" y="245" width="160" height="15" fill="white" stroke="#cbd5e1" rx="2" />
             <circle cx="300" cy="252.5" r="2" fill="#94a3b8" />

             {/* Desk Top */}
             <path d="M 200 210 L 400 210 L 390 190 L 210 190 Z" fill="url(#gradDesk)" stroke="#78350f" strokeWidth="1" />
             
             {/* PC Monitor (Default) or Laptop (Accessory) */}
             {equippedAccessory.id !== 'acc_laptop' && (
                <g transform="translate(260, 140)">
                    <rect x="20" y="50" width="40" height="5" fill="#1e293b" />
                    <rect x="35" y="40" width="10" height="15" fill="#334155" />
                    <rect x="0" y="0" width="80" height="50" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <rect x="4" y="4" width="72" height="42" rx="1" fill="#1e3a8a" />
                    <path d="M 4 44 L 76 4 L 76 44 Z" fill="white" opacity="0.1" />
                    {isWinner ? (
                        <g>
                            <rect x="10" y="10" width="10" height="30" fill="#22c55e" />
                            <rect x="25" y="20" width="10" height="20" fill="#22c55e" />
                            <rect x="40" y="5" width="10" height="35" fill="#22c55e" />
                            <rect x="55" y="15" width="10" height="25" fill="#22c55e" />
                        </g>
                    ) : (
                        <g>
                            <line x1="10" y1="10" x2="50" y2="10" stroke="#60a5fa" strokeWidth="2" opacity="0.7"/>
                            <line x1="10" y1="20" x2="60" y2="20" stroke="#60a5fa" strokeWidth="2" opacity="0.7"/>
                            <line x1="10" y1="30" x2="40" y2="30" stroke="#60a5fa" strokeWidth="2" opacity="0.7"/>
                        </g>
                    )}
                </g>
             )}

             {/* Dynamic Desk Accessories */}
             {equippedAccessory.id === 'acc_coffee' && (
                <g transform="translate(350, 195)">
                   <rect x="0" y="0" width="15" height="15" rx="1" fill={equippedAccessory.primaryColor} />
                   <path d="M 15 3 Q 20 3 20 8 T 15 12" fill="none" stroke={equippedAccessory.primaryColor} strokeWidth="2" />
                   <ellipse cx="7.5" cy="0" rx="7.5" ry="2" fill={equippedAccessory.secondaryColor} />
                   {/* Steam */}
                   <path d="M 5 -5 Q 8 -10 5 -15" stroke="#ccc" strokeWidth="1" fill="none" opacity="0.7" />
                </g>
             )}

             {equippedAccessory.id === 'acc_calc' && (
                <g transform="translate(340, 200) skewX(20)">
                   <rect x="0" y="0" width="20" height="10" fill={equippedAccessory.primaryColor} />
                   <rect x="2" y="1" width="16" height="3" fill="#cbd5e1" />
                   <rect x="2" y="5" width="3" height="3" fill="#334155" />
                   <rect x="6" y="5" width="3" height="3" fill="#334155" />
                </g>
             )}
             
             {equippedAccessory.id === 'acc_folders' && (
                <g transform="translate(340, 205)">
                   <path d="M 0 0 L 30 0 L 35 15 L -5 15 Z" fill="#d97706" /> {/* Bottom folder */}
                   <path d="M 0 -3 L 30 -3 L 35 12 L -5 12 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="0.5"/>
                   <path d="M 2 -6 L 32 -6 L 37 9 L -3 9 Z" fill="#fcd34d" stroke="#b45309" strokeWidth="0.5"/>
                </g>
             )}
             
             {equippedAccessory.id === 'acc_pens' && (
                <g transform="translate(350, 195)">
                   {/* Cup */}
                   <path d="M 0 0 L 5 20 L 25 20 L 30 0" fill={equippedAccessory.primaryColor} opacity="0.8"/>
                   {/* Pens */}
                   <line x1="10" y1="5" x2="5" y2="-10" stroke="red" strokeWidth="2" />
                   <line x1="15" y1="5" x2="15" y2="-12" stroke="blue" strokeWidth="2" />
                   <line x1="20" y1="5" x2="25" y2="-8" stroke="black" strokeWidth="2" />
                </g>
             )}

             {equippedAccessory.id === 'acc_lamp' && (
               <g transform="translate(220, 180)">
                  <path d="M 0 30 L 20 30" stroke={equippedAccessory.secondaryColor} strokeWidth="4" />
                  <path d="M 10 30 Q 10 10 30 5" fill="none" stroke={equippedAccessory.secondaryColor} strokeWidth="2" />
                  <path d="M 30 5 L 45 15 L 20 15 Z" fill={equippedAccessory.primaryColor} />
                  <path d="M 30 15 L 40 40 L 0 40 L 50 100" fill="white" opacity="0.2" /> {/* Light beam */}
               </g>
             )}

             {equippedAccessory.id === 'acc_laptop' && (
                <g transform="translate(270, 195)">
                   {/* Base */}
                   <path d="M 0 10 L 50 10 L 45 15 L 5 15 Z" fill="#1e1b4b" />
                   {/* Screen */}
                   <path d="M 0 10 L 5 -25 L 45 -25 L 50 10" fill="#312e81" />
                   <path d="M 4 8 L 8 -22 L 42 -22 L 46 8" fill={equippedAccessory.primaryColor} /> {/* Screen lit */}
                   <circle cx="25" cy="-7" r="5" fill="white" opacity="0.5" />
                </g>
             )}
        </g>

        {/* --- Gallows (Only show if NOT a winner) --- */}
        {!isWinner && (
            <g filter="url(#shadowDrop)">
            <rect x="40" y="280" width="120" height="10" rx="2" fill="#78350f" />
            <rect x="95" y="40" width="10" height="245" fill="#78350f" />
            <rect x="95" y="40" width="110" height="10" fill="#78350f" />
            <path d="M 95 80 L 135 40 L 145 40 L 95 90 Z" fill="#92400e" />
            <line x1="200" y1="50" x2="200" y2="80" stroke="#d97706" strokeWidth="3" strokeDasharray="4 2" />
            <circle cx="200" cy="80" r="3" fill="#d97706" />
            </g>
        )}

        {/* --- The Accountant --- */}
        
        {/* WINNER STATE: Full Body Celebrating */}
        {isWinner ? (
            <g transform="translate(150, 80)" filter="url(#shadowDrop)">
                {/* Arms Raised */}
                <path d="M 20 50 L 0 10" stroke="url(#gradSuit)" strokeWidth="10" strokeLinecap="round" />
                <circle cx="0" cy="10" r="4" fill="url(#gradSkin)" />
                <path d="M 50 50 L 70 10" stroke="url(#gradSuit)" strokeWidth="10" strokeLinecap="round" />
                <circle cx="70" cy="10" r="4" fill="url(#gradSkin)" />

                {/* Body */}
                <path d="M 15 40 Q 15 40 15 50 L 15 100 L 55 100 L 55 50 Q 55 40 55 40 L 35 40 Z" fill="url(#gradSuit)" />
                 {/* Shirt Collar */}
                <path d="M 25 40 L 35 50 L 45 40" fill="white" />
                {/* Tie */}
                <path d="M 35 45 L 30 70 L 35 80 L 40 70 Z" fill="url(#gradTie)" />

                {/* Legs */}
                 <path d="M 20 100 L 15 160" stroke="url(#gradSuit)" strokeWidth="10" strokeLinecap="round" fill="none" />
                 <path d="M 50 100 L 55 160" stroke="url(#gradSuit)" strokeWidth="10" strokeLinecap="round" fill="none" />
                 {/* Shoes */}
                 <path d="M 15 160 L 5 160 Q 2 160 5 155 L 15 155 Z" fill="black" />
                 <path d="M 55 160 L 65 160 Q 68 160 65 155 L 55 155 Z" fill="black" />

                {/* Head */}
                <rect x="30" y="35" width="10" height="10" fill="url(#gradSkin)" />
                <ellipse cx="35" cy="20" rx="18" ry="22" fill="url(#gradSkin)" />
                <path d="M 17 15 Q 35 0 53 15 L 53 20 L 50 10 L 20 10 Z" fill="#1f2937" />
                {/* Glasses */}
                <g stroke="#1e3a8a" strokeWidth="1.5" fill="rgba(255,255,255,0.3)">
                    <rect x="21" y="16" width="12" height="8" rx="2" />
                    <rect x="37" y="16" width="12" height="8" rx="2" />
                    <line x1="33" y1="20" x2="37" y2="20" />
                </g>
                {/* Smile */}
                <path d="M 25 32 Q 35 40 45 32" stroke="#b45309" strokeWidth="2" fill="none" />

                {/* Celebration lines */}
                <g stroke="#eab308" strokeWidth="2">
                     <line x1="-10" y1="0" x2="-20" y2="-10" />
                     <line x1="80" y1="0" x2="90" y2="-10" />
                     <line x1="35" y1="-15" x2="35" y2="-25" />
                </g>
            </g>
        ) : (
            // NORMAL / LOSING STATE
            <g>
                {/* 1. Head */}
                {wrongGuesses >= 1 && (
                <g filter="url(#shadowDrop)">
                    <rect x="195" y="115" width="10" height="10" fill="url(#gradSkin)" />
                    <ellipse cx="200" cy="100" rx="18" ry="22" fill="url(#gradSkin)" />
                    <path d="M 182 95 Q 200 80 218 95 L 218 100 L 215 90 L 185 90 Z" fill="#1f2937" />
                    <path d="M 182 95 Q 180 110 185 110" fill="none" stroke="#1f2937" strokeWidth="1" />
                    <g stroke="#1e3a8a" strokeWidth="1.5" fill="rgba(255,255,255,0.3)">
                    <rect x="186" y="96" width="12" height="8" rx="2" />
                    <rect x="202" y="96" width="12" height="8" rx="2" />
                    <line x1="198" y1="100" x2="202" y2="100" />
                    </g>
                    <path d="M 198 112 Q 200 114 202 112" stroke="#b45309" strokeWidth="1" fill="none" />
                    {wrongGuesses >= MAX_LIVES && (
                        <path d="M 196 114 Q 200 110 204 114" stroke="#b45309" strokeWidth="1.5" fill="none" /> 
                    )}
                </g>
                )}

                {/* 2. Torso */}
                {wrongGuesses >= 2 && (
                <g filter="url(#shadowDrop)">
                    <path d="M 195 120 L 200 130 L 205 120" fill="white" />
                    <path d="M 200 125 L 196 145 L 200 155 L 204 145 Z" fill="url(#gradTie)" />
                    <path d="M 185 125 Q 180 125 180 140 L 180 190 L 220 190 L 220 140 Q 220 125 215 125 L 205 125 L 205 160 L 195 160 L 195 125 Z" fill="url(#gradSuit)" />
                    <circle cx="203" cy="160" r="1.5" fill="#fbbf24" />
                    <circle cx="203" cy="175" r="1.5" fill="#fbbf24" />
                </g>
                )}

                {/* 3. Right Arm */}
                {wrongGuesses >= 3 && (
                <g filter="url(#shadowDrop)">
                    <path d="M 215 130 Q 235 140 230 165" stroke="url(#gradSuit)" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <circle cx="230" cy="168" r="4" fill="url(#gradSkin)" />
                    
                    <g transform="translate(225, 168) rotate(-10)">
                    <rect x="-5" y="0" width="40" height="30" rx="3" fill="url(#gradLeather)" stroke="#3f1802" />
                    <path d="M 10 0 L 10 -5 Q 15 -10 20 -5 L 20 0" fill="none" stroke="#3f1802" strokeWidth="2" />
                    <rect x="0" y="5" width="30" height="2" fill="#3f1802" opacity="0.3" />
                    <circle cx="5" cy="25" r="1" fill="#fbbf24" />
                    <circle cx="25" cy="25" r="1" fill="#fbbf24" />
                    </g>
                </g>
                )}

                {/* 4. Left Arm */}
                {wrongGuesses >= 4 && (
                <g filter="url(#shadowDrop)">
                    <path d="M 185 130 Q 165 140 170 165" stroke="url(#gradSuit)" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <circle cx="170" cy="168" r="4" fill="url(#gradSkin)" />
                </g>
                )}

                {/* 5. Right Leg */}
                {wrongGuesses >= 5 && (
                <g filter="url(#shadowDrop)">
                    <path d="M 210 190 L 215 240" stroke="url(#gradSuit)" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <path d="M 210 240 L 222 240 Q 225 242 222 245 L 210 245 Z" fill="black" />
                </g>
                )}

                {/* 6. Left Leg */}
                {wrongGuesses >= 6 && (
                <g filter="url(#shadowDrop)">
                    <path d="M 190 190 L 185 240" stroke="url(#gradSuit)" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <path d="M 188 240 L 176 240 Q 173 242 176 245 L 188 245 Z" fill="black" />
                    
                    <g transform="rotate(-15 280 100)">
                    <rect x="240" y="80" width="140" height="50" rx="4" fill="none" stroke="#dc2626" strokeWidth="4" opacity="0.8" />
                    <text x="310" y="115" textAnchor="middle" className="text-3xl font-black fill-red-600 font-sans opacity-90 tracking-widest">DESPEDIDO</text>
                    </g>
                </g>
                )}
            </g>
        )}
      </svg>
    </div>
  );
};

export default HangmanFigure;
