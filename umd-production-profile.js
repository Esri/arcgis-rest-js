import config from './umd-base-profile.js';
import uglify from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";

// remove 'debug' from the unminified UMD filename and sourcemap
config.output.file = config.output.file.replace(".umd.", ".umd.min.");
config.output.sourcemap = config.output.sourcemap.replace(".umd.", ".umd.min.");

config.plugins.push(filesize())
config.plugins.push(uglify({ 
  output: {comments: /Institute, Inc/} 
}))

export default config;