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

function arraySwapWithLast(array: string[], idx: number): string[] {
  if (idx >= array.length || array.length < 2) return array;
  const temp = array[array.length - 1];
  array[array.length - 1] = array[idx];
  array[idx] = temp;
  return array;
}

function shuffleSingleWord(word: string): string {
  const copyWord: string[] = word.split("");
  let result: string = "";
  for (let last = copyWord.length - 1; last >= 0; last--) {
    const idx = Math.floor(Math.random() * copyWord.length);
    result += copyWord[idx];
    arraySwapWithLast(copyWord, idx);
    copyWord.pop();
  }
  return result;
}
