import React from "react";
import "./App.css";
import { JsxAttribute, Statement } from "typescript";
import { json } from "stream/consumers";

type State =
  | { phase: "Pre-Game" }
  | { phase: "In-Game"; goal: string; guess: string }
  | { phase: "Post-Game"; goal: string };

type Action =
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string };

// ######################################################################
// ==================    State Reducer      =============================
// ######################################################################

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start-game":
      return { phase: "In-Game", goal: getRandomWord(), guess: "" };

    case "update-guess":
      if (state.phase !== "In-Game") return state;

      if (state.goal === action.newGuess)
        return { phase: "Post-Game", goal: state.goal };

      return { ...state, guess: action.newGuess };
  }
  return state;
}
// ######################################################################
// ==================     Utilities      ================================
// ######################################################################

function getRandomWord(): string {
  const RANDOMWORDS = [
    "llama",
    "tiger",
    "wildebeest",
    "aardvark",
    "puma",
    "spotted-turtle",
  ];
  return RANDOMWORDS[Math.floor(Math.random() * RANDOMWORDS.length)];
}

function getInitialState(): State {
  return { phase: "Pre-Game" };
}

// ######################################################################
// ==================     App Render     ================================
// ######################################################################

function App() {
  const [state, dispatch] = React.useReducer(reducer, null, getInitialState);

  switch (state.phase) {
    case "Pre-Game":
      return (
        <div>
          <h3>Pre Game!</h3>
          <button onClick={() => dispatch({ type: "start-game" })}>
            Start Game!
          </button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      );

    case "In-Game":
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
    case "Post-Game":
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
