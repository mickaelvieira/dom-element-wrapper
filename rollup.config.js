import babel from "rollup-plugin-babel";

export default {
  entry: "src/index.js",
  moduleName: "ElementWrapper",
  exports: "named",
  format: "umd",
  plugins: [
    babel({
      exclude: "node_modules/**"
    })
  ],
  sourceMap: false,
  targets: [
    { dest: `dist/element-wrapper.js`, format: "umd" },
    { dest: `dist/element-wrapper-es.js`, format: "es" }
  ]
};
