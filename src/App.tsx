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

function reducer(state: State, action: Action) {}

export default App;
