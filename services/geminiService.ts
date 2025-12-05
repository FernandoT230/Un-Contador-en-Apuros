import { AccountTerm } from "../types";
import { GAME_TERMS } from "../constants";

// Utility to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const fetchAccountingTerms = async (count: number = 5): Promise<AccountTerm[]> => {
  // We simulate an async operation to keep the interface consistent,
  // although it is now instant.
  return new Promise((resolve) => {
    const shuffled = shuffleArray(GAME_TERMS);
    resolve(shuffled.slice(0, count));
  });
};
