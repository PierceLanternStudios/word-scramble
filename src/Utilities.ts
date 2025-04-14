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

/**
 * tryRemoveElement
 * @param array  An array of strings to try to remove an item from
 * @param elem   An element to try and remove from the array. Assumes no
 *               duplicate words in the array.
 * @returns      An array with the specified element removed, or the original array
 *               if the input is not found.
 */
export function tryRemoveElement(array: string[], elem: string): string[] {
  array = quickRemove(array, array.indexOf(elem));
  return array;
}

/**
 * quickRemove
 * @param array  An array of strings to quickly remove an item from
 * @param idx    An index in the array to remove the item from. If this index
 *               out-of-bounds, will return the original array.
 * @returns      An array with the specified index removed, or the original array
 *               if the input is invalid.
 */
export function quickRemove(array: string[], idx: number): string[] {
  if (idx >= array.length || idx < 0) return array;
  if (array.length === 1) return [];
  arraySwapWithLast(array, idx);
  array.pop();
  return array;
}

/**
 *                arraySwapWithLast
 * @param array   An array of strings in which to perform the swap
 * @param idx     The index with which to swap the last element. If this index is
 *                out of bounds or the array has size < 2, the function will
 *                return the original array.
 * @returns       A new array with the specified index swapped with the last
 *                element, or the original array if the inputs were invalid.
 */
function arraySwapWithLast(array: string[], idx: number): string[] {
  if (idx >= array.length || array.length < 2) return array;
  const temp = array[array.length - 1];
  array[array.length - 1] = array[idx];
  array[idx] = temp;
  return array;
}
