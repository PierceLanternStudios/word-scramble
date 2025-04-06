import { isTemplateExpression } from "typescript";

/**
 * Name:        shuffleWord
 * Description: Takes a string, and returns a randomly shuffled
 *              ordering of that string.
 * Parameters:  An string to randomize. This input string will be
 *              preserved.
 * Returns:     A new string containing the same characters as the input, but
 *              in a randomized order.
 * Effects:     This will preserve the input data.
 */
export function shuffleWord(word: string): string {
  return word
    .split(/([ -])/)
    .map(shuffleSingleWord)
    .join("");
}

function shuffleSingleWord(word: string): string {
  const copyWord: string[] = word.split("");
  let result: string = "";
  for (let last = copyWord.length - 1; last >= 0; last--) {
    const idx = Math.floor(Math.random() * copyWord.length);
    result += copyWord[idx];
    const temp = copyWord[last];
    copyWord[last] = copyWord[idx];
    copyWord[idx] = temp;
    copyWord.pop();
  }

  return result;
}
