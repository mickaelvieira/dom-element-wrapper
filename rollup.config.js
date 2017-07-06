import babel from "rollup-plugin-babel";

export default {
  entry: "src/index.js",
  moduleName: "DOMElementWrapper",
  exports: "named",
  format: "umd",
  plugins: [
    babel({
      exclude: "node_modules/**"
    })
  ],
  sourceMap: false,
  targets: [
    { dest: `dist/dom-element-wrapper.js`, format: "umd" },
    { dest: `dist/dom-element-wrapper-es.js`, format: "es" }
  ]
};
