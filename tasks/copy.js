const gulp = require('gulp');

gulp.task('copy:test', ['clean'], () => {
  return gulp.src(['./test/support/**/*'])
             .pipe(gulp.dest('./.test/test/support'));
})