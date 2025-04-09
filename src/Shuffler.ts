export function getNewWord(
  previous: string,
  wordPack: readonly string[],
  bannedWords: Set<string>
): { wordScrambled: string; wordUnscrambled: string } {
  let shuffledWord: string | null;
  let word: string;
  do {
    word = getRandomWord(wordPack, previous);
    shuffledWord = shuffleWord(word, bannedWords);
  } while (shuffledWord === null);

  return { wordScrambled: word, wordUnscrambled: shuffledWord };
}

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
export function shuffleWord(
  word: string,
  bannedWords: Set<string>
): string | null {
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

// function to return if any of the substrings of a word are naughty. If so,
// this function will return true. If not, this returns false.
function isWordNaughty(
  shuffledWord: string,
  bannedWords: Set<string>
): boolean {
  return (
    shuffledWord
      .split("")
      .flatMap((_, i) =>
        shuffledWord
          .slice(i)
          .split("")
          .map((_, j) => shuffledWord.slice(i, i + j + 1))
      )
      .filter((elem) => bannedWords.has(elem)).length > 0
  );
}

// picks a random word from the word pack. Guarantees that the previous word
// will not be chosen again.
function getRandomWord(
  wordPack: readonly string[],
  previous: string = ""
): string {
  let newWord: string;
  do {
    newWord = wordPack[Math.floor(Math.random() * wordPack.length)];
  } while (newWord === previous);
  return newWord;
}
