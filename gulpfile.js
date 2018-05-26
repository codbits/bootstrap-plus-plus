var gulp = require('gulp');
var newer = require('gulp-newer');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var pugLinter = require('gulp-pug-linter');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
// var gulpIf = require('gulp-if')
var watch = require('gulp-watch');
var standard = require('gulp-standard');
var $ = require('gulp-load-plugins')();

gulp.task('default', [ 'serve' ]);

gulp.task('serve', [ 'html', 'imgs', 'scss', 'js' ], () => {
  browserSync.init({
    server: './dist/',
    open: false,
    reloadDelay: 500
  });

  gulp.watch('./src/**/*.pug', [ 'html' ]);
  gulp.watch('./src/**/*.{png,gif,jpg,svg}', [ 'imgs' ]);
  gulp.watch('./src/**/*.scss', [ 'scss' ]);
  gulp.watch('./src/**/*.js', [ 'js' ]);
});

gulp.task('html', () => {
  return gulp
    .src([ '!./src/_layout.pug', './src/**/*.pug' ])
    .pipe(plumber())
    .pipe(newer('./dist'))
    .pipe(pugLinter())
    .pipe(pugLinter.reporter())
    .pipe(pug())
    .pipe($.htmlPrettify({
      indent_size: 2
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('imgs', () => {
  return gulp
    .src('./src/**/*.{png,gif,jpg,svg}')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
  });

gulp.task('scss', () => {
  return gulp
    .src('./src/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        browsers: [ 'last 2 versions' ],
        cascade: false
      })
    )
    .pipe(newer('./dist'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp
    .src('./src/**/*.js')
    .pipe(standard())
    .pipe(
      standard.reporter('default', {
        breakOnError: false,
        quiet: true
      })
    )
    .pipe(newer('./dist'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('copy:demo', () => {
  return gulp.src('./dist/**/*').pipe(gulp.dest('../demo/sputnik'));
});
