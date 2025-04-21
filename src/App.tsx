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

  // function to perform all the actions required to skip a word:
  const skipWord = React.useCallback(() => {
    dispatch({ type: "skip-word" });
    guessInputRef.current?.focus();
  }, [dispatch]);

  // add event listener for keyboard presses:
  React.useEffect(() => {
    const abortController = new AbortController();
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          skipWord();
        }
      },
      { signal: abortController.signal }
    );
    return () => {
      document.removeEventListener("keydown", abortController.abort);
    };
  }, [skipWord]);

  // switch on game phase to decide what to render:
  switch (state.phase) {
    case "pre-game":
      return (
        <div className={PreGameCSS.container}>
          <h3>Welcome to Word Scramble!</h3>
          {state.wordPack === null || state.bannedWords === null ? (
            <i>Loading words...</i>
          ) : (
            <button
              autoFocus
              className={ButtonCSS.button}
              onClick={() => dispatch({ type: "start-game" })}
            >
              Start Game!
            </button>
          )}
          <strong>Word pack to use:</strong>
          <div className={InGameCSS.rowContainer}>
            {Object.keys(state.availableWordPacks).map((name, pack) => (
              <button
                className={ButtonCSS.smallButton}
                onClick={() =>
                  dispatch({ type: "select-pack", wordPackName: name })
                }
              >
                {name}
              </button>
            ))}
          </div>
          <div>
            {state.wordPackName === null
              ? ""
              : "Currently Using Wordpack: " + state.wordPackName}
          </div>
        </div>
      );

    case "in-game":
      return (
        <div className={InGameCSS.container}>
          <h3>Word Scramble!</h3>
          <div>Unscramble this:</div>
          <div>{generateDisplayWord(state.wordScrambled, state.guess)}</div>
          <div className={InGameCSS.inputFieldOverlay}>
            <div className={InGameCSS.inputFieldText}>
              {generateHighlightedGuess(state.guess, state.wordScrambled)}
            </div>
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
          </div>
          <div className={InGameCSS.rowContainer}>
            <button
              className={ButtonCSS.button}
              onClick={() => dispatch({ type: "end-game" })}
            >
              End Game
            </button>
            <button className={ButtonCSS.button} onClick={skipWord}>
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
          <strong>Word pack to use:</strong>
          <div className={InGameCSS.rowContainer}>
            {Object.keys(state.availableWordPacks).map((name, pack) => (
              <button
                className={ButtonCSS.smallButton}
                onClick={() =>
                  dispatch({ type: "select-pack", wordPackName: name })
                }
              >
                {name}
              </button>
            ))}
          </div>
          <div>
            {state.wordPackName === null
              ? ""
              : "Currently Using Wordpack: " + state.wordPackName}
          </div>
        </div>
      );
  }
}

function generateDisplayWord(word: string, alreadyTyped: string) {
  const letters = normalizeString(word).split("");
  let alreadyTypedArray = normalizeString(alreadyTyped).split("");
  const result: React.ReactNode[] = [];

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

  return (
    <div className={LetterCSS.container}>{result.map((elem) => elem)}</div>
  );
}

// function to generate the highlighted text for the guess field
function generateHighlightedGuess(currentGuess: string, word: string) {
  const guess = currentGuess.toUpperCase().split("");
  let wordArray = word.toUpperCase().split("");
  const result: React.ReactNode[] = [];

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

  return (
    <div className={LetterCSS.guessContainer}>
      {result.slice(-20).map((elem) => elem)}
    </div>
  );
}

export default App;
