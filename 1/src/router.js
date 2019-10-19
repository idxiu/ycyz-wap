import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            redirect: {
                name: 'index'
            },
        },
        //首页
        {
            path: '/index',
            name: 'index',
            component: () => import( /* webpackChunkName: "index" */ './views/index/Index.vue'),
        },
        {
            path: '/games',
            name: 'games',
            component: () => import( /* webpackChunkName: "index" */ './views/index/Games.vue'),

        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import( /* webpackChunkName: "index" */ './views/index/Settings.vue'),

        },
        //登录
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/auth/Login.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('./views/auth/Register.vue')
        },

        //活动
        {
            path: '/activity',
            name: 'activity',
            component: () => import( /* webpackChunkName: "activity" */ './views/activity/Activity.vue')
        },
        //活动详情
        {
            path: '/actDetail',
            name: 'actDetail',
            component: () => import( /* webpackChunkName: "activity" */ './views/activity/ActDetail.vue')
        },
        //活动领取记录
        {
            path: '/activityRecord',
            name: 'activityRecord',
            component: () => import( /* webpackChunkName: "activity" */ './views/activity/ActivityRecord.vue')
        },


        //幸运大转盘
        {
            path: '/luckdraw',
            name: 'luckdraw',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "activity" */ './views/activity/Luckdraw.vue')
        },
        //钱包
        {
            path: '/purse',
            name: 'purse',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "purse" */ './views/purse/Purse.vue')
        },
        //钱包-稽核查询
        {
            path: '/auditQuery',
            name: 'auditQuery',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "auditQuery" */ './views/purse/auditQuery/AuditQuery.vue')
        },
        //钱包余额
        {
            path: '/purseDeposit',
            name: 'purseDeposit',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "purseDeposit" */ './views/purse/PurseDeposit.vue')
        },
        //存款
        {
            path: '/deposit',
            name: 'deposit',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "deposits" */ './views/purse/deposit/Deposit.vue')
        },
        //存款-线上入款-支付宝/微信
        {
            path: '/online/alipay',
            name: 'onlineAlipay',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "onlineAlipay" */ './views/purse/deposit/DepositOnlineAlipay.vue')
        },
        //存款-线上入款-网银
        {
            path: '/online/ebank',
            name: 'onlineEBank',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "onlineEBank" */ './views/purse/deposit/DepositOnlineEBank.vue')
        },
        //存款-线上入款-点卡
        {
            path: '/online/timeCard',
            name: 'timeCard',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "timeCard" */ './views/purse/deposit/DepositOnlineTimeCard.vue')
        },
        //存款-线上入款/公司存款-支付返回结果页
        {
            path: '/payResult',
            name: 'payResult',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "payResult" */ './views/purse/deposit/DepositPayResult.vue')
        },
        //存款-线上入款/公司存款-支付成功页
        {
            path: '/paySuccess',
            name: 'paySuccess',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "paySuccess" */ './views/purse/deposit/DepositPaySuccess.vue')
        },
        //存款-公司存款-支付宝/微信
        {
            path: '/company/alipay',
            name: 'companyAlipay',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "companyAlipay" */ './views/purse/deposit/DepositCompanyAlipay.vue')
        },
        //存款-公司存款-银行卡
        {
            path: '/company/ebank',
            name: 'companyEBank',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "companyEBank" */ './views/purse/deposit/DepositCompanyEBank.vue')
        },

        //存款-线上存款/公司存款-记录
        {
            path: '/deposits/record',
            name: 'depositRecord',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "depositRecord" */ './views/purse/deposit/DepositRecord.vue')
        },

        //取款
        {
            path: '/withdraw',
            name: 'withdraw',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "withdraw" */ './views/purse/withdraw/Withdraw.vue')
        },
        //取款-稽核
        {
            path: '/withdraw/audit',
            name: 'withdrawAudit',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "withdrawAudit" */ './views/purse/withdraw/WithdrawAudit.vue')
        },
        //取款-成功
        {
            path: '/withdraw/success',
            name: 'withdrawSuccess',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "withdrawSuccess" */ './views/purse/withdraw/WithdrawSuccess.vue')
        },
        //额度转换
        {
            path: '/transfer',
            name: 'transfer',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "transfer" */ './views/purse/transfer/Transfer.vue')
        },
        //自助返水
        {
            path: '/backwater',
            name: 'backwater',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "backwater" */ './views/purse/backwater/Backwater.vue')
        },
        //会员返佣
        {
            path: '/backCommission',
            name: 'backCommission',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "backCommission" */ './views/purse/backCommission/BackCommission.vue')
        },
        //会员返佣比例
        {
            path: '/backCommissionRatio',
            name: 'backCommissionRatio',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "backCommissionRatio" */ './views/purse/backCommission/BackCommissionRatio.vue')
        },
         //现金流水
         {
            path: '/moneyWater',
             name: 'moneyWater',
             meta:{auth:true},            
            component: () => import( /* webpackChunkName: "moneyWater" */ './views/purse/moneyWater/MoneyWater.vue')
        },
        //订单
        {
            path: '/order',
            name: 'order',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "order" */ './views/order/Order.vue'),
            children: [
                //彩票
                {
                    path: 'lottery',
                    name: 'lottery',
                    component: () => import( /* webpackChunkName: "order" */ './views/order/Lottery.vue'),
                },
                //棋牌
                {
                    path: 'chess',
                    name: 'chess',
                    component: () => import( /* webpackChunkName: "order" */ './views/order/Chess.vue'),
                },
                //视讯
                {
                    path: 'directvideo',
                    name: 'directvideo',
                    component: () => import( /* webpackChunkName: "order" */ './views/order/Directvideo.vue'),
                },
                //电子
                {
                    path: 'tvgame',
                    name: 'tvgame',
                    component: () => import( /* webpackChunkName: "order" */ './views/order/Tvgame.vue'),
                },
                //体育
                {
                    path: 'sports',
                    name: 'sports',
                    component: () => import( /* webpackChunkName: "order" */ './views/order/Sports.vue'),
                }
            ]
        },
        //报表
        {
            path: '/reportform',
            name: 'reportform',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "order" */ './views/order/Reportform.vue'),
        },
        //我的
        {
            path: '/my',
            name: 'my',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/My.vue'),
        },
        {
            path: '/about',
            name: 'about',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/about/About.vue'),
        },
        {
            path: '/bankCard',
            name: 'bankCard',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/bankCard/BankCard.vue'),
            children: []
        },
        {
            path: '/bankCardadd',
            name: 'bankCardadd',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/bankCard/AddBankCard.vue'),
        },
        //密码管理
        {
            path: '/password',
            name: 'password',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/password/Password.vue'),
        },
        //消息中心
        {
            path: '/msgcenter',
            name: 'msgcenter',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/msgCenter/MsgCenter.vue'),
        },
        {
            path: '/msgcenters',
            name: 'msgcenters',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/msgCenter/MsgCenters.vue'),
        },
        {
            path: '/questionnaire/list',
            name: 'questionnaireList',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/msgCenter/QuestionnaireList.vue'),
        },
        {
            path: '/questionnaire/info',
            name: 'questionnaireInfo',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/msgCenter/Questionnaire.vue'),
        },
        //代理账号
        {
            path: '/agencyappli',
            name: 'agencyappli',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/agencyApplication/Agencyapplication.vue'),
        },
        //我要推广
        {
            path: '/spread',
            name: 'spread',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/spread/Spread.vue'),
        },
        //推广链接
        {
            path: '/generalizeLink',
            name: 'generalizeLink',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/spread/GeneralizeLink.vue'),
        },
        //会员管理
        {
            path: '/memberManagement',
            name: 'memberManagement',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/spread/MemberManagement.vue'),
        },

        {
            path: '/statis',
            name: 'statis',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/spread/Statis.vue'),
        },
        {
            path: '/subordinate',
            name: 'subordinate',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/spread/Subordinate.vue'),
        },
        {
            path: '/explain',
            name: 'explain',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/spread/Explain.vue'),
        },
        

        //联系我们
        {
            path: '/contactus',
            name: 'contactus',
            component: () => import( /* webpackChunkName: "my" */ './views/my/Contactus.vue'),
        },
        //更多
        {
            path: '/more',
            name: 'more',
            component: () => import( /* webpackChunkName: "my" */ './views/my/more/More.vue'),
        },
        //关于我们
        {
            path: '/morepage',
            name: 'morepage',
            component: () => import( /* webpackChunkName: "my" */ './views/my/more/Morepage.vue'),
        },
        {
            path: '/selfHelp',
            name: 'selfHelp',
            component: () => import( /* webpackChunkName: "my" */ './views/my/selfHelp/SelfHelp.vue'),
        },
        {
            path: '/selfDetail',
            name: 'selfDetail',
            component: () => import( /* webpackChunkName: "my" */ './views/my/selfHelp/SelfHelpDetail.vue'),
        },
        {
            path: '/apply',
            name: 'apply',
            component: () => import( /* webpackChunkName: "my" */ './views/my/selfHelp/Apply.vue'),
        },
        {
            path: '/selfmore',
            name: 'selfmore',
            component: () => import( /* webpackChunkName: "my" */ './views/my/selfHelp/Selfmore.vue'),
        },
        //维护
        {
            path: '/maintainweb',
            name: 'maintainweb',
            component: () => import( /* webpackChunkName: "my" */ './views/Maintainweb.vue'),
        },
        {
            path: '/maintaingame',
            name: 'maintaingame',
            component: () => import( /* webpackChunkName: "my" */ './views/MaintainGame.vue'),
        },
        {
            path: "/download",
            name: "download",
            component: () => import(/* webpackChunkName: "download" */ "./views/auth/Download.vue")
        }
    ]
})
