require('colors')
const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const gulpRollup = require('./build/gulpRollup')
const FILES = require('./build/FILES')

const src = './src/*js'
const dest = './dist'
global.builds = []

/**
 * 每个入口文件输出三个版本：
 *  1. umd 版本，面向开发环境，文件名以 .js 结尾
 *  2. umd 压缩版，面向生产环境，文件名以 .min.js 结尾
 *  3. esm 版本，面向开发环境，文件名以 .esm.js 结尾
 * 注意：esm(ES Module)版本不提供压缩版本，因为 esm 不能用于生产环境
 */

gulp.task('build:umd', () => {
  return gulp.src(src)
    .pipe(gulpRollup('umd'))
    .pipe(gulp.dest(dest))
})

gulp.task('build:prod', () => {
  return gulp.src(src)
    .pipe(gulpRollup('prod'))
    .pipe(gulp.dest(dest))
})

gulp.task('build:esm', () => {
  return gulp.src(src)
    .pipe(gulpRollup('esm'))
    .pipe(gulp.dest(dest))
})

gulp.task('build:all', gulp.series(gulp.parallel('build:umd', 'build:prod', 'build:esm'), genBuildReport))

function genBuildReport (done) {
  let tbody = ''
  FILES.forEach(file => {
    tbody += `<tr><td>${file.title}</td>`
    global.builds.filter(build => file.filename === build.config.outputOptions.name)
      .sort((a, b) => a.config.index > b.config.index)
      .forEach(build => {
        tbody += '<td>' +
          `<a href="https://unpkg.com/es6-dessert/dist/${build.filename}">` +
          build.filename +
          `</a>(${build.size}kb)</td>`
      })
    tbody += '</tr>'
  })
  fs.writeFile(path.join(__dirname, './dist/builds.html'), tbody, err => {
    if (err) throw err
    done()
  })
}
