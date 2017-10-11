var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require("path");

module.exports = {
    context: path.join(__dirname, "src/includes/js"),
    devtool: debug ? "inline-sourcemap" : null,
    entry: {
        app: "./app.js"
    },
    output: {
        path: path.join(__dirname, "src/includes/js"),
        filename: "[name].min.js"
    },
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: true, sourcemap: false })
    ],
    module: {
        loaders: [{
            exclude: [
                "./node_modules/",
                "./build/",
                "./.vscode/"
            ],
            loader: "babel-loader"
        }]
    }
};