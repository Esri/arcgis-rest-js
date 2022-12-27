const EventEmitter = require("promise-events");
const { identity } = require("lodash");
const debug = require("debug")("msr:synchronizer");

/**
 * Cross-packages synchronization context.
 * @typedef Synchronizer
 * @param {EventEmitter} ee Shared event emitter class.
 * @param {Function} todo Gets the list of packages which are still todo
 * @param {Function} once Memoized event subscriber.
 * @param {Function} emit Memoized event emitter.
 * @params {Function} waitFor Function returns a promise that waits until the package has target probe value.
 * @params {Function} waitForAll Function returns a promise that waits until all the packages have the same target probe value.
 */

/**
 * Creates shared signal bus and its assets.
 * @param {Package[]} packages The multi-semantic-release context.
 * @returns {Synchronizer} Shared sync assets.
 */
const getSynchronizer = (packages) => {
	const ee = new EventEmitter();
	const getEventName = (probe, pkg) => `${probe}${pkg ? ":" + pkg.name : ""}`;

	// List of packages which are still todo (don't yet have a result).
	const todo = () => packages.filter((p) => p.result === undefined);

	// Emitter with memo: next subscribers will receive promises from the past if exists.
	const store = {
		evt: {},
		subscr: {},
	};

	const emit = (probe, pkg) => {
		const name = getEventName(probe, pkg);
		debug("ready: %s", name);

		return store.evt[name] || (store.evt[name] = ee.emit(name));
	};

	const once = (probe, pkg) => {
		const name = getEventName(probe, pkg);
		return store.evt[name] || store.subscr[name] || (store.subscr[name] = ee.once(name));
	};

	const waitFor = (probe, pkg) => {
		const name = getEventName(probe, pkg);
		return pkg[name] || (pkg[name] = once(probe, pkg));
	};

	// Status sync point.
	const waitForAll = (probe, filter = identity) => {
		const promise = once(probe);
		const awaitedPkgs = todo().filter(filter);

		if (awaitedPkgs.every((p) => p.hasOwnProperty(probe))) {
			awaitedPkgs.length && debug("ready: %s", probe);
			emit(probe);
		}

		return promise;
	};

	// Only the first lucky package passes the probe.
	const getLucky = (probe, pkg) => {
		if (getLucky[probe]) {
			return;
		}
		const name = getEventName(probe, pkg);
		debug("lucky: %s", name);

		getLucky[probe] = emit(probe, pkg);
	};

	return {
		ee,
		emit,
		once,
		todo,
		waitFor,
		waitForAll,
		getLucky,
	};
};

module.exports = getSynchronizer;
