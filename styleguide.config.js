'use strict';
/*global __dirname*/
var glob = require("glob")

module.exports = {
	title: 'Components',
	sections: [
		{ name: 'UI Chart Components', content: './docs/heading.md'}, 
		{ name: 'Viz Components', content: './docs/visualization.md', components: 'src/components/visualization/**/[A-Z]*.js' }
	],
	defaultExample: true,
	showUsage: true,
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
				{
					test: /\.css$/,
					loader: 'style-loader!css-loader',
				},
			],
		},
	},
};
