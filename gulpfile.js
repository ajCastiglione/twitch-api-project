let gulp = require('gulp');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let browserSync = require('browser-sync').create();

gulp.task('default', function() {
  gulp.watch('scss/**/*.scss', gulp.series('styles'));
});



gulp.task('styles', function() {
  return gulp.src('scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./css'));
});

browserSync.init({
  files: ['index.html', 'css/*.css', 'js/*.js'],
  server: "./"
});
browserSync.stream();
