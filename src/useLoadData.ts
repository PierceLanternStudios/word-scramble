import { type Dispatch, useEffect } from "react";
import { type Action } from "./useAppState";
import { normalizeString } from "./Normalization";

export default function useLoadData(
  dispatch: Dispatch<Action>,
  wordPackName: string
): void {
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/" + wordPackName)
      .then((response) => response.text())
      .then((text) => {
        setTimeout(() => {
          dispatch({
            type: "load-data",
            wordPackName: wordPackName,
            wordPack: text
              .split("\n")
              .map(normalizeString)
              .filter(Boolean)
              .filter((elem, idx, self) => self.indexOf(elem) === idx),
          });
        }, 1000);
      });
  }, [dispatch]);
}
