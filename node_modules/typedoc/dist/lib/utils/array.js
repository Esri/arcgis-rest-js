"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatMap = exports.filterMap = exports.zip = exports.toArray = exports.uniqueByEquals = exports.partition = exports.unique = exports.removeIf = exports.removeIfPresent = exports.binaryFindPartition = exports.insertPrioritySorted = void 0;
/**
 * Inserts an item into an array sorted by priority. If two items have the same priority,
 * the item will be inserted later will be placed earlier in the array.
 * @param arr modified by inserting item.
 * @param item
 */
function insertPrioritySorted(arr, item) {
    const index = binaryFindPartition(arr, (v) => v.priority >= item.priority);
    arr.splice(index === -1 ? arr.length : index, 0, item);
    return arr;
}
exports.insertPrioritySorted = insertPrioritySorted;
/**
 * Performs a binary search of a given array, returning the index of the first item
 * for which `partition` returns true. Returns the -1 if there are no items in `arr`
 * such that `partition(item)` is true.
 * @param arr
 * @param partition should return true while less than the partition point.
 */
function binaryFindPartition(arr, partition) {
    if (arr.length === 0) {
        return -1;
    }
    let low = 0, high = arr.length - 1;
    while (high > low) {
        const mid = low + Math.floor((high - low) / 2);
        if (partition(arr[mid])) {
            high = mid;
        }
        else {
            low = mid + 1;
        }
    }
    return partition(arr[low]) ? low : -1;
}
exports.binaryFindPartition = binaryFindPartition;
/**
 * Removes an item from the array if the array exists and the item is included
 * within it.
 * @param arr
 * @param item
 */
function removeIfPresent(arr, item) {
    if (!arr) {
        return;
    }
    const index = arr.indexOf(item);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}
exports.removeIfPresent = removeIfPresent;
/**
 * Remove items in an array which match a predicate.
 * @param arr
 * @param predicate
 */
function removeIf(arr, predicate) {
    const indices = filterMap(arr, (item, index) => predicate(item) ? index : void 0);
    for (const index of indices.reverse()) {
        arr.splice(index, 1);
    }
}
exports.removeIf = removeIf;
/**
 * Filters out duplicate values from the given iterable.
 * @param arr
 */
function unique(arr) {
    return Array.from(new Set(arr));
}
exports.unique = unique;
function partition(iter, predicate) {
    const left = [];
    const right = [];
    for (const item of iter) {
        if (predicate(item)) {
            left.push(item);
        }
        else {
            right.push(item);
        }
    }
    return [left, right];
}
exports.partition = partition;
/**
 * Filters out duplicate values from the given array with a custom equals check.
 * @param arr
 */
function uniqueByEquals(arr) {
    const result = [];
    for (const item of arr !== null && arr !== void 0 ? arr : []) {
        if (result.every((other) => !other.equals(item))) {
            result.push(item);
        }
    }
    return result;
}
exports.uniqueByEquals = uniqueByEquals;
/**
 * Ensures the given item is an array.
 * @param item
 */
function toArray(item) {
    if (item === void 0) {
        return [];
    }
    return Array.isArray(item) ? [...item] : [item];
}
exports.toArray = toArray;
function* zip(...args) {
    const iterators = args.map((x) => x[Symbol.iterator]());
    while (true) {
        const next = iterators.map((i) => i.next());
        if (next.some((v) => v.done)) {
            break;
        }
        yield next.map((v) => v.value);
    }
}
exports.zip = zip;
function filterMap(arr, fn) {
    const result = [];
    arr.forEach((item, index) => {
        const newItem = fn(item, index);
        if (newItem !== void 0) {
            result.push(newItem);
        }
    });
    return result;
}
exports.filterMap = filterMap;
function flatMap(arr, fn) {
    const result = [];
    for (const item of arr) {
        const newItem = fn(item);
        if (newItem instanceof Array) {
            result.push(...newItem);
        }
        else {
            result.push(newItem);
        }
    }
    return result;
}
exports.flatMap = flatMap;
