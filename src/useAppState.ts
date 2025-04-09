import { normalizeString } from "./Normalization";
import { getNewWord } from "./Shuffler";

export type WordHistoryItem = {
  wordUnscrambled: string;
  wordScrambled: string;
  result: "guessed" | "skipped";
};

export type State =
  | {
      phase: "pre-game";
      wordPack: readonly string[] | null;
      bannedWords: Set<string> | null;
    }
  | {
      phase: "in-game";
      wordUnscrambled: string;
      wordScrambled: string;
      guess: string;
      wordPack: readonly string[];
      bannedWords: Set<string>;
      history: {
        words: readonly WordHistoryItem[];
        guesses: number;
        skips: number;
      };
    }
  | {
      phase: "post-game";
      wordUnscrambled: string;
      history: {
        words: readonly WordHistoryItem[];
        guesses: number;
        skips: number;
      };
      wordPack: readonly string[];
      bannedWords: Set<string>;
    };

export type Action =
  | { type: "load-data"; wordPack: readonly string[] }
  | { type: "load-bans"; bannedWords: readonly string[] }
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
      if (state.wordPack !== null && state.bannedWords !== null) {
        const wordData = getNewWord(state.wordPack, state.bannedWords);
        return {
          phase: "in-game",
          wordUnscrambled: wordData.wordUnscrambled,
          wordScrambled: wordData.wordScrambled,
          history: { words: [], skips: 0, guesses: 0 },
          wordPack: state.wordPack,
          bannedWords: state.bannedWords,
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

    // Action: Load bans
    // called when the game has loaded a banned wordpack and can update state.
    case "load-bans": {
      if (state.phase === "pre-game") {
        return { ...state, bannedWords: new Set<string>(action.bannedWords) };
      }
      break;
    }

    // Action: End Game
    // called whenever a new input is detected in the textbox
    case "update-guess":
      if (state.phase !== "in-game") return state;

      // only occurs if the word is guessed correctly:
      if (state.wordUnscrambled === normalizeString(action.newGuess)) {
        return generateNewGameState(state, true);
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
        bannedWords: state.bannedWords,
      };

    // called if the player wants to skip a word:
    case "skip-word": {
      return generateNewGameState(state, false);
    }
  }
  return state;
}

// generates an initial state with no wordPack
export function getInitialState(): State {
  return { phase: "pre-game", wordPack: null, bannedWords: null };
}

// function to generate a new game-state object, called after a word was
// either guessed correctly or skipped
function generateNewGameState(state: State, wasGuessed: boolean): State {
  if (state.phase !== "in-game") return state;

  const newWordData = getNewWord(
    state.wordUnscrambled,
    state.wordPack,
    state.bannedWords
  );
  return {
    phase: "in-game",
    wordUnscrambled: newWordData.wordUnscrambled,
    wordScrambled: newWordData.wordScrambled,
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
      guesses: wasGuessed ? state.history.guesses + 1 : state.history.guesses,
      skips: wasGuessed ? state.history.skips : state.history.skips + 1,
    },
    wordPack: state.wordPack,
    bannedWords: state.bannedWords,
  };
}
