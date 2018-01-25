const gulp = require('gulp')

const src = './src/*js'
const dest = './dist'

/**
 * 每个入口文件输出三个版本：
 *  1. umd 版本，面向开发环境，文件名以 .js 结尾
 *  2. umd 压缩版，面向生产环境，文件名以 .min.js 结尾
 *  3. esm 版本，面向开发环境，文件名以 .esm.js 结尾
 * 注意：esm(ES Module)版本不提供压缩版本，因为 esm 不能用于生产环境
 */

gulp.task('build:umd', () => {
  return gulp.src(src)
    .pipe()
    .pipe(gulp.dest(dest))
})

gulp.task('build:prod', () => {
  return gulp.src(src)
    .pipe()
    .pipe(gulp.dest(dest))
})

gulp.task('build:esm', () => {
  return gulp.src(src)
    .pipe()
    .pipe(gulp.dest(dest))
})
