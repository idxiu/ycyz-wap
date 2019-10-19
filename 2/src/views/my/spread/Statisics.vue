
<template>
	<div class="statisics">
		<nut-navbar
			class="pk-title"
			@on-click-back="$router.go(-1)"
			@on-click-more="$router.push({name:'index'})"
		>
			推广统计
			<a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png">
			</a>
			<a class="backIdex" slot="more-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/backIndex.png">
			</a>
		</nut-navbar>
		<div class="cent">
			<div class="tab">
				<nut-tab @tab-switch="tabSwitch" :contentShow="false">
					<nut-tab-panel v-for="item in timeArr" :key="item.value" :tabTitle="item.name"></nut-tab-panel>
				</nut-tab>
			</div>
			<div class="tab-content">
				<div class="top-content">
					<h4>个人数据</h4>
					<ul>
						<li>
							<p>推广人数</p>
							<h2>{{info.newSNum}}</h2>
						</li>
						<li>
							<p>投注人数</p>
							<h2>{{info.betNum}}</h2>
						</li>
						<li>
							<p>返佣金额</p>
							<h2>{{ info.tzRebate | currency('') }}</h2>
						</li>
						<li>
							<p>累计返佣总额</p>
							<h2>{{ info.rebate | currency('') }}</h2>
						</li>
					</ul>
				</div>
				<div class="bottom-content">
					<h4>下级团队数据</h4>
					<div class="title">
						<span>投注总额</span>
						<span>{{ info.betAll | currency('') }}</span>
					</div>
					<ul class="pk-1px-b">
						<li>
							<p><img src="@/assets/img/caipiao.png" alt="">彩票投注</p>
							<h2>{{ info.cpBet | currency('') }}</h2>
						</li>
						<li>
							<p><img src="@/assets/img/qipai.png" alt="">棋牌投注</p>
							<h2>{{ info.qpBet | currency('') }}</h2>
						</li>
						<li>
							<p><img src="@/assets/img/dianzi.png" alt="">电子投注</p>
							<h2>{{ info.dzBet | currency('') }}</h2>
                        </li>
					</ul>
					<ul>
						<li>
							<p><img src="@/assets/img/buyu.png" alt="">捕鱼投注</p>
							<h2>{{ info.byBet | currency('') }}</h2>
						</li>
						<li>
							<p><img src="@/assets/img/tiyu.png" alt="">体育投注</p>
							<h2>{{ info.tyBet | currency('') }}</h2>
						</li>
						<li>
							<p><img src="@/assets/img/shixun.png" alt="">视讯投注</p>
							<h2>{{ info.sxBet | currency('') }}</h2>
						</li>
                    </ul>
                    
					<div class="title title-backwater">
						<span>返佣总额</span>
						<span>{{ info.water | currency('') }}</span>
					</div>
					<ul class="pk-1px-b">
						<li>
							<p><img src="@/assets/img/caipiao.png" alt="">彩票返佣</p>
							<h2>{{ info.cpWater | currency('') }}</h2>
						</li>
						<li>
							<p><img src="@/assets/img/qipai.png" alt="">棋牌返佣</p>
							<h2>{{ info.qpWater | currency('') }}</h2>
						</li>
						<li>
							<p><img src="@/assets/img/dianzi.png" alt="">电子返佣</p>
							<h2>{{ info.dzWater | currency('') }}</h2>
                        </li>
					</ul>
					<ul>
						<li>
							<p><img src="@/assets/img/buyu.png" alt="">捕鱼返佣</p>
							<h2>{{ info.byWater | currency('') }}</h2>
						</li>
						<li>
							<p><img src="@/assets/img/tiyu.png" alt="">体育返佣</p>
							<h2>{{ info.tyWater | currency('') }}</h2>
						</li>
						<li>
							<p><img src="@/assets/img/shixun.png" alt="">视讯返佣</p>
							<h2>{{ info.sxWater | currency('') }}</h2>
						</li>
					</ul>
                </div>
			</div>
		</div>
	</div>
</template>
<script>
	import func from "@/services/spread";
	import noData from "@/components/NoData.vue";

	export default {
		components: {
			noData
		},
		data() {
			return {
				timeArr: [
					{ value: 2, name: "今日" },
					{ value: 1, name: "昨日" },
					{ value: 5, name: "本月" },
					{ value: 6, name: "上月" }
				],
				dayType: 2,
				info: {},
			};
		},
		mounted() {
			this.getGeneralizeStatisList();
		},
		methods: {
			getGeneralizeStatisList() {
				let loading = this.$toast.loading("加载中...");
				func.getGeneralizeStatisList({
					dayType: this.dayType
				}).then(res => {
					loading.hide();
					if (res.success) {
						this.info = res.data;
					} else {
						this.$toast.fail(res.message, {
							cover: true,
							duration: 4000
						});
					}
				});
			},
			tabSwitch(index) {
				this.dayType = this.timeArr[index].value;
				this.getGeneralizeStatisList();
			}
		}
	};
</script>
<style lang="scss" scoped>
	.no-data-box {
		margin-top: 2.13333rem /* 160/75 */;
	}
	.statisics {
		.tab {
			position: fixed;
			top: 1.17rem;
			left: 0;
			width: 100%;
			z-index: 1;
			/deep/ .nut-tab-title {
				height: 1.07rem;
				.nav-bar {
					background: $primary-color;
				}
			}
			/deep/ .nut-tab {
				padding: 0;
				.nut-tab-active {
					.nut-tab-link {
						color: $primary-color;
					}
				}
				/deep/ .nut-tab-link {
					font-size: 0.37rem;

					&:hover {
						text-decoration: none;
					}
				}
			}
		}
		.tab-content {
			padding-top: 1.57rem;
			background-color: $default-bg-color;
			.top-content {
				background-color: $default-color;
				padding:0 0.4rem /* 30/75 */;
				h4 {
					height: 1.46667rem /* 110/75 */;
					line-height: 1.46667rem /* 110/75 */;
					font-size: 0.42667rem /* 32/75 */;
					color: $text-color;
					font-weight: 400;
				}
				ul {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					li {
						box-sizing: border-box;
						padding: 0.4rem /* 30/75 */;
						width: 4.4rem /* 330/75 */;
						height: 1.73333rem /* 130/75 */;
						margin-bottom: 0.4rem /* 30/75 */;
						background: url(../../../assets/img/tuiguangrensgu@2x.png)
							no-repeat;
						background-size: 100%;
						p {
							font-size: 0.34667rem /* 26/75 */;
							color: $default-color;
						}
						h2 {
							font-size: 0.42667rem /* 32/75 */;
							color: $default-color;
						}
						&:nth-child(2) {
							background: url(../../../assets/img/touzhurenshu@2x.png)
								no-repeat;
							background-size: 100%;
						}
						&:nth-child(3) {
							background: url(../../../assets/img/fanyongjine@2x.png)
								no-repeat;
							background-size: 100%;
						}
						&:nth-child(4) {
							background: url(../../../assets/img/leijifanyongjine@2x.png)
								no-repeat;
							background-size: 100%;
						}
					}
				}
			}
			.bottom-content {
				padding:0 0.4rem /* 30/75 */;
				margin-top: 0.4rem /* 30/75 */;
				background-color: $default-color;
				h4 {
					height: 1.46667rem /* 110/75 */;
					line-height: 1.46667rem /* 110/75 */;
					font-size: 0.42667rem /* 32/75 */;
					color: $text-color;
					font-weight: 400;
                }
                .title{
                    height:1.2rem /* 90/75 */;
                    line-height:1.2rem /* 90/75 */;
                    padding:0 .4rem /* 30/75 */;
                    display: flex;
                    justify-content: space-between;
                    background-image: linear-gradient(90deg, #1caffc 0%, #535bfc 100%);
                    border-radius: .13333rem /* 10/75 */;
                    span{
                        color:$default-color;
                        font-size:.34667rem /* 26/75 */;
                        &:last-child{
                            font-size:.42667rem /* 32/75 */;
                        }
                    }
                    &.title-backwater{
                        background-image: linear-gradient(90deg, #f96f91 1%, #c23afb 100%);
                    }
                }

				ul {
					display: flex;
					flex-wrap: wrap;
                    justify-content: space-between;
                    
					li {
                        flex:1;
                        padding:.53333rem /* 40/75 */ 0;
                        text-align: center;
                        p{
                            font-size:.34667rem /* 26/75 */;
                            color:$tip-color;
                            margin-bottom:.26667rem /* 20/75 */;
                            img{
                                width:.37333rem /* 28/75 */;
                                height:.37333rem /* 28/75 */;
                                vertical-align: middle;
                                margin-right:.13333rem /* 10/75 */;
                            }
                        }
                        h2{
                            font-size:.34667rem /* 26/75 */;
                            color:$text-color;
                        }
					}
				}
			}
		}
	}
</style>

