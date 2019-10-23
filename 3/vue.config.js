/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-05 09:25:57
 * @LastEditTime: 2019-10-05 13:14:44
 * @LastEditors: Please set LastEditors
 */
const merge = require('webpack-merge');
const ps = require('process');
// const path = require("path");
const isProduction = ps.env.NODE_ENV === "production";

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
	publicPath: "wap",
	
	devServer: {
		port: 8092,
		proxy: {
			"/app/api/v2": {
				// target: "https://www.pkplus.org",
				// target: "http://192.168.11.200:7072", //dev
				// target: "http://10.18.3.30:7072", //127
				// target: "http://10.18.3.39:7072", //135
				target: "https://zzya.pkbeta.com", //test
				ws: false,
				changeOrigin: true //是否跨域
			}
		},
		disableHostCheck: true
	},

	outputDir: undefined,
	assetsDir: undefined,
	runtimeCompiler: undefined,
	productionSourceMap: false,
	parallel: undefined,

	css: {
		loaderOptions: {
			sass: {
				data:
					'@import "@/styles/skin.scss";@import "@/styles/common.scss";@import "@nutui/nutui/dist/styles/index.scss";'
			},
			stylus: {
				"resolve url": true,
				import: ["./src/theme"]
			}
		}
	},

	pluginOptions: {
		"cube-ui": {
			postCompile: true,
			theme: true
		}
    },
    chainWebpack: config => {
			if(isProduction){
				config.module
					.rule('fontfile')
						.test(/\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/)
						.pre()
						.include
						.add('/src/assets')
						.add('/src/assets/img')///loading.svg
						.end()
						.use('url-loader')
						.loader('url-loader')
						.tap(options =>
							merge(options, {
								limit: 100000000000 /// 文件大小（打包无限制base64编码）
							})
						)
				config.module
					.rule("images")
					.use("image-webpack-loader")
					.loader("image-webpack-loader")
					.options({
						bypassOnDebug: true
					});
				config.module
					.rule("images")
					.test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
					.use("url-loader")
					.loader("url-loader")
					.tap(options =>
						merge(options, {
							limit: 100000000000 /// 文件大小（无限制base64编码）
						})
					);
			}

	}
};
