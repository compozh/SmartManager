const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const bundleFileName = 'index';
const dirName = 'wwwroot/js';

module.exports = (env, argv) => {
	return {
		mode: argv.mode === "production" ? "production" : "development",
		entry: ['./Frontend/index.js', './Frontend/sass/index.scss'],
		output: {
			filename: bundleFileName + '.js',
			path: path.resolve(__dirname, dirName)
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
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '../css/' + bundleFileName + '.css'
			})
		]
	};
};