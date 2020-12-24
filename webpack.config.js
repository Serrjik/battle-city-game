const path = require('path')

module.exports = {
	entry: {
		// Для продакшена.
		GameEngine: './engine/index.js',
		// Для отладки.
		app: './game/index.js'
	},
	output: {
		// 2 свойства ниже используются для сборки и для виртуальной сборки.
		filename: '[name].js',
		path: path.join(__dirname, '/dist'),

		// 4 свойства ниже используются для сборки.
		publicPath: '/dist',
		// Имя после сборки.
		library: 'GameEngine',
		// Для какой системы собирается движок.
		libraryTarget: 'umd',
		/*
			К какому глобальному объекту будут обращаться
			внутренние методы классов и функций.
		*/
		globalObject: 'this'
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: '/node_modules/'
		}]
	},
	devServer: {
		overlay: true
	}
}