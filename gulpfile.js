'use strict';

const gulp = require('gulp');
const jade = require('gulp-jade');
const stylus = require('gulp-stylus');
const babel = require('gulp-babel');

const paths = {
  jade: ['./src/index.jade'],
  stylus: ['./src/styles.styl'],
  babel: ['./src/app.js'],
  copy: ['./src/favicon.png']
};

gulp.task('default', ['jade', 'stylus', 'babel', 'copy']);

gulp.task('jade', () => {
  return gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('./build'));
});

gulp.task('stylus', () => {
  return gulp.src(paths.stylus)
    .pipe(stylus())
    .pipe(gulp.dest('./build'));
});

gulp.task('babel', () => {
  return gulp.src(paths.babel)
    .pipe(babel())
    .pipe(gulp.dest('./build'));
});

gulp.task('copy', () => {
  return gulp.src(paths.copy)
    .pipe(gulp.dest('./build'));
});
