const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    entry: './src/server/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                options: {
                    presets: [
                        '@babel/preset-react',
                        '@babel/env'
                    ]
                }
            }
        ]
    },
    externals: [webpackNodeExternals()]
}