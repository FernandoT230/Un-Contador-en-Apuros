import React from 'react';
import { ALPHABET } from '../constants';

interface KeyboardProps {
  guessedLetters: string[];
  onGuess: (letter: string) => void;
  disabled: boolean;
  targetWord: string;
}

const Keyboard: React.FC<KeyboardProps> = ({ guessedLetters, onGuess, disabled, targetWord }) => {
  return (
    <div className="grid grid-cols-7 gap-2 max-w-2xl mx-auto">
      {ALPHABET.map((letter) => {
        const isGuessed = guessedLetters.includes(letter);
        const isCorrect = targetWord.includes(letter);
        
        let bgClass = "bg-white hover:bg-gray-100 text-gray-800 border-gray-200";
        if (isGuessed) {
          if (isCorrect) {
            bgClass = "bg-ledger-500 text-white border-ledger-600";
          } else {
            bgClass = "bg-gray-300 text-gray-500 border-gray-300 opacity-50";
          }
        }

        return (
          <button
            key={letter}
            onClick={() => onGuess(letter)}
            disabled={disabled || isGuessed}
            className={`
              h-12 rounded-lg font-bold shadow-sm border-b-4 transition-all active:border-b-0 active:translate-y-1
              ${bgClass}
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;