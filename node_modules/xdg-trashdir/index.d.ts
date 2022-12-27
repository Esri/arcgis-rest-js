declare const xdgTrashdir: {
	/**
	Get the correct trash path for a file on Linux according to the [spec](http://www.ramendik.ru/docs/trashspec.html)
	@example
	```
	import xdgTrashdir = require('xdg-trashdir');

	(async () => {
		console.log(await xdgTrashdir());
		//=> '/home/johndoe/.local/share/Trash'

		console.log(await xdgTrashdir('foo.zip'));
		//=> '/media/johndoe/UUI/.Trash-1000'
	})();
	```
	*/
	(filePath?: string): Promise<string>;

	/**
	Get all possible trash paths on Linux according to the [spec](http://www.ramendik.ru/docs/trashspec.html)
	@example
	```
	import xdgTrashdir = require('xdg-trashdir');

	(async () => {
		console.log(await xdgTrashdir.all());
		//=> ['/home/johndoe/.local/share/Trash', '/media/johndoe/UUI/.Trash-1000', …]
	})();
	```
	*/
	all(): Promise<string[]>;
};

export = xdgTrashdir;
