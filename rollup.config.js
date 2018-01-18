import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const banner =
`/*!
 * ES6 Dessert v${pkg.version}
 * (c) 2017-${new Date().getFullYear()} DOM哥
 * https://github.com/dom-bro/es6-dessert
 */`

export default {
  input: 'src/main.js',
  output: [
    {
      file: pkg.main,
      format: 'es',
      banner,
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'es6Dessert',
      banner,
    },
  ],
  plugins: [
    babel(),
  ],
}
