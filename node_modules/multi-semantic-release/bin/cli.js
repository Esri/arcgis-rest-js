#!/usr/bin/env node

const meow = require("meow");
const { toPairs, set } = require("lodash");
const runner = require("./runner");
const cli = meow(
	`
  Usage
    $ multi-semantic-release

  Options
    --dry-run Dry run mode.
    --debug Output debugging information.
    --sequential-init  Avoid hypothetical concurrent initialization collisions.
    --first-parent Apply commit filtering to current branch only.
    --deps.bump Define deps version updating rule. Allowed: override, satisfy, inherit.
    --deps.release Define release type for dependent package if any of its deps changes. Supported values: patch, minor, major, inherit.
    --ignore-packages  Packages' list to be ignored on bumping process
    --ignore-private-packages Ignore private packages
	--help Help info.

  Examples
    $ multi-semantic-release --debug
    $ multi-semantic-release --deps.bump=satisfy --deps.release=patch
    $ multi-semantic-release --ignore-packages=packages/a/**,packages/b/**
`,
	{
		flags: {
			sequentialInit: {
				type: "boolean",
			},
			firstParent: {
				type: "boolean",
			},
			debug: {
				type: "boolean",
			},
			"deps.bump": {
				type: "string",
				default: "override",
			},
			"deps.release": {
				type: "string",
				default: "patch",
			},
			ignorePackages: {
				type: "string",
			},
			ignorePrivatePackages: {
				type: "boolean",
			},
			dryRun: {
				type: "boolean",
			},
		},
		allowUnknownFlags: true,
	}
);

const processFlags = (flags) => {
	return toPairs(flags).reduce((m, [k, v]) => {
		if (k === "ignorePackages" && v) return set(m, k, v.split(","));
		return set(m, k, v);
	}, {});
};

runner(processFlags(cli.flags));
