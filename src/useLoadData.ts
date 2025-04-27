import { type Dispatch, useEffect } from "react";
import { type Action } from "./useAppState";
import { normalizeString } from "./Normalization";
import { WORDPACKS } from "./WordPacks";

export default function useLoadData(dispatch: Dispatch<Action>): void {
  useEffect(() => {
    Object.entries(WORDPACKS).map(([name, path]) => {
      fetch(process.env.PUBLIC_URL + path)
        .then((response) => response.text())
        .then((text) => {
          setTimeout(() => {
            dispatch({
              type: "load-data",
              wordPackName: name,
              wordPack: text
                .split("\n")
                .map(normalizeString)
                .filter(Boolean)
                .filter((elem, idx, self) => self.indexOf(elem) === idx),
            });
          }, 300);
        });
    });
  }, [dispatch]);
}
