import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import { minify } from "uglify-es";

export default {
  input: "src/index.js",
  name: "DOMElementWrapper",
  exports: "named",
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    uglify({}, minify)
  ],
  sourceMap: false,
  output: [
    { file: `dist/dom-element-wrapper.js`, format: "umd" },
    { file: `dist/dom-element-wrapper-es.js`, format: "es" }
  ]
};
