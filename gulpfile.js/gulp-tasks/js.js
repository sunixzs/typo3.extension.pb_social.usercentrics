"use strict";

const babel = require("gulp-babel");

/**
 * Task to minify/uglify js files.
 */
module.exports = (gulp, plugins, config) => {
    return () => {
        // Minifies the js files
        var mergedStreams = require("merge-stream")();

        for (var key in config.js.files) {
            console.log(plugins.color("js -> uglify: ", "BLUE") + plugins.color(key, "CYAN"));
            console.log(plugins.color("          to: ", "BLUE") + plugins.color(config.js.files[key], "CYAN"));
            var stream = gulp
                .src(key)
                .pipe(babel(config.babel))
                .pipe(plugins.uglify())
                .pipe(gulp.dest(config.js.files[key]));

            mergedStreams.add(stream);
        }

        return mergedStreams.isEmpty() ? null : mergedStreams;
    };
};
