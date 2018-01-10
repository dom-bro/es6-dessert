import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default {
  input: 'src/main.js',
  output: [
    {
      file: pkg.main,
      format: 'es',
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'es6Dessert',
    },
  ],
  plugins: [
    babel(),
  ]
}
