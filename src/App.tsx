import React from "react";
import "./App.css";
import { reducer, getInitialState } from "./useAppState";
import { normalizeString } from "./Normalization";

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
              .map((word) => normalizeString(word))
              .filter(Boolean),
          });
        }, 1000);
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
          <div>Goal: {state.wordScrambled}</div>
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
          <div>
            <button onClick={() => dispatch({ type: "end-game" })}>
              End Game
            </button>
            <button onClick={() => dispatch({ type: "skip-word" })}>
              Skip this word
            </button>
          </div>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
    case "post-game":
      return (
        <div>
          <h3>Nice Job!</h3>
          <div>The last word was "{state.wordUnscrambled}"!</div>
          <span>
            Stats: You had <strong>{state.history.guesses} guesses</strong> and{" "}
            <strong>{state.history.skips} skips!</strong>
          </span>
          <div>
            <button onClick={() => dispatch({ type: "start-game" })}>
              Start a new Game!
            </button>
          </div>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );
  }
}

export default App;
