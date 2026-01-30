/* istanbul ignore next --@preserve */
// Find the greatest precision (1-8) at which two coordinate arrays match
export function maxPrecision(a: any[], b: any[]): number {
  for (let precision = 8; precision >= 1; precision--) {
    const count = compareCoordinates(a, b, precision).length;
    if (count === 0) {
      return precision;
    }
  }
  return -1; // No precision found where all match
}

/* istanbul ignore next --@preserve */
// Helper: compare two numbers up to a given decimal precision (default 6)
function numbersEqual(a: number, b: number, precision = 6) {
  return Number(a.toFixed(precision)) === Number(b.toFixed(precision));
}

/* istanbul ignore next --@preserve */
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

/* istanbul ignore next --@preserve */
// Helper: recursively compare coordinates (numbers only, up to given digits)
export function compareCoordinates(
  a: any,
  b: any,
  precision = 6
): { a: number; b: number }[] {
  function compareRecursive(
    a: any,
    b: any,
    diffs: { a: number; b: number }[] = []
  ): void {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        diffs.push({ a: a.length, b: b.length });
        return;
      }
      for (let i = 0; i < a.length; i++) {
        compareRecursive(a[i], b[i], diffs);
      }
      return;
    }
    // At this point, both should be numbers
    if (!numbersEqual(a, b, precision)) {
      diffs.push({ a, b });
    }
  }
  const diffs: { a: number; b: number }[] = [];
  compareRecursive(a, b, diffs);
  return diffs;
}
