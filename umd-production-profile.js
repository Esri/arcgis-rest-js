import config from './umd-base-profile.js';
import uglify from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";

// use umd.min.js
config.output.file = config.output.file.replace(".umd.", ".umd.min.");

config.plugins.push(filesize())
config.plugins.push(uglify({
  output: { comments: /@preserve/ }
}))

export default config;