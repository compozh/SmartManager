const autoprefixer = require('autoprefixer');
module.exports = ({ options }) => {
	const plugins = [
		autoprefixer({
			browsers: ['ie >= 8', 'last 4 version']
		})
	];
	if (options.env === 'production') plugins.push(require('cssnano'));
	return {
		plugins: plugins
	};
};