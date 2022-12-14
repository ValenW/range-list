/**
 * get the first index that predict(array[index]) return true,
 * assume the result of `predict(array[i])` will always false for i < index,
 * and always true for i >= index
 * @param array find target array
 * @param predict judge function
 * @returns the first index that predict(array) return true
 */
export const findFirstIndexFromSorted = <T>(
  array: T[],
  predict: (item: T) => boolean
): number => {
  let left = 0,
    right = array.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (predict(array[mid])) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
};
