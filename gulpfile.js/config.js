"use strict";

module.exports = {
    // generate css from scss + autoprefixer
    styles: {
        watchSource: "./src/*.scss",
        generateSourcemap: false,
        files: {
            ["./src/UserCentricsOptIn.scss"]: "./dist/"
        }
    },

    js: {
        // minify single js files
        watchSource: "./src/*.js",
        files: {
            // requirejs
            ["./src/UserCentricsOptIn.js"]: "./dist/"
        }
    },

    // configuration for babel(...)
    babel: {
        presets: [
            [
                "@babel/env",
                {
                    modules: false
                }
            ]
        ]
    }
};
