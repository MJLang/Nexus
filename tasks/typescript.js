import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
import * as sourcemap from 'gulp-sourcemaps';

gulp.task('ts', () => {
  let tsProject = ts.createProject('tsconfig.json');
  let tsResult = tsProject.src()
                          .pipe(sourcemap.init())
                          .pipe(tsProject());

  return tsResult.js
                 .pipe(sourcemap.write())
                 .pipe(gulp.dest('./lib'));

});