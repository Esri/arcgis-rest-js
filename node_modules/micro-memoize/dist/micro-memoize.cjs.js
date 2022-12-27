'use strict';

/**
 * @constant DEFAULT_OPTIONS_KEYS the default options keys
 */
var DEFAULT_OPTIONS_KEYS = {
    isEqual: true,
    isMatchingKey: true,
    isPromise: true,
    maxSize: true,
    onCacheAdd: true,
    onCacheChange: true,
    onCacheHit: true,
    transformKey: true,
};
/**
 * @function slice
 *
 * @description
 * slice.call() pre-bound
 */
var slice = Array.prototype.slice;
/**
 * @function cloneArray
 *
 * @description
 * clone the array-like object and return the new array
 *
 * @param arrayLike the array-like object to clone
 * @returns the clone as an array
 */
function cloneArray(arrayLike) {
    var length = arrayLike.length;
    if (!length) {
        return [];
    }
    if (length === 1) {
        return [arrayLike[0]];
    }
    if (length === 2) {
        return [arrayLike[0], arrayLike[1]];
    }
    if (length === 3) {
        return [arrayLike[0], arrayLike[1], arrayLike[2]];
    }
    return slice.call(arrayLike, 0);
}
/**
 * @function getCustomOptions
 *
 * @description
 * get the custom options on the object passed
 *
 * @param options the memoization options passed
 * @returns the custom options passed
 */
function getCustomOptions(options) {
    var customOptions = {};
    /* eslint-disable no-restricted-syntax */
    for (var key in options) {
        if (!DEFAULT_OPTIONS_KEYS[key]) {
            customOptions[key] = options[key];
        }
    }
    /* eslint-enable */
    return customOptions;
}
/**
 * @function isMemoized
 *
 * @description
 * is the function passed already memoized
 *
 * @param fn the function to test
 * @returns is the function already memoized
 */
function isMemoized(fn) {
    return (typeof fn === 'function' &&
        fn.isMemoized);
}
/**
 * @function isSameValueZero
 *
 * @description
 * are the objects equal based on SameValueZero equality
 *
 * @param object1 the first object to compare
 * @param object2 the second object to compare
 * @returns are the two objects equal
 */
function isSameValueZero(object1, object2) {
    // eslint-disable-next-line no-self-compare
    return object1 === object2 || (object1 !== object1 && object2 !== object2);
}
/**
 * @function mergeOptions
 *
 * @description
 * merge the options into the target
 *
 * @param existingOptions the options provided
 * @param newOptions the options to include
 * @returns the merged options
 */
function mergeOptions(existingOptions, newOptions) {
    // @ts-ignore
    var target = {};
    /* eslint-disable no-restricted-syntax */
    for (var key in existingOptions) {
        target[key] = existingOptions[key];
    }
    for (var key in newOptions) {
        target[key] = newOptions[key];
    }
    /* eslint-enable */
    return target;
}

// utils
var Cache = /** @class */ (function () {
    function Cache(options) {
        this.keys = [];
        this.values = [];
        this.options = options;
        var isMatchingKeyFunction = typeof options.isMatchingKey === 'function';
        if (isMatchingKeyFunction) {
            this.getKeyIndex = this._getKeyIndexFromMatchingKey;
        }
        else if (options.maxSize > 1) {
            this.getKeyIndex = this._getKeyIndexForMany;
        }
        else {
            this.getKeyIndex = this._getKeyIndexForSingle;
        }
        this.canTransformKey = typeof options.transformKey === 'function';
        this.shouldCloneArguments = this.canTransformKey || isMatchingKeyFunction;
        this.shouldUpdateOnAdd = typeof options.onCacheAdd === 'function';
        this.shouldUpdateOnChange = typeof options.onCacheChange === 'function';
        this.shouldUpdateOnHit = typeof options.onCacheHit === 'function';
    }
    Object.defineProperty(Cache.prototype, "size", {
        get: function () {
            return this.keys.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cache.prototype, "snapshot", {
        get: function () {
            return {
                keys: cloneArray(this.keys),
                size: this.size,
                values: cloneArray(this.values),
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @function _getKeyIndexFromMatchingKey
     *
     * @description
     * gets the matching key index when a custom key matcher is used
     *
     * @param keyToMatch the key to match
     * @returns the index of the matching key, or -1
     */
    Cache.prototype._getKeyIndexFromMatchingKey = function (keyToMatch) {
        var _a = this.options, isMatchingKey = _a.isMatchingKey, maxSize = _a.maxSize;
        var keys = this.keys;
        var keysLength = keys.length;
        if (!keysLength) {
            return -1;
        }
        if (isMatchingKey(keys[0], keyToMatch)) {
            return 0;
        }
        if (maxSize > 1) {
            for (var index = 1; index < keysLength; index++) {
                if (isMatchingKey(keys[index], keyToMatch)) {
                    return index;
                }
            }
        }
        return -1;
    };
    /**
     * @function _getKeyIndexForMany
     *
     * @description
     * gets the matching key index when multiple keys are used
     *
     * @param keyToMatch the key to match
     * @returns the index of the matching key, or -1
     */
    Cache.prototype._getKeyIndexForMany = function (keyToMatch) {
        var isEqual = this.options.isEqual;
        var keys = this.keys;
        var keysLength = keys.length;
        if (!keysLength) {
            return -1;
        }
        if (keysLength === 1) {
            return this._getKeyIndexForSingle(keyToMatch);
        }
        var keyLength = keyToMatch.length;
        var existingKey;
        var argIndex;
        if (keyLength > 1) {
            for (var index = 0; index < keysLength; index++) {
                existingKey = keys[index];
                if (existingKey.length === keyLength) {
                    argIndex = 0;
                    for (; argIndex < keyLength; argIndex++) {
                        if (!isEqual(existingKey[argIndex], keyToMatch[argIndex])) {
                            break;
                        }
                    }
                    if (argIndex === keyLength) {
                        return index;
                    }
                }
            }
        }
        else {
            for (var index = 0; index < keysLength; index++) {
                existingKey = keys[index];
                if (existingKey.length === keyLength &&
                    isEqual(existingKey[0], keyToMatch[0])) {
                    return index;
                }
            }
        }
        return -1;
    };
    /**
     * @function _getKeyIndexForSingle
     *
     * @description
     * gets the matching key index when a single key is used
     *
     * @param keyToMatch the key to match
     * @returns the index of the matching key, or -1
     */
    Cache.prototype._getKeyIndexForSingle = function (keyToMatch) {
        var keys = this.keys;
        if (!keys.length) {
            return -1;
        }
        var existingKey = keys[0];
        var length = existingKey.length;
        if (keyToMatch.length !== length) {
            return -1;
        }
        var isEqual = this.options.isEqual;
        if (length > 1) {
            for (var index = 0; index < length; index++) {
                if (!isEqual(existingKey[index], keyToMatch[index])) {
                    return -1;
                }
            }
            return 0;
        }
        return isEqual(existingKey[0], keyToMatch[0]) ? 0 : -1;
    };
    /**
     * @function orderByLru
     *
     * @description
     * order the array based on a Least-Recently-Used basis
     *
     * @param key the new key to move to the front
     * @param value the new value to move to the front
     * @param startingIndex the index of the item to move to the front
     */
    Cache.prototype.orderByLru = function (key, value, startingIndex) {
        var keys = this.keys;
        var values = this.values;
        var currentLength = keys.length;
        var index = startingIndex;
        while (index--) {
            keys[index + 1] = keys[index];
            values[index + 1] = values[index];
        }
        keys[0] = key;
        values[0] = value;
        var maxSize = this.options.maxSize;
        if (currentLength === maxSize && startingIndex === currentLength) {
            keys.pop();
            values.pop();
        }
        else if (startingIndex >= maxSize) {
            // eslint-disable-next-line no-multi-assign
            keys.length = values.length = maxSize;
        }
    };
    /**
     * @function updateAsyncCache
     *
     * @description
     * update the promise method to auto-remove from cache if rejected, and
     * if resolved then fire cache hit / changed
     *
     * @param memoized the memoized function
     */
    Cache.prototype.updateAsyncCache = function (memoized) {
        var _this = this;
        var _a = this.options, onCacheChange = _a.onCacheChange, onCacheHit = _a.onCacheHit;
        var firstKey = this.keys[0];
        var firstValue = this.values[0];
        this.values[0] = firstValue.then(function (value) {
            if (_this.shouldUpdateOnHit) {
                onCacheHit(_this, _this.options, memoized);
            }
            if (_this.shouldUpdateOnChange) {
                onCacheChange(_this, _this.options, memoized);
            }
            return value;
        }, function (error) {
            var keyIndex = _this.getKeyIndex(firstKey);
            if (keyIndex !== -1) {
                _this.keys.splice(keyIndex, 1);
                _this.values.splice(keyIndex, 1);
            }
            throw error;
        });
    };
    return Cache;
}());

// cache
function createMemoizedFunction(fn, options) {
    if (options === void 0) { options = {}; }
    if (isMemoized(fn)) {
        return createMemoizedFunction(fn.fn, mergeOptions(fn.options, options));
    }
    if (typeof fn !== 'function') {
        throw new TypeError('You must pass a function to `memoize`.');
    }
    var _a = options.isEqual, isEqual = _a === void 0 ? isSameValueZero : _a, isMatchingKey = options.isMatchingKey, _b = options.isPromise, isPromise = _b === void 0 ? false : _b, _c = options.maxSize, maxSize = _c === void 0 ? 1 : _c, onCacheAdd = options.onCacheAdd, onCacheChange = options.onCacheChange, onCacheHit = options.onCacheHit, transformKey = options.transformKey;
    var normalizedOptions = mergeOptions({
        isEqual: isEqual,
        isMatchingKey: isMatchingKey,
        isPromise: isPromise,
        maxSize: maxSize,
        onCacheAdd: onCacheAdd,
        onCacheChange: onCacheChange,
        onCacheHit: onCacheHit,
        transformKey: transformKey,
    }, getCustomOptions(options));
    var cache = new Cache(normalizedOptions);
    var keys = cache.keys, values = cache.values, canTransformKey = cache.canTransformKey, shouldCloneArguments = cache.shouldCloneArguments, shouldUpdateOnAdd = cache.shouldUpdateOnAdd, shouldUpdateOnChange = cache.shouldUpdateOnChange, shouldUpdateOnHit = cache.shouldUpdateOnHit;
    // @ts-ignore
    var memoized = function memoized() {
        // @ts-ignore
        var key = shouldCloneArguments
            ? cloneArray(arguments)
            : arguments;
        if (canTransformKey) {
            key = transformKey(key);
        }
        var keyIndex = keys.length ? cache.getKeyIndex(key) : -1;
        if (keyIndex !== -1) {
            if (shouldUpdateOnHit) {
                onCacheHit(cache, normalizedOptions, memoized);
            }
            if (keyIndex) {
                cache.orderByLru(keys[keyIndex], values[keyIndex], keyIndex);
                if (shouldUpdateOnChange) {
                    onCacheChange(cache, normalizedOptions, memoized);
                }
            }
        }
        else {
            var newValue = fn.apply(this, arguments);
            var newKey = shouldCloneArguments
                ? key
                : cloneArray(arguments);
            cache.orderByLru(newKey, newValue, keys.length);
            if (isPromise) {
                cache.updateAsyncCache(memoized);
            }
            if (shouldUpdateOnAdd) {
                onCacheAdd(cache, normalizedOptions, memoized);
            }
            if (shouldUpdateOnChange) {
                onCacheChange(cache, normalizedOptions, memoized);
            }
        }
        return values[0];
    };
    memoized.cache = cache;
    memoized.fn = fn;
    memoized.isMemoized = true;
    memoized.options = normalizedOptions;
    return memoized;
}

module.exports = createMemoizedFunction;
//# sourceMappingURL=micro-memoize.cjs.js.map
