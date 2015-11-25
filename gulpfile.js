// Gulp Tasks
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var browserSync = require('browser-sync');

var options = {};

gulp.task('sass', function() {
  var styles = gulp.src('scss/**/*.scss')
                .pipe(sass({outputStyle: 'expanded'})
                .on('error', sass.logError));
  if (options.minify) {
    styles.pipe(minifyCss({compatibility: 'ie8'}));
  }
  styles.pipe(gulp.dest(options.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('script', function() {
  gulp.src('./foopicker.js')
    .pipe(uglify())
    .pipe(gulp.dest('./demos/js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'demos'
    }
  });
});

gulp.task('watch', ['browserSync', 'script', 'sass'], function() {
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('foopicker.js', ['script']);
});

gulp.task('serve', function() {
  options.dest = './demos/css/';
  gulp.start('watch');
});

gulp.task('default', function() {
  options.dest = './css/';
  options.minify = true;
  gulp.start('sass');
});
