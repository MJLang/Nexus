const del = require('del');
const gulp = require('gulp');

gulp.task('clean', () => del(['.test']));

gulp.task('clean:lib', () => del(['lib']));