import { isWordNaughty } from "./IsNaughty";
import { quickRemove, tryRemoveElement } from "./Utilities";

/**
 *  getNewWord
 *
 *  Highest level function to generate new words. Will result in a new word,
 *  including shuffled and unshuffled forms. Also guarantees that the resulting
 *  word is clean (assuming there are at least 2 words with clean shuffles in the
 *  word pack.)
 *
 * @param wordPack      A list of words to select from when picking a new word.
 * @param bannedWords   A Set of banned words to use to filter whether a word is
 *                      naughty or not. All substrings of the candidate shuffle will
 *                      be checked against this Set.
 * @param previous      The previously chosen word to avoid selecting again. Can be
 *                      left blank, which will disable a previous-word check.
 * @returns             An object containing two fields: wordScrambled and
 *                      wordUnscrambled, which correspond to the two forms of the
 *                      new word.
 */
export function getNewWord(
  wordPack: readonly string[],
  bannedWords: Set<string>,
  previous: string = ""
): {
  wordScrambled: string;
  wordUnscrambled: string;
  availableWordPack: string[];
} {
  let shuffledWord: string | null;
  let word: string;
  do {
    word = getRandomWord(wordPack, previous);
    shuffledWord = shuffleWord(word, bannedWords);
  } while (shuffledWord === null);
  return {
    wordScrambled: word,
    wordUnscrambled: shuffledWord,
    availableWordPack: tryRemoveElement(wordPack.slice(), word),
  };
}

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
function shuffleWord(word: string, bannedWords: Set<string>): string | null {
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
  return attempt === 10 ? null : shuffledWord;
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
  const copyWord: string[] = word.split("");
  let result: string = "";
  for (let last = copyWord.length - 1; last >= 0; last--) {
    const idx = Math.floor(Math.random() * copyWord.length);
    result += copyWord[idx];
    quickRemove(copyWord, idx);
  }
  return result;
}

/**
 * getRandomWord
 * @param wordPack    A list of strings to pick a random word from.
 * @param previous    A previous word to avoid picking again (preventing
 *                    duplicate picks). If unfilled/left as "", will not perform
 *                    a duplicate check.
 * @returns           A random word selected from the wordPack, that is not the
 *                    previous word if specified.
 */
function getRandomWord(
  wordPack: readonly string[],
  previous: string = ""
): string {
  let newWord: string;
  do {
    const idx = Math.floor(Math.random() * wordPack.length);
    newWord = wordPack[idx];
  } while (newWord === previous);
  return newWord;
}
