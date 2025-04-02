import React from "react";
import "./App.css";
import { Statement } from "typescript";

type State =
  | { phase: "Pre-Game" }
  | { phase: "In-Game"; goal: string; guess: string }
  | { phase: "Post-Game"; goal: string };

type Action =
  | { type: "start-game" }
  | { type: "update-guess"; newGuess: string };

function App() {}

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

function getRandomWord(): string {
  return "llama";
}

export default App;
