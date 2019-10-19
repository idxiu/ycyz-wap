let http = {}
// nginx 作为代理服务器，解决跨域问题
// let _baseURL="vpaas"
import Vue from 'vue';
import router from '../router';

const vue = new Vue({
    router
});
let _baseURL = ""
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
    /*第二层if，根据.env文件中的VUE_APP_FLAG判断是生产环境还是测试环境*/
    if (process.env.VUE_APP_FLAG === 'pro') {
        //production 生产环境
        _baseURL = '/app/api/v1';

    } else {
        //test 测试环境
        _baseURL = '/app/api/v1';

    }
} else {
    //dev 开发环境
    _baseURL = 'http://192.168.11.200:7072/app/api/v1';
}

// 用 CorsFilter 解决前台跨域
// let _baseURL = "http://192.168.11.200:7072/app/api/v1";
//----打包
// let _baseURL = "/app/api/v1"


//节流
function throttle(fn, interval) {
    let timer;
    return function () {
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
            fn()
        }, interval || 1000);
    }
}

http.request = function (opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = _baseURL + (opt.url || '');
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () {};
    opt.error = opt.error || function () {};
    let TOKEN = sessionStorage.getItem("session");
    // 创建ajax 对象
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
        xmlHttp.withCredentials = true;
        xmlHttp.responseType = "arraybuffer";
    } else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        xmlHttp.withCredentials = true;
    }
    var postData = opt.data;
    //post 方法
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Accept', 'application/protobuf');
        xmlHttp.setRequestHeader('Content-Type', 'application/protobuf;charset=utf-8');
        xmlHttp.setRequestHeader('sid', TOKEN);
        xmlHttp.send(postData);
    }

    // 读取请求相应的状态
    console.log(opt.url)
    var isAdvs = opt.url.indexOf('/games/adv') >= 0;
    var time = isAdvs ? 0 : 1000;
    if(!isAdvs){
        Vue.$indicator.open();
    }
    xmlHttp.onreadystatechange = throttle(function () {
        if (xmlHttp.readyState == 4) {
            Vue.$indicator.close();
            if (xmlHttp.status == 200 || xmlHttp.status == 204) {
                opt.success(xmlHttp.response);
            } else {
                if (xmlHttp.status == 401) {
                    vue.$toast({
                        message: '登录过期，请重新登录',
                        duration: 2000
                    });
                    vue.$router.push("/login");
                } else if (xmlHttp.status == 402) {
                    vue.$router.push("/maintainweb");
                } else {
                    opt.error(xmlHttp.response);
                }
            }
        }
    }, time);
}

export default http;