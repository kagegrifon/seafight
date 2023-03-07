/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
    mode: NODE_ENV,
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.[contenthash].js",
        assetModuleFilename: path.join("images", "[name].[contenthash][ext]"),
        clean: true,
    },
    devtool: NODE_ENV === "development" ? "inline-source-map" : null,
    // watch: NODE_ENV === 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: "/node_modules/",
            },
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
            {
                test: /\.html$/,
                use: "html-loader",
            },
            {
                test: /\.(jpg|png|jpeg|gif)$/,
                type: "asset/resource",
            },
            {
                test: /\.svg$/,
                type: "asset/resource",
                generator: {
                    filename: path.join("icons", "[name].[contenthash][ext]"),
                },
            },
        ],
    },
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "template.html"),
            filename: "index.html",
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        hot: true,
        compress: true,
        port: 9000,
        open: true,
    },
};
