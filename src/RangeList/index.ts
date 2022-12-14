import { findFirstIndexFromSorted } from "@utils";

interface RangePoint {
  n: number;
  include: boolean;
}
interface NumberRange {
  start: RangePoint;
  end: RangePoint;
}

export class RangeList {
  #sortedRanges: NumberRange[] = [];

  static #getRangeFromTuple(tuple: [number, number]): NumberRange {
    return {
      start: { n: tuple[0], include: true },
      end: { n: tuple[1], include: tuple[0] === tuple[1] },
    };
  }
  static #isRangeExist(range: NumberRange): boolean {
    return (
      range.start.n < range.end.n ||
      (range.start.n === range.end.n &&
        range.start.include &&
        range.end.include)
    );
  }
  static #getMin(
    a: RangePoint,
    b: RangePoint,
    includeIfPossible: boolean = true
  ): RangePoint {
    if (a.n !== b.n) return a.n < b.n ? a : b;
    if (includeIfPossible) return a.include ? a : b;
    return a.include ? b : a;
  }
  static #getMax(a: RangePoint, b: RangePoint): RangePoint {
    if (a.n !== b.n) return a.n > b.n ? a : b;
    return a.include ? a : b;
  }

  #merge(ranges: NumberRange[], range: NumberRange): NumberRange[] {
    if (!ranges.length) {
      return [range];
    }
    if (!RangeList.#isRangeExist(range)) {
      return ranges;
    }
    return [
      {
        start: RangeList.#getMin(ranges[0].start, range.start),
        end: RangeList.#getMax(ranges[ranges.length - 1].end, range.end),
      },
    ];
  }

  #remove(ranges: NumberRange[], range: NumberRange): NumberRange[] {
    if (!ranges.length) {
      return [];
    }
    if (!RangeList.#isRangeExist(range)) {
      return ranges;
    }

    const removed: NumberRange[] = [];
    if (ranges[0].start.n < range.start.n) {
      removed.push({
        start: ranges[0].start,
        end: { n: range.start.n, include: !range.start.include },
      });
    } else if (
      ranges[0].start.n === range.start.n &&
      ranges[0].start.include &&
      !range.start.include
    ) {
      removed.push({
        start: { n: range.start.n, include: true },
        end: { n: range.start.n, include: true },
      });
    }

    if (ranges[ranges.length - 1].end.n > range.end.n) {
      removed.push({
        start: { n: range.end.n, include: !range.end.include },
        end: ranges[ranges.length - 1].end,
      });
    } else if (
      ranges[ranges.length - 1].end.n === range.end.n &&
      ranges[ranges.length - 1].end.include &&
      !range.end.include
    ) {
      removed.push({
        start: { n: range.end.n, include: true },
        end: { n: range.end.n, include: true },
      });
    }
    return removed;
  }

  #getUpdateIndexRange(updateRange: NumberRange): [number, number] {
    return [
      findFirstIndexFromSorted(
        this.#sortedRanges,
        // range.end >= updateRange.start
        (range) =>
          range.end.n > updateRange.start.n ||
          (range.end.n === updateRange.start.n &&
            (range.end.include || updateRange.start.include))
      ),
      findFirstIndexFromSorted(
        this.#sortedRanges,
        // range.start > updateRange.end
        (range) =>
          range.start.n > updateRange.end.n ||
          (range.start.n === updateRange.end.n &&
            !range.start.include &&
            !updateRange.end.include)
      ),
    ];
  }

  /**
   * Adds a range to the list
   * @param {[number, number]} tuple - Array of two integers that specify beginning and end of range.
   */
  add(tuple: [number, number]) {
    const range = RangeList.#getRangeFromTuple(tuple);
    const [start, end] = this.#getUpdateIndexRange(range);
    this.#sortedRanges.splice(
      start,
      end - start,
      ...this.#merge(this.#sortedRanges.slice(start, end), range)
    );
  }

  /**
   * Removes a range from the list
   * @param {[number, number]} tuple - Array of two integers that specify beginning and end of range.
   */
  remove(tuple: [number, number]) {
    const range = RangeList.#getRangeFromTuple(tuple);
    const [start, end] = this.#getUpdateIndexRange(range);
    this.#sortedRanges.splice(
      start,
      end - start,
      ...this.#remove(this.#sortedRanges.slice(start, end), range)
    );
  }

  /**
   * convert the range list to string display like `[1,2), [3, 4)`
   */
  toString(): string {
    return this.#sortedRanges
      .map(
        (range) =>
          `${range.start.include ? "[" : "("}${range.start.n}, ` +
          `${range.end.n}${range.end.include ? "]" : ")"}`
      )
      .join(", ");
  }

  /**
   * Prints out the list of ranges in the range list
   */
  print() {
    console.log(this.toString());
  }
}
