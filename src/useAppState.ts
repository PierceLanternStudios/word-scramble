import { normalizeString } from "./Normalization";
import { shuffleWord } from "./Shuffler";

export type State =
  | { phase: "pre-game"; wordPack: readonly string[] | null }
  | {
      phase: "in-game";
      goal: string;
      shuffledGoal: string;
      guess: string;
      wordPack: readonly string[];
    }
  | { phase: "post-game"; goal: string; wordPack: readonly string[] };

export type Action =
  | { type: "load-data"; wordPack: readonly string[] }
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string }
  | { type: "end-game" };

// ######################################################################
// ==================    State Reducer      =============================
// ######################################################################

// the reducer function: TODO: move to other file, along with type
// definitions
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    // Action: Start game:
    // called whenever the player wants to start the game (after the word pack
    // has been loaded)
    case "start-game":
      if (state.wordPack !== null) {
        const word = getRandomWord(state);
        return {
          phase: "in-game",
          goal: word,
          shuffledGoal: shuffleWord(word),
          wordPack: state.wordPack,
          guess: "",
        };
      }
      break;

    // Action: Load data
    // called whenever the game starts to load a word pack.
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

      if (state.goal === normalizeString(action.newGuess)) {
        const word = getRandomWord(state);
        return {
          phase: "in-game",
          goal: word,
          shuffledGoal: shuffleWord(word),
          guess: "",
          wordPack: state.wordPack,
        };
      }
      return { ...state, guess: action.newGuess };

    // Action: End Game
    // called whenever the end game button is pressed
    case "end-game":
      if (state.phase === "in-game")
        return {
          phase: "post-game",
          goal: state.goal,
          wordPack: state.wordPack,
        };
  }
  return state;
}

// generates an initial state with no wordPack
export function getInitialState(): State {
  return { phase: "pre-game", wordPack: null };
}

// picks a random word from the word pack. Assumes that the wordPack is
// initialized and not null.
function getRandomWord(state: State): string {
  return state.wordPack![Math.floor(Math.random() * state.wordPack!.length)];
}
