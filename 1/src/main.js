import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './assets/js/flexible'

//复制
import VueClipboard from 'vue-clipboard2';

Vue.use(VueClipboard);
VueClipboard.config.autoSetContainer = true;

//二维码
import VueQriously from 'vue-qriously';
Vue.use(VueQriously);

//mint-ui
import MitUI from 'mint-ui';

require('swiper/dist/css/swiper.css')


import 'mint-ui/lib/style.css';
import {
    Lazyload
} from 'mint-ui';

Vue.use(Lazyload, {
    error: require('./assets/img/error_img.png'),
    loading: require('./assets/img/icon_loadingimage.gif')

});
Vue.use(MitUI);


import APP_CONFIG from './assets/js/app.config';

Vue.prototype.APP_CONFIG = APP_CONFIG;
import * as filters from './filter';

Object.keys(filters).forEach(k => Vue.filter(k, filters[k])) //注册过滤器
Vue.prototype.filterDate = filters.filterDate; //时间过滤方法
Vue.prototype.filterAmount = filters.filterAmount;//数字金额大写中文转换
Vue.prototype.ModalHelper = filters.ModalHelper;

import $ from 'jquery';
import './lib/verify';


Vue.prototype.$ = $;
Vue.prototype.HTML_FONT_SIZE = parseInt(document.documentElement.style.fontSize);



Vue.config.productionTip = false;

//验证，国际化
import VeeValidate, {
    Validator
} from 'vee-validate';
import cn from 'vee-validate/dist/locale/zh_CN';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: 'cn'
});
Vue.use(VeeValidate, {
    i18n,
    dictionary: {
        cn
    }
});

const dict = {
    cn: {
        messages: {
            pwd: (name) => `${name}格式不正确!`,
            paswed: (name) => `密码为6-20位字母和数字组合!`,
            num: (name) => `${name}格式不正确!`,
            is: (name) => `${name}不匹配!`,
            required: (name) => `${name}不能为空!`,
            between: ((name, value) => {
                return `${name}必须在${value[0]}之间`
            }),
            bankcard: (name) => `${name}银行卡号规则为16-19位数字`,
            numeric: (name) => `${name}必须为整数`,
            depositMoney: (name) => `金额为0.00-99999999.99`,
            structPassword: (name) => '密码长度6~20位，必须包含大小写字母、数字和特殊字符',

        },
        attributes: {
            account: "账户",
            password: "密码",
            captcha: "验证码",
            confirmPassword: "确认密码",
            introducer: "介绍人",
            name: "姓名",
            nickName: "昵称",
            idCard: "身份证",
            telephone: "手机",
            email: "邮箱",
            wechat: "微信号",
            localhost: "所在地",
            birthday: "出生日期",
            agencyAccount: "代理账号",
            englishNickName: "英文昵称",
            chineseNickName: "中文昵称",
            promoteSite: "推广网址",
            otherPromoteWay: "其它方式",
            remark: "备注",
            bankName: "银行账号",
            bankAddress: "支行地址",
            bankUser: "户主",
            bankLocal: "开户行网点",
            bankId: "银行卡号",
            oldPwd: "原密码",
            newPwd: "新密码",
            loginPwd: "登录密码",
            outPwd: "取款密码",
            oldoutPwd: "原取款密码",
            confirmOutPwd: "重复输入的取款密码",
            sxPwd: "视讯密码",
            money: "金额",
            reason: "申请理由",
            inAccount: "存款账号",
            inTime: "存款时间",
            cardType: "卡类型",
            serialNumber: "序列号",
            inUser: "存款人",
        }
    } // name接受alias的值.
}
Validator.localize(dict);
Validator.extend('pwd', {
    validate: value => {
        return APP_CONFIG.RegExp.pwd.test(value)
    }
});
Validator.extend('paswed', {
    validate: value => {
        return APP_CONFIG.RegExp.pwd.test(value)
    }
});
Validator.extend('bankcard', {
    validate: value => {
        return APP_CONFIG.RegExp.bankcard.test(value)
    }
});

Validator.extend('chineseNickName', {
    validate: value => {
        let strRegex = /^[\u4e00-\u9fa5]{0,}$/
        let re = new RegExp(strRegex);
        return re.test(value)
    }
});

Validator.extend('structPassword', {
    validate: value => {
        return APP_CONFIG.RegExp.structPassword.test(value)
    }
});

Validator.extend('num', {
    validate: value => {
        return APP_CONFIG.RegExp.num.test(value)
    }
});
Validator.extend('qq', {
    validate: value => {
        let strRegex = '[1-9][0-9]{4,}'
        let re = new RegExp(strRegex);
        return re.test(value)
    }
});
// 111111111111111111
Validator.extend('http', {
    validate: value => {
        let strRegex = '^((https|http|ftp|rtsp|mms)?://)'
            + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
            + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
            + '|' // 允许IP和DOMAIN（域名） 
            + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
            + '[a-z]{2,6})' // first level domain- .com or .museum 
            + '(:[0-9]{1,4})?' // 端口- :80 
            + '((/?)|' // a slash isn't required if there is no file name 
            + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
        let re = new RegExp(strRegex);
        return re.test(value)
    }
});

Validator.extend('idCard', {
    validate: value => {
        let strRegex = '^([0-9]{17}|[0-9]{14})'
            + '([0-9]{1}|[xX]{1})$'
        let re = new RegExp(strRegex);
        return re.test(value)
    }
});

Validator.extend('chineseNickName', {
    validate: value => {
        let strRegex = /^[\u4e00-\u9fa5]{0,}$/
        let re = new RegExp(strRegex);
        return re.test(value)
    }
});


function commonsValidate (str, reg) {
    return Validator.extend(str, {
        validate: value => {
            let strRegex = reg
            let re = new RegExp(strRegex);
            return re.test(value)
        }
    });
}


//路由拦截用户是否登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(m => m.meta.auth)) {
        if (sessionStorage.getItem("session")) { // 已经登录   
            next() //正常跳转到设置好的页面     
        } else {
            // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
            next({
                name: 'login',
                query: {
                    Rurl: to.fullPath
                }
            })
        }
    } else {
        next()
    }
})


//----
let title = localStorage.getItem('nodeTitle') || "";
document.title = title;

new Vue({
    i18n,
    router,
    render: h => h(App),
}).$mount('#app')