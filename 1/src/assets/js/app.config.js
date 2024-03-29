const APP_CONFIG = {
    apiUrls: {
        DOWNLOAD_URL:'/download',//app下载url
        REGISTER: "/register",
        LOGIN: '/login',
        CAPTCHA: "/captcha",//验证码
        CAPTCHA_SETUP: "/captcha/info",//登陆注册设定
        CAPTCHA_IMG:"/captcha/puzzle",//拼图验证码
        CAPTCHA_VER:"/captcha/puzzle/ver",//拼图验证码验证
        DefaultAgentResp: "/default/agent",
        NOTICE:"/notice",//公告
        LOGIN_OUT:"/logout",
        REGISTER_AGREEMENT: "/register/protocol",//注册协议
        INDEX_QS:"/message/investigationid",


        /**钱包- -start*/
        WALLET_INFO: "/wallet/info",//钱包-刷新余额
        MEMBER_CENTER: "/member/center",
        PURSE_AUDIT: "/audit",//钱包-即时稽核查询

        //钱包-存款
        PURSE_ONLINE_COMPANY_LIST: "/income/bank/list",//线上入款 公司入款方式列表
        PURSE_COMPANY_ADD: "/company/add",//公司入款
        PURSE_COMPANY_INFO: "/company/income/info",//公司入款-信息

        PURSE_ONLINE_ADD: "/online/add",//线上入款
        PURSE_ONLINE_INFO:"/online/income/info",//线上入款-信息
        PURSE_ONLINE_THREE:"/online/buy",//线上入款-跳转第三方
        PURSE_ONLINE_BANK: "/online/bank",//线上入款-银行卡下拉列表
        PURSE_ONLINE_POINT_CARD:"/online/point/card",//线上入款-点卡下拉列表

        //钱包-取款
        PURSE_WITHDRAW_INFO: "/withdraw/info", //取款详情
        PURSE_WITHDRAW_OUT: "/withdraw/out", //取款
        PURSE_WITHDRAW_CONTINUE: "/withdraw/continue", //继续取款

        //钱包-额度转换
        PURSE_CONVERSION: "/member/conversion",//转入，转出
        PURSE_CONVERSION_SET_FAST: "/balance/ratio/edit",//设置快捷转入
        PURSE_CONVERSION_SET_FAST_INFO: "/balance/ratio/get",//获取设置的快捷转入数据
        PURSE_CONVERSION_RETRUN_MONEY:"/member/conversion/back",//一键归户
        PURSE_CONVERSION_MODE_CHANGE:"/member/freeWalletSwitch/edit", //免转钱包或多钱包模式切换提交


        //钱包-公司入款，线上入款，取款，额度转换记录
        PURSE_RECORD: "/order/detail",
        PURSE_ORDER_INFO:"/income/info",

        //返水
        PURSE_BACK_WATER_INFO: "/backwater/info",//自助反水查询
        PURSE_BACK_WATER_LIST: "/backwater/list",//自助反水记录
        PURSE_BACK_WATER_RECEIVE: "/backwater/receive",//领取返水

        //返佣
        PURSE_BACK_REBATE: "/rebate",//返佣列表和基本信息
        
        //现金流水
        PURSE_MONEY_RECORD:"/cash/record",//现金流水记录
        /**钱包- xwl -end*/







        //个人中心接口
        //用户信息 -个人资料
        MEMBER_INFO: '/member/info',
        MEMBER_INFO_EDIT: '/member/info/edit', //修改个人资料
        MEMBER_BANK_LIST: '/member/bank/list', //银行卡下拉列表
        MEMBER_BANK_ADD: '/member/bank/add', //添加银行卡
        BANK_LIST:'/bank/list',//银行卡下拉列表
        DEF_BANK_EDIT:'/default/bank/edit',//设为默认银行卡
        MEMBER_BANK_DEL:'/member/bank/del',//删除银行卡
        BANK_USER_NAME:'/username/exist',//银行卡下拉列表

        UNREAD_NUM: '/unread/num',//消息未读数
        NOTICE_LIST: '/notice/list',//公告消息列表
        MSG_LIST: '/message/list',//通知消息列表
        MSG_GET: '/message/get',//消息读取
        MSG_DEL: '/message/del',//消息删除
        PROXY_ADD: '/proxy/add',//代理申请添加
        PROXY_INFO:'/proxy/info',//代理申请设置

        //联系我们
        CONTACTUS: '/contact',
        MORE: '/contact/more',


        //推广
        SPREAD: '/spread',
        SPREAD_GAME_TYPE:"/spread/gametype",//获取添加推广链接彩种数据
        SPREAD_ADD:"/spread/add",//添加推广链接
        SPREAD_LIST:"/spread/list",//推广链接列表
        SPREAD_DELETE:"/spread/delete",//推广链接 删除
        SPREAD_MEMBER:"/spread/member",//会员管理 列表






        //活动
        ACTIVITY_LIST: "/activity/list",
        ACTIVITY_INFO: "/activity/info",
        ACTIVITY_RECEIVE: "/activity/receive",
        PROMOTION_LIST: "/promotion/list",
        PROMOTION_INFO: "/promotion/info",
        PROMOTION_APPLY: "/promotion/apply",
        PROMOTION_RECORD: "/promotion/record",//自助优惠记录
        GET_ACTIVITY_RECORD:"/activity/log",//活动领取记录
        PROMOTION_CAN: "/isselfhelp",//是否开启

        TURNTABLE_SHOW:"/turntable",
        TURNTABLE_SHOW_LOGIN:"/turntable/noauth",
        TURNTABLE_INFO:"/turntable/info",
        TURNTABLE_LOTTERY:"/turntable/lottery",
        TURNTABLE_RECEIVE:"/turntable/receive",
        TURNTABLE_LOG:"/turntable/log",
        //修改密码
        PASSWORD_EDIT:"/member/password/edit",
        PASSWORD_QUERY: "/member/withdrawal/issetup",

        ///订单 类型下拉
        REPORT_DROP:"/report/drop",
        REPORT_LIST: "/report/info",
        REPORT_KIND_DROP:"/lottery/ticket/drop",
        REPORT_ORDER:"/total/report/account",//报表

        //games
        HOTGAMES_ADV:"/game/adv",//广告推荐游戏
        GAMES_ADV:"/games/adv",//游戏大厅广告轮播
        ADV_STATISTICS:'/adv/statistics',//广告统计
        LOGIN_POP_NOTICE:"/message/popup",//获取用户登录了的弹窗公告

        //维护
        MAINTAIN_INFO:"/maintain/info",

        //index
        LOGINGAME:"/member/logingame",//进入游戏
        RATIO:"/balance/ratio",//首页查看是否设置自动转入和当天首存
        REDBAG:"/red/receive",//红包
        //-----修改后接口
        INDEX_INFO:"/index/data",//首页数据
        ALLGAMES:"/product/type",//所有游戏
        HISTORYGAMES:"/recent",//玩过的游戏
        THREEWAYLOGIN_INFO:'/third/login/info',//是否有三方
        THREEWAYLOGIN_QQ_OPTIONS:"/threewaylogin/qq/options", //三方登录
        THREEWAYLOGIN_QQ_LOGIN: "/qqlogin",//三方登录回调登录
        //------问卷
        INCESTIGATION_MESSAGE_LIST: "/message/investigationlist",
        INCESTIGATION_MESSAGE_INFO:"/message/investigationinfo",
        INCESTIGATION_MESSAGE_SEND:"/message/investigationsubmit",
        INCESTIGATION_MESSAGE_ANSWER_INFO:"/message/investigationquery",
        //----------我要推广
        //----推广统计
        STATIS_LIST:"/spread/count",
        SUBORDINATE_LIST:"/spread/report",

    },
    RegExp: {
        pwd: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
        number: /^[1-9]\d*$/, //非0正整数
        outMoneyPwd: /^\d{6}$/, //取款密码
        num: /^[0-9]+([.]{1}[0-9]+){0,1}$/, //正数+小数
        url: /^((https|http|ftp|rtsp|mms):\/\/)[^\s]+/,
        depositMoney: /^\d{1,8}(\.\d{1,2})?$/,
        structPassword:/^(?=.*[~`!@#$%^&*+-/=/_()|<\{\}\[\],.;:'"//\?\\/>])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9~`!@#$%^&*+-/=/_()|<\{\}\[\],.;:'"//\?\\/>]{6,20}$/,
        bankcard: /^([1-9]{1})(\d{15,18})$/,
    },
    constant: {
        timerDrop: [
            {
                key: 1,
                value: "最近两小时"
            },
            {
                key: 2,
                value: "今天"
            },
            
            {
                key: 3,
                value: "最近一周"
            },
            {
                key: 4,
                value: "最近一个月"
            },
            {
                key: 5,
                value: "最近三个月"
            }
        ]
    }
}
export default APP_CONFIG;
