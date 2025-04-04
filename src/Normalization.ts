// function to perform guess normalization
export function normalizeString(guess: string): string {
  return guess.trim().toUpperCase().replaceAll(/\s+/g, " ");
}
