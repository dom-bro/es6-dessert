const path = require('path')
const uglify = require('rollup-plugin-uglify')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const cmj = require('rollup-plugin-commonjs')
const pkg = require('../package')

/**
 * @param chunk gulp 的文件流
 * @param edition 构建的版本 umd | prod | esm
 */
const banner =
`/*!
 * ES6 Dessert v${pkg.version}
 * (c) 2017-${new Date().getFullYear()} DOM哥
 * https://github.com/dom-bro/es6-dessert
 */`
module.exports = (chunk, edition) => {
  let outputFileExtension, format = 'umd'
  let inputOptions = {
    input: chunk.path,
    plugins: [
      resolve(),
      cmj(),
    ],
  }

  if (/umd|prod/.test(edition)) {
    inputOptions.plugins.push(babel())
    outputFileExtension = '.js'
    if (/prod/.test(edition)) {
      inputOptions.plugins.push(uglify())
      outputFileExtension = '.min.js'
    }
  } else if (/esm/.test(edition)) {
    format = 'es'
    outputFileExtension = '.esm.js'
  }

  let outputOptions = {
    format,
    name: path.basename(chunk.path, '.js'),
    banner,
  }
  return {
    inputOptions,
    outputOptions,
    outputFileExtension,
  }
}
