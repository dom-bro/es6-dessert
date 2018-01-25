const path = require('path')
const uglify = require('rollup-plugin-uglify')
const babel = require('rollup-plugin-babel')

/**
 * @param chunk gulp 的文件流
 * @param edition 构建的版本 umd | prod | esm
 */
module.exports = (chunk, edition) => {
  let outputFilename
  let inputOptions = {
    input: chunk.path,
    plugins: [],
  }

  if (/umd|prod/.test(edition)) {
    inputOptions.plugins.push(babel())
    if (/prod/.test(edition)) {
      inputOptions.plugins.push(uglify())
    }
  } else if (/esm/.test(edition)) {

  }
}
