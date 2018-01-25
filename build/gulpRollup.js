const rollup = require('rollup')
const through2 = require('through2')
const gutil = require('gulp-util')
const getRollupConfig = require('getRollupConfig')

/**
 * @param edition 构建的版本 umd | prod | esm
 */
module.exports = (edition) => {
  return through2.obj(async (chunk, enc, cb) => {
    const config = getRollupConfig(edition)

    const bundle = await rollup.rollup(config.inputOptions)

    bundle.write(config.outputOptions)

    const {code} = await bundle.generate(config.outputOptions)

    chunk.contents = Buffer.from(code)

    cb(null, chunk)
  })
}
