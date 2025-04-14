import { type Dispatch, useEffect } from "react";
import { type Action } from "./useAppState";
import { normalizeString } from "./Normalization";

export default function useLoadData(dispatch: Dispatch<Action>): void {
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/animals.txt")
      .then((response) => response.text())
      .then((text) => {
        setTimeout(() => {
          dispatch({
            type: "load-data",
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
