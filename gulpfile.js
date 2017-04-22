const gulp = require('gulp');
const tsc = require('gulp-typescript');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = tsc.createProject('tsconfig.json');
const gulp_tslint = require('gulp-tslint');
const gutil = require('gulp-util');
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const mocha = require('gulp-mocha');

//--- Configurations Constants ---

var paths = {
    sourceRoot: "./",
    webroot: "./deploy/",
    node_modules: "./node_modules/",
    typings: "./typings/",
    typescript_definitions: "./typings/main/**/*.ts",
};

paths.typescript_in = paths.sourceRoot + "src/";
paths.typescript_out = paths.webroot + "output"

paths.allTypeScript = paths.typescript_in + "**/*.ts";
paths.modulesDestination = paths.webroot + "vendors/";

paths.style_in = paths.sourceRoot + "styles/";
paths.style_out = paths.webroot + "styles/";



paths.files_out = paths.webroot + "files";

paths.scss_in = paths.sourceRoot + "src/styles/**/*.scss";
paths.scss_out = paths.webroot + "styles/";

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

    gulp.src("./src/index.html").pipe(gulp.dest(paths.webroot));
});


gulp.task("build", function () {
    var sourceTsFiles = [paths.typescript_in, paths.typescript_definitions];
    var compilationResults = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
    compilationResults.dts.pipe(gulp.dest(paths.typescript_out));
    return compilationResults.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.typescript_out))
        .pipe(connect.reload());
});

gulp.task("buildall", ["clean", "copy", "build", "scss"], function (callback) {
    callback();
});


gulp.task("tslint", () => {
    return gulp.src(['**/*.ts', '!**/*.d.ts', '!node_modules/**'])
        .pipe(gulp_tslint())
        .pipe(gulp_tslint.report());
});

gulp.task("buildsinglefile", () => {
    const arguments = process.argv;
    const pathWithFileNameToCompile = arguments[7];
    const pathWithoutFileNameForOutput = arguments[5].replace(arguments[3], ".").replace("\\src\\", "\\output\\");

    const step1 = gulp.src(pathWithFileNameToCompile)
        .pipe(sourcemaps.init())
        .pipe(tsc({
            "target": "es6",
            "module": "amd"
        }))

    step1.pipe(gulp.dest(pathWithoutFileNameForOutput));

    step1.dts.pipe(gulp.dest(pathWithoutFileNameForOutput));
    return step1.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(pathWithoutFileNameForOutput));
});

gulp.task('watch', function () {
    gulp.watch(paths.typescript_in + '/*.ts', ['build']);
});

gulp.task('server', function () {
    connect.server({
        root:  paths.webroot,
        livereload: true,
        port: 8080
    });
});

gulp.task('go', ["server", "watch"], function () {

});

gulp.task("scss", function () {
    gulp.src(paths.scss_in)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(paths.scss_out));
});

gulp.task("tests", function () {
    var compilationResults = gulp.src(paths.typescript_in +"/**/*.spec.ts")
        .pipe(tsProject("tsconfigtest.json", {module: "amd"}))
        .pipe(gulp.dest(paths.typescript_out));
});