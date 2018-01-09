import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/main.js',
  output: {
    format: 'iife',
  },
  plugins: [
    resolve(),
    cjs(),
  ],
  external: [
    'lodash',
  ],
}
