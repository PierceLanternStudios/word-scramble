import { useEffect, type Dispatch } from "react";
import { type Action } from "./useAppState";
import { normalizeString } from "./Normalization";

export default function useLoadBans(dispatch: Dispatch<Action>): void {
  useEffect(() => {
    fetch("https://unpkg.com/naughty-words@1.2.0/en.json").then((response) =>
      response.json().then((bannedWords) =>
        dispatch({
          type: "load-bans",
          bannedWords: bannedWords.map(normalizeString).filter(Boolean),
        })
      )
    );
  }, [dispatch]);
}
