var ps = require('process');
var webpackHtmlPlugin = require('html-webpack-plugin');
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_PREFIX : '', // 部署应用包时的基本 URL
    outputDir: 'dist',  // 执行npm run build时的本地打包地址
    assetsDir: "", // 相对于outputDir的静态资源(js、css、img、fonts)目录
    indexPath: 'index.html', // 指定生成的index.html相对于outputDir的地址，默认是index.html
    filenameHashing: true, // 是否给生成的静态资源在它们的文件名中加上 hash，以便更好的控制缓存，如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
    lintOnSave: process.env.NODE_ENV !== 'production', // 开发环境每次保存都执行eslint，在生产构建时禁用eslint
    runtimeCompiler: true,
    productionSourceMap: false, // 禁用生产环境的source map
    crossorigin: "anonymous",
    integrity:false,
    parallel: undefined,
    css: {
        extract: true,
    },
    devServer: {
        port: 8090,
        proxy: {
            '/api': {
                target: "http://192.168.11.200:7072",
                ws: false,
                changeOrigin: true, //是否跨域
            },
        },
        disableHostCheck: true
    }
}
