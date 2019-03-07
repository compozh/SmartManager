const path = require('path')
const webpack = require('webpack')
//const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const bundleOutputDir = './wwwroot/dist'

module.exports = () => {
  console.log('Building for \x1b[33m%s\x1b[0m', process.env.NODE_ENV)

  const isDevBuild = !(process.env.NODE_ENV && process.env.NODE_ENV === 'production')
  //const extractCSS = new MiniCssExtractPlugin ({'site.css'})
	

  return [{
	  mode:process.env.NODE_ENV,
	  stats: { modules: false },
    entry: { 'main': './ClientApp/boot-app.js' },
    resolve: {
      extensions: ['.js', '.vue'],
      alias: isDevBuild ? {
        'vue$': 'vue/dist/vue',
        'components': path.resolve(__dirname, './ClientApp/components')
      } : {
        'components': path.resolve(__dirname, './ClientApp/components')
      }
    },
    output: {
      path: path.join(__dirname, bundleOutputDir),
      filename: '[name].js',
      publicPath: '/dist/'
    },
	  optimization: {
		  minimize: false
	  },
    module: {
      rules: [
        { test: /\.vue$/, include: /ClientApp/, use: 'vue-loader' },
        { test: /\.js$/, include: /ClientApp/, use: 'babel-loader' },
        { test: /\.css$/, use:  [isDevBuild ?'style-loader' :  MiniCssExtractPlugin.loader, 'css-loader'] },
        { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
      ]
    },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./wwwroot/dist/vendor-manifest.json')
      }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(isDevBuild? 'development': 'production')
		}),
		
		// new SWPrecacheWebpackPlugin({
		// 	cacheId: 'my-pwa-vue-app',
		// 	filename: 'service-worker-cache.js',
		// 	staticFileGlobs: ['dist/**/*.{js,css}', '/'],
		// 	//minify: true,
		// 	stripPrefix: '/',
		// 	dontCacheBustUrlsMatching: /\.\w{6}\./
		// }),
		new CopyWebpackPlugin([
			{ from: './ClientApp/static', to: 'static', toType:"dir" }
		]),
	    new CopyWebpackPlugin([
			{ from: './ClientApp/service-worker.js', to: '../../wwwroot', toType: "dir" }
	    ]),
    ].concat(isDevBuild ? [
      // Plugins that apply in development builds only
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map', // Remove this line if you prefer inline source maps
        moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
      })
    ] : [
      // Plugins that apply in production builds only
		new MiniCssExtractPlugin({
			filename: isDevBuild ? 'site.css' : 'site.css',
		}),
      // Compress extracted CSS.
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      })
    ])
  }]
}
