/**
 * isWordNaughty
 * @param shuffledWord    A shuffled word to evaluate as naughty or not.
 * @param bannedWords     A set of banned words that will flag any substring
 *                        of the input data as "naughty".
 * @returns               True if the word is found to be naughty, and false
 *                        otherwise.
 */
export function isWordNaughty(
  shuffledWord: string,
  bannedWords: ReadonlySet<string>
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
