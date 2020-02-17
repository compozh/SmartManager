const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const jsDirName = 'wwwroot/js';
module.exports = (env, argv) => {
	return {
		mode: argv.mode === "production" ? "production" : "development",
		entry: {
			index: './Frontend/index.js',
			edsexecutor: './Frontend/edsexecutor.js'
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, jsDirName)
		},
		module: {
			rules: [
				{
					test: /\.s[c|a]ss$/,
					use:
						[
							'style-loader',
							MiniCssExtractPlugin.loader,
							'css-loader',
							{
								loader: 'postcss-loader',
								options: {
									config: {
										ctx: {
											env: argv.mode
										}
									}
								}
							},
							'sass-loader'
						]
				},
				{
					test: /\.m?js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '../css/index.css'
			})
		]
	};
};