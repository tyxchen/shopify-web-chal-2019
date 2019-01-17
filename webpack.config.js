const webpack = require('webpack'), path = require('path');

module.exports = {
    entry: './src/index.jsx',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.css', '.js', '.jsx']
    },
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: 'bundle.js'
    }
};
