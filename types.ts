
export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST',
  LOADING = 'LOADING'
}

export interface AccountTerm {
  name: string;          // The word to guess (e.g., "CAJA")
  classification: string; // e.g., "Activo"
  definition: string;     // Hint: "Dinero en efectivo..."
}

export interface GameState {
  currentTerm: AccountTerm | null;
  guessedLetters: string[];
  wrongGuesses: number;
  status: GameStatus;
  score: number;
  streak: number;
}

export const MAX_LIVES = 6;

// --- New Types for Shop & Customization ---

export type ItemType = 'suit' | 'tie' | 'decor' | 'accessory';

export interface ShopItem {
  id: string;
  type: ItemType;
  name: string;
  price: number;
  currency: 'coins' | 'diamonds';
  primaryColor: string;
  secondaryColor: string; // Used for gradients
}

export interface PlayerInventory {
  coins: number;
  diamonds: number;
  ownedItems: string[]; // IDs of owned items
  equippedSuitId: string;
  equippedTieId: string;
  equippedDecorId: string;     // New: Wall/Room decoration
  equippedAccessoryId: string; // New: Desk accessory
}
