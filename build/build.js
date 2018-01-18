const path = require('path')
const fs = require('fs')
const rollup = require('rollup')
const FILES = require('./FILES')
const Con = require('./config')
const configs = Con.getAllConfigs(FILES.map(item => item.filename))
const {filenameMap} = Con

/* 构建主代码 */
configs.forEach(async config => {
  const bundle = await rollup.rollup(config.inputOptions)

  bundle.write(config.outputOptions)

  const {code} = await bundle.generate(config.outputOptions)

  buildLogs(config, code)
})

/* 收集构建信息 */
let sizes = []
function buildLogs (config, code) {
  let size = getSize(code)

  console.log(`${blue(path.relative(process.cwd(), config.inputOptions.input))} -> ${blue(path.relative(process.cwd(), config.outputOptions.file))} ${size}kb`)

  config.size = size

  sizes.push(size)

  let tbody = ''
  if (sizes.length === FILES.length * 3) {
    FILES.forEach(file => {
      tbody += `<tr><td>${file.title}</td>`
      let filename = filenameMap[file.filename] || file.filename
      configs.filter(config => new RegExp(filename).test(config.outputOptions.file))
        .forEach(config => {
          tbody += `<td>
                      <a href="https://unpkg.com/es6-dessert/dist/${config.outputFilename}">
                        ${config.outputFilename}
                      </a>
                      (${config.size}kb)
                    </td>`
        })
      tbody += '</tr>'
    })
    fs.writeFile(path.join(__dirname, '../dist/builds.html'), tbody, err => {
      if (err) throw err
      console.log('build done!')
    })
  }
}

function getSize (code) {
  return (code.length / 1024).toFixed(2)
}
function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
