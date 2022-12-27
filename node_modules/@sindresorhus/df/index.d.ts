declare namespace df {
	interface SpaceInfo {
		/**
		 * Name of the filesystem.
		 */
		readonly filesystem: string;

		/**
		 * Total size in bytes.
		 */
		readonly size: number;

		/**
		 * Used size in bytes.
		 */
		readonly used: number;

		/**
		 * Available size in bytes.
		 */
		readonly available: number;

		/**
		 * Capacity as a float from `0` to `1`.
		 */
		readonly capacity: number;

		/**
		 * Disk mount location.
		 */
		readonly mountpoint: string;
	}
}

declare const df: {
	/**
	 * Get free disk space info from [`df -kP`](https://en.wikipedia.org/wiki/Df_\(Unix\)).
	 *
	 * @returns A list of space info objects for each filesystem.
	 */
	(): Promise<df.SpaceInfo[]>;

	/**
	 * @param path - Path to a filesystem device file. Example: `'/dev/disk1'`.
	 * @returns Space info for the given filesystem.
	 */
	fs(path: string): Promise<df.SpaceInfo>;

	/**
	 * @param path - Path to a file on the filesystem to get the space info for.
	 * @returns Space info for the filesystem the given file is part of.
	 */
	file(path: string): Promise<df.SpaceInfo>;

	// TODO: remove this in the next major version
	default: typeof df;
};

export = df;
