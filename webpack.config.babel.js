import path from "path";
import fs from "fs";

export default {
    entry: (function () {
        var entry = {};

        fs.readdirSync("es2015/")
            .filter(_path  => {
                return fs.statSync(`es2015/${_path}`).isFile();
            })
            .map(_path =>{
                entry[path.parse(_path).name] = `./es2015/${_path}`;
                return `./es2015/${_path}`;
            });
        return entry;
    })(),
    output: {
        path: path.join(__dirname, '/js'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        loaders: [
            {
                test: /\.js|jsx$/,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                // We could restrict using json-loader only on .json files in the
                // node_modules/pixi.js directory, but the ability to load .json files
                // could be useful elsewhere in our app, so I usually don't.
                //include: path.resolve(__dirname, 'node_modules/pixi.js'),
                loader: 'json'
            },
            {
                test: /\.ts|tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    watch: true,
    devtool: 'source-map'
};