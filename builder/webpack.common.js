const path = require('path');

module.exports = {
    entry: path.join(__dirname, '../src/index.js'),
    resolve: {
        extensions: ['.js', '.json', '.png', '.jpg', '.mp3', '.svg', '.css', '.gif', '.mp4'],
        alias: {
            assets: path.join(__dirname, '../assets')
        }
    },
    output: {
        filename: 'build.js',
        path: path.join(__dirname, '../dist/'),
        publicPath: '',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(gif|png|jpe?g|svg|mp3|m4a|ogg|wav|json$)$/i,
                type: 'asset/inline'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/inline'
            }
        ]
    },
    plugins: []
};
