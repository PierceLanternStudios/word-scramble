import React from "react";
import "./App.css";

type State =
  | { phase: "pre-game"; wordPack: readonly string[] | null }
  | {
      phase: "in-game";
      goal: string;
      guess: string;
      wordPack: readonly string[];
    }
  | { phase: "post-game"; goal: string; wordPack: readonly string[] };

type Action =
  | { type: "load-data"; wordPack: readonly string[] }
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string };

// ######################################################################
// ==================    State Reducer      =============================
// ######################################################################

// the reducer function: TODO: move to other file, along with type
// definitions
function reducer(state: State, action: Action): State {
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
        state.wordPack = action.wordPack;
        console.log(action.wordPack);
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

// picks a random word from the word pack. Assumes that the wordPack is
// initialized and not null.
function getRandomWord(state: State): string {
  return state.wordPack![Math.floor(Math.random() * state.wordPack!.length)];
}

// generates an initial state with no wordPack
function getInitialState(): State {
  return { phase: "pre-game", wordPack: null };
}

// ######################################################################
// ==================     App Render     ================================
// ######################################################################

function App() {
  const [state, dispatch] = React.useReducer(reducer, null, getInitialState);

  // get word pack:
  React.useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/animals.txt")
      .then((response) => response.text())
      .then((text) => {
        setTimeout(() => {
          dispatch({
            type: "load-data",
            wordPack: text
              .split("\n")
              .map((word) => word.toUpperCase().trim())
              .filter(Boolean),
          });
          console.log(text);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error fetching the file:", error);
      });
  }, [dispatch]);

  // switch on game phase to decide what to render:
  switch (state.phase) {
    case "pre-game":
      return (
        <div>
          <h3>Pre Game!</h3>
          {state.wordPack === null ? (
            "Loading words..."
          ) : (
            <button onClick={() => dispatch({ type: "start-game" })}>
              Start Game!
            </button>
          )}
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );

    case "in-game":
      return (
        <div>
          <h3>In Game!</h3>
          <div>Goal: {state.goal}</div>
          <label>
            Guess:{" "}
            <input
              type="text"
              value={state.guess}
              onChange={(ev) =>
                dispatch({ type: "update-guess", newGuess: ev.target.value })
              }
            />
          </label>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
    case "post-game":
      return (
        <div>
          <h3>Nice Job!</h3>
          <div>You guessed "{state.goal}"!</div>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Start a new Game!
          </button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
  }
}

export default App;
