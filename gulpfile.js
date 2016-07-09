var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ghPages = require('gulp-gh-pages');

// both used to serve static files as well as automatically reload browser on changes
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./dist",
      serveStaticOptions: { // serves files without .html extension - thanks https://github.com/BrowserSync/browser-sync/issues/197#issuecomment-169704723
        extensions: ['html']
      }
    },
    notify: false // do not show a notification every time an update is done
    // open: false // can be set so it does not automatically open browser
  });
});

// compile sass to css
gulp.task('sass', function () {
  return gulp.src('./css/*.scss')
    .pipe(plumber({errorHandler: notify.onError("Sass error: <%= error.message %>")}))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// CSS concat, auto-prefix and minify
gulp.task('css', function() {
  return gulp.src(['./css/*.css'])
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// compile all our js files into one file
gulp.task('js', function() {
  gulp.src('./js/*.js')
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// compile all our coffeescript files to js
gulp.task('coffee', function() {
  gulp.src('./coffee/*.coffee')
    .pipe(plumber({errorHandler: notify.onError("CoffeeScript error: <%= error.message %>")}))
    .pipe(coffee({bare: true}))
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// minify images (lossless) automatically!
gulp.task('images', function() {
  return gulp.src('./images/*')
    .pipe(gulp.dest('./dist/images'))
    .pipe(browserSync.stream());
});

// simply copy files to our output folder
gulp.task('copy-extras', function() {
  gulp.src('*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
  gulp.src('CNAME')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

// watch our files for changes
gulp.task('watch', function () {
	gulp.watch("*.html", ['copy-extras']);
	gulp.watch("./js/*.js", ['js']);
  gulp.watch('./css/*.css', ['css']);
  gulp.watch('./css/*.scss', ['sass']);
  gulp.watch('./coffee/*', ['coffee']);
  gulp.watch('./images/*', ['images']);
});

// deploy to github pages automatically
gulp.task('deploy', ['build'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({
      branch: "master" // deploy branch needs to be master, since this is a Github user site, not a project site
    }));
});

// group together all the relevant 'build' tasks
gulp.task('build', ['css', 'sass', 'js', 'coffee', 'copy-extras', 'images']);

// by default, build everything, start the webserver, and watch our files for changes
gulp.task('default', ['build', 'browser-sync', 'watch']);