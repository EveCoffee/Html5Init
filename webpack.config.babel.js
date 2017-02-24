import path from "path";
import fs from "fs";
import webpack from "webpack";

export default {
    entry: (function () {
        var entry = {};
        
        fs.readdirSync("es2015/")
            .filter(_path  => {
                return fs.statSync(`es2015/${_path}`).isFile() && [".ts", ".js"].indexOf(path.extname(`es2015/${_path}`)) !== -1;
            })
            .map(_path =>{
                entry[path.parse(_path).name] = `./es2015/${_path}`;
                return `./es2015/${_path}`;
            });
            
            //entry["lib"] = ["babel-polyfill"];
            
        return entry;
    })(),
    
    output: {
        path: path.join(__dirname, '/js'),
        filename: '[name].js'
    },
    
    plugin: [
        //new webpack.optimize.CommonsChunkPlugin("lib", "lib.js"),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        //new webpack.optimize.DedupePlugin()
    ],
    
    resolve: {
        extensions: ['', '.js', '.jsx', '.ts', '.tsx']
    },
    
    module: {
        loaders: [
            {
                test: /\.js|jsx$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.ts|tsx?$/,
                loaders: ['ts-loader'] 
            },
            {
                test: /\.scss|css$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            ,
            {
                test: /\.html$/,
                loaders: ['html-loader']
            },
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                loader: "url-loader?limit=50000"
            }
        ]
    },
    
    devtool: 'source-map'
};