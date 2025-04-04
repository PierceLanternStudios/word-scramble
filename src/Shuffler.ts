export function shuffleWords(words: readonly string[]): string[] {
  const copyWords: string[] = words.slice();
  const result: string[] = [];
  for (let last = copyWords.length - 1; last >= 0; last--) {
    const idx = Math.floor(Math.random() * copyWords.length);
    result.push(copyWords[idx]);
    [copyWords[idx], copyWords[last]] = [copyWords[last], copyWords[idx]];
    copyWords.pop();
  }

  return result;
}
