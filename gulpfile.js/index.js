"use strict";

const gulp = require("gulp");
const plugins = require("gulp-load-plugins")();

// load configuration for tasks
const config = require("./config");

/**
 * Method to load a task dynamically.
 * @param {string} task
 */
let getTask = task => {
    return require("./gulp-tasks/" + task)(gulp, plugins, config);
};

// define scss tasks
gulp.task("scss", getTask("scss"));
gulp.task("watch_scss", () => {
    return gulp.watch(config.styles.watchSource, gulp.series("scss"));
});

// define js single tasks
gulp.task("js", getTask("js"));
gulp.task("watch_js", () => {
    return gulp.watch(config.js.watchSource, gulp.series("js"));
});

// task to build all in once
gulp.task("build", gulp.series("scss", "js"));

// task to watch js and scss files
gulp.task("watch", gulp.parallel("watch_scss", "watch_js"));
