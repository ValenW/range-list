import { RangeList } from ".";

describe("range list toString method", () => {
  const rangeList = new RangeList();
  rangeList.add([1, 2]);

  test("add range", () => {
    expect(rangeList.toString()).toBe("[1, 2)");
  });
});

describe("range list print method", () => {
  const rangeList = new RangeList();
  rangeList.add([1, 2]);
  const spyLog = jest.spyOn(console, "log");

  test("add range", () => {
    rangeList.print();
    expect(spyLog).toHaveBeenCalledWith("[1, 2)");
  });
});

describe("range list add method", () => {
  test("add range and merge", () => {
    const rangeList = new RangeList();
    rangeList.add([1, 2]);
    expect(rangeList.toString()).toBe(`[1, 2)`);
    rangeList.add([3, 4]);
    expect(rangeList.toString()).toBe(`[1, 2), [3, 4)`);
    rangeList.add([2, 3]);
    expect(rangeList.toString()).toBe(`[1, 4)`);
  });

  test("add range among existed ranges", () => {
    const rangeList = new RangeList();
    rangeList.add([1, 2]);
    rangeList.add([3, 4]);
    rangeList.add([1, 5]);
    expect(rangeList.toString()).toBe(`[1, 5)`);
  });

  test("add single point and merge", () => {
    const rangeList = new RangeList();
    rangeList.add([1, 1]);
    expect(rangeList.toString()).toBe(`[1, 1]`);
    rangeList.add([1, 2]);
    expect(rangeList.toString()).toBe(`[1, 2)`);
    rangeList.add([2, 2]);
    expect(rangeList.toString()).toBe(`[1, 2]`);
    rangeList.add([3, 3]);
    expect(rangeList.toString()).toBe(`[1, 2], [3, 3]`);
  });
});

describe("range list remove method", () => {
  test("remove on empty range", () => {
    const rangeList = new RangeList();
    rangeList.remove([1, 2]);
    expect(rangeList.toString()).toBe(``);
  });

  test("remove on existed ranges", () => {
    const rangeList = new RangeList();
    rangeList.add([1, 5]);
    rangeList.remove([1, 2]);
    expect(rangeList.toString()).toBe(`[2, 5)`);
    rangeList.remove([3, 4]);
    expect(rangeList.toString()).toBe(`[2, 3), [4, 5)`);
    rangeList.remove([4, 5]);
    expect(rangeList.toString()).toBe(`[2, 3)`);
  });

  test("remove on overlap ranges", () => {
    const rangeList = new RangeList();
    rangeList.add([1, 2]);
    rangeList.add([3, 4]);
    rangeList.remove([1, 4]);
    expect(rangeList.toString()).toBe(``);

    rangeList.add([1, 3]);
    rangeList.add([4, 7]);
    rangeList.remove([2, 5]);
    expect(rangeList.toString()).toBe(`[1, 2), [5, 7)`);

    rangeList.remove([6, 7]);
    expect(rangeList.toString()).toBe(`[1, 2), [5, 6)`);
  });

  test("remove with single point", () => {
    const rangeList = new RangeList();
    rangeList.add([1, 5]);
    expect(rangeList.toString()).toBe(`[1, 5)`);
    rangeList.remove([2, 2]);
    expect(rangeList.toString()).toBe(`[1, 2), (2, 5)`);

    rangeList.remove([1, 1]);
    expect(rangeList.toString()).toBe(`(1, 2), (2, 5)`);
    rangeList.add([5, 5]);
    expect(rangeList.toString()).toBe(`(1, 2), (2, 5]`);
    rangeList.remove([5, 5]);
    expect(rangeList.toString()).toBe(`(1, 2), (2, 5)`);
  });
});
