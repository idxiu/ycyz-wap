import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
export default new Router({
	// mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/",
			redirect: {
				name: "index"
			}
		},
		//首页
		{
			path: "/index",
			name: "index",
			component: () =>
				import(/* webpackChunkName: "index" */ "./views/index/Index.vue")
		},
		//首页
		{
			path: "/games",
			name: "games",
			component: () =>
				import(/* webpackChunkName: "index" */ "./views/index/Games.vue")
        },
        //首页
		{
			path: "/402",
			name: "402",
			component: () =>
				import(/* webpackChunkName: "index" */ "./views/auth/402.vue")
		},
		//注册
		{
			path: "/register",
			name: "register",
			component: () =>
				import(/* webpackChunkName: "auth" */ "./views/auth/Register.vue")
		},
		//注册 协议
		{
			path: "/registerAgreement",
			name: "registerAgreement",
			component: () =>
				import(/* webpackChunkName: "auth" */ "./views/auth/Agreement.vue")
		},
		//登录
		{
			path: "/login",
			name: "login",
			component: () =>
				import(/* webpackChunkName: "auth" */ "./views/auth/Login.vue")
		},
		//存款
		{
			path: "/deposit",
			name: "deposit",
			meta: {
				auth: true
			},
			component: () =>
				import(/* webpackChunkName: "deposits" */ "./views/deposit/Deposit.vue")
		},
		//存款-线上入款-网银/支付宝/微信
		{
			path: "/deposit/online",
			name: "online",
			meta: {
				auth: true
			},
			component: () =>
				import(/* webpackChunkName: "onlineAlipay" */ "./views/deposit/DepositOnline.vue")
		},
		//存款-公司存款-有无二维码
		{
			path: "/deposit/company",
			name: "company",
			meta: {
				auth: true
			},
			component: () =>
				import(/* webpackChunkName: "companyAlipay" */ "./views/deposit/DepositCompany.vue")
		},

		//存款-线上入款/公司存款-支付返回结果页
		{
			path: "/deposit/payResult",
			name: "payResult",
			meta: {
				auth: true
			},
			component: () =>
				import(/* webpackChunkName: "payResult" */ "./views/deposit/DepositPayResult.vue")
		},
		//存款-线上入款/公司存款-支付成功页
		{
			path: "/deposit/paySuccess",
			name: "paySuccess",
			meta: {
				auth: true
			},
			component: () =>
				import(/* webpackChunkName: "paySuccess" */ "./views/deposit/DepositPaySuccess.vue")
		},

		// 会员积分
		{
			path: "/intergral",
			name: "intergral",
			component: () =>
				import(/* webpackChunkName: "intergral" */ "./views/my/intergral/intergral.vue")
		},
		//积分等级制度
		{
			path: "/intergral/intergRule",
			name: "intergRule",
			component: () =>
				import(/* webpackChunkName: "intergral" */ "./views/my/intergral/intergRule.vue")
		},
		//积分明细
		{
			path: "/intergral/intergDeta",
			name: "intergDeta",
			component: () =>
				import(/* webpackChunkName: "intergral" */ "./views/my/intergral/intergDetailed.vue")
		},
		// 投注资讯
		{
			path: "/betInformation",
			name: "betInformation",
			component: () =>
				import(/* webpackChunkName: "intergral" */ "./views/my/betInformation/betInformation.vue")
		},


		//取款
		{
			path: "/withdraw",
			name: "withdraw",
			meta: {
				auth: true
			},
			component: () =>
				import(/* webpackChunkName: "withdraw" */ "./views/withdraw/Withdraw.vue")
		},
		//取款-稽核
		{
			path: "/withdraw/audit",
			name: "withdrawAudit",
			meta: {
				auth: true
			},
			component: () =>
				import(/* webpackChunkName: "withdrawAudit" */ "./views/withdraw/WithdrawAudit.vue")
		},
		//取款-成功
		{
			path: "/withdraw/success",
			name: "withdrawSuccess",
			meta: {
				auth: true
			},
			component: () =>
				import(/* webpackChunkName: "withdrawSuccess" */ "./views/withdraw/WithdrawSuccess.vue")
		},
		//额度转换
		{
			path: "/transfer",
			name: "transfer",
			meta: {
				auth: true
			},
			component: () =>
				import(/* webpackChunkName: "transfer" */ "./views/transfer/Transfer.vue")
		},
		//我的
		{
			path: "/my",
			name: "my",
			component: () => import(/* webpackChunkName: "my" */ "./views/my/My.vue")
		},

		//排行榜
		{
            path: '/ranking',
            name: 'ranking',
            meta:{auth:true},
            component: () => import( /* webpackChunkName: "my" */ './views/my/ranking/ranking.vue'),
		},
		
		//个人资料
		{
			path: "/about",
			name: "about",
			component: () =>
				import(/* webpackChunkName: "my" */ "./views/my/about/About.vue")
		},
		//及时稽核查询
		{
			path: "/auditQuery",
			name: "auditQuery",
			component: () =>
				import(/* webpackChunkName: "my" */ "./views/my/auditQuery/AuditQuery.vue")
		},

		/* 安全中心 */
		{
			path: "/securityCenter",
			name: "securityCenter",
			component: () =>
				import(/* webpackChunkName: "securityCenter" */ "./views/my/securityCenter/SecurityCenter.vue")
		},
		{
			path: "/securityCenter/EditLoginpwd",
			name: "editLoginpwd",
			component: () =>
				import(/* webpackChunkName: "securityCenter" */ "./views/my/securityCenter/EditLoginpwd.vue")
		},
		{
			path: "/securityCenter/securitypwd",
			name: "securitypwd",
			component: () =>
				import(/* webpackChunkName: "securityCenter" */ "./views/my/securityCenter/Securitypwd.vue")
		},
		{
			path: "/securityCenter/videopwd",
			name: "videopwd",
			component: () =>
				import(/* webpackChunkName: "securityCenter" */ "./views/my/securityCenter/Videopwd.vue")
		},
		{
			path: "/securityCenter/bankcardAdd",
            name: "bankcardList",
			component: () =>
				import(/* webpackChunkName: "bank" */ "./views/my/securityCenter/AddBankcard.vue")
		},
		{
			path: "/securityCenter/bankcard",
			name: "bankcard",
			component: () =>
				import(/* webpackChunkName: "bank" */ "./views/my/securityCenter/Bankcard.vue")
		},
		/* 消息中心 */
		{
			path: "/msgCenter",
			name: "msgCenter",
			component: () =>
				import(/* webpackChunkName: "msgCenter" */ "./views/my/msgCenter/MsgCenter.vue"),
			children: [
				{
					path: "systemAnnounce",
					name: "systemAnnounce",
					component: () =>
						import(/* webpackChunkName: "msgCenter" */ "./views/my/msgCenter/systemAnnounce/SystemAnnounce.vue")
				},
				{
					path: "gameAnnounce",
					name: "gameAnnounce",
					component: () =>
						import(/* webpackChunkName: "msgCenter" */ "./views/my/msgCenter/gameAnnounce/GameAnnounce.vue")
				},
				{
					path: "questionnaireList",
					name: "questionnaireList",
					component: () =>
						import(/* webpackChunkName: "msgCenter" */ "./views/my/msgCenter/questionnaire/QuestionnaireList.vue")
				}
			]
		},
		/* 消息中心 */
		{
			path: "/inbox",
			name: "inbox",
			component: () =>
				import(/* webpackChunkName: "inbox" */ "./views/my/inbox/Inbox.vue"),
			children: [
				{
					path: "systemBox",
					name: "systemBox",
					component: () =>
						import(/* webpackChunkName: "inbox" */ "./views/my/inbox/SystemBox.vue")
				},
				{
					path: "myBox",
					name: "myBox",
					component: () =>
						import(/* webpackChunkName: "inbox" */ "./views/my/inbox/MyBox.vue")
				}
			]
		},
		{
			path: "/inbox/boxDetail",
			name: "boxDetail",
			component: () =>
				import(/* webpackChunkName: "inbox" */ "./views/my/inbox/BoxDetail.vue")
		},
		{
			path: "/questionnaire",
			name: "questionnaire",
			component: () =>
				import(/* webpackChunkName: "inbox" */ "./views/my/msgCenter/questionnaire/Questionnaire.vue")
		},
		{
			path: "/msgCenter/msgDetail",
			name: "msgDetail",
			component: () =>
				import(/* webpackChunkName: "msgCenter" */ "./views/my/msgCenter/msgDetail/MsgDetail.vue")
		},
		/* 我要推广 */
		{
			path: "/spread",
			name: "spread",
			component: () =>
				import(/* webpackChunkName: "spread" */ "./views/my/spread/Spread.vue")
		},
		//下级报表
		{
			path: "/spread/subordinate",
			name: "subordinate",
			component: () =>
				import(/* webpackChunkName: "spread" */ "./views/my/spread/Subordinate.vue")
		},
		//推广说明
		{
			path: "/spread/promote",
			name: "promote",
			component: () =>
				import(/* webpackChunkName: "spread" */ "./views/my/spread/Promote.vue")
		},
		//推广链接
		{
			path: "/spread/generalizeLink",
			name: "generalizeLink",
			component: () =>
				import(/* webpackChunkName: "spread" */ "./views/my/spread/GeneralizeLink.vue")
		},
		//推广统计
		{
			path: "/spread/statisics",
			name: "statisics",
			component: () =>
				import(/* webpackChunkName: "spread" */ "./views/my/spread/Statisics.vue")
		},
		//下级会员管理
		{
			path: "/spread/memberManagement",
			name: "memberManagement",
			component: () =>
				import(/* webpackChunkName: "spread" */ "./views/my/spread/MemberManagement.vue")
		},

		//资金记录 
		{
			path: "/capitalrecord",
			name: "capitalrecord",
			// meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "my" */ "./views/my/capitalrecord/Capitalrecord.vue")
		},
		/*自助优惠申请*/
		{
			path: "/selfhelp",
			name: "selfHelp",
			// meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "selfhelp" */ "./views/my/selfHelp/SelfHelp.vue")
		},
		{
			path: "/selfDetail",
			name: "selfDetail",
			// meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "selfhelp" */ "./views/my/selfHelp/SelfDetail.vue")
		},
		{
			path: "/selfmore",
			name: "selfmore",
			// meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "selfhelp" */ "./views/my/selfHelp/Selfmore.vue")
		},
		/** 自主返水*/
		{
			path: "/backwater",
			name: "backwater",
			// meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "selfhelp" */ "./views/my/backwater/Backwater.vue")
		},
		/*更多*/
		{
			path: "/more",
			name: "more",
			// meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "more" */ "./views/my/more/More.vue")
		},
		{
			path: "/morepage",
			name: "morepage",
			// meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "more" */ "./views/my/more/Morepage.vue")
		},
		{
			path: "/morelist",
			name: "morelist",
			// meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "more" */ "./views/my/more/Morelist.vue")
		},
		{
			path: "/contactus",
			name: "contactus",
			// meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "more" */ "./views/my/more/Contactus.vue")
		},
		/* 投注记录 */
		{
			path: "/betRecord",
			name: "betRecord",
			meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "activity" */ "./views/my/betRecord/BetRecord.vue")
		},
		{
			path: "/detailRecord",
			name: "detailRecord",
			meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "activity" */ "./views/my/betRecord/DetailRecord.vue")
		},
		//活动
		{
			path: "/activity",
			name: "activity",
			component: () =>
				import(/* webpackChunkName: "activity" */ "./views/activity/Activity.vue")
		},
		//活动详情
		{
			path: "/actDetail",
			name: "actDetail",
			component: () =>
				import(/* webpackChunkName: "activity" */ "./views/activity/ActDetail.vue")
		},
		//活动领取记录
		{
			path: "/activityRecord",
			name: "activityRecord",
			component: () =>
				import(/* webpackChunkName: "activity" */ "./views/activity/ActivityRecord.vue")
		},
		//幸运大转盘
		{
			path: "/luckdraw",
			name: "luckdraw",
			meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "activity" */ "./views/activity/Luckdraw.vue")
		},
		//代理申请
		{
			path: "/agencyappli",
			name: "agencyappli",
			meta: { auth: true },
			component: () =>
				import(/* webpackChunkName: "activity" */ "./views/my/agencyApplication/Agencyapplication.vue")
		},
		{
			path: "/download",
			name: "download",
			component: () =>
				import(/* webpackChunkName: "download" */ "./views/auth/Download.vue")
		}
	]
});
