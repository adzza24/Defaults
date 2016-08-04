/// <vs AfterBuild='sass:compile' SolutionOpened='sass:watch' />
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
//path/**/*.scss - double star means any sub directories. single star means any file


//reusable services
var service = {
    complete: function (msg) {
        return function () {
            console.log("Task complete: " + msg);
        };
    },
    fail: function (error) {
        // Would like to catch the error here 
        console.log("THERE WAS AN ERROR: ", error);
    }
};

//defaults
var config = {
    output: "./Css",
    scriptOutput: './Scripts/dist',
    input: ["./SASS/partials/*.scss", "./SASS/*.scss", "./SASS/loader/*.scss"],
    sass: {
        errLogToConsole: true
    },
    autofixer: {
        browsers: ['> 1%', 'Last 2 versions', 'Firefox > 0', 'Opera > 0', 'Edge > 0', 'Explorer > 7'],
        cascade: false
    }
};

//sass compiler
gulp.task('sass:compile', function () {
    return gulp.src(config.input)
      .pipe(sourcemaps.init())
        .pipe(sass(config.sass))
           .pipe(autoprefixer(config.autofixer))
           .on('error', service.fail)
             .pipe(sourcemaps.write())
               .pipe(gulp.dest(config.output))
               .on("end", service.complete("sass:compile"));
});

//compile sass on save
gulp.task('sass:watch', function () {
    gulp.watch(config.input, ['sass:compile']);
});



//concatenate angular app js files
var appConcat = function () {
    var ngLib = [
        './Scripts/app/**/app.*.js',
        './Scripts/app/**/*.js',
        './Scripts/app/app.js'
    ];
    return gulp.src(ngLib)
      .pipe(concat('app.js'))
      .pipe(gulp.dest(config.scriptOutput))
        .on("end", service.complete("appConcat"));
};

var venConcat = function () {
    return gulp.src(['./Scripts/vendor/jquery-1.10.2.min.js', './Scripts/vendor/*min.js'])
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(config.scriptOutput))
        .on("end", service.complete("venConcat"));
};

var ngConcat = function () {
    return gulp.src(['./Scripts/vendor/angular/angular.min.js', './Scripts/vendor/angular/angular-*.min.js'])
      .pipe(concat('ng.js'))
      .pipe(gulp.dest(config.scriptOutput))
        .on("end", service.complete("ngConcat"));
};

var libConcat = function () {
    var lib = [
        './Scripts/lib/osd.js',
        "./Scripts/lib/osd.*.js",
        './Scripts/lib/init.js'
    ];
    return gulp.src(lib)
      .pipe(concat('lib.js'))
      .pipe(gulp.dest(config.scriptOutput))
        .on("end", service.complete("libConcat"));
};

//task to concatenacte all scripts
gulp.task('scripts:concat', function () {
    appConcat();
    venConcat();
    ngConcat();
    libConcat();
});

gulp.task('scripts:minify', function () {
    return gulp.src('./Scripts/output/*.js')
      .pipe(minify({
          ext: {
              src: '.js',
              min: '.min.js'
          },
          ignoreFiles: ['*.min.js', '*-min.js']
      }))
        .on("end", service.complete("scripts:minify"))
      .pipe(gulp.dest(config.scriptOutput));
});


gulp.task('scripts:watch', function () {
    gulp.watch(['./Scripts/**/*.js', '!./Scripts/output/*.js'], ['scripts:concat']);
});