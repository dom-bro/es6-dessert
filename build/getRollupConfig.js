const path = require('path')
const uglify = require('rollup-plugin-uglify')
const babel = require('rollup-plugin-babel')

/**
 * @param chunk gulp 的文件流
 * @param edition 构建的版本 umd | prod | esm
 */
module.exports = (chunk, edition) => {
  let outputFileExtension, format = 'umd'
  let inputOptions = {
    input: chunk.path,
    plugins: [],
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
  }
  return {
    inputOptions,
    outputOptions,
    outputFileExtension,
  }
}
