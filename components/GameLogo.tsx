import React from 'react';
import logoSrc from '../WhatsApp_Image_2025-12-04_at_11.41.30_AM-removebg-preview.png';

interface GameLogoProps {
  className?: string;
}

const GameLogo: React.FC<GameLogoProps> = ({ className }) => {
  return (
    <img src={logoSrc} className={className} alt="Un Contador" />
  );
};

export default GameLogo;