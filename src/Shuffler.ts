import { isWordNaughty } from "./IsNaughty";
import { quickRemove, tryRemoveElement } from "./Utilities";

/**
 * Name:        shuffleWord
 * Description: Takes a string, and returns a randomly shuffled
 *              ordering of that string. Also checks to ensure the resulting
 *              string is not naughty, in which case it will re-randomize it.
 *              If after 10 re-randomizations no safe versions have been found,
 *              this returns null instead.
 * Parameters:  An string to randomize. This input string will be
 *              preserved.
 * Returns:     A new string containing the same characters as the input, but
 *              in a randomized and safe order, or null if no safe orderings have
 *              been found after 10 attempts.
 * Effects:     This will preserve the input data.
 */
export function shuffleWord(
  word: string,
  bannedWords: ReadonlySet<string>
): string {
  let shuffledWord = word
    .split(/([ -])/)
    .map(shuffleSingleWord)
    .join("");

  let attempt = 0;
  while (isWordNaughty(shuffledWord, bannedWords) && attempt < 10) {
    shuffledWord = word
      .split(/([ -])/)
      .map(shuffleSingleWord)
      .join("");
    attempt++;
  }
  return attempt === 10 ? word : shuffledWord;
}

/**
 * shuffleArray
 * @param array       An array of strings to be shuffled
 * @param previous    A previous string entry to prevent from being the first
 *                    element in the new array. If unspecified, this will allow
 *                    any element to be the first element.
 * @returns           A new array containing the same elements as the input but
 *                    in a randomly shuffled order.
 */
export function shuffleArray(
  array: readonly string[],
  previous: string | null = null
): string[] {
  let result: string[];
  do {
    result = [];
    const copyWord: string[] = array.slice();
    for (let last = copyWord.length - 1; last >= 0; last--) {
      const idx = Math.floor(Math.random() * copyWord.length);
      result.push(copyWord[idx]);
      quickRemove(copyWord, idx);
    }
  } while (result[0] === previous);

  return result;
}

/**
 * shuffleSingleWord
 * @param word A single word to be shuffled. Will return a random ordering of
 *             this word.
 * @returns   A shuffled version of the word. This function is distinct because
 *            it's header function, `shuffleWord` preserves the location of
 *            delimiting characters within it. This function, in contrast, will
 *            randomize all characters in the input data.
 */
function shuffleSingleWord(word: string): string {
  return shuffleArray(word.split("")).join("");
}
