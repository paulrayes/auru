'use strict';

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');

function factory(version) {
	var filename, hammer, uglify;
	if (version === 'full') {
		filename = 'auru';
		hammer = true;
	}
	if (version === 'notouch') {
		filename = 'auru.notouch';
		hammer = false;
	}
	if (version === 'full.min') {
		filename = 'auru.min';
		hammer = true;
		uglify = true;
	}
	if (version === 'notouch.min') {
		filename = 'auru.notouch.min';
		hammer = false;
		uglify = true;
	}
	return {
		entry: './auru.js',
		output: {
			path: path.join(__dirname, 'build'),
			filename: filename + '.js',
			library: 'Auru',
			libraryTarget: 'umd' //var/umd
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: 'babel-loader'
				}
			]
		},
		plugins: (function() {
			var plugins = [];
			plugins.push(new webpack.DefinePlugin({
				'AURU_TOUCH_ENABLED': hammer
			}));
			if (uglify) {
				plugins.push(new webpack.optimize.DedupePlugin());
				plugins.push(new webpack.optimize.UglifyJsPlugin({
					sourcemap: true,
					compress: {
						unsafe: true,
						warnings: false
					},
					mangler: {
						screw_ie8: true
					}
				}));
			}
			plugins.push(function() {
				this.plugin('done', function(stats) {
					fs.writeFileSync(
						path.join(__dirname, 'build', filename + '.js.stats.json'),
						JSON.stringify(stats.toJson()));
				});
			});
			return plugins;
		})(),
		devtool: 'module-source-map'
	}
}

module.exports = [
	factory('full'),
	factory('notouch'),
	factory('full.min'),
	factory('notouch.min')
];
