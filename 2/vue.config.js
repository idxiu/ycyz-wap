const ps = require('process');
const isProduction = ps.env.NODE_ENV === "production";
const merge = require('webpack-merge');
module.exports = {
	publicPath: "wap",

	devServer: {
		port: 8091,
		proxy: {
			"/app/api/v2": {
               target: "https://zzya.pkbeta.com",
				// target: "https://pkplus.org",
				// target: "http://front-aaaa.pkplus.local",
				// target: "http://10.18.3.30:7072",
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
					'@import "@nutui/nutui/dist/styles/index.scss";@import "@/components/scss/skin.scss";@import "@/components/scss/common.scss"; '
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
						limit: 51200 /// 文件大小（低于50Kb才会base64编码）
					})
				);
		}
		
	}
};
