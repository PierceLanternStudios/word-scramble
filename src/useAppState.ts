import { normalizeString } from "./Normalization";
import { shuffleWord } from "./Shuffler";

export type WordHistory = {
  wordUnscrambled: string;
  wordScrambled: string;
  result: "guessed" | "skipped";
};

export type State =
  | { phase: "pre-game"; wordPack: readonly string[] | null }
  | {
      phase: "in-game";
      wordUnscrambled: string;
      wordScrambled: string;
      guess: string;
      wordPack: readonly string[];
      history: { words: WordHistory[]; guesses: number; skips: number };
    }
  | {
      phase: "post-game";
      wordUnscrambled: string;
      history: { words: WordHistory[]; guesses: number; skips: number };
      wordPack: readonly string[];
    };

export type Action =
  | { type: "load-data"; wordPack: readonly string[] }
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string }
  | { type: "skip-word" }
  | { type: "end-game" };

// ######################################################################
// ==================    State Reducer      =============================
// ######################################################################

// the reducer function:
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    // Action: Start game:
    // called whenever the player wants to start the game (after the word pack
    // has been loaded)
    case "start-game":
      if (state.wordPack !== null) {
        const word = getRandomWord(state.wordPack);
        return {
          phase: "in-game",
          wordUnscrambled: word,
          wordScrambled: shuffleWord(word),
          history: { words: [], skips: 0, guesses: 0 },
          wordPack: state.wordPack,
          guess: "",
        };
      }
      break;

    // Action: Load data
    // called when the game has loaded a wordpack and can update state.
    case "load-data": {
      if (state.phase === "pre-game") {
        return { ...state, wordPack: action.wordPack };
      }
      break;
    }

    // Action: End Game
    // called whenever a new input is detected in the textbox
    case "update-guess":
      if (state.phase !== "in-game") return state;

      // only occurs if the word is guessed correctly:
      if (state.wordUnscrambled === normalizeString(action.newGuess)) {
        const word = getRandomWord(state.wordPack);
        return {
          phase: "in-game",
          wordUnscrambled: word,
          wordScrambled: shuffleWord(word),
          guess: "",
          history: {
            words: [
              ...state.history.words,
              {
                wordUnscrambled: state.wordUnscrambled,
                wordScrambled: state.wordScrambled,
                result: "guessed",
              },
            ],
            guesses: state.history.guesses + 1,
            skips: state.history.skips,
          },
          wordPack: state.wordPack,
        };
      }
      return { ...state, guess: action.newGuess };

    // Action: End Game
    // called whenever the end game button is pressed
    case "end-game":
      if (state.phase !== "in-game") break;
      return {
        phase: "post-game",
        wordUnscrambled: state.wordUnscrambled,
        history: state.history,
        wordPack: state.wordPack,
      };

    // called if the player wants to skip a word:
    case "skip-word": {
      if (state.phase !== "in-game") break;
      const word = getRandomWord(state.wordPack);
      return {
        phase: "in-game",
        wordUnscrambled: word,
        wordScrambled: shuffleWord(word),
        guess: "",
        history: {
          words: [
            ...state.history.words,
            {
              wordUnscrambled: state.wordUnscrambled,
              wordScrambled: state.wordScrambled,
              result: "skipped",
            },
          ],
          guesses: state.history.guesses,
          skips: state.history.skips + 1,
        },
        wordPack: state.wordPack,
      };
    }
  }
  return state;
}

// generates an initial state with no wordPack
export function getInitialState(): State {
  return { phase: "pre-game", wordPack: null };
}

// picks a random word from the word pack.
function getRandomWord(wordPack: readonly string[]): string {
  return wordPack![Math.floor(Math.random() * wordPack!.length)];
}
