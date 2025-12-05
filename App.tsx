
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, HelpCircle, Trophy, AlertCircle, BookOpen, Share2, Link as LinkIcon, Check, Download, X, Coins, Gem, ShoppingBag, Clock, Lightbulb, Shirt, Briefcase, Monitor, Flower, LogOut, Gamepad2 } from 'lucide-react';
import { AccountTerm, GameStatus, MAX_LIVES, PlayerInventory, ShopItem, ItemType } from './types';
import { fetchAccountingTerms } from './services/geminiService';
import HangmanFigure from './components/HangmanFigure';
import WordDisplay from './components/WordDisplay';
import Keyboard from './components/Keyboard';
import GameLogo from './components/GameLogo';
import ShopModal from './components/ShopModal';
import StudyGuideModal from './components/StudyGuideModal';
import { SHOP_ITEMS } from './constants';
import { playSound } from './utils/audio';

const TIME_LIMIT = 130; // Changed to 130 seconds
const HINT_COST = 10;

// Simple CSS Confetti Component
const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    setPieces(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((i) => {
        const left = Math.random() * 100;
        const animDelay = Math.random() * 0.5;
        const bg = ['#facc15', '#3b82f6', '#ef4444', '#22c55e', '#a855f7'][Math.floor(Math.random() * 5)];
        return (
          <div
            key={i}
            className="absolute top-[-20px] w-3 h-3 rounded-sm opacity-0 animate-confetti"
            style={{
              left: `${left}%`,
              backgroundColor: bg,
              animationDuration: `${1.5 + Math.random()}s`,
              animationDelay: `${animDelay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

const App: React.FC = () => {
  // Game State
  const [wordQueue, setWordQueue] = useState<AccountTerm[]>([]);
  const [currentTerm, setCurrentTerm] = useState<AccountTerm | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);
  
  // Lazy initialization for persistent data
  const [score, setScore] = useState(() => {
    try {
      const saved = localStorage.getItem('contableAhorcadoData');
      return saved ? JSON.parse(saved).score || 0 : 0;
    } catch { return 0; }
  });

  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('contableAhorcadoData');
      return saved ? JSON.parse(saved).streak || 0 : 0;
    } catch { return 0; }
  });

  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  
  // UI State
  const [showWelcome, setShowWelcome] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showStudyGuide, setShowStudyGuide] = useState(false);
  
  // Unique Challenge ID for sharing
  const [challengeId, setChallengeId] = useState('');

  // Player Inventory & Customization State (Lazy Initialized)
  const [inventory, setInventory] = useState<PlayerInventory>(() => {
    const defaultInventory: PlayerInventory = {
      coins: 0,
      diamonds: 0,
      ownedItems: ['suit_classic_navy', 'tie_gold', 'decor_none', 'acc_none'],
      equippedSuitId: 'suit_classic_navy',
      equippedTieId: 'tie_gold',
      equippedDecorId: 'decor_none',
      equippedAccessoryId: 'acc_none'
    };

    try {
      const saved = localStorage.getItem('contableAhorcadoData');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.inventory) {
          return {
            ...defaultInventory,
            ...parsed.inventory,
            ownedItems: [...new Set([...defaultInventory.ownedItems, ...(parsed.inventory.ownedItems || [])])]
          };
        }
      }
    } catch (e) {
      console.error("Error loading inventory", e);
    }
    return defaultInventory;
  });

  // Generate a unique challenge ID on mount
  useEffect(() => {
    setChallengeId(Math.random().toString(36).substring(2, 8).toUpperCase());
  }, []);

  // Save game data on change
  useEffect(() => {
    localStorage.setItem('contableAhorcadoData', JSON.stringify({
      inventory,
      score,
      streak
    }));
  }, [inventory, score, streak]);

  // Derived State for Customization
  const equippedSuit = SHOP_ITEMS.find(i => i.id === inventory.equippedSuitId) || SHOP_ITEMS[0];
  const equippedTie = SHOP_ITEMS.find(i => i.id === inventory.equippedTieId) || SHOP_ITEMS.find(i => i.type === 'tie')!;
  const equippedDecor = SHOP_ITEMS.find(i => i.id === inventory.equippedDecorId) || SHOP_ITEMS.find(i => i.type === 'decor')!;
  const equippedAccessory = SHOP_ITEMS.find(i => i.id === inventory.equippedAccessoryId) || SHOP_ITEMS.find(i => i.type === 'accessory')!;

  // Derived Game State
  const wrongGuesses = guessedLetters.filter(
    letter => currentTerm && !currentTerm.name.includes(letter)
  ).length;

  const isWinner = currentTerm 
    ? currentTerm.name.split("").every(char => char === " " || guessedLetters.includes(char))
    : false;
    
  const isLoser = wrongGuesses >= MAX_LIVES;

  // --- Timer Logic ---
  useEffect(() => {
    let timer: any;
    if (status === GameStatus.PLAYING && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setStatus(GameStatus.LOST);
            playSound('lose');
            return 0;
          }
          if (prev <= 11) {
            playSound('click');
          }
          return prev - 1;
        });
      }, 1000);
    } else if (status !== GameStatus.PLAYING) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  // --- PWA Install Logic ---
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("Install prompt captured");
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = useCallback(async () => {
    playSound('click');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallHelp(true);
    }
  }, [deferredPrompt]);

  // --- Initialization & Data Fetching ---

  const loadMoreWords = useCallback(async () => {
    const newTerms = await fetchAccountingTerms(20);
    setWordQueue(newTerms);
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadMoreWords();
      setStatus(GameStatus.IDLE);
    };
    init();
  }, [loadMoreWords]);

  // --- Game Logic ---

  const startNewRound = useCallback(() => {
    playSound('click');
    if (wordQueue.length === 0) {
      loadMoreWords().then(() => setStatus(GameStatus.IDLE));
      return;
    }

    const [nextWord, ...remaining] = wordQueue;
    
    if (remaining.length === 0) {
      loadMoreWords();
    } else {
      setWordQueue(remaining);
    }

    setCurrentTerm(nextWord);
    setGuessedLetters([]);
    setTimeLeft(TIME_LIMIT);
    setStatus(GameStatus.PLAYING);
  }, [wordQueue, loadMoreWords]);

  const handleGuess = useCallback((letter: string) => {
    if (status !== GameStatus.PLAYING) return;

    const isCorrect = currentTerm?.name.includes(letter);
    
    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setGuessedLetters(prev => {
      if (prev.includes(letter)) return prev;
      return [...prev, letter];
    });
  }, [status, currentTerm]);

  const handleHint = useCallback(() => {
    if (status !== GameStatus.PLAYING || !currentTerm) return;
    
    if (inventory.coins < HINT_COST) {
      playSound('wrong');
      return;
    }

    const correctLetters = currentTerm.name.split('').filter(char => char !== ' ' && !guessedLetters.includes(char));
    
    if (correctLetters.length === 0) return;

    playSound('correct');
    const randomChar = correctLetters[Math.floor(Math.random() * correctLetters.length)];
    
    setInventory(prev => ({...prev, coins: prev.coins - HINT_COST}));
    setGuessedLetters(prev => [...prev, randomChar]);

  }, [status, currentTerm, guessedLetters, inventory.coins]);

  useEffect(() => {
    if (status !== GameStatus.PLAYING) return;

    if (isWinner) {
      playSound('win');
      setStatus(GameStatus.WON);
      
      const points = 10 + (MAX_LIVES - wrongGuesses) * 2;
      const earnedCoins = 30; // UPDATED: 30 coins per win
      
      setScore(s => s + points);
      
      setStreak(currentStreak => {
        const newStreak = currentStreak + 1;
        // UPDATED: Reward 1 Diamond every 5 streak wins
        if (newStreak > 0 && newStreak % 5 === 0) {
          setInventory(prev => ({
            ...prev,
            coins: prev.coins + earnedCoins,
            diamonds: prev.diamonds + 1
          }));
        } else {
           setInventory(prev => ({
            ...prev,
            coins: prev.coins + earnedCoins
          }));
        }
        return newStreak;
      });

    } else if (isLoser) {
      playSound('lose');
      setStatus(GameStatus.LOST);
      setStreak(0);
    }
  }, [guessedLetters, currentTerm, isWinner, isLoser, status, wrongGuesses]);

  // --- Shop & Currency Logic ---

  const handleBuyItem = (item: ShopItem) => {
    if (item.currency === 'coins' && inventory.coins >= item.price) {
      playSound('click');
      setInventory(prev => ({
        ...prev,
        coins: prev.coins - item.price,
        ownedItems: [...prev.ownedItems, item.id]
      }));
    } else if (item.currency === 'diamonds' && inventory.diamonds >= item.price) {
      playSound('click');
      setInventory(prev => ({
        ...prev,
        diamonds: prev.diamonds - item.price,
        ownedItems: [...prev.ownedItems, item.id]
      }));
    } else {
      playSound('wrong');
    }
  };

  const handleEquipItem = (item: ShopItem) => {
    playSound('click');
    setInventory(prev => ({
      ...prev,
      equippedSuitId: item.type === 'suit' ? item.id : prev.equippedSuitId,
      equippedTieId: item.type === 'tie' ? item.id : prev.equippedTieId,
      equippedDecorId: item.type === 'decor' ? item.id : prev.equippedDecorId,
      equippedAccessoryId: item.type === 'accessory' ? item.id : prev.equippedAccessoryId,
    }));
  };

  const handleBuyDiamond = () => {
    if (inventory.coins >= 200) {
      playSound('correct');
      setInventory(prev => ({ ...prev, coins: prev.coins - 200, diamonds: prev.diamonds + 1 }));
    } else {
      playSound('wrong');
    }
  };

  // --- Quick Equipment Selector Logic ---
  const cycleOwnedItem = (type: ItemType) => {
    playSound('click');
    
    // Get all items of this type that are OWNED
    const ownedItemsOfType = SHOP_ITEMS.filter(
      item => item.type === type && inventory.ownedItems.includes(item.id)
    );

    if (ownedItemsOfType.length <= 1) return; // Nothing to cycle

    // Find current item index
    let currentId = '';
    if (type === 'suit') currentId = inventory.equippedSuitId;
    if (type === 'tie') currentId = inventory.equippedTieId;
    if (type === 'decor') currentId = inventory.equippedDecorId;
    if (type === 'accessory') currentId = inventory.equippedAccessoryId;

    const currentIndex = ownedItemsOfType.findIndex(i => i.id === currentId);
    
    // Calculate next index (wrap around)
    const nextIndex = (currentIndex + 1) % ownedItemsOfType.length;
    const nextItem = ownedItemsOfType[nextIndex];

    handleEquipItem(nextItem);
  };

  const handleExit = () => {
    playSound('click');
    setStatus(GameStatus.IDLE); // Just pause/idle
    // Do NOT reset queue or current term to allow resuming
    setShowWelcome(true);
  };

  // --- Share Logic ---
  const getShareUrl = () => {
    // Generate a clean URL without existing query params, then add a unique challenge ID
    const baseUrl = window.location.origin + window.location.pathname;
    // We add a 'challenge' param to make it look unique/trackable, even if the game just loads normally
    return `${baseUrl}?reto=${challengeId}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      try {
        const input = document.getElementById('share-link-input') as HTMLInputElement;
        if (input) {
          input.value = url; // Ensure input has the correct URL
          input.select();
          document.execCommand('copy');
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        }
      } catch (fallbackErr) {
        alert('Copia el enlace manualmente.');
      }
    }
  };

  const handleShare = async () => {
    const url = getShareUrl();
    const text = `¡Te desafío en Un Contador en Apuros! 👨‍💼📊 ¿Podrás superar mi puntuación? Código de Reto: ${challengeId}`;
    
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Desafío Contable', text, url });
      } else {
        handleCopyLink();
      }
    } catch (error) {
      console.log('Share cancelled', error);
    }
  };

  const getClassificationStyle = (classification?: string) => {
    switch(classification) {
      case 'Activo': return 'bg-blue-50/80 border-blue-200 shadow-blue-100 ring-2 ring-blue-100';
      case 'Pasivo': return 'bg-red-50/80 border-red-200 shadow-red-100 ring-2 ring-red-100';
      case 'Patrimonio': return 'bg-purple-50/80 border-purple-200 shadow-purple-100 ring-2 ring-purple-100';
      case 'Ingresos': return 'bg-green-50/80 border-green-200 shadow-green-100 ring-2 ring-green-100';
      case 'Egresos': return 'bg-orange-50/80 border-orange-200 shadow-orange-100 ring-2 ring-orange-100';
      default: return 'bg-white/50 border-white/60';
    }
  };

  // --- Helper Components ---
  const LinkBox = () => {
    const uniqueUrl = getShareUrl();
    return (
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <Gamepad2 className="w-3 h-3 text-gold-500" /> 
            Enlace de Reto Único
          </div>
          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">Solo Lectura (Jugar)</span>
        </label>
        <div className="flex items-center gap-2">
          <input 
            id="share-link-input"
            readOnly 
            value={uniqueUrl}
            onClick={(e) => e.currentTarget.select()}
            className="flex-1 bg-white border border-gray-300 text-gray-600 text-sm rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold-400 select-all font-mono cursor-text"
          />
          <button 
            onClick={() => { playSound('click'); handleCopyLink(); }}
            className={`p-1.5 rounded-md transition-all flex items-center gap-1 text-sm font-bold px-3 min-w-[90px] justify-center ${copySuccess ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-ledger-100 text-ledger-700 hover:bg-ledger-200 border border-ledger-200'}`}
          >
            {copySuccess ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            {copySuccess ? '¡Listo!' : 'Copiar'}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center">Este enlace permite jugar pero no editar el código fuente.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 ledger-bg relative z-0">
      
      {/* Visual Effects */}
      {status === GameStatus.WON && <Confetti />}

      {/* Shop Modal */}
      <ShopModal 
        isOpen={showShop} 
        onClose={() => setShowShop(false)} 
        inventory={inventory}
        onBuy={handleBuyItem}
        onEquip={handleEquipItem}
        onBuyDiamond={handleBuyDiamond}
      />

      {/* Study Guide Modal */}
      <StudyGuideModal
        isOpen={showStudyGuide}
        onClose={() => setShowStudyGuide(false)}
      />

      {/* Header */}
      <header className="bg-ledger-900 text-white p-3 shadow-realistic sticky top-0 z-20 border-b-4 border-gold-500">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-3">
          
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-3 select-none">
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <GameLogo className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-2xl font-bold tracking-wide text-white leading-none">Un Contador</h1>
              <span className="text-xs text-gold-400 font-mono font-bold tracking-widest">EN APUROS</span>
            </div>
          </div>

          {/* Right: Actions & Stats */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Currency Pills */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
               <Coins className="w-4 h-4 text-gold-400" />
               <span className="font-mono text-sm font-bold">{inventory.coins}</span>
            </div>
             <div className="hidden sm:flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
               <Gem className="w-4 h-4 text-purple-400" />
               <span className="font-mono text-sm font-bold">{inventory.diamonds}</span>
            </div>

             {/* Study Guide Button */}
             <button
                onClick={() => setShowStudyGuide(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-ledger-800 hover:bg-ledger-700 text-white rounded-lg transition-colors shadow-md border border-ledger-600"
                title="Guía de Estudio"
              >
                <BookOpen className="w-4 h-4 text-gold-400" />
                <span className="hidden md:inline text-sm font-bold">Guía</span>
              </button>

             {/* Shop Button */}
             <button
                onClick={() => setShowShop(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-ledger-600 hover:bg-ledger-500 text-white rounded-lg transition-colors shadow-md border border-ledger-500"
                title="Tienda"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden md:inline text-sm font-bold">Tienda</span>
              </button>

             {/* Install Button */}
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-ledger-900 rounded-full transition-colors shadow-md border-b-2 border-gold-700"
                title="Instalar App"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline text-sm font-bold">Instalar</span>
              </button>

              {/* Exit Button */}
              <button
                onClick={handleExit}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md border border-red-600"
                title="Salir al Menú"
              >
                <LogOut className="w-4 h-4" />
              </button>

            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 bg-gradient-to-b from-gold-400 to-gold-500 text-ledger-900 px-3 py-1.5 rounded-full shadow-md border-b-2 border-gold-600 min-w-[4rem] justify-center">
              <RefreshCw className={`w-3.5 h-3.5 ${status === GameStatus.LOADING ? 'animate-spin' : ''}`} />
              <span className="font-bold text-sm">{streak}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Currency Bar (Visible only on small screens) */}
      <div className="sm:hidden bg-ledger-800 px-4 py-2 flex justify-center gap-6 border-b border-ledger-700 text-white text-sm font-bold shadow-inner">
          <div className="flex items-center gap-2">
             <Coins className="w-4 h-4 text-gold-400" /> {inventory.coins}
          </div>
          <div className="flex items-center gap-2">
             <Gem className="w-4 h-4 text-purple-400" /> {inventory.diamonds}
          </div>
      </div>

      <main className="flex-grow p-4 md:p-8 w-full max-w-4xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Top Section: Hangman & Hint */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full transform transition-all duration-500 group relative">
            
            {/* QUICK EQUIPMENT SELECTOR OVERLAY */}
            <div className="absolute z-10 top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <button onClick={() => cycleOwnedItem('suit')} className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white border border-gray-200 text-ledger-700" title="Cambiar Traje">
                 <Shirt className="w-4 h-4" />
               </button>
               <button onClick={() => cycleOwnedItem('tie')} className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white border border-gray-200 text-ledger-700" title="Cambiar Corbata">
                 <Briefcase className="w-4 h-4" />
               </button>
               <button onClick={() => cycleOwnedItem('decor')} className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white border border-gray-200 text-ledger-700" title="Cambiar Decoración">
                 <Flower className="w-4 h-4" />
               </button>
               <button onClick={() => cycleOwnedItem('accessory')} className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white border border-gray-200 text-ledger-700" title="Cambiar Accesorio">
                 <Monitor className="w-4 h-4" />
               </button>
            </div>

            <HangmanFigure 
              wrongGuesses={wrongGuesses} 
              isWinner={status === GameStatus.WON} 
              equippedSuit={equippedSuit}
              equippedTie={equippedTie}
              equippedDecor={equippedDecor}
              equippedAccessory={equippedAccessory}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-realistic border border-gray-200 p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-12 h-12 bg-gray-100 -mr-6 -mt-6 rotate-45 shadow-sm border-b border-gray-200"></div>

            <div>
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                 <div className="flex items-center gap-2 text-ledger-900 font-bold text-xl">
                   <HelpCircle className="w-6 h-6 text-gold-500 fill-current" />
                   <h3>Expediente</h3>
                 </div>
                 
                 {/* TIMER DISPLAY */}
                 <div className={`flex items-center gap-2 px-3 py-1 rounded-full border shadow-inner transition-all duration-300 ${timeLeft <= 10 ? 'bg-red-50 border-red-200 text-red-600 animate-urgent' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-mono text-xl font-bold">{timeLeft}s</span>
                 </div>
              </div>
              
              {currentTerm ? (
                <div className="space-y-4 relative">
                  <div className="p-4 bg-blue-50/80 text-blue-900 rounded-lg border-l-4 border-ledger-500 shadow-sm backdrop-blur-sm transition-all hover:translate-x-1">
                    <span className="text-xs font-bold uppercase text-ledger-600 block mb-1 tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Clasificación
                    </span>
                    <span className="font-semibold text-lg">{currentTerm.classification}</span>
                  </div>
                  <div className="p-4 bg-yellow-50/80 text-yellow-900 rounded-lg border-l-4 border-gold-500 shadow-sm backdrop-blur-sm transition-all hover:translate-x-1">
                     <span className="text-xs font-bold uppercase text-gold-700 block mb-1 tracking-wider">Descripción</span>
                     <span className="italic font-medium leading-relaxed">"{currentTerm.definition}"</span>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              )}
            </div>

            <div className="mt-6 text-sm text-gray-500 flex items-center justify-between pt-4 border-t border-gray-100">
               <div className="flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 text-gold-500" />
                 <span>Identifique la cuenta correcta.</span>
               </div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className={`flex flex-col items-center p-8 rounded-2xl shadow-sm border backdrop-blur-sm relative transition-all duration-500 ${getClassificationStyle(currentTerm?.classification)}`}>
          
          {/* HINT BUTTON (MOVED TO TOP ROW TO AVOID OVERLAP) */}
          <div className="w-full flex justify-end mb-4">
            <button
              onClick={handleHint}
              disabled={status !== GameStatus.PLAYING || inventory.coins < HINT_COST}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm shadow-sm transition-all border transform active:scale-95
                 ${inventory.coins >= HINT_COST 
                   ? 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200' 
                   : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed grayscale'
                 }
              `}
              title={`Pista: Revelar letra (-${HINT_COST} monedas)`}
            >
               <Lightbulb className={`w-4 h-4 ${inventory.coins >= HINT_COST ? 'fill-yellow-400' : ''}`} />
               <span>Pista</span>
               <span className="bg-white/50 px-1.5 rounded text-xs">-{HINT_COST}</span>
            </button>
          </div>

          {currentTerm && (
            <WordDisplay 
              word={currentTerm.name} 
              guessedLetters={guessedLetters} 
              reveal={status === GameStatus.LOST || status === GameStatus.WON}
            />
          )}

          <div className="w-full mt-8">
            <Keyboard 
              guessedLetters={guessedLetters} 
              onGuess={handleGuess} 
              disabled={status !== GameStatus.PLAYING} 
              targetWord={currentTerm?.name || ""} 
            />
          </div>
        </div>

        {/* Install Help Modal */}
        {showInstallHelp && (
           <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ledger-900/80 backdrop-blur-sm">
             <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border-t-8 border-gold-500 relative animate-pop-in">
                <button onClick={() => setShowInstallHelp(false)} className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <h3 className="text-xl font-bold text-ledger-900 mb-4 flex items-center gap-2">
                  <Download className="w-6 h-6 text-gold-500" />
                  Instalación Manual
                </h3>
                <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex gap-3">
                    <span className="font-bold text-ledger-700">🤖 Android:</span>
                    <span>Menú (⋮) → "Instalar aplicación".</span>
                  </div>
                  <hr className="border-gray-200"/>
                  <div className="flex gap-3">
                    <span className="font-bold text-ledger-700">🍎 iOS:</span>
                    <span>Compartir → "Agregar a Inicio".</span>
                  </div>
                </div>
                <button onClick={() => setShowInstallHelp(false)} className="mt-6 w-full py-2 bg-ledger-600 text-white rounded-lg font-bold">Entendido</button>
             </div>
           </div>
        )}

        {/* Welcome Modal */}
        {showWelcome && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ledger-900/60 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-pop-in border-t-8 border-gold-500 ring-4 ring-black/5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-center mx-auto mb-6 animate-float">
                 <GameLogo className="w-32 h-32 drop-shadow-xl" />
              </div>
              <h1 className="text-3xl font-black text-ledger-900 mb-4 tracking-tight">
                Un Contador<br/>en Apuros
              </h1>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Adivina las cuentas contables antes de que el tiempo se agote. <br/>Gana <span className="font-bold text-gold-600">Monedas</span> para obtener pistas y <span className="font-bold text-purple-600">Diamantes</span> para personalizarte.
              </p>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => { 
                    playSound('click'); 
                    setShowWelcome(false); 
                    
                    if (!currentTerm) {
                       startNewRound();
                    } else if (status === GameStatus.IDLE) {
                       // If paused (IDLE) but has term, resume
                       setStatus(GameStatus.PLAYING);
                    }
                  }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-ledger-600 to-ledger-700 hover:from-ledger-700 hover:to-ledger-800 text-white text-xl font-bold rounded-xl transition-all shadow-lg border-b-4 border-ledger-900 active:scale-95"
                >
                  Iniciar Jornada
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post Game Modal (Result) */}
        {(status === GameStatus.WON || status === GameStatus.LOST) && !showWelcome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ledger-900/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-pop-in border-t-8 border-gold-500 ring-1 ring-black/5 max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                {status === GameStatus.WON ? (
                  <>
                    <div className="inline-block p-4 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 text-gold-600 mb-4 border-4 border-white shadow-lg animate-bounce">
                      <Trophy className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-ledger-800 animate-pulse">¡BALANCE CUADRADO!</h2>
                    
                    {/* Rewards Section */}
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full border border-yellow-200 transform hover:scale-105 transition-transform">
                        <Coins className="w-5 h-5 text-yellow-500" />
                        <span className="font-bold">+30</span>
                      </div>
                      {(streak > 0 && streak % 5 === 0) && (
                         <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full border border-purple-200 animate-pulse">
                           <Gem className="w-5 h-5 text-purple-500" />
                           <span className="font-bold">+1 Diamante!</span>
                         </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="inline-block p-4 rounded-full bg-gradient-to-br from-red-50 to-red-100 text-red-600 mb-4 border-4 border-white shadow-lg animate-shake">
                      <AlertCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-red-600">
                      {timeLeft === 0 ? "¡TIEMPO AGOTADO!" : "DESPEDIDO"}
                    </h2>
                  </>
                )}
                
                <div className="bg-ledger-50 py-3 px-6 rounded-xl mt-3 border border-ledger-200 shadow-inner transform transition-all duration-500 delay-100 opacity-0 animate-[popIn_0.5s_0.2s_forwards]">
                  <p className="text-gray-500 text-sm font-medium mb-1">La cuenta era:</p>
                  <span className="font-black text-2xl text-ledger-900 tracking-widest font-mono">{currentTerm?.name}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => startNewRound()}
                  className="w-full py-4 px-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-ledger-900 font-black text-lg rounded-xl transition-all shadow-lg border-b-4 border-gold-700 active:border-b-0 active:translate-y-1 active:mt-1 hover:scale-[1.02]"
                >
                  Siguiente Cuenta
                </button>

                <button
                  onClick={() => setShowShop(true)}
                  className="w-full py-3 px-4 bg-white border-2 border-ledger-200 hover:border-ledger-400 text-ledger-700 font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                  <ShoppingBag className="w-5 h-5" /> Ir a la Tienda
                </button>
                
                <LinkBox />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
