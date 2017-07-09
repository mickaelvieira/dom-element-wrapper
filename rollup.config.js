import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import { minify } from "uglify-es";

export default {
  entry: "src/index.js",
  moduleName: "DOMElementWrapper",
  exports: "named",
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    uglify({}, minify)
  ],
  sourceMap: false,
  targets: [
    { dest: `dist/dom-element-wrapper.js`, format: "umd" },
    { dest: `dist/dom-element-wrapper-es.js`, format: "es" }
  ]
};
