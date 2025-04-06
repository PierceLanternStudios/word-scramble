// A collection place for utilities in case more odds-and-ends come up

// function to take an input and a string and a number of those "things",
// and return a (potentially) pluralized version of that string. Useful
// if you have, for example 5 : egg and you want to return the string "5 eggs"
export function pluralize(input: string, occurences: number) {
  return occurences === 1
    ? occurences.toString() + " " + input
    : input.at(-1) === "s"
    ? occurences.toString() + " " + input + "es"
    : occurences.toString() + " " + input + "s";
}
