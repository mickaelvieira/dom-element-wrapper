import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

const isProd = process.env.NODE_ENV === "production";

const format = "umd";
const moduleName = "elementWrapper";
const sourceMap = false;
const plugins = [
  babel({
    exclude: "node_modules/**"
  })
];

if (isProd) {
  plugins.push(uglify());
}

const min = isProd ? ".min" : "";

export default {
  entry: "src/index.js",
  dest: `dist/element-wrapper${min}.js`,
  moduleName,
  format,
  plugins,
  sourceMap
};
