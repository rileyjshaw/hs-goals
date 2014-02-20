var
  gulp = require('gulp'),
  watch = require('gulp-watch'),
  jshint = require('gulp-jshint'),
  stripDebug = require('gulp-strip-debug'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifyCSS = require('gulp-minify-css'),
  changed = require('gulp-changed'),
  imagemin = require('gulp-imagemin');

var paths = {
  src: {
    scripts: 'src/public/scripts/*.js',
    stylesheets: 'src/public/stylesheets/*.js',
    images: 'src/public/stylesheets/*.sass'
  }
};

gulp.task('lint', function() {
  gulp.src(paths.src.scripts)
    .pipe(watch())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  gulp.src(paths.src.scripts)
    .pipe(watch())
    .pipe(stripDebug())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./build/'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/img'));
});

gulp.task('sass', function () {
  gulp.src(paths.src.stylesheets)
    .pipe(watch())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/'))
});

gulp.task('images', function() {
  gulp.src('src/images/**/*')
    .pipe(watch())
    .pipe(changed('build/images'))
    .pipe(imagemin())
    .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['lint', 'sass', 'scripts', 'images']);
