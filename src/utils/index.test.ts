import { findFirstIndexFromSorted } from ".";

const array = [1, 2, 3, 4, 5];
describe("findFirstIndexFromSorted function", () => {
  test("first higher than 1", () => {
    expect(findFirstIndexFromSorted(array, (n) => n > 1)).toBe(1);
  });

  test("first higher than 3", () => {
    expect(findFirstIndexFromSorted(array, (n) => n > 3)).toBe(3);
  });

  test("first higher than 5", () => {
    expect(findFirstIndexFromSorted(array, (n) => n > 5)).toBe(5);
  });

  test("first higher than 100", () => {
    expect(findFirstIndexFromSorted(array, (n) => n > 100)).toBe(5);
  });

  test("first higher than -100", () => {
    expect(findFirstIndexFromSorted(array, (n) => n > -100)).toBe(0);
  });
});
