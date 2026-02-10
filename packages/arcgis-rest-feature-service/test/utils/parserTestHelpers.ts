/**
 * Tolerance values for coordinate comparisons.
 * EPSG_4326: Use for latitude/longitude (degrees). ~0.11 mm at equator.
 * EPSG_3857: Use for Web Mercator (meters). 0.1 mm.
 */
export enum CoordinateToleranceEnum {
  /**
   * Tolerance for EPSG:4326 (lat/lon), ~0.11 mm at equator.
   */
  EPSG_4326 = 0.000000001,
  /**
   * Tolerance for EPSG:3857 (Web Mercator), ~0.11 mm at equator.
   */
  EPSG_3857 = 0.0001
}

// Helper: compare two numbers up to a given decimal precision (default 6)
function numbersEqual(a: number, b: number, precision = 6) {
  return Number(a.toFixed(precision)) === Number(b.toFixed(precision));
}

// Helper: compare two properties objects (deep, with number precision up to given digits)
export function compareProperties(
  a: Record<string, any>,
  b: Record<string, any>,
  precision = 6
) {
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  const keysAreDifferent =
    keysA.length !== keysB.length || !keysA.every((k, i) => k === keysB[i]);
  if (keysAreDifferent) {
    return {
      type: "key-mismatch",
      keysA,
      keysB
    };
  }
  const diffs: { key: string; a: any; b: any }[] = [];
  keysA.forEach((key) => {
    const valA = a[key];
    const valB = b[key];
    const bothAreNumbers = typeof valA === "number" && typeof valB === "number";
    const numbersAreNotEqual =
      bothAreNumbers && !numbersEqual(valA, valB, precision);
    const valuesAreNotEqual = !bothAreNumbers && valA !== valB;
    if (numbersAreNotEqual) {
      diffs.push({ key, a: valA, b: valB });
    } else if (valuesAreNotEqual) {
      diffs.push({ key, a: valA, b: valB });
    }
  });
  if (!diffs.length) {
    return true;
  } else {
    return {
      type: "value-mismatch",
      diffs
    };
  }
}

// Helper: recursively compare coordinates (numbers only, up to given digits)
export function compareCoordinates(
  a: any,
  b: any
): { a: number; b: number; diff: number }[] {
  function compareRecursive(
    a: any,
    b: any,
    diffs: { a: number; b: number; diff: number }[] = []
  ): void {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        diffs.push({
          a: a.length,
          b: b.length,
          diff: Math.abs(a.length - b.length)
        });
        return;
      }
      for (let i = 0; i < a.length; i++) {
        compareRecursive(a[i], b[i], diffs);
      }
      return;
    }
    // At this point, both should be numbers
    if (a !== b) {
      diffs.push({ a, b, diff: Math.abs(a - b) });
    }
  }
  const diffs: { a: number; b: number; diff: number }[] = [];
  compareRecursive(a, b, diffs);
  return diffs;
}

export function maxDifference(
  a: any,
  b: any
): { a: number; b: number; diff: number } | null {
  let maxDiffObj: { a: number; b: number; diff: number } | null = null;

  function compareRecursive(a: any, b: any): void {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        const diff = Math.abs(a.length - b.length);
        if (!maxDiffObj || diff > maxDiffObj.diff) {
          maxDiffObj = { a: a.length, b: b.length, diff };
        }
        return;
      }
      for (let i = 0; i < a.length; i++) {
        compareRecursive(a[i], b[i]);
      }
      return;
    }
    // At this point, both should be numbers
    if (a !== b) {
      const diff = Math.abs(a - b);
      if (!maxDiffObj || diff > maxDiffObj.diff) {
        maxDiffObj = { a, b, diff };
      }
    }
  }

  compareRecursive(a, b);
  return maxDiffObj;
}
