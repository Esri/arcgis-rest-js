/* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);

const edgeIntersectsEdge = (a1, a2, b1, b2) => {
  var uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
  var ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
  var uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

  if (uB !== 0) {
    var ua = uaT / uB;
    var ub = ubT / uB;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return true;
    }
  }

  return false;
};

export const arraysIntersectArrays = (a, b) => {
  if (isNumber(a[0][0])) {
    if (isNumber(b[0][0])) {
      for (var i = 0; i < a.length - 1; i++) {
        for (var j = 0; j < b.length - 1; j++) {
          if (edgeIntersectsEdge(a[i], a[i + 1], b[j], b[j + 1])) {
            return true;
          }
        }
      }
    } else {
      for (var k = 0; k < b.length; k++) {
        if (arraysIntersectArrays(a, b[k])) {
          return true;
        }
      }
    }
  } else {
    for (var l = 0; l < a.length; l++) {
      if (arraysIntersectArrays(a[l], b)) {
        return true;
      }
    }
  }
  return false;
};

export const coordinatesContainPoint = (coordinates, point) => {
  let contains = false;
  for (let i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
    if (((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
         (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
        (point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0])) {
      contains = !contains;
    }
  }
  return contains;
};

export const pointsEqual = (a, b) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};

export const arrayIntersectsArray = (a, b) => {
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < b.length - 1; j++) {
      if (edgeIntersectsEdge(a[i], a[i + 1], b[j], b[j + 1])) {
        return true;
      }
    }
  }
  return false;
};
