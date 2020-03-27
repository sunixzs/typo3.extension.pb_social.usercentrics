"use strict";

const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

sass.compiler = require("dart-sass");

/**
 * Task to render css from scss.
 */
module.exports = (gulp, plugins, config) => {
    return () => {
        let mergedStreams = require("merge-stream")();
        let scssPlugins = [autoprefixer()];

        for (let key in config.styles.files) {
            console.log(plugins.color("scss -> css: ", "BLUE") + plugins.color(key, "CYAN"));
            console.log(plugins.color("         to: ", "BLUE") + plugins.color(config.styles.files[key], "CYAN"));
            let stream = gulp
                .src(key)
                // build scss
                .pipe(
                    plugins
                        .sass({
                            sourceMap: false,
                            outputStyle: "compressed"
                        })
                        .on("error", sass.logError)
                )

                // call autoprefixer
                .pipe(postcss(scssPlugins))

                // write file
                .pipe(gulp.dest(config.styles.files[key]));

            mergedStreams.add(stream);
        }

        return mergedStreams.isEmpty() ? null : mergedStreams;
    };
};
