var gulp = require('gulp');
var tsc = require('gulp-typescript');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = tsc.createProject('tsconfig.json');

//--- Configurations Constants ---

var paths = {
    webroot: "./",
    node_modules: "./node_modules/",
    typescript_in: "./src/",
    typescript_out: "output",
    typings: "./typings/",
    typescript_definitions: "./typings/main/**/*.ts"
};
paths.allTypeScript = paths.typescript_in + "**/*.ts";
paths.modulesDestination = paths.webroot + "vendors/";

//--- Task ---

gulp.task("clean", function (callback) {
    var typeScriptGenFiles = [
        paths.typescript_out + "/**/*.js",
        paths.typescript_out + "/**/*.js.map"
    ];

    del(typeScriptGenFiles, callback);
});

gulp.task("copy", function () {
    var modulesToMove = {
        //"bootstrap": "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}",
        "jquery": "jquery/dist/jquery*.{js,map}",
        "requirejs": "requirejs/*.{js,map}"
    }

    for (var destinationDir in modulesToMove) {
        gulp.src(paths.node_modules + modulesToMove[destinationDir])
            .pipe(gulp.dest(paths.modulesDestination + destinationDir));
    }
});


gulp.task("build", function () {
    var sourceTsFiles = [paths.typescript_in, paths.typescript_definitions];
    var compilationResults = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
    compilationResults.dts.pipe(gulp.dest(paths.typescript_out));
    return compilationResults.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.typescript_out));
});

gulp.task("buildall", ["clean", "copy", "build"], function (callback){
    callback();
});