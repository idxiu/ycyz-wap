<template>
	<div class="withdraw">
		<Header rooter="-1" title="取款" :hasNoBack="true" iFontsize=".58667rem"></Header>
		<div class="content">
			<div class="person-info clearfix">
				<div class="left iconfont icon-sidebar_head"></div>
				<div class="center">
					<h2>{{infoData.account}}</h2>
					<p v-show="isShowMoney">{{infoData.balance}}</p>
					<mt-spinner v-show="!isShowMoney" type="fading-circle" color="#00d897" :size="size"></mt-spinner>
				</div>
				<div class="right">
					<a @click="refush()">
						<i class="iconfont icon-wallet-refresh"></i>
						<span>刷新余额</span>
					</a>
				</div>
			</div>
			<div class="widthdraw-top">
				<div class="title">
					<span class="must">收款账户</span>
				</div>
				<router-link tag="div" :to="{name:'bankCardadd'}" v-show="infoData.has===1" class="no-bankCard">
					<p>您还未添加银行卡</p>
					<div class="add-card">
						<i class="iconfont icon-qb-bank-add"></i>
						<span>点击添加银行卡</span>
					</div>
				</router-link>
				<div v-show="infoData.has===2" class="has-bankCard">
					<swiper :options="swiperOption" ref="mySwiper">
						<swiper-slide v-for="(item, index) in swiperSlides" :key="index">
							<div class="card-list clearfix">
								<div class="left">
									<h2 class="text-dots">{{item.bankName}}
									</h2>
									<h3 class="text-dots">{{item.subbranch}}</h3>
									<p>{{item.card | filterBankNum}}</p>
								</div>
								<div class="right">
									<i class="iconfont icon-bank-normal" v-show="item.isDefault === 1"></i>
									<i class="iconfont icon-qb-bank-tongyong1"></i>
								</div>
							</div>
						</swiper-slide>
						<div class="swiper-pagination" slot="pagination"></div>
					</swiper>
				</div>
				<div class="width-form">
					<ul>
						<li class="pk-1px-tb">
							<span class="must">取款金额</span>
							<input type="number" v-model="postData.outMoney" placeholder="请输入取款金额">
						</li>
							<div v-show="postData.outMoney" class="money-chinese">{{outMoneyChinese}}</div>
						<li>
							<span class="must">取款密码</span>
							<input type="password" v-model="postData.drawPassword" placeholder="请输入取款密码">
						</li>
					</ul>
				</div>
			</div>
			<div class="widthdraw-bottom">
				<h2 v-show="infoData.hasP===1">忘记取款密码请
					<router-link tag="a" :to="{name:'contactus'}">联系客服</router-link>
				</h2>
				<h2 v-show="infoData.hasP===2">您还未设置取款密码请
					<router-link tag="a" :to="{name:'password'}">点击设置</router-link>
				</h2>

				<button @click="handleWithdraw" :disabled="infoData.has===1">取款</button>
				<div class="hint">
					<h3>温馨提示</h3>
					<p>1.单笔取款金额为<span>{{infoData.min}}~{{infoData.max}}</span>元</p>
					<p>2.取款金额需为整数，否则可能延长出款。</p>
					<p>3.有未完成的取款订单时，无法提交第二笔订单。</p>
					<p>4.出款出现以下情况将会扣除一定费用：</p>
					<p>1）未满足常态稽核 将扣除入款金额{{infoData.lineAuditAdminRate}}%行政费用与优惠金额。</p>
					<p>2) 未满足综合稽核 将扣除优惠金额。</p>
					<p>*常态稽核 = 会员入款金额 * 常态稽核倍数</p>
					<p>*综合(优惠)稽核 = (会员入款金额+优惠) *综合稽核倍数</p>
				</div>
			</div>
		</div>


	</div>
</template>

<script>
    import Header from '@/components/Header'
    import 'swiper/dist/css/swiper.css'
    import {
        swiper,
        swiperSlide
    } from 'vue-awesome-swiper'
    import func from '@/api/purse'

    export default {
        name: 'withdraw',
        components: {
            Header,
            swiper,
            swiperSlide
        },
        data () {
            return {
                isShowMoney: true,
                size: parseInt(this.HTML_FONT_SIZE * 0.4),
                swiperOption: {
                    spaceBetween: '5%',
                    pagination: '.swiper-pagination',
                },
                swiperSlides: [],
                infoData: {},
                postData: {
                    outMoney: '',
                    drawPassword: "",
                    bankId: "",
                },
                outMoneyChinese:'',//出款金额中文大写
            }
        },
        computed: {
            swiper () {
                return this.$refs.mySwiper.swiper
            },
            outMoney(){
                return this.postData.outMoney;
			}
        },
        mounted () {
            this.refush(1);
        },
        methods: {
            //获取取款信息/刷新
            refush (t) {
                this.isShowMoney = false;
                func.getWithdrawInfo().then((res) => {
                    console.log(res)
                    this.infoData = res;
                    this.swiperSlides = res.bankList;
                    this.isShowMoney = true;

                    //是否有完成的订单 1=有 2=没有
                    if (this.infoData.isOrder === 1) {
                        this.$messagebox({
                            title: " ",
                            message: '抱歉，您有尚未完成的取款订单，订单完成后才能再次取款。',
                            confirmButtonText: "关闭",
                        }).then(action => {

                        });
                        return;
                    }

                    //去设置取款密码hasP 1=有设置密码 2=没有设置密码
                    if (this.infoData.hasP === 2) {
                        this.isSetOutMoneyPassword();
                    }


                    if (!t) {
                        this.$toast({
                            message: '刷新成功',
                            duration: 2000
                        });
                    }

                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                })
            },
            //取款提交
            handleWithdraw () {
                if (!this.APP_CONFIG.RegExp.number.test(this.postData.outMoney)) {
                    this.$toast({
                        message: '取款金额为正整数',
                        duration: 2000
                    });
                    return;
                }
                if (this.postData.outMoney > this.infoData.max || this.postData.outMoney < this.infoData.min) {
                    this.$toast({
                        message: `取款金额为${this.infoData.min}-${this.infoData.max}`,
                        duration: 2000
                    });
                    return;
                }
                if (!this.APP_CONFIG.RegExp.outMoneyPwd.test(this.postData.drawPassword)) {
                    this.$toast({
                        message: '取款密码为6位数字',
                        duration: 2000
                    });
                    return;
                }
                let postData = {
                    outMoney: this.postData.outMoney * 1,
                    drawPassword: this.postData.drawPassword,
                    bankId: this.swiperSlides[this.swiper.activeIndex].id
                }
                console.log(postData)
                func.postWithdraw(postData).then((res) => {
                    console.log(res)

                    this.isSetUserInfo(res.isMemberInfo);
                    let data = encodeURIComponent(JSON.stringify(res));
                    sessionStorage.setItem('withdrawAudit', data);
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                })
            },
            //是否设置了取款密码
            isSetOutMoneyPassword () {
                this.$messagebox({
                    title: " ",
                    message: "您还没有设置取款密码",
                    showCancelButton: true,
                    confirmButtonText: "设置",
                    cancelButtonText: "取消"
                }).then(action => {
                    if (action == "confirm") {
                        this.$router.push({name: 'password'});//设置取款密码
                    }
                });
            },
            //是否设置了个人资料
            isSetUserInfo (info) {
                if (info.isQq === 2
                    && info.isWechat === 2
                    && info.isEmail === 2
                    && info.isPhone === 2
                    && info.isIdCard === 2
                ) {
                    this.$router.push({
                        name: 'withdrawAudit'
                    });
                    return;
                }


                let arr = [];
                if (info.isQq === 1) {
                    arr.push('QQ');
                }
                if (info.isWechat === 1) {
                    arr.push('微信');
                }
                if (info.isEmail === 1) {
                    arr.push('邮箱');
                }
                if (info.isPhone === 1) {
                    arr.push('手机号');
                }
                if (info.isIdCard === 1) {
                    arr.push('身份证');
                }

                this.$messagebox({
                    title: " ",
                    message: `抱歉，您还未完善个人资料（${arr.join('、')}），无法取款！`,
                    showCancelButton: true,
                    confirmButtonText: "去完善资料",
                    cancelButtonText: "暂不取款"
                }).then(action => {
                    if (action == "confirm") {
                        this.$router.push({name: 'about'});//设置个人资料
                    }
                });
            }
        },
        watch:{
            outMoney(newVal,oldVal){
                console.log(newVal)
				this.outMoneyChinese = this.filterAmount(newVal * 1);
			}
        }
    }
</script>

<style lang="less" scoped>
	@import url("../../../components/less/common.less");

	.content {
		padding-top: 1.22667rem /* 92/75 */;
	}

	.person-info {
		background: #252232 url("../../../assets/img/headbg.png") center 30px no-repeat;
		overflow: hidden;
		background-size: cover;
		.left {
			margin: 0.4rem /* 30/75 */;
			float: left;
			font-size: 1.70667rem;
			color: @color-primary;
		}
		.center {
			float: left;
			color: @color-primary;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			height: 2.50667rem /* 188/75 */;
			h2 {
				margin-bottom: 0.26667rem /* 20/75 */;
				font-size: 0.48rem /* 36/75 */;
			}
			p {
				font-size: 0.4rem /* 30/75 */;
			}
		}
		.right {
			float: right;
			height: 2.50667rem /* 188/75 */;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-right: 0.4rem /* 30/75 */;
			a {
				color: @color-primary;
				border: 1px solid @color-primary;
				border-radius: 0.08rem /* 6/75 */;
				height: 0.58667rem /* 44/75 */;
				line-height: 0.58667rem /* 44/75 */;
				padding: 0 0.13333rem /* 10/75 */;
				box-sizing: border-box;
				text-decoration: none;
				span {
					color: @color-primary;
					font-size: .32rem /* 24/75 */;
				}
				.iconfont {
					font-size: 0.32rem /* 24/75 */;
				}
			}
		}
	}

	.widthdraw-top {
		background: @color-default;
		margin-top: .26667rem /* 20/75 */;
		padding: .4rem /* 30/75 */;
		padding-bottom: 0;
		.title {
			font-size: .37333rem /* 28/75 */;
			color: @color-C;
			margin-bottom: .26667rem /* 20/75 */;
		}
		.no-bankCard {
			p {
				text-align: center;
				font-size: .32rem /* 24/75 */;
				color: @color-M;
			}
			.add-card {
				width: 100%;
				border: 1px dashed @color-P;
				border-radius: .13333rem /* 10/75 */;
				margin: .4rem /* 30/75 */ 0;
				height: 2.66667rem /* 200/75 */;
				font-size: .37333rem /* 28/75 */;
				color: @color-J;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				i {
					font-size: .8rem /* 60/75 */;
					color: @color-P;
				}

			}
		}
		.has-bankCard {
			position: relative;
			.card-list {
				width: 100%;
				height: 2.66667rem /* 200/75 */;
				border-radius: .13333rem /* 10/75 */;
				box-sizing: border-box;
				font-size: .37333rem /* 28/75 */;
				background-image: linear-gradient(-90deg, @color-i 0%, @color-k 100%), linear-gradient(@color-i, @color-i);
				color: @color-default;

				.left {
					padding-left: .53333rem /* 40/75 */;
					padding-top: .4rem /* 30/75 */;
					float: left;
					max-width: 65%;
					font-weight: 200;
					h2 {
						font-size: .48rem /* 36/75 */;
						position: relative;
						font-weight: 200;
					}
					h3 {
						margin: .4rem /* 30/75 */ 0 .26667rem /* 20/75 */ 0;
						font-weight: 200;
					}
				}
				.right {
					float: right;
					position: relative;
					i.icon-qb-bank-tongyong1 {
						font-size: 3.8rem;
						opacity: 0.2;
						position: absolute;
						right: -0.26667rem;
						top: -.26667rem /* 20/75 */;
					}
					i.icon-bank-normal {
						position: absolute;
						font-size: 1.06667rem /* 80/75 */;
						color: @color-default;
						opacity: 0.8;
						right: .26667rem /* 20/75 */;
						top: -.08rem /* 6/75 */;
					}
				}
			}
		}
		.width-form {
			margin-top: 0.8rem;
			ul {
				.money-chinese{
					text-align: right;
					padding:.4rem 0 0 0;
				}
				li {
					height: 1.06667rem /* 80/75 */;
					line-height: 1.06667rem /* 80/75 */;
					display: flex;
					justify-content: space-between;
					span {
						flex: 2;
						font-size: .37333rem /* 28/75 */;
					}
					input {
						flex: 8;
						border: none;
						text-align: right;
						font-size: .37333rem /* 28/75 */;
						color: @color-C;
						&::-webkit-input-placeholder {
							color: @color-P;
							font-size: .32rem /* 24/75 */;
						}
					}
				}
			}
		}
	}

	.widthdraw-bottom {
		padding: 0 .4rem /* 30/75 */ .53333rem /* 40/75 */;
		h2 {
			height: .98667rem /* 74/75 */;
			line-height: .98667rem /* 74/75 */;
			font-size: .32rem /* 24/75 */;
			text-align: right;
			color: @color-M;
			a {
				color: @color-w;
				text-decoration: underline;
			}
		}
		button {
			width: 100%;
			height: 1.2rem /* 90/75 */;
			line-height: 1.2rem /* 90/75 */;
			font-size: .48rem /* 36/75 */;
			border-radius: .13333rem /* 10/75 */;
			background: @color-primary;
			border: none;
			color: @color-default;
			text-align: center;
			box-shadow: 0px 2px 5px 0px @color-rgab-black;
			&:active {
				background: @color-primary-active;
			}
			&:disabled {
				background: @color-y;
				box-shadow: none;
				color: @color-P;
			}
		}
		.hint {
			margin-top: .4rem /* 30/75 */;
			font-size: .32rem /* 24/75 */;
			color: @color-M;
			p {
				line-height: 1.5;
				span {
					color: @color-primary;
				}
			}
			h3 {
				line-height: 1.5;
				font-size: .34667rem /* 26/75 */;
			}
		}
	}
</style>


