import { normalizeString } from "./Normalization";
import { shuffleArray, shuffleWord } from "./Shuffler";
import { isWordNaughty } from "./IsNaughty";
import { Dispatch, useReducer } from "react";

export type WordHistoryItem = {
  wordUnscrambled: string;
  wordScrambled: string;
  result: "Guessed" | "Skipped";
};

export type State =
  | {
      phase: "pre-game";
      wordPack: readonly string[] | null;
      wordPackName: string | null;
      availableWordPacks: Record<string, readonly string[]>;
      bannedWords: ReadonlySet<string> | null;
    }
  | {
      phase: "in-game";
      wordUnscrambled: string;
      wordScrambled: string;
      guess: string;
      wordPack: readonly string[];
      wordPackName: string;
      availableWordPacks: Record<string, readonly string[]>;
      shuffledWordPack: string[];
      roundNumber: number;
      bannedWords: ReadonlySet<string>;
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
      wordPackName: string;
      availableWordPacks: Record<string, readonly string[]>;
      bannedWords: ReadonlySet<string>;
    };

export type Action =
  | { type: "load-data"; wordPackName: string; wordPack: readonly string[] }
  | { type: "select-pack"; wordPackName: string }
  | { type: "load-bans"; bannedWords: readonly string[] }
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string }
  | { type: "skip-word" }
  | { type: "end-game" };

// ######################################################################
// ==================    State Reducer      =============================
// ######################################################################
export default function useAppState(): [State, Dispatch<Action>] {
  return useReducer(reducer, null, getInitialState);
}

// the reducer function:
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    // Action: Start game:
    // called whenever the player wants to start the game (after the word pack
    // has been loaded)
    case "start-game":
      if (
        state.wordPack !== null &&
        state.bannedWords !== null &&
        state.wordPackName !== null
      ) {
        const cleanWords = state.wordPack.filter(
          (word) => !isWordNaughty(word, state.bannedWords!)
        );
        const shuffledCleanWords = shuffleArray(cleanWords);
        return {
          phase: "in-game",
          wordUnscrambled: shuffledCleanWords[0],
          wordScrambled: shuffleWord(shuffledCleanWords[0], state.bannedWords),
          history: { words: [], skips: 0, guesses: 0 },
          wordPack: cleanWords,
          wordPackName: state.wordPackName,
          availableWordPacks: state.availableWordPacks,
          shuffledWordPack: shuffledCleanWords,
          roundNumber: 0,
          bannedWords: state.bannedWords,
          guess: "",
        };
      }
      break;

    // Action: Load data
    // called when the game has loaded a wordpack and can update state.
    case "load-data": {
      if (state.phase === "pre-game") {
        console.log(action.wordPackName, action.wordPack);
        return {
          ...state,
          availableWordPacks: {
            ...state.availableWordPacks,
            [action.wordPackName]: action.wordPack,
          },
        };
      }
      break;
    }

    // Action: select-pack
    // called to select a specific pack to use as the wordPack for the game.
    case "select-pack": {
      if (action.wordPackName in state.availableWordPacks) {
        return {
          ...state,
          wordPack: state.availableWordPacks[action.wordPackName],
          wordPackName: action.wordPackName,
        };
      }

      break;
    }

    // Action: Load bans
    // called when the game has loaded a banned wordpack and can update state.
    case "load-bans": {
      if (state.phase === "pre-game") {
        return {
          ...state,
          bannedWords: new Set<string>(action.bannedWords),
        };
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
        wordPackName: state.wordPackName,
        availableWordPacks: state.availableWordPacks,
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
  return {
    phase: "pre-game",
    wordPack: null,
    wordPackName: null,
    availableWordPacks: {} as Record<string, readonly string[]>,
    bannedWords: null,
  };
}

// function to generate a new game-state object, called after a word was
// either guessed correctly or skipped
function generateNewGameState(state: State, wasGuessed: boolean): State {
  if (state.phase !== "in-game") return state;

  const shuffledWordPack =
    (state.roundNumber + 1) % state.wordPack.length === 0
      ? shuffleArray(state.shuffledWordPack, state.shuffledWordPack.at(-1))
      : state.shuffledWordPack;

  return {
    phase: "in-game",
    wordUnscrambled:
      shuffledWordPack[(state.roundNumber + 1) % state.wordPack.length],
    wordScrambled: shuffleWord(
      shuffledWordPack[(state.roundNumber + 1) % state.wordPack.length],
      state.bannedWords
    ),
    guess: "",
    history: {
      words: [
        ...state.history.words,
        {
          wordUnscrambled: state.wordUnscrambled,
          wordScrambled: state.wordScrambled,
          result: wasGuessed ? "Guessed" : "Skipped",
        },
      ],
      guesses: wasGuessed ? state.history.guesses + 1 : state.history.guesses,
      skips: wasGuessed ? state.history.skips : state.history.skips + 1,
    },
    wordPack: state.wordPack,
    wordPackName: state.wordPackName,
    availableWordPacks: state.availableWordPacks,
    shuffledWordPack: shuffledWordPack,
    roundNumber: state.roundNumber + 1,
    bannedWords: state.bannedWords,
  };
}
