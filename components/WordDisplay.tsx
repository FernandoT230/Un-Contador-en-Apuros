import React from 'react';

interface WordDisplayProps {
  word: string;
  guessedLetters: string[];
  reveal: boolean;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, guessedLetters, reveal }) => {
  // Split by space to handle multi-word accounts like "CAPITAL SOCIAL"
  const words = word.split(" ");

  return (
    <div className="flex flex-col items-center gap-6">
      
      {/* Word Letters */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
        {words.map((w, wordIndex) => (
          <div key={wordIndex} className="flex gap-2">
            {w.split("").map((letter, index) => {
              const isGuessed = guessedLetters.includes(letter);
              const show = isGuessed || reveal;
              
              let textColor = "text-ledger-900";
              if (reveal && !isGuessed) textColor = "text-red-500";
              
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className={`
                    w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center 
                    text-2xl sm:text-3xl font-black rounded-lg border-b-4 
                    transition-all duration-300 chalk-text shadow-sm
                    ${show ? 'bg-white border-gray-300 transform -translate-y-1' : 'bg-gray-200/50 border-gray-300'}
                  `}>
                    <span className={`transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'} ${textColor}`}>
                      {letter}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordDisplay;