const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemap = require('gulp-sourcemaps');
const merge = require('merge2');

gulp.task('ts', () => {
  let tsProject = ts.createProject('tsconfig.json');
  let tsResult = tsProject.src()
                          // .pipe(sourcemap.init())
                          .pipe(tsProject());

  return merge([
      tsResult.js.pipe(gulp.dest('./lib')),
      tsResult.dts.pipe(gulp.dest('./lib')),
      ]);

});

gulp.task('ts:test', ['copy:data:test'], () => {
  let tsProject = ts.createProject('./test/tsconfig.json');
  let tsResult = tsProject.src()
                          .pipe(sourcemap.init())
                          .pipe(tsProject());

  return tsResult.js
                 .pipe(sourcemap.write())
                 .pipe(gulp.dest('./.test'));

});