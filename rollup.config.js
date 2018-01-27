const babel = require('rollup-plugin-babel')
const pkg = require('./package.json')
const resolve = require('rollup-plugin-node-resolve')
const cmj = require('rollup-plugin-commonjs')

export default {
  input: './src/es6Dessert.js',
  output: [{
    file: pkg.browser,
    format: 'umd',
    name: 'es6Dessert',
  }, {
    file: pkg.main,
    format: 'es',
  }],
  plugins: [
    resolve(),
    cmj(),
    babel(),
  ],
}
