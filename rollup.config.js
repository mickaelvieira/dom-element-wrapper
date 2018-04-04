import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import { minify } from "uglify-es";

const sourceMap = false;
const exports = "named";
const name = "DOMElementWrapper";

export default {
  input: "src/index.js",
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    uglify({}, minify)
  ],
  output: [
    {
      sourceMap,
      exports,
      name,
      file: `dist/dom-element-wrapper.js`,
      format: "umd"
    },
    {
      sourceMap,
      exports,
      name,
      file: `dist/dom-element-wrapper-es.js`,
      format: "es"
    }
  ]
};
