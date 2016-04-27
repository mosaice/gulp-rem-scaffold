var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var del = require('del');
var browserSync = require("browser-sync").create();
var plumber = require('gulp-plumber');
var px2rem = require('gulp-px3rem');

//sass编译
gulp.task('sass', function() {
  return gulp.src('sourcefile/sass/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compact', //输出模式  nested 嵌套 expanded 扩展 compact 严实 compressed  压缩
      precision: 5, //默认数值精确度  到第五位
      sourceComments: false //是否行数输出注释
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(px2rem({
      baseDpr: 2,             // base device pixel ratio (default: 2)
      threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
      remVersion: true,       // whether to generate rem version (default: true)
      remUnit: 100,            // rem unit value (default: 75)
      remPrecision: 6         // rem precision (default: 6)
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('sourcefile/css'));
});


//图片压缩
gulp.task('imagemin', function() {
  return gulp.src('sourcefile/images/**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'));
});


//字体
gulp.task('fonts', function() {
  return gulp.src('sourcefile/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

//css
gulp.task('css', function() {
  return gulp.src('sourcefile/css/**/*')
    .pipe(gulp.dest('dist/css'));
});


//html
gulp.task('html', function() {
  return gulp.src('sourcefile/**/*.html')
    .pipe(gulp.dest('dist'));
});

//转移sass
gulp.task('changesass', function() {
  return gulp.src('sourcefile/sass/**/*.scss')
    .pipe(gulp.dest('dist/sass'));
});



gulp.task('js', function() {
  return gulp.src('sourcefile/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
});


//重置dist文件内容
gulp.task('reset', function() {
  return del(['dist/**/*']).then(function() {
    gulp.src('sourcefile/**/*')
      .pipe(gulp.dest('dist'));
  })
});


gulp.task('serve', ['sass', 'imagemin'], function() {

  browserSync.init({
    // files: "**/*.css, **/*.js, **/*.html", // 监听所有文件
    server: "./dist" // 监听的文件夹目录
  });

  gulp.watch('sourcefile/**/*.html', ['html']); // html文件变动触发html
  gulp.watch('sourcefile/sass/**/*.scss', ['sass', 'changesass']); // scss文件变动触发sass
  gulp.watch('sourcefile/css/**/*', ['css']); // scss文件变动触发sass
  gulp.watch('sourcefile/images/**/*', ['imagemin']); //
  gulp.watch('sourcefile/fonts/**/*', ['fonts']); //
  gulp.watch('sourcefile/js/**/*.js', ['js']); //

  gulp.watch('dist/css/**/*.css').on('change', browserSync.reload); // sass变动触发browserSync.reload
  gulp.watch('dist/fonts/**/*').on('change', browserSync.reload); // sass变动触发browserSync.reload
  gulp.watch('sourcefile/**/*.html').on('change', browserSync.reload); // sass变动触发browserSync.reload
});

gulp.task('default', ['reset', 'serve']);
