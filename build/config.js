const path = require('path')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const babel = require('rollup-plugin-babel')

/*
 * 每个入口文件输出三个版本：
 *  1. umd 版本，面向开发环境（如 es6-dessert.js，NormalPopup.js）
 *  2. umd 压缩版，面向生产环境（如 es6-dessert.min.js，NormalPopup.min.js）
 *  3. esm 版本，面向开发环境（如 es6-dessert.esm.js，NormalPopup.esm.js）
 * ES Module 不提供压缩版本，因为 esm 不能用于生产环境
 */
const filenameMap = {
  main: 'es6Dessert'
}
// 获取输出路径
function getOutpuFilename(filename, env, format) {
  filename = filenameMap[filename] || filename

  if(format === 'es') filename += '.esm'
  else if(/prod/.test(env)) filename += '.min'

  return `${filename}.js`
}

// 生成单个入口配置
function genConfig(filename, env, format) {
  let inputOptions = {
    input: path.join(__dirname, `../src/${filename}.js`),
    plugins: [
      replace({
        'process.env.NODE_ENV': env
      })
    ]
  }
  if(/umd/.test(format)) inputOptions.plugins.push(babel())
  if(/prod/.test(env)) inputOptions.plugins.push(uglify())

  let outputFilename = getOutpuFilename(filename, env, format)
  let outputOptions = {
    format,
    file: path.join(__dirname, `../dist/${outputFilename}`),
    name: filenameMap[filename] || filename
  }
  return {
    inputOptions,
    outputOptions,
    outputFilename,
  }
}

let builds = []
// 生成多个入口配置
function getAllConfigs (files) {
  files.forEach(filename => {
    // umd 版和 umd 压缩版
    ['dev', 'prod'].forEach(env => {
      builds.push(genConfig(filename, env, 'umd'))
    })

    // esm 版本
    builds.push(genConfig(filename, 'dev', 'es'))
  })
  return builds
}

module.exports = {
  genConfig,
  getAllConfigs,

  filenameMap,
}
