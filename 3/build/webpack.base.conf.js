'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
const publicPath = require("../src/configs").publicPath
module.exports = {
	context: path.resolve(__dirname, "./"),
	entry: {
		app: "./src/main.js"
	},
	output: {
		// path: config.build.assetsRoot,
		// filename: 'pk-skin.min.js',
		path: path.resolve(__dirname, "dist"),
		filename: "[name].bundle.js",
		publicPath: publicPath
		// process.env.NODE_ENV === "production" ? "./" : "/"
	},
	resolve: {
		extensions: [".js", ".vue", ".json"],
		alias: {
			vue$: "vue/dist/vue.esm.js",
			"@": path.resolve(__dirname, "./src")
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				include: [path.resolve(__dirname, "./src")],
				// exclude: [/node_modules/, /vue-swipe-actions/]
				options: {
					//预设
					presets: ["@babel/preset-env"],
					plugins: ["syntax-dynamic-import", "@babel/transform-runtime"]
				}
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: "url-loader",
				// loader: "file-loader",
				options: {
					limit: 100000000000,
					outputpath: "/assets/",
					// name: utils.assetsPath("img/[name].[ext]")
					name: "imgs/[name].[ext]"
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: utils.assetsPath("media/[name].[hash:7].[ext]")
				}
			},
			{
				test: /\.less$/,
				loader: "style-loader!css-loader!less-loader"
			},
			// {
			//     test: /\.(sa|sc)ss$/,
			//     include: [resolve("src")],
			//     use: [
			//         {
			//             loader: "style-loader!css-loader!sass-loader!postcss-loader",
			//             options: {
			//                 data: `@import "@nutui/nutui/dist/styles/index.scss";@import "@/components/scss/skin.scss";@import "@/components/scss/common.scss"; `
			//             }
			//         }
			//     ]
			// },
			// {
			// 	test: /\.(css|scss|sass)$/,
			// 	include: [],
			// 	loader: ["style-loader", "css-loader", "sass-loader", "postcss-loader"]
			// },
			{
				// 增加对 SCSS 文件的支持
				test: /\.(sa|sc)ss$/,
				include: [path.resolve(__dirname, "./src/assets")],
				// SCSS 文件的处理顺序为先 sass-loader 再 css-loader 再 style-loader
				use: [
					"style-loader",
					"css-loader",
					{
						loader: "sass-loader"
						// options: { webpack4 vue-cli3
						// 	data: `@import "@/styles/skin.scss";@import "@/styles/common.scss";@import "@nutui/nutui/dist/styles/index.scss";`
						// }
					}
				]
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 100000000000,
					name: utils.assetsPath("fonts/[name].[ext]")
				}
			},
			{
				test: /\.styl(us)?$/,
				use: ["vue-style-loader", "css-loader", "stylus-loader"]
			}
		]
	}
};
