<template>
	<div class="deposit">

		<!-- 文案详情弹框 -->
		<div v-show="isShowCopyWriterMask" class="copy-writer-details-mask"></div>
		<div v-show="isShowCopyWriterMask" class="copy-writer-details-box" @touchmove.prevent>
			<div class="details-title pk-1px-b">
				<span>文案详情</span>
				<span @click.stop="isShowCopyWriterMask = false;"><i class="iconfont icon-sykszz-close"></i> </span>
			</div>
			<div class="details-content">
				<div class="sub-title">{{detitle}}</div>
				<p v-html="detail" class="details-content-html"></p>
			</div>
		</div>

		<Header rooter="-1" title="选择支付方式" :hasNoBack="true" iFontsize=".58667rem"></Header>

		<div class="content">

			<!-- 线上存款 -->
			<div v-show="onlineList.length>0" class="pay-list">
				<div class="title">
					<h2>线上存款</h2>
					<!-- <p class="text-dots">此处展示文案全部内容，此处文案全部内容，此处展示...</p> -->
					<!-- <a @click="isShowCopyWriterMask=true">详情</a> -->
				</div>
				<ul>
					<li v-for="(item,index) in onlineList" :key="index" @click="goOnlineDeposit(item)"
						:class="{'pk-1px-b':index === onlineList.length-1}">
						<div class="left company-icon">
							<img :src="cdnUrl+'/online/'+item.payType+'.png'" alt="">
							<!--<i class="iconfont" :class="item.icon" :style="{'color':item.color}"></i>-->
						</div>
						<div class="right" :class="{'pk-1px-b':index != onlineList.length-1}">
							<div class="desc">
								<div>
									<h2>{{item.payName}}</h2>
									<p v-show="item.isHigh == 1" class="text-dots">
										存款区间{{item.depositMin}}~{{item.depositMax}}</p>
									<p v-show="item.isHigh == 2" class="text-dots">
										存款区间{{item.singleMin}}~{{item.singleMax}}</p>
								</div>
								<a v-show="item.content" class="details-btn" @click.stop="deMore(item,1)">存款信息</a>
							</div>
							<i class="iconfont icon-list-more"></i>
						</div>
					</li>

					<div @click="speardMore()" v-show="isShowMoreWayBtn" class="more-payType">
						<span>{{more?'收起':'更多'}}支付方式</span>
						<i class="iconfont icon-wallet-more"></i>
					</div>

				</ul>
			</div>

			<!-- 公司存款 -->
			<div v-show="companyList.length>0" class="pay-list">
				<div class="title">
					<h2>公司存款</h2>
					<!-- <p class="text-dots">此处展示文案全部内容，此处文案全部内容，此处展示...</p> -->
					<!-- <a @click.stop>详情</a> -->
				</div>
				<ul>
					<li v-for="(item,index) in companyList" :key="index" @click="goCompanyDeposit(item)"
						:class="{'pk-1px-b':index === companyList.length-1}">
						<div class="left company-icon">
							<!-- <i class="iconfont icon-qb-tongyong1"></i> -->
							<img :src="cdnUrl+'/'+item.bankId+'.png'" alt="">
						</div>
						<div class="right" :class="{'pk-1px-b':index != companyList.length-1}">
							<div class="desc">
								<div>
									<h2><i v-if="item.recommend === 1" class="iconfont icon-ck-tuijian"></i> {{item.bankName}}{{item.bankAddress}}</h2>
									<p v-show="item.bankNum" class="text-dots">账号：{{item.bankNum}}</p>
								</div>
								<a v-show="item.content" class="details-btn" @click.stop="deMore(item,2)">存款信息</a>
							</div>

							<!--<p v-if="item.bankAddress"><a>开户行</a><span>{{item.bankAddress}}</span></p>-->
							<!--<p><a><b>户</b>主</a><span>{{item.bankUser}}</span></p>-->
							<!--<p class="text-dots"><a><b>账</b>号</a><span>{{item.bankNum}}</span></p>-->
							<!-- <p class="text-dots">此处展示文案全部内容，此处文案全部内容，此处展示...</p> -->
							<!-- <a @click.stop>详情</a> -->
							<i class="iconfont icon-list-more"></i>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<div v-show="companyList.length<1 && onlineList.length<1" class="noContent">
			<div class="noContent-box">
				<i class="iconfont icon-qb-zwzhifufs"></i>
				<h2>暂无支付方式</h2>
				<p>请<a>联系客服添加</a></p>
			</div>
		</div>

	</div>
</template>

<script>
    import Header from '@/components/Header'
    import func from '@/api/purse'

    export default {
        name: "deposit",
        components: {
            Header
        },
        data () {
            return {
                cdnUrl: "",
                detitle: '',
                detail: '',
                isShowMoreWayBtn: false,
                isShowCopyWriter: true,
                isShowMorePayType: true,
                more: false,
                isShowCopyWriterMask: false,
                onlineList: [],
                onlineListMore: [],
                imgUrlArr: [{
                    payType: 1,
                    payName: "网银",
                    icon: 'icon-qb-wangyin',
                    color: '#4cd964'
                },
                    {
                        payType: 2,
                        payName: "微信",
                        icon: 'icon-qb-weixin',
                        color: '#62b900'

                    },
                    {
                        payType: 3,
                        payName: "支付宝",
                        icon: 'icon-qb-zhifubao',
                        color: '#00b7ee'
                    },
                    {
                        payType: 10,
                        payName: "点卡支付",
                        icon: 'icon-qb-dianka',
                        color: '#ff6057'
                    },
                ],
                companyList: [],
            };
        },
        created () {
            this.getOnlineCompanyList();
        },
        methods: {
            getOnlineCompanyList () {
                func.getOnlineCompanyList().then((res) => {
                    console.log(res, '-------');
                    this.cdnUrl = res.cdnUrl;
                    this.companyList = res.bank;
                    this.onlineListMore = res.pay;
                    this.onlineListMore.map((v, i) => {
                        v.depositMax +=0.99;
                        v.singleMax +=0.99;
                        this.imgUrlArr.map((v2) => {
                            if (v.payType === v2.payType) {
                                this.onlineListMore[i]['icon'] = v2.icon;
                                this.onlineListMore[i]['color'] = v2.color;
                            }
                        })
                    })

                    this.isShowMoreWayBtn = this.onlineListMore.length > 5;
                    this.onlineList = this.onlineListMore.slice(0, 5);
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                })

            },
            //展开收起-线上存款更多支付方式
            speardMore () {
                this.more = !this.more;
                if (this.more) {
                    this.onlineList = this.onlineListMore;
                } else {
                    this.onlineList = this.onlineListMore.slice(0, 5);
                }
            },
            deMore (item, type) {
                this.isShowCopyWriterMask = true;
                if (type === 1) {//线上存款
                    this.detail = item.content;
                    this.detitle = item.payIdName + '-' + item.payName;
                } else {//公司存款
                    this.detail = item.content;
                    this.detitle = item.bankName + '-' + item.bankAddress;
                }

            },
            goOnlineDeposit (item) {
                let name = '';
                switch (item.payType) {
                    case 1: //网银
                        name = 'onlineEBank';
                        break;
                    case 2://微信
                        name = 'onlineAlipay'
                        break;
                    case 3://支付宝
                        name = 'onlineAlipay'
                        break;
                    case 10://点卡支付
                        name = 'timeCard'
                        break;
                }
                this.$router.push({
                    'name': name,
                    query: {
                        setId: item.setId,
                        payType: item.payType
                    }
                });
            },
            goCompanyDeposit (item) {
                if (item.payType === 1) { //无二维码
                    this.$router.push({
                        'name': 'companyEBank',
                        query: {
                            id: item.id
                        },
                    });
                } else if (item.payType === 2) { //有二维码
                    this.$router.push({
                        'name': 'companyAlipay',
                        query: {
                            id: item.id
                        },
                    });

                }
            }
        },
        watch: {
            isShowCopyWriterMask (newVal, oldVal) {
                if (newVal) {
                    this.ModalHelper.open();
                } else {
                    this.ModalHelper.close();
                }
            }
        },
    };
</script>

<style lang="less" scoped>
	@import url("../../../components/less/common.less");
	// 无内容样式
	.noContent {
		padding-top: 1.22667rem /* 92/75 */;
		.noContent-box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-top: 2.13333rem /* 160/75 */;
			text-align: center;
			i {
				font-size: 2.66667rem /* 200/75 */;
				color: @color-w;
				opacity: .6;
			}

			h2 {
				color: @color-w;
				font-size: .48rem /* 36/75 */;
				margin: .4rem /* 30/75 */ 0;
			}
			p {
				color: @color-w;
				font-size: .4rem /* 30/75 */;
				a {
					text-decoration: underline;
				}
			}
		}
	}

	.content {
		padding-top: 1.22667rem /* 92/75 */;
		.pay-list {
			margin-top: 0.26667rem /* 20/75 */;
			.title {
				font-size: 0;
				padding: 0 0.4rem /* 30/75 */;
				h2 {
					font-size: 0.42667rem /* 32/75 */;
					color: @color-C;
					font-weight: normal;
				}
				p {
					font-size: 0.32rem /* 24/75 */;
					color: @color-J;
					margin-top: 0.2rem /* 15/75 */;
					width: 7.92rem /* 594/75 */;
					display: inline-block;
				}
				a {
					font-size: 0.32rem /* 24/75 */;
					color: @color-w;
					text-decoration: underline;
					vertical-align: bottom;
				}
			}
			ul {
				.more-payType {
					padding-top: .26667rem /* 20/75 */;
					background-color: @color-default;
					text-align: center;
					position: relative;
					height: 1.06667rem /* 80/75 */;
					span {
						display: block;
						font-size: .32rem /* 24/75 */;
						color: @color-w;
						margin-top: .13333rem /* 10/75 */;
					}
					i {
						font-size: 1.06667rem /* 80/75 */;
						color: @color-w;
						opacity: 0.6;
						display: block;
						position: absolute;
						left: 50%;
						transform: translate(-50%);
						bottom: -.08rem /* 6/75 */;
					}

				}
				li {
					background-color: @color-default;
					display: flex;
					&:active {
						background: @color-rgab-b2;
					}
					.left {
						flex: 1;
						padding: 0.27rem /* 20/75 */ 0.4rem /* 30/75 */;
						display: flex;
						justify-content: center;
						align-self: center;
						i {
							font-size: .8rem /* 60/75 */;
							color: @color-a;
						}
						&.company-icon {
							img {
								width: 0.80rem; /* 60/75 */
								height: 0.80rem; /* 60/75 */
								display: block;
							}
						}
					}
					.right {
						flex: 10;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0.27rem /* 20/75 */ 0;
						padding-right: 0.4rem /* 30/75 */;
						.desc {
							display: flex;
							align-items: center;
							width: 100%;
							padding-right: 30px;
							justify-content: space-between;
							.details-btn {
								height: 0.53rem; /* 40/75 */;
								line-height: 0.53rem; /* 40/75 */;
								font-size: 0.27rem /* 20/75 */;
								border-radius: 0.08rem; /* 6/75 */;
								padding: 0 0.13rem /* 10/75 */;
								color: @color-primary;
								text-align: center;
								border: 1px solid @color-primary;
							}
							h2 {
								font-size: 0.37333rem /* 28/75 */;
								color: @color-C;
                                font-weight: normal;
                                i{
                                    color: #ff2a00;
                                    font-size: 0.37333rem /* 28/75 */;
                                }
							}
							p {
								font-size: 0.32rem /* 24/75 */;
								color: @color-J;
								margin-top: 0.13rem /* 10/75 */;;
								/*width: 6.30667rem !* 473/75 *!;*/
								display: inline-block;
								a {
									font-size: .37333rem /* 28/75 */;
									text-decoration: none;
									color: @color-J;
									margin-right: .4rem /* 30/75 */;
									b {
										letter-spacing: 1em;
										font-weight: normal;
									}
								}
								span {
									font-size: .37333rem /* 28/75 */;
									color: @color-C;
									a {
										color: @color-C;
									}
								}
							}

						}
						.iconfont {
							font-size: 0.32rem /* 24/75 */;
							color: @color-K;
						}
					}
					&:last-child {
						.right {
							border-bottom: none;
						}
					}
				}
				&:nth-child(n+1) {
					margin-top: 0.26667rem /* 20/75 */;
				}
			}
		}
	}
</style>



<style lang="less">
 .details-content-html{
        img{
            max-width: 100%;
        }
    }
</style>
