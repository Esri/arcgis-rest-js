const {RE_WS, parseObject} = require('./utils');

const fanotifyFlagsMap = new Map([
	['event-flags', (obj, v) => obj.eventFlags = parseInt(v, 16)],
]);

const fanotifyMarkMap = new Map([
	['sdev', (obj, v) => obj.devId = parseInt(v, 16)],
	['mask', (obj, v) => obj.mask = parseInt(v, 16)],
	['ignored_mask', (obj, v) => obj.ignoredMask = parseInt(v, 16)],
	['mflags', (obj, v) => obj.flags = parseInt(v, 16)],
]);

const inotifyFileMap = new Map([
	['ino', (obj, v) => obj.inode = parseInt(v, 16)],
	['sdev', (obj, v) => obj.devId = parseInt(v, 16)],
	['mask', (obj, v) => obj.mask = parseInt(v, 16)],
	['ignored_mask', (obj, v) => obj.ignoredMask = parseInt(v, 16)],
]);

const RE_TIMER_VALUE = /\((\d+),\s(\d+)\)/;
const parseTimerValue = src => {
	let m = RE_TIMER_VALUE.exec(src);
	return [parseInt(m[1]), parseInt(m[2])];
};

const fdinfoMap = new Map([
	['pos', (obj, v) => obj.position = parseInt(v)],
	['mnt_id', (obj, v) => obj.mountId = parseInt(v)],
	['flags', (obj, v) => obj.flags = parseInt(v, 8)],
	['eventfd-count', (obj, v) => {
		obj.type = 'event';
		obj.eventCounter = parseInt(v, 16);
	}],
	['tfd', (obj, v) => {
		obj.type = 'epoll';
		if (obj.epollCounters === undefined) {
			obj.epollCounters = [];
		}
		let ps = v.trim().split(RE_WS);
		obj.epollCounters.push({
			fd: parseInt(ps[0]),
			mask: parseInt(ps[2], 16),
		});
	}],
	['sigmask', (obj, v) => {
		obj.type = 'signal';
		obj.signalMask = parseInt(v.substr(v.length - 1), 16);
		obj.rtSignalMask = (v.length === 16) ? parseInt(v.substr(0, 8), 16) : 0;
	}],
	['inotify wd', (obj, v) => {
		obj.type = 'inotify';
		if (obj.inotifyFiles === undefined) {
			obj.inotifyFiles = [];
		}
		let ps = v.trim().split(' ');
		let wd = parseInt(ps.shift());
		obj.inotifyFiles.push(parseObject(ps, inotifyFileMap, {wd}));
	}],
	['fanotify flags', (obj, v) => {
		obj.type = 'fanotify';
		if (obj.fanotifyMarks === undefined) {
			obj.fanotifyMarks = [];
		}
		let ps = v.trim().split(' ');
		let flags = parseInt(ps.shift(), 8);
		let other = parseObject(ps, fanotifyFlagsMap);
		obj.fanotifyFlags = flags;
		obj.fanotifyEventFlags = other.eventFlags;
	}],
	['fanotify ino', (obj, v) => {
		obj.type = 'fanotify';
		if (obj.fanotifyMarks === undefined) {
			obj.fanotifyMarks = [];
		}
		let ps = v.trim().split(' ');
		let inode = parseInt(ps.shift(), 16);
		obj.fanotifyMarks.push(parseObject(ps, fanotifyMarkMap, {inode}));
	}],
	['clockid', (obj, v) => {
		obj.type = 'timer';
		obj.timerClockId = parseInt(v);
	}],
	['ticks', (obj, v) => {
		obj.type = 'timer';
		obj.timerTicks = parseInt(v);
	}],
	['settime flags', (obj, v) => {
		obj.type = 'timer';
		obj.timerSettimeFlags = parseInt(v, 8);
	}],
	['it_value', (obj, v) => {
		obj.type = 'timer';
		obj.timerValue = parseTimerValue(v);
	}],
	['it_interval', (obj, v) => {
		obj.type = 'timer';
		obj.timerInterval = parseTimerValue(v);
	}],
]);

module.exports = src => parseObject(src, fdinfoMap, {
	type: 'regular',
	position: 0,
	mountId: 0,
});
