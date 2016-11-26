const gulp = require('gulp');

gulp.task('copy:test', ['clean'], () => {
  return gulp.src(['./test/support/**/*'])
             .pipe(gulp.dest('./.test/test/support'));
});

gulp.task('copy:data:test', ['copy:test'], () => {
  return gulp.src(['./src/data/**/*.json'])
             .pipe(gulp.dest('./.test/src/data/'));
});