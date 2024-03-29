require('colors')
const path = require('path')
const rollup = require('rollup')
const through2 = require('through2')
const getRollupConfig = require('./getRollupConfig')

/**
 * @param edition 构建的版本 umd | prod | esm
 */
module.exports = edition => {
  return through2.obj(async (chunk, enc, cb) => {
    const config = getRollupConfig(chunk, edition)

    const bundle = await rollup.rollup(config.inputOptions)
    const res = await bundle.generate(config.outputOptions)
    const { code } = res.output[0]

    chunk.contents = Buffer.from(code)
    chunk.path = chunk.path.replace(/\.\w+$/, config.outputFileExtension)

    cb(null, chunk)

    if (/umd/.test(edition)) config.index = 0
    else if (/prod/.test(edition)) config.index = 1
    else if (/esm/.test(edition)) config.index = 2

    collectBuildLogs(config, code)
  })
}

function collectBuildLogs (config, code) {
  const size = (code.length / 1024).toFixed(2) // kb
  const inputname = path.basename(config.inputOptions.input)
  const outputname = config.outputOptions.name + config.outputFileExtension
  console.log(`${fixedLength(inputname, 30)} → ${fixedLength(outputname, 30)} ${size}kb`.blue)

  global.builds.push({
    filename: outputname,
    config,
    size,
  })
}

function fixedLength (str, length) {
  return str + Array.from({length: length - str.length}).join(' ')
}
