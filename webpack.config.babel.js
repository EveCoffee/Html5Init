import path from "path";

export default {
    entry: {
        'index': './es2015/index.js',
        "easel": "./es2015/easel.js"
    },
    output: {
        path: path.join(__dirname, '/js'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
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
            }
        ]
    },
    watch: true,
    devtool: 'source-map'
};