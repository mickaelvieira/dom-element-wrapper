import babel from "rollup-plugin-babel";

const plugins = [
  babel({
    exclude: "node_modules/**"
  })
];

export default {
  entry: "src/index.js",
  moduleName: "ElementWrapper",
  exports: "named",
  format: "umd",
  plugins,
  sourceMap: false,
  targets: [
    { dest: `dist/element-wrapper.js`, format: "umd" },
    { dest: `dist/element-wrapper-es.js`, format: "es" }
  ]
};
