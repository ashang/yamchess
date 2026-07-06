export interface GameRecord {
  id: string;
  date: string;
  result: string;
  moves: string[];
  finalFen: string;
  startPosition: string | null;
}

const STORAGE_KEY = 'chess-game-history';

// Save a completed game to history
export function saveGameToHistory(record: GameRecord): void {
  const history = getGameHistory();
  history.unshift(record); // Add to beginning
  // Keep only last 50 games
  if (history.length > 50) {
    history.pop();
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// Get all game history
export function getGameHistory(): GameRecord[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Clear all game history
export function clearGameHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Delete a specific game from history
export function deleteGameFromHistory(id: string): void {
  const history = getGameHistory();
  const filtered = history.filter(game => game.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
