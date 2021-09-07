import config from "./umd-base-profile.js";
import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";

// use umd.min.js
config.output.file = config.output.file.replace(".umd.", ".umd.min.");

config.plugins.push(filesize());
config.plugins.push(
  terser({
    format: {
      comments: function (node, comment) {
        var text = comment.value;
        var type = comment.type;
        if (type == "comment2") {
          // multiline comment
          return /@preserve|@license|@cc_on/i.test(text);
        }
      },
    },
  })
);

export default config;
