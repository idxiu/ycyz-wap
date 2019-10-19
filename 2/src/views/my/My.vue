<template>
	<div class="my" ref="my">
		 <Trial :isDemo='isDemo' @trialClose='trialClose'></Trial>
		 <div class="isTral">
			<nut-navbar
				class="pk-title"
				@on-click-back="more('index')"
				@on-click-more="more('inbox')"
			>
				<a class="spans" slot="back-icon">
					<img
						class="imgsbank"
						src="../../assets/img/my-icon/fanhui.png"
					/>
				</a>
				我的
				<a class="spansright" slot="more-icon" :class="{'inbox-num':boxNum > 0}">
					<img
						class="imgsbank"
						src="../../assets/img/icon_mail@3x.png"
					/>
				</a>
			</nut-navbar>
			<!-- <div class="info">
                <div class="makemid">
                    <img src="../../assets/img/morentouxiang.png" alt="tupian" class="src">
                    <p class="name">{{userinfo.account}}</p>
                    <p class="times">本次登录时间{{userinfo.lastLoginTime | filterDate}}</p>
                </div>
            </div> -->
			<div class="topmy">
			<div class="person-info">
				<div class="left">
					<a @click="goPath('about')">
					<img src="../../assets/img/morentouxiang.png" alt="" /></a>
					<div class="center">
						<h2>{{ userinfo.account }}</h2>
						<p>
							上次登录时间{{
								userinfo.lastLoginTime | filterDate
							}}
						</p>
					</div>
					<div class="goAbout"><a @click="goPath('about')"></a></div>
					
				</div>
			</div>
		</div>
		<div class="content_container">
			<ul class="pk-my-ul">
				<li class="lis">
					<div class="total_asset md-6 bdr">
						<i>￥{{ userinfo.totalBalance }}</i>
						<span>总资产</span>
					</div>
					<div class="total_asset md-6">
						<i>￥{{ userinfo.balance }}</i>
						<span>钱包余额</span>
					</div>
				</li>
				<li class="lis mgb2 pk-list">
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('deposit')"
					>
						<i>
							<img
								src="../../assets/img/my-icon/chongzhi.png"
								alt
							/>
						</i>
						<span class="spans">充值</span>
					</div>
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('withdraw')"
					>
						<i>
							<img
								src="../../assets/img/my-icon/tixian.png"
								alt
							/>
						</i>
						<span class="spans">提现</span>
					</div>
				</li>
				<li class="lis pk-list">
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('transfer')"
					>
						<i>
							<img
								src="../../assets/img/my-icon/eduzhuanhuan.png"
								alt
							/>
						</i>
						<span class="spans">额度转换</span>
					</div>
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('auditQuery')"
					>
						<i>
							<img
								src="../../assets/img/my-icon/jishijihechaxun.png"
								alt
							/>
						</i>
						<span class="spans">即时稽核查询</span>
					</div>
				</li>
				<li class="lis fakes">
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('ranking')"
					>
						<i>
							<img
								src="../../assets/img/my-icon/icon_mine_phb.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>排行榜</div>
							<p>查看投注中奖返佣排行</p>
						</div>
					</div>
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('betRecord')"
					>
						<i>
							<img
								src="../../assets/img/my-icon/touzhujilu.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>投注记录</div>
							<p>查看所有参与的游戏记录</p>
						</div>
					</div>
					<router-link
						to="/agencyappli"
						tag="div"
						class="total_asset iconpfn md-6"
						v-show="switchList.isAgencyReg"
					>
						<i>
							<img
								src="../../assets/img/my-icon/shenqingdaili.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>代理申请</div>
							<p>申请成为代理</p>
						</div>
					</router-link>
					<router-link
						to="/capitalrecord"
						tag="div"
						class="total_asset iconpfn md-6"
					>
						<i>
							<img
								src="../../assets/img/my-icon/zijinjilu.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>资金记录</div>
							<p>查看所有资金来往记录</p>
						</div>
					</router-link>
					<router-link
						to="/backwater"
						tag="div"
						class="total_asset iconpfn md-6"
						v-show="switchList.isWaterSelf"
					>
						<i>
							<img
								src="../../assets/img/my-icon/zizhufanshui.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>自助返水</div>
							<p>投注即得返水奖励</p>
						</div>
					</router-link>
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('securityCenter')"
					>
						<i>
							<img
								src="../../assets/img/my-icon/anquanzhongxin.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>安全中心</div>
							<p>保护您的账号安全</p>
						</div>
					</div>
					<router-link
						to="/selfHelp"
						tag="div"
						class="total_asset iconpfn md-6"
						v-show="switchList.isOfferSelf"
					>
						<i>
							<img
								src="../../assets/img/my-icon/zizhuyouhui.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>自助优惠申请</div>
							<p>所有申请优惠与优惠记录</p>
						</div>
					</router-link>
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('spread')"
						v-show="switchList.isSpread"
					>
						<i>
							<img
								src="../../assets/img/my-icon/tuiguangfanyong.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>推广返佣</div>
							<p>查看团队信息</p>
						</div>
					</div>
				</li>
				<li class="lis fakes">
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('msgCenter')"
					>
						<i>
							<img
								src="../../assets/img/my-icon/xiaoxizhongxin.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>消息中心</div>
							<p>查看历史消息内容</p>
						</div>
					</div>
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('intergral')"
					>
						<i>
							<img
								src="../../assets/img/hyjf.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>会员积分</div>
							<p>查看您的会员权益</p>
						</div>
					</div>
					<div
						class="total_asset iconpfn md-6"
						@click="goPath('betInformation')"
					>
						<i>
							<img
								src="../../assets/img/icon-tzzx.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>投注资讯</div>
							<p>查看游戏限额情况</p>
						</div>
					</div>
					<router-link
						to="/more"
						tag="div"
						class="total_asset iconpfn md-6"
					>
						<i>
							<img
								src="../../assets/img/my-icon/gengduo.png"
								alt
							/>
						</i>
						<div class="divspans">
							<div>更多</div>
							<p>保护你的账号安全</p>
						</div>
					</router-link>
					
				</li>
			</ul>
		</div>
		</div>
	</div>
</template>

<script>
import { getInfo } from "../../services/auth.js";
import { getBoxnum } from "@/services/msgCenter.js";
import Trial from "../../components/Trial";
export default {
	components: {
		Trial,
	},
	data() {
		return {
			userinfo: {
				account: "",
				lastLoginTime: "",
				totalBalance: "",
				gameBalance: ""
			},
			switchList: {
				isSpread: true, //是否开启会员推广
				isAgencyReg: true, //是否开启代理注册
				isOfferSelf: true, //是否开启自助优惠
				isWaterSelf: true //是否开启自助返水
			},
			boxNum: 0,
			isDemo:false
		};
	},
	mounted() {
		this.hasHeight();
		this.getMyInfo();
		this.getBoxnumFunc();
	},
	methods: {
		trialShow(){
                 this.isDemo = localStorage.getItem("Trial")==1 ? true :false;
                 
			},
			trialClose(step){
            this.isDemo = step;
            console.log(this.isDemo, 'this.isDemo')
            },//关闭

		getBoxnumFunc() {
			getBoxnum().then(res => {
				if (res.success) {
					console.log(res);
					if (res.data) {
						let num1 = res.data.advisoryUnReadCount || 0;
						let num2 = res.data.sysMessageUnReadCount || 0;
                        this.boxNum = num1 + num2;
                        console.log( this.boxNum);
					}
				} else {
					this.$toast.fail(res.message, {
						cover: true,
						duration: 1500
					});
				}
			});
		},
		hasHeight() {
			this.$refs.my.style.height = window.innerHeight + "px";
		},
		more(path) {
			this.$router.push({
				name: path
			});
		},
		goPath(path) {
			if(localStorage.getItem("Trial")==1){
                    this.trialShow();
                    return ;
                } 
			this.$router.push({
				name: path
			});
		},
		getMyInfo() {
			getInfo().then(res => {
				if (res.success) {
					console.log(res);
					this.userinfo = res.data.user;
					this.switchList = res.data.switch;
				} else {
					this.$toast.fail(res.message, {
						cover: true,
						duration: 1500
					});
				}
			});
		}
	},
	beforeRouteLeave(to, from, next) {
		console.log(to);
		if (to.name === "index") {
			next();
		} else {
			if(localStorage.getItem("Trial")==1){
                    this.trialShow();
            }else{
				next();
			}
		}
	}

};
</script>

<style lang="scss" scoped>
	.person-info {
		background: url("../../assets/img/touxiangbg.png") center center no-repeat;
		overflow: hidden;
		background-size: cover;
		height: 5.14667rem /* 386/75 */;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0.867rem 0 0.4rem;
		.left {
			font-size: 1.70667rem;
			color: $primary-color;
			display: flex;
			img {
				width: 1.6rem;
				height: 1.6rem;
				vertical-align: middle;
			}
			.center {
				margin-left: 0.267rem;
				color: $default-color;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				h2 {
					font-size: 0.427rem;
				}
				p {
					font-size: 0.293rem;
				}
			}
			.goAbout{
				height: 2.2rem;
				width: 3rem;
				background: url(../../assets/img/right.png) center right no-repeat;
				background-size:.24rem .426667rem; 
				a{
					display: block;
					height: 100%;
				}
			}
		}

		.right {
			height: 2.50667rem /* 188/75 */;
			display: flex;
			flex-direction: column;
			justify-content: center;
			a {
				color: $default-color;
				border: 0.027rem solid $default-color;
				border-radius: 0.4rem;
				width: 2.187rem;
				height: 0.8rem;
				line-height: 0.8rem;
				box-sizing: border-box;
				text-decoration: none;
				font-size: 0.293rem;
				text-align: center;
				span {
					color: $default-color;
					font-size: 0.32rem /* 24/75 */;
				}
				.iconfont {
					font-size: 0.347rem;
					margin-right: 0.067rem;
				}
			}
		}
	}
	.my {
		.pk-title {
				height: 1.22667rem /* 92/75 */;
				padding: 0 0.4rem /* 30/75 */;
				padding-left: 0;
				line-height: 1.22667rem /* 92/75 */;
				font-size: 0.48rem;
				color: #fff;
				.spans {
					position: relative;
					font-size: 0.48rem;
					img {
						position: absolute;
						top: 0.13333rem /* 10/75 */ /* 10/75 */;
			}
				}
				.spansright{
					top: 0.13333rem;
				}
			}
		overflow: scroll;
		background: #f9f9f9;
		margin-top: -1.22667rem;
		.topmy {
			height: 5.14667rem /* 386/75 */;
			width: 100%;
			background: url("../../assets/img/touxiangbg.png") center center no-repeat;
			background-size: cover;
            background-position: 0 0;
           // position: fixed;
			
			.info {
				height: 3.6rem /* 270/75 */;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;
				padding-top: 1.22667rem /* 92/75 */;
				.makemid {
					text-align: center;
					img {
						height: 1.38667rem /* 104/75 */;
						width: 1.38667rem /* 104/75 */;
					}
					.name {
						color: $default-color;
						font-size: 0.346667rem;
					}
					.times {
						color: $default-color;
						font-size: 0.293333rem; /*22px/75                             */
						font-weight: 300;
					}
				}
			}
		}
	}

	.content_container {
		position: relative;
	//	height: 16rem;
		width: 95%;
		padding: 0 2.5%;
		margin-top: -0.75rem;
		//background: #f9f9f9;
	}

	.pk-my-ul {
		width: 100%;
		//position: fixed;
		top: 4.5rem;
	//	height: 16rem;
		z-index: 100;
		background-color: transparent;
		//overflow: scroll;
		.bdr0 {
			border-radius: 0 !important;
		}
		.mgb2 {
			margin-bottom: 0.01333rem /* 1/75 */ !important;
		}
		.fakebot {
			border-radius: 0 0 0.13333rem 0.13333rem !important;
		}
		.fakes {
			border-radius: 0.13333rem !important;
			flex-flow: row wrap;
			align-content: flex-start;
			justify-content: flex-start !important;
			.total_asset {
                position: relative;
				margin-bottom: 0.02rem /* 1.5/75 */ !important;
				flex: 0 0 50%;
				box-sizing: border-box;
				padding: 0.2rem /* 15/75 */ /* 10/75 */ 0;
				// border-top: 1px solid $center-background;
			}
			// .total_asset:nth-child(1),.total_asset:nth-child(2){
			// 	border-top: none;
			// }
		}
		.fake {
			border-radius: 0 !important;
			margin-bottom: 0.01333rem /* 1/75 */ !important;
		}
		.lis {
			cursor: pointer;
			height: auto;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			border-radius: 0.13333rem /* 10/75 */;
			padding: 0.14667rem /* 11/75 */ 0;
			margin-bottom: 0.26667rem /* 20/75 */;
			text-align: center;
			.md-6 {
				width: 50%;
			}
			.bdr {
				border-right: 0.02667rem /* 2/75 */ solid #f2f4f3;
			}
			.total_asset {
				display: flex;
				flex-direction: column;
				align-items: center;
				i {
					font-style: normal;
					color: #35aafd;
					font-size: 0.43rem;
				}
				span {
					color: #333;
					font-size: 0.29rem;
					&.spans {
						font-size: 0.346667rem /* 26/75 */;
					}
				}
				.divspans {
					padding-left: 0.2rem /* 15/75 */;
					font-size: 0.34rem;
					color: $text-color;
					text-align: left;
					p {
						font-size: 0.293333rem;
						color: $label-color;
					}
				}
			}
			.iconpfn {
				flex-direction: row;
				padding-left: 0.2rem /* 30/75 */;
				i {
					width: 0.93333rem /* 70/75 */;
					height: 0.93333rem /* 70/75 */;
					img {
						width: 100%;
					}
				}
				span {
					margin-left: 0.4rem /* 30/75 */;
				}
			}
			.text-lefts {
				text-align: left;
				width: 100%;
			}
		}
		.pk-list {
			.total_asset {
				i {
					// margin-left: .26667rem/* 20/75 */
				}
			}
		}
	}

	@import "../../components/scss/pk-pwd.scss";
	

	.spansright,
	.spansleft {
		position: absolute;
		right: 0.4rem /* 30/75 */;
		top: 0.2rem /* 15/75 */;
		.imgsbank {
			width: 0.6rem /* 45/75 */;
		}
	}
	.inbox-num {
		position: relative;
		z-index: 1;
		&::before {
			content: "";
			position: absolute;
			top: -0.1334rem;
			right: -0.6667rem;
			width: 0.2667rem;
			height: 0.2667rem;
			border-radius: 0.2667rem;
			background: $color-a;
		}
	}
</style>