const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemap = require('gulp-sourcemaps');

gulp.task('ts', () => {
  let tsProject = ts.createProject('tsconfig.json');
  let tsResult = tsProject.src()
                          .pipe(sourcemap.init())
                          .pipe(tsProject());

  return tsResult.js
                 .pipe(sourcemap.write())
                 .pipe(gulp.dest('./lib'));

});

gulp.task('ts:test', ['copy:test'], () => {
  let tsProject = ts.createProject('./test/tsconfig.json');
  let tsResult = tsProject.src()
                          .pipe(sourcemap.init())
                          .pipe(tsProject());

  return tsResult.js
                 .pipe(sourcemap.write())
                 .pipe(gulp.dest('./.test'));

});