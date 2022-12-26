const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
    mode: NODE_ENV,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
    },
    devtool: NODE_ENV === 'development' ? "eval-cheap-module-source-map" : null,
    watch: NODE_ENV === 'development',
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              "style-loader",
              // Translates CSS into CommonJS
              "css-loader",
              // Compiles Sass to CSS
              "sass-loader",
            ],
          },
        ],
      },
}