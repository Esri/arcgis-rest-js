const {parseObject, splitTwo, RE_WS} = require('./utils');

const parseInts = v => {
	let ps = v.split(RE_WS);
	return ps.map(p => parseInt(p));
};

const statusMap = new Map([
	['Umask', (obj, v) => obj.umask = parseInt(v, 8)],
	['Groups', (obj, v) => {
		let groups = v.split(' ');
		for (let i = 0; i < groups.length; i++) {
			groups[i] = parseInt(groups[i]);
		}
		obj.groups = groups;
	}],
	['SigQ', (obj, v) => {
		let pair = splitTwo(v, '/');
		obj.signalsQueued = parseInt(pair.left);
		obj.signalsQueuedLimit = parseInt(pair.right);
	}],
	['Uid', (obj, v) => {
		let ps = v.split(RE_WS);
		obj.uidReal = parseInt(ps[0]);
		obj.uidEffective = parseInt(ps[1]);
		obj.uidSavedSet = parseInt(ps[2]);
		obj.uidFilesystem = parseInt(ps[3]);
	}],
	['Gid', (obj, v) => {
		let ps = v.split(RE_WS);
		obj.gidReal = parseInt(ps[0]);
		obj.gidEffective = parseInt(ps[1]);
		obj.gidSavedSet = parseInt(ps[2]);
		obj.gidFilesystem = parseInt(ps[3]);
	}],
	['Mems_allowed', (obj, v) => obj.memoriesAllowedMask = parseInt(v, 16)],
	['Cpus_allowed', (obj, v) => obj.cpusAllowedMask = parseInt(v, 16)],
	['Name', (obj, v) => obj.name = v],
	['Speculation_Store_Bypass', (obj, v) => obj.speculationStoreBypass = v],
	['State', (obj, v) => obj.state = v[0]],
	['SigPnd', (obj, v) => obj.signalsPending = parseInt(v, 16)],
	['ShdPnd', (obj, v) => obj.sharedSignalsPending = parseInt(v, 16)],
	['SigBlk', (obj, v) => {
		obj.signalsBlocked = parseInt(v.substr(8), 16);
		obj.rtSignalsBlocked = parseInt(v.substr(0, 8), 16);
	}],
	['SigIgn', (obj, v) => {
		obj.signalsIgnored = parseInt(v.substr(8), 16);
		obj.rtSignalsIgnored = parseInt(v.substr(0, 8), 16);
	}],
	['SigCgt', (obj, v) => {
		obj.signalsCaught = parseInt(v.substr(8), 16);
		obj.rtSignalsCaught = parseInt(v.substr(0, 8), 16);
	}],
	// ['CapInh', (obj, v) => obj.capabilityInheritable = v],
	// ['CapPrm', (obj, v) => obj.capabilityPermitted = v],
	// ['CapEff', (obj, v) => obj.capabilityEffective = v],
	// ['CapBnd', (obj, v) => obj.capabilityBounding = v],
	// ['CapAmb', (obj, v) => obj.capabilityAmbient = v],
	// ['CoreDumping', (obj, v) => obj.coreDumping = v === '1'],
	['Threads', (obj, v) => obj.threads = parseInt(v)],
	['Seccomp', (obj, v) => obj.seccompMode = parseInt(v)],
	['Pid', (obj, v) => obj.pid = parseInt(v)],
	['PPid', (obj, v) => obj.parentPid = parseInt(v)],
	['TracerPid', (obj, v) => obj.tracerPid = parseInt(v)],
	['FDSize', (obj, v) => obj.fdSlots = parseInt(v)],
	['VmPeak', (obj, v) => obj.vmPeak = parseInt(v)],
	['VmSize', (obj, v) => obj.vmSize = parseInt(v)],
	['VmLck', (obj, v) => obj.vmLocked = parseInt(v)],
	['VmPin', (obj, v) => obj.vmPinned = parseInt(v)],
	['VmHWM', (obj, v) => obj.vmHwm = parseInt(v)],
	['VmRSS', (obj, v) => obj.vmRss = parseInt(v)],
	['RssAnon', (obj, v) => obj.rssAnon = parseInt(v)],
	['RssFile', (obj, v) => obj.rssFile = parseInt(v)],
	['RssShmem', (obj, v) => obj.rssShmem = parseInt(v)],
	['VmData', (obj, v) => obj.vmData = parseInt(v)],
	['VmStk', (obj, v) => obj.vmStack = parseInt(v)],
	['VmExe', (obj, v) => obj.vmExe = parseInt(v)],
	['VmLib', (obj, v) => obj.vmLib = parseInt(v)],
	['VmPTE', (obj, v) => obj.vmPte = parseInt(v)],
	['VmSwap', (obj, v) => obj.vmSwap = parseInt(v)],
	['Tgid', (obj, v) => obj.threadGroupId = parseInt(v)],
	['Ngid', (obj, v) => obj.numaGroupId = parseInt(v)],
	['voluntary_ctxt_switches', (obj, v) => obj.contextSwitchesVoluntary = parseInt(v)],
	['nonvoluntary_ctxt_switches', (obj, v) => obj.contextSwitchesNonvoluntary = parseInt(v)],
	['HugetlbPages', (obj, v) => obj.hugetlbPagesSize = parseInt(v)],
	['NStgid', (obj, v) => obj.namespaceThreadGroupIds = parseInts(v)],
	['NSpid', (obj, v) => obj.namespacePids = parseInts(v)],
	['NSpgid', (obj, v) => obj.namespaceProcessGroupIds = parseInts(v)],
	['NSsid', (obj, v) => obj.namespaceSessionIds = parseInts(v)],
	// ['NoNewPrivs', (obj, v) => obj.noNewPrivs = v === '1'],
]);

module.exports = src => parseObject(src, statusMap);
