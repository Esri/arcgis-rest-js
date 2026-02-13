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
export function compareKeysAndValues(
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

// This function takes in two nested arrays of corresponding coordinates and returns the set with the maximum divergence between corresponding pairs.
export function maxDifference(
  a: any,
  b: any
): { a: number; b: number; diff: number } | null {
  let maxDiffObj: { a: number; b: number; diff: number } | null = null;
  function compareRecursive(a: any, b: any): void {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        throw new Error("Array lengths differ");
      }
      for (let i = 0; i < a.length; i++) {
        compareRecursive(a[i], b[i]);
      }
      return;
    }
    if (typeof a !== typeof b) {
      throw new Error("Type mismatch in structure");
    }
    if (typeof a === "number" && a !== b) {
      const diff = Math.abs(a - b);
      if (!maxDiffObj || diff > maxDiffObj.diff) {
        maxDiffObj = { a, b, diff };
      }
    }
    // For non-number types, only allow strict equality
    if (typeof a !== "number" && a !== b) {
      throw new Error("Value mismatch for non-number type");
    }
  }
  compareRecursive(a, b);
  return maxDiffObj;
}
