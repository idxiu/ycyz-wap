function JsBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback]; // 创建一个 WVJBCallbacks 全局属性数组，并将 callback 插入到数组中。
    var WVJBIframe = document.createElement('iframe'); // 创建一个 iframe 元素
    WVJBIframe.style.display = 'none'; // 不显示
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'; // 设置 iframe 的 src 属性
    document.documentElement.appendChild(WVJBIframe); // 把 iframe 添加到当前文导航上。
    setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}

// 使用方法如下
/*
JsBridge(function (bridge) {
    /**
     * oc 调用 js 的方法
     * 参数1 双方定义的方法名
     * 参数2 函数 data oc传给js的数据 
     *      responseCallback 是js调用完毕之后传递给oc的数据
     *
    bridge.registerHandler('changeBGColor', function (data, responseCallback) {
        document.body.style.backgroundColor = "orange";
        document.getElementById("returnValue").value = data;
        responseCallback({ data: "js 的数据", from: "JS" });
    });

    /**
     * js 调用 oc 的方法
     * 参数1 双方定义的方法名
     * 参数2 js给oc传递的数据
     * 参数3 oc会在该函数里面返回给js数据
     *
    bridge.callHandler('colorClick', { data: 'bbb' }, function (dataFromOC) {
        document.getElementById("returnValue").value = dataFromOC;
    })

});
*/

window.JsBridge = JsBridge;

export const js2oc = {
    CLEAR_CACHE: 'clearCache',              //清除缓存         
    GET_DEVICE_INFO: 'getDeviceInfo',       //获取设备信息      
    GET_VERSION_INFO: 'getVersionInfo',     //获取版本信息   
    SET_TOKEN: 'setToken',                  //给oc发送token 
    LOGOUT: 'logout',                       //退出登录      
    COPY_DEVICE_INFO: 'copyDeviceInfo',     //复制设备信息
}

