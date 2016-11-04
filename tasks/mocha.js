const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('test', ['ts:test'], () => {
  return gulp.src('./.test/test/**/*.js')
             .pipe(mocha({reporter: 'nyan'}));
})