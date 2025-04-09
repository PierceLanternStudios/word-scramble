import React from "react";
import "./App.css";
import { reducer, getInitialState } from "./useAppState";
import { normalizeString } from "./Normalization";
import InGameCSS from "./InGame.module.css";
import PreGameCSS from "./PreGame.module.css";
import ButtonCSS from "./Button.module.css";
import { pluralize } from "./Utilities";

// ######################################################################
// ==================     App Render     ================================
// ######################################################################

function App() {
  const [state, dispatch] = React.useReducer(reducer, null, getInitialState);
  const guessInputRef = React.useRef<HTMLInputElement | null>(null);

  // get word pack:
  React.useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/animals.txt")
      .then((response) => response.text())
      .then((text) => {
        setTimeout(() => {
          dispatch({
            type: "load-data",
            wordPack: text.split("\n").map(normalizeString).filter(Boolean),
          });
        }, 1000);
      });
  }, [dispatch]);

  React.useEffect(() => {
    fetch("https://unpkg.com/naughty-words@1.2.0/en.json").then((response) =>
      response.json().then((bannedWords) =>
        dispatch({
          type: "load-bans",
          bannedWords: bannedWords.map(normalizeString).filter(Boolean),
        })
      )
    );
  }, []);

  // switch on game phase to decide what to render:
  switch (state.phase) {
    case "pre-game":
      return (
        <div className={PreGameCSS.container}>
          <h3>Welcome to Word Scramble!</h3>
          {state.wordPack === null ? (
            "Loading words..."
          ) : (
            <button
              autoFocus
              className={ButtonCSS.button}
              onClick={() => dispatch({ type: "start-game" })}
            >
              Start Game!
            </button>
          )}
        </div>
      );

    case "in-game":
      return (
        <div className={InGameCSS.container}>
          <h3>In Game!</h3>
          <div>Goal: {state.wordScrambled}</div>
          <input
            type="text"
            className={InGameCSS.inputField}
            autoFocus
            ref={guessInputRef}
            value={state.guess}
            onChange={(ev) =>
              dispatch({ type: "update-guess", newGuess: ev.target.value })
            }
          />
          <div className={InGameCSS.rowContainer}>
            <button
              className={ButtonCSS.button}
              onClick={() => dispatch({ type: "end-game" })}
            >
              End Game
            </button>
            <button
              className={ButtonCSS.button}
              onClick={() => {
                dispatch({ type: "skip-word" });
                guessInputRef.current?.focus();
              }}
            >
              Skip this word
            </button>
          </div>
        </div>
      );
    case "post-game":
      return (
        <div className={InGameCSS.container}>
          <h3>Nice Job!</h3>
          <div>The last word was "{state.wordUnscrambled}"!</div>
          <span>
            Stats: You had{" "}
            <strong>{pluralize("guess", state.history.guesses)}</strong> and{" "}
            <strong>{pluralize("skip", state.history.skips)}!</strong>
          </span>
          <div>
            <button
              autoFocus
              className={ButtonCSS.button}
              onClick={() => dispatch({ type: "start-game" })}
            >
              Start a new Game!
            </button>
          </div>
        </div>
      );
  }
}

export default App;
