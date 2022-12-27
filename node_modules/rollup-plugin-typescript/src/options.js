import * as path from 'path';
import {
	existsSync,
	readFileSync
} from 'fs';

export function getDefaultOptions () {
	return {
		noEmitHelpers: true,
		module: 'ESNext',
		sourceMap: true,
		importHelpers: true
	};
}

// Gratefully lifted from 'look-up', due to problems using it directly:
//   https://github.com/jonschlinkert/look-up/blob/master/index.js
//   MIT Licenced
function findFile ( cwd, filename ) {
	let fp = cwd ? ( cwd + '/' + filename ) : filename;

	if ( existsSync( fp ) ) {
		return fp;
	}

	const segs = cwd.split( path.sep );
	let len = segs.length;

	while ( len-- ) {
		cwd = segs.slice( 0, len ).join( '/' );
		fp = cwd + '/' + filename;
		if ( existsSync( fp ) ) {
			return fp;
		}
	}

	return null;
}

export function getCompilerOptionsFromTsConfig (typescript, tsconfigPath) {
	if (tsconfigPath && !existsSync(tsconfigPath)) {
		throw new Error(`Could not find specified tsconfig.json at ${tsconfigPath}`);
	}
	const existingTsConfig = tsconfigPath || findFile( process.cwd(), 'tsconfig.json' );
	if (!existingTsConfig) {
		return {};
	}
	const tsconfig = typescript.readConfigFile( existingTsConfig, path => readFileSync( path, 'utf8' ) );

	if ( !tsconfig.config || !tsconfig.config.compilerOptions ) return {};
	return tsconfig.config.compilerOptions;
}

export function adjustCompilerOptions ( typescript, options ) {
	// Set `sourceMap` to `inlineSourceMap` if it's a boolean
	// under the assumption that both are never specified simultaneously.
	if ( typeof options.inlineSourceMap === 'boolean' ) {
		options.sourceMap = options.inlineSourceMap;
		delete options.inlineSourceMap;
	}

	// Delete the `declaration` option to prevent compilation error.
	// See: https://github.com/rollup/rollup-plugin-typescript/issues/45
	delete options.declaration;
}
