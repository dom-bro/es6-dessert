const rollup = require('rollup')
const through2 = require('through2')
const gutil = require('gulp-util')

module.exports = () => {
  return through2.obj(async (chunk, enc, cb) => {
    const options = {
      inputOptions: {
        input: chunk.path,
        plugins: [
        ],
      }
    }

    try {
      const bundle = await rollup.rollup(options);
      const res = await bundle.generate(options);

      chunk.contents = new Buffer(res.code);
      chunk.path = gutil.replaceExtension(chunk.path, '.js');
    }catch(e){
      console.error('ERROR[rollup 编译错误]');
      console.error(e);
    }

    cb(null, chunk);
  });
};
