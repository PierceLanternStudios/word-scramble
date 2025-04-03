export type State =
  | { phase: "pre-game"; wordPack: readonly string[] | null }
  | {
      phase: "in-game";
      goal: string;
      guess: string;
      wordPack: readonly string[];
    }
  | { phase: "post-game"; goal: string; wordPack: readonly string[] };

export type Action =
  | { type: "load-data"; wordPack: readonly string[] }
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string };

// ######################################################################
// ==================    State Reducer      =============================
// ######################################################################

// the reducer function: TODO: move to other file, along with type
// definitions
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start-game":
      if (state.wordPack !== null) {
        return {
          phase: "in-game",
          goal: getRandomWord(state),
          wordPack: state.wordPack,
          guess: "",
        };
      }
      break;

    case "load-data": {
      if (state.phase === "pre-game") {
        return { ...state, wordPack: action.wordPack };
      }
      break;
    }
    case "update-guess":
      if (state.phase !== "in-game") return state;

      if (state.goal === action.newGuess)
        return {
          phase: "post-game",
          goal: state.goal,
          wordPack: state.wordPack,
        };

      return { ...state, guess: action.newGuess };
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
