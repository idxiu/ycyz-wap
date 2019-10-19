<template>
	<div class="withdraw">
		<nut-navbar class="pk-title" @on-click-back="$router.go(-1)">
			<a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../assets/img/my-icon/fanhui.png">
			</a>
			取款
			<a class="backIdex" @click="$router.push('/')" slot="more-icon">
				<img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
			</a>
		</nut-navbar>

		<div class="content">
			<div class="person-info">
				<div class="left">
					<img src="../../assets/img/morentouxiang.png" alt>
					<div class="center">
						<h2>{{infoData.account}}</h2>
						<p>￥: {{infoData.balance}}</p>
					</div>
				</div>
				<div class="right">
					<a @click="refush(1)">
						<i class="iconfont icon-wallet-refresh"></i>
						<span>刷新余额</span>
					</a>
				</div>
			</div>

			<div class="widthdraw-top">
				<div class="title" @click="handleShowModal()">
					<span class="must">收款账户</span>
					<i v-show="infoData.has" class="iconfont icon-list-more"></i>
				</div>

				<router-link tag="div" :to="{name:'bankcardList'}" v-show="!infoData.has" class="no-bankCard">
					<p>您还未添加银行卡</p>
					<div class="add-card">
						<i class="iconfont icon-qb-bank-add"></i>
						<span>点击添加银行卡</span>
					</div>
				</router-link>

				<div v-show="infoData.has" class="has-bankCard">
					<div class="card-list clearfix">
						<div class="left">
							<h2 class="text-dots">{{bankInfo.bankName}}</h2>
							<h3 class="text-dots">{{bankInfo.userName}}</h3>
							<h3 class="text-dots">{{bankInfo.subbranch}}</h3>
							<h3 class="text-dots">{{bankInfo.addr}}</h3>
							<p>{{bankInfo.card | filterBankNum}}</p>
						</div>
						<div class="right">
							<i class="iconfont icon-qb-bank-tongyong1"></i>
						</div>
					</div>
				</div>
			</div>

			<div class="width-form">
				<ul>
					<li class="pk-1px-tb">
						<span class="must">取款金额</span>
						<input
							type="number"
							@keyup="validateRegExp()"
							v-model="postData.outMoney"
							placeholder="请输入取款金额"
						>
					</li>
					<div class="money-chinese">{{outMoneyChinese}}</div>
					<li class="pk-1px-tb">
						<span class="must">取款密码</span>
						<input type="password" v-model="postData.drawPassword" placeholder="请输入取款密码">
					</li>
				</ul>
			</div>

			<div class="widthdraw-bottom">
				<h2 v-show="infoData.hasP">
					忘记取款密码请
					<router-link tag="a" :to="{name:'contactus'}">联系客服</router-link>
				</h2>
				<h2 v-show="!infoData.hasP">
					您还未设置取款密码请
					<router-link tag="a" :to="{name:'securitypwd'}">点击设置</router-link>
				</h2>
			</div>

			<div class="hint">
				<h3>温馨提示:</h3>
				<p>
					1.单笔取款金额为
					<span>{{infoData.min}}~{{infoData.max}}</span>元
				</p>
				<p>2.取款金额需为整数，否则可能延长出款。</p>
				<p>3.有未完成的取款订单时，无法提交第二笔订单。</p>
				<p>4.出款出现以下情况将会扣除一定费用：</p>
				<p>1）未满足常态稽核 将扣除入款金额<span>{{infoData.lineAuditAdminRate}}%</span>行政费用与优惠金额。</p>
				<p>2) 未满足综合稽核 将扣除优惠金额。</p>
				<p>*常态稽核 = 会员入款金额 * 常态稽核倍数</p>
				<p>*综合(优惠)稽核 = (会员入款金额+优惠) *综合稽核倍数</p>
			</div>

			<!--选择银行卡弹框-->
			<nut-actionsheet :is-visible="isShowChooseBankModal" @close="isShowChooseBankModal = false;">
				<div slot="custom" class="custom-wrap">
					<div class="title">收款银行</div>
					<ul>
						<li
							class="pk-1px-t"
							v-for="(item, index) in swiperSlides"
							:key="index"
							@click="handleChooseBank(item,index)"
							:class="chooseBankIndex === index ?'active':''"
						>
							<div class="left">
								<p class="text-dots">{{item.bankName}}</p>
								<span>{{item.card | filterBankNum}}</span>
							</div>
							<div class="right">
								<i class="iconfont icon-qb-zfok"></i>
							</div>
						</li>
					</ul>
				</div>
			</nut-actionsheet>

			<div class="pk-submit-bottom">
				<img src="../../assets/img/submit_bg.png" alt>
				<div class="submit">
					<button @click="handleWithdraw" :disabled="!infoData.has">取款</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import "swiper/dist/css/swiper.css";
	import { swiper, swiperSlide } from "vue-awesome-swiper";
	import func from "@/services/deposit";

	export default {
		name: "withdraw",
		components: {
			swiper,
			swiperSlide
		},
		data() {
			return {
				swiperSlides: [], //银行卡列表
				infoData: {},
				postData: {
					outMoney: "",
					drawPassword: "",
					bankId: ""
				},
				outMoneyChinese: "", //出款金额中文大写
				isShowChooseBankModal: false, //是否显示选择银行弹框
				chooseBankIndex: 0, //控制选择的银行卡图标样式
				bankInfo: {} //选择的银行卡详情
			};
		},
		computed: {
			swiper() {
				return this.$refs.mySwiper.swiper;
			},
			outMoney() {
				return this.postData.outMoney;
			}
		},
		mounted() {
            this.refush();
		},
		methods: {
			//获取取款信息
			refush(t) {
				let loading = t
					? this.$toast.loading("刷新中...")
					: this.$toast.loading("加载中...");
				func.getWithdrawInfo().then(res => {
					loading.hide();
					if (res.success) {
						this.infoData = res.data;
						if (this.infoData.bankList) {
                            this.swiperSlides = this.infoData.bankList;
                            this.swiperSlides.map((v,i)=> {
                                if(v.isDefault==1){
                                    this.chooseBankIndex = i;
                                    this.bankInfo = this.swiperSlides[this.chooseBankIndex];
                                }
                            })
						}
						if (t) {
							this.$toast.success("刷新成功", { cover: true });
						}else {
                            if (!this.infoData.has) {
                                //是否有银行卡 false=没有 true=有
                                this.isBankList();
                            } else if (!this.infoData.isOrder) {
                                //是否有完成的订单 true=没有 false=有
                                this.isFinishOrder();
                            } else if (!this.infoData.hasP) {
                                //去设置取款密码hasP true=有设置密码 false=没有设置密码
                                this.isSetOutMoneyPassword();
                            }
                        }
					} else {
						this.$toast.fail(res.message, {
							cover: true,
							duration: 4000
						});
					}
				});
			},
			handleShowModal() {
				if (this.infoData.has) {
					this.isShowChooseBankModal = true;
				}
			},
			//点击选择银行卡
			handleChooseBank(item, index) {
				this.chooseBankIndex = index;
				this.bankInfo = item;
				this.isShowChooseBankModal = false;
			},

			//是否有银行卡
			isBankList() {
                let self = this;
				this.$dialog({
					id: "dialog_bank",
					lockBgScroll: true,
					closeOnClickModal: false,
                    textAlign: "left",
					cancelBtnTxt: "暂不取款",
                    okBtnTxt: "去设置",
					title: "温馨提示",
					content: "抱歉，您还未添加银行卡，无法出款！",
                    customClass: "pk-dialog",
                    onOkBtn() {
                        this.close();
						self.$router.push({ name: "bankcardList" }); //添加银行卡
					}
				});
			},

			//是否有未完成的订单
			isFinishOrder() {
				this.$dialog({
					id: "dialog_order",
					lockBgScroll: true,
					closeOnClickModal: false,
					textAlign: "left",
					noCancelBtn: true,
					okBtnTxt: "关闭",
					title: "温馨提示",
					content: "您有尚未完成的取款订单，订单完成后才能再次取款！",
					customClass: "pk-dialog-single",
                    onOkBtn() {
						this.close();
					}
				});
			},
			//是否设置了取款密码
			isSetOutMoneyPassword() {
				let self = this;
				this.$dialog({
					id: "dialog_pwd",
					lockBgScroll: true,
					closeOnClickModal: false,
					textAlign: "left",
					cancelBtnTxt: "暂不取款",
					okBtnTxt: "设置取款密码",
					title: "温馨提示",
					content: "抱歉，您还未设置取款密码，无法出款！",
					customClass: "pk-dialog",
					onOkBtn() {
						self.$router.push({ name: "securitypwd" }); //设置取款密码
						this.close();
					}
				});
			},
			//是否设置了个人资料
			isSetUserInfo(info) {
				if (
					!info ||
					(info.isQq === 2 &&
						info.isWechat === 2 &&
						info.isEmail === 2 &&
						info.isPhone === 2 &&
						info.isIdCard === 2)
				) {
					this.$router.push({
						name: "withdrawAudit"
					});
					return;
				}
				let arr = [];
				if (info.isQq === 1) {
					arr.push("QQ");
				}
				if (info.isWechat === 1) {
					arr.push("微信");
				}
				if (info.isEmail === 1) {
					arr.push("邮箱");
				}
				if (info.isPhone === 1) {
					arr.push("手机号");
				}
				if (info.isIdCard === 1) {
					arr.push("身份证");
				}
				let self = this;
				this.$dialog({
					id: "dialog_info",
					lockBgScroll: true,
					closeOnClickModal: false,
					textAlign: "left",
					okBtnTxt: "去完善资料",
					cancelBtnTxt: "暂不取款",
					title: "温馨提示",
					content: `抱歉，您还未完善个人资料(${arr.join(
						"、"
					)}），无法取款！`,
					customClass: "pk-dialog",
					onOkBtn() {
						self.$router.push({ name: "about" }); //设置个人资料
						this.close();
					}
				});
			},

			validateRegExp() {
				this.postData.outMoney = this.postData.outMoney.replace(
					/[^\d]/,
					""
				);
			},

			//取款提交
			handleWithdraw() {
				if (!this.infoData.isOrder) {
					//是否有完成的订单 true=没有 false=有
					this.isFinishOrder();
					return;
				} else if (!this.infoData.hasP) {
					//去设置取款密码hasP true=有设置密码 false=没有设置密码
					this.isSetOutMoneyPassword();
					return;
				} else if (!this.postData.outMoney) {
					this.$toast.fail("请输入取款金额", { cover: true });
					return;
				}

				if (!/^[1-9]\d*$/.test(this.postData.outMoney)) {
					this.$toast.fail("取款金额为正整数", { cover: true });
					return;
				}
				if (
					this.postData.outMoney > this.infoData.max ||
					this.postData.outMoney < this.infoData.min
				) {
					this.$toast.fail(
						`取款金额为${this.infoData.min}-${this.infoData.max}`,
						{ cover: true }
					);
					return;
				}
				if (!/^\d{6}$/.test(this.postData.drawPassword)) {
					this.$toast.fail("取款密码为6位数字", { cover: true });
					return;
				}
				let postData = {
					outMoney: this.postData.outMoney * 1,
					drawPassword: this.postData.drawPassword,
					bankId: this.bankInfo.id
				};
				let loading = this.$toast.loading("提交中...");
				func.postWithdraw(postData).then(res => {
					loading.hide();
					if (res.success) {
						this.isSetUserInfo(res.data.imi);
						let data = encodeURIComponent(JSON.stringify(res.data));
						sessionStorage.setItem("withdrawAudit", data);
					} else {
						this.$toast.fail(res.message, {
							cover: true,
							duration: 4000
						});
					}
				});
			}
		},
		watch: {
			outMoney(newVal, oldVal) {
				this.outMoneyChinese = this.filterAmount(newVal * 1);
			},
			isShowChooseBankModal(newVal, oldVal) {
				if (newVal) {
					this.ModalHelper.open();
				} else {
					this.ModalHelper.close();
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		padding-bottom: 2.8rem;
	}

	.person-info {
		background: url("../../assets/img/touxiangbg.png") center center no-repeat;
		overflow: hidden;
		background-size: cover;
		height: 3.733rem;
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

	/deep/ .nut-actionsheet-panel {
		border-radius: 0.133rem 0.133rem 0 0;
	}

	.custom-wrap {
		background: $default-color;
		border-radius: 0.133rem 0.133rem 0 0;
		.title {
			height: 1.46666rem;
			line-height: 1.46666rem;
			text-align: center;
			background: $primary-color;
			color: $default-color;
			font-size: 0.43rem;
			letter-spacing: 0.08rem;
			border-radius: 0.133rem 0.133rem 0 0;
		}
		ul {
			li {
				height: 2rem;
				padding: 0 0.4rem;
				display: flex;
				justify-content: space-between;
				.left {
					display: flex;
					justify-content: center;
					flex-direction: column;
					p {
						font-size: 0.427rem;
						color: $text-color;
					}
					span {
						font-size: 0.347rem;
						color: $tip-color;
					}
				}
				.right {
					@extend .left;
					i {
						font-size: 0.453rem;
						color: $tip-color;
					}
				}
				&.active {
					.right {
						i {
							color: $primary-color;
						}
					}
				}
			}
		}
	}

	.widthdraw-top {
		background: $default-color;
		padding: 0.4rem /* 30/75 */;
		.title {
			font-size: 0.43rem;
			color: $tip-color;
			margin-bottom: 0.26667rem /* 20/75 */;
			display: flex;
			justify-content: space-between;
		}
		.no-bankCard {
			p {
				text-align: center;
				font-size: 0.32rem /* 24/75 */;
				color: $label-color;
			}
			.add-card {
				width: 100%;
				border: 1px dashed $color-P;
				border-radius: 0.13333rem /* 10/75 */;
				margin: 0.4rem /* 30/75 */ 0;
				height:3.73333rem /* 280/75 */;
				font-size: 0.37333rem /* 28/75 */;
				color: $label-color;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				i {
					font-size: 0.8rem /* 60/75 */;
					color: $label-color;
				}
			}
		}
		.has-bankCard {
			position: relative;
			.card-list {
				width: 100%;
				padding-left: 0.4rem;
				padding-bottom: 0.4rem;
				border-radius: 0.13333rem /* 10/75 */;
				box-sizing: border-box;
				font-size: 0.37333rem /* 28/75 */;
				background-image: linear-gradient(90deg, #f82657 0%, #fb3d3d 100%);
				color: $default-color;

				.left {
					float: left;
					max-width: 65%;
					font-weight: 200;
					padding-top: 0.4rem;
					h2 {
						font-size: 0.48rem /* 36/75 */;
						position: relative;
						font-weight: 200;
					}
					h3 {
						// margin: .4rem /* 30/75 */ 0 .26667rem /* 20/75 */ 0;
						font-weight: 200;
					}
				}
				.right {
					float: right;
					i {
						font-size: 2.933rem;
						opacity: 0.66;
					}
				}
			}
		}
	}

	.width-form {
		background: $default-color;
		ul {
			li {
				padding: 0 0.4rem;
				height: 1.47rem;
				line-height: 1.47rem;
				display: flex;
				justify-content: space-between;
				span {
					flex: 3;
					font-size: 0.43rem;
					color: $tip-color;
				}
				input {
					flex: 8;
					border: none;
					text-align: right;
					font-size: 0.43rem;
					color: $color-C;
					&::-webkit-input-placeholder {
						color: $label-color;
						font-size: 0.43rem;
					}
				}
			}
		}
	}

	.widthdraw-bottom {
		h2 {
			padding-right: 0.4rem;
			height: 0.8rem;
			line-height: 0.8rem;
			font-size: 0.32rem /* 24/75 */;
			text-align: right;
			color: $tip-color;
			background: $default-color;
			font-weight: 400;
			a {
				color: $primary-color;
				text-decoration: underline;
			}
		}
	}

	.hint {
		padding: 0.4rem /* 30/75 */;
		font-size: .34667rem /* 26/75 */;
		color: $label-color;
		background: $default-bg-color;
		p {
            line-height: 1.5;
            color:$label-color;
			span {
				color: $primary-color;
			}
		}
		h3 {
			line-height: 1.5;
            font-size: 0.34667rem /* 26/75 */;
            font-weight:400;
            color:$tip-color;
		}
	}

	.money-chinese {
		text-align: right;
		background: $default-bg-color;
		line-height: 0.93rem;
		height: 0.93rem;
		font-size: 0.35rem;
		color: $text-color;
		padding-right: 0.4rem;
	}
</style>


