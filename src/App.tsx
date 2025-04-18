import React from "react";
import "./App.css";
import { normalizeString } from "./Normalization";
import InGameCSS from "./InGame.module.css";
import PreGameCSS from "./PreGame.module.css";
import ButtonCSS from "./Button.module.css";
import LetterCSS from "./Letters.module.css";
import { pluralize, quickRemove } from "./Utilities";
import useLoadData from "./useLoadData";
import useLoadBans from "./useLoadBans";
import useAppState from "./useAppState";

// ######################################################################
// ==================     App Render     ================================
// ######################################################################

function App() {
  const [state, dispatch] = useAppState();
  const guessInputRef = React.useRef<HTMLInputElement | null>(null);

  //load our word pack data and banned words
  useLoadData(dispatch);
  useLoadBans(dispatch);

  // switch on game phase to decide what to render:
  switch (state.phase) {
    case "pre-game":
      return (
        <div className={PreGameCSS.container}>
          <h3>Welcome to Word Scramble!</h3>
          {state.wordPack === null || state.bannedWords === null ? (
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
          <h3>Word Scramble!</h3>
          <div>Unscramble this:</div>
          <div>{generateDisplayWord(state.wordScrambled, state.guess)}</div>
          <div className={InGameCSS.inputFieldOverlay}>
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
            <div className={InGameCSS.inputFieldText}>
              {generateHighlightedGuess(state.guess, state.wordScrambled)}
            </div>
          </div>
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

function generateDisplayWord(word: string, alreadyTyped: string) {
  const letters = normalizeString(word).split("");
  let alreadyTypedArray = normalizeString(alreadyTyped).split("");
  const result: React.ReactNode[] = [];
  {
    letters.forEach((elem, idx) => {
      if (alreadyTypedArray.includes(elem)) {
        alreadyTypedArray = quickRemove(
          alreadyTypedArray,
          alreadyTypedArray.indexOf(elem)
        );
        result.push(
          <span key={idx} className={LetterCSS.highlight}>
            {elem}
          </span>
        );
      } else {
        result.push(
          <span key={idx} className={LetterCSS.normal}>
            {elem}
          </span>
        );
      }
    });
  }
  return (
    <div className={LetterCSS.container}>{result.map((elem) => elem)}</div>
  );
}

// function to generate the highlighted text for the guess field
function generateHighlightedGuess(currentGuess: string, word: string) {
  const guess = normalizeString(currentGuess).split("");
  let wordArray = normalizeString(word).split("");
  const result: React.ReactNode[] = [];
  {
    guess.forEach((elem, idx) => {
      if (wordArray.includes(elem)) {
        wordArray = quickRemove(wordArray, wordArray.indexOf(elem));
        result.push(
          <span key={idx} className={LetterCSS.guessNormal}>
            {elem}
          </span>
        );
      } else {
        result.push(
          <span key={idx} className={LetterCSS.guessWrong}>
            {elem}
          </span>
        );
      }
    });
  }
  return (
    <div className={LetterCSS.guessContainer}>{result.map((elem) => elem)}</div>
  );
}

export default App;
