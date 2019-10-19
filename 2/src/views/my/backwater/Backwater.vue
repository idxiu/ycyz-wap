<template>
	<div id="backwater">
		<!-- 查看返水详情弹框 -->
		<div v-show="isShowBackwaterMask" class="dialogbox">
			<div class="positionFixed dialog-mask"></div>
			<div class="positionFixed deviceBody">
				<div class="dialogs">
					<div class="title">
						返水详情
						<span class="closebox" @click="isShowBackwaterMask = false;">
							<nut-icon type="cross" size="0.4rem" color="#fff"></nut-icon>
						</span>
					</div>
					<div class="details-content">
						<dl>
							<dt>
								<span>游戏名称</span>
								<span>有效打码</span>
								<span>返水金额</span>
							</dt>
							<div class="scorll-list">
								<dd v-show="isShowBackwaterMask" v-for="(item,index) in infoData.list" :key="index">
									<span>{{item.platformName}}</span>
									<span>{{item.betall}}</span>
									<span>{{item.money}}</span>
								</dd>
								<div v-show="!isShowBackwaterMask" class="noData">
									<img src="../../../assets/img/bet-record-no-data.png" />
									<p>暂无数据</p>
								</div>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</div>
		<nut-navbar class="pk-title" @on-click-back="$router.go(-1)" @on-click-more="back('index')">
			<a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png" />
			</a>
			自助返水
			<a class="backIdex" slot="more-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/backIndex.png" />
			</a>
		</nut-navbar>
		<div class="content">
			<div class="backwater-top">
				<ul>
					<li>
						<h2>有效打码</h2>
						<p>{{infoData.betall}}</p>
						<button :disabled="infoData.allMoney <= 0" @click="getBackWaterInfo">查看返水额</button>
					</li>
					<li>
						<h2>返水金额</h2>
						<p>{{infoData.allMoney}}</p>
						<button :disabled="infoData.status === 2" @click="handleBackWater">领取返水</button>
					</li>
				</ul>
			</div>
			<div class="backwater-list">
				<div class="title">自助返水历史</div>
				<div class="total">
					<p>
						当日已返水：
						<span>{{today}}</span>
					</p>
					<p>
						本周返水额：
						<span>{{week}}</span>
					</p>
				</div>
				<dl v-show="list.length > 0">
					<dt>
						<span>有效打码</span>
						<span>返水金额</span>
					</dt>
				</dl>
			</div>
			<!--列表数据展示 -start -->
			<!--paddingTop 用来动态计算上面层级高度，这里是可以动态改变滴-->
			<div class="generalizeLink-list">
				<div v-show="list.length > 0" class="page-loadmore">
					<!-- :style="{ height: wrapperHeight + 'px' }" -->
					<div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px'}" ref="wrapper">
						<pk-loadmore
							:top-method="loadTop"
							:bottom-method="loadBottom"
							:bottom-all-loaded="allLoaded"
							:top-all-loaded="topAllLoaded"
							@top-status-change="handleTopChange"
							@bottom-status-change="handleBottomChange"
							ref="loadmore"
							:stop-translate="stopTranslate"
						>
							<ul>
								<li v-for="(item,index) in list" :key="index">
									<h2>
										<span>{{item.betall}}</span>
										<span>{{item.rebateWater}}</span>
									</h2>
									<p>
										<span>订单号：{{item.orderId}}</span>
										<span>{{item.createTime | filterDate}}</span>
									</p>
								</li>
							</ul>
							<div class="noMoredata" v-show="hasData">我是有底线的</div>
						</pk-loadmore>
					</div>
				</div>
				<!--列表数据展示 -end -->
				<noData v-show="list.length == 0" :dataText="dataText" class="no-data-box"></noData>
				<router-link class="goBetting" tag="button" :to="{name:'index'}">去投注，获得返水！</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import {
	getBackwaterInfo,
	getBackwaterReceive,
	getBackwaterList
} from "@/services/center.js";
import pkLoadmore from "@/components/Loadmore";
import noData from "@/components/NoData.vue";
export default {
	name: "backwater",
	components: {
		pkLoadmore,
		noData
	},
	mounted() {
		this.getBackWaterInfo(1);
		this.getList();
	},
	data() {
		return {
			isShowBackwaterMask: false,
			stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
			allLoaded: false,
			topAllLoaded: false,
			topStatus: "",
			bottomStatus: "",
			wrapperHeight: 0,
			// paddingTop:this.getPaddingTop(),
			page: 1, //当前页数
			pageSize: 10, //每页请求的条数
			totalNum: 0, //总页数
			list: [],
			hasData: false,
			dataText: "您暂时还未获得返水哦~~",
			infoData: {},
			today: 0,
			week: 0
		};
	},
	methods: {
		// //动态计算 层级哪里的高度
		// getPaddingTop(){
		//     //92是header的固定高度
		//     return (this.$(".content").height()+92) / 75;
		// },
		//获取返水列表
		getList(t) {
			let postData = {
				page: this.page,
				pageSize: this.pageSize
			};
			getBackwaterList(postData).then(res => {
				if (res.success) {
					this.today = res.data.today;
					this.week = res.data.week;
					this.totalNum = res.data.totalNum;
					let result = res.data.list || [];
					if (this.page === 1) {
						this.list = result;
						if (this.totalNum < this.page * this.pageSize) {
							this.allLoaded = true;
							this.topAllLoaded = true;
						} else {
							this.allLoaded = false;
							this.topAllLoaded = false;
						}
					} else {
						this.list = this.list.concat(result);
						this.topAllLoaded = false;
					}
					if (t === 1) {
						this.$toast.text("刷新成功");
					}
					this.$nextTick(() => {
						this.wrapperHeight =
							document.documentElement.clientHeight -
							this.$refs.wrapper.getBoundingClientRect().top;
					});
				} else {
					this.$toast.fail(res.message, {
						cover: true,
						duration: 2000
					});
				}
			});
		},
		//获取返水金额以及是否能返水
		getBackWaterInfo(t) {
			getBackwaterInfo().then(res => {
				if (res.success) {
					this.infoData = res.data;
					if (t != 1) {
						this.isShowBackwaterMask = true;
					}
				} else {
					this.$toast.fail(res.message, {
						cover: true,
						duration: 2000
					});
				}
			});
		},
		//领取返水
		handleBackWater() {
			getBackwaterReceive().then(res => {
				if (res.success) {
					this.getBackWaterInfo(1);
					this.getList();
					this.$toast.text("领取成功", {
						cover: true,
						duration: 2000
					});
				} else {
					if (res.code === 12025) {
						//这个code代表成功
						this.getBackWaterInfo(1);
						this.getList();
					}
					this.$toast.text(res.message, {
						cover: true,
						duration: 2000
					});
				}
			});
		},
		//下拉刷新
		handleTopChange(status) {
			this.topStatus = status;
		},
		loadTop() {
			this.page = 1;
			this.hasData = false;
			setTimeout(() => {
				this.getList(1);
				this.$refs.loadmore.onTopLoaded();
				this.allLoaded = false;
			}, 1500);
		},
		//mint-ui 上拉加载
		handleBottomChange(status) {
			this.bottomStatus = status;
		},
		loadBottom() {
			this.page += 1;
			this.hasData = false;
			setTimeout(() => {
				this.getList();
				this.$refs.loadmore.onBottomLoaded();
				if (this.page * this.pageSize >= this.totalNum) {
					this.allLoaded = true; //所有数据加载完成
					this.hasData = true;
					this.topAllLoaded = false;
				}
			}, 1500);
		},
		back(path) {
			this.$router.push({
				name: path
			});
		}
	}
};
</script>

<style lang="scss" scoped>
button.goBetting {
	position: fixed;
	bottom: 1rem;
	left: 4%;
	width: 92%;
	height: 1.466667rem /* 110/75 */;
	line-height: 1.466667rem /* 110/75 */;
	color: $default-color;
	text-align: center;
	border: none;
	border-radius: 0.13333rem /* 10/75 */;
	font-size: 0.48rem /* 36/75 */;
	background: $primary-color;
	box-shadow: 0px 2px 5px 0px rgba($color: $nondefault-color, $alpha: 0.12);
	margin-top: 0.53333rem /* 40/75 */;
	&:active {
		background: $tabtit-color;
	}
}

.content {
	.generalizeLink-list {
		.page-loadmore-wrapper {
			overflow-y: scroll;
			/*解决ios上滑动不流畅*/
			-webkit-overflow-scrolling: touch;
			&::-webkit-scrollbar {
				display: none;
			}
		}
	}
	.backwater-top {
		ul {
			display: -webkit-flex;
			display: flex;
			justify-content: space-evenly;
			text-align: center;
			padding-top: 0.36rem;
			li {
				position: relative;
				display: -webkit-flex;
				display: flex;
				flex-direction: column;
				width: 4.4rem;
				height: 3.467rem;
				border-radius: 0.267rem;
				overflow: hidden;
				color: $default-color;
				background-image: linear-gradient(
					0deg,
					$backwater-gradualb-right 0%,
					$backwater-gradualt-right 100%
				);
				box-shadow: 0 0.15rem 0.4rem 0
					rgba($color: $primary-color, $alpha: 0.25);
				h2 {
					margin-top: 0.787rem;
					font-size: 0.347rem;
					font-weight: normal;
				}
				p {
					font-family: PingFangSC-Semibold;
					font-size: 0.533rem;
					line-height: 1.2rem;
				}
				button {
					position: absolute;
					left: 0;
					bottom: 0;
					width: 100%;
					height: 0.933rem;
					border: 0;
					font-size: 0.347rem;
					color: $primary-color;
					background-color: $default-color;
					&:disabled {
						color: $label-color;
						background-color: $backwater-disable;
					}
				}
				&:last-child {
					background-image: linear-gradient(
						0deg,
						$backwater-gradualb-left 0%,
						$backwater-gradualc-left 50%,
						$backwater-gradualt-left 100%
					);
					box-shadow: 0 0.15rem 0.4rem 0
						rgba($color: $backwater-redshadow, $alpha: 0.25);
					button {
						color: $backwater-redtext;
						&:disabled {
							color: $label-color;
							background-color: $backwater-disable;
						}
					}
				}
			}
		}
	}
	.backwater-list {
		margin-top: 0.466667rem /* 35/75 */;
		.title {
			line-height: 1.2rem /* 90/75 */;
			padding-left: 0.453333rem /* 34/75 */;
			font-size: 0.346667rem /* 26/75 */;
			color: $tip-color;
		}
		.total {
			background: $default-color;
			padding: 0 0.453333rem /* 34/75 */;
			height: 1.466667rem /* 110/75 */;
			display: flex;
			justify-content: space-between;
			align-items: center;
			p {
				font-size: 0.426667rem /* 32/75 */;
				color: $tip-color;
				span {
					color: $primary-color;
					font-weight: bold;
				}
			}
		}
		dl {
			padding: 0 0.4rem;
			line-height: 1.2rem;
			background: $default-bg-color;
			dt {
				display: flex;
				justify-content: space-between;
				font-size: 0.346667rem;
				color: $tip-color;
			}
		}
	}
	.page-loadmore {
		position: fixed;
		left: 0;
		right: 0;
		ul {
			background: $default-color;
			padding: 0 0.4rem /* 30/75 */;
			li {
				padding: 0.33333rem /* 25/75 */ 0;
				border-bottom: $onerem solid $border-light;
				h2 {
					display: flex;
					justify-content: space-between;
					color: $text-color;
					font-size: 0.426667rem /* 32/75 */;
					font-weight: normal;
				}
				p {
					display: flex;
					justify-content: space-between;
					color: $tip-color;
					margin-top: 0.26667rem /* 20/75 */;
					font-size: 0.346667rem /* 26/75 */;
					span {
						&:last-child {
							color: $label-color;
						}
					}
				}
			}
		}
	}
}

.dialogbox {
	.deviceBody {
		.dialogs {
			.title {
				text-align: center;
				color: $default-color;
				border-bottom: $onerem solid $border-color;
				background-color: $primary-color;
			}
			.noData {
				margin: 1rem auto 0;
				p {
					font-size: 0.4rem;
					text-align: center;
				}
			}
			.details-content {
				border-radius: 0 0 0.13333rem /* 10/75 */ 0.13333rem /* 10/75 */;
				.sub-title {
					font-size: 0.37333rem /* 28/75 */;
					color: $text-color;
				}
				p {
					margin-top: 0.4rem /* 30/75 */;
					line-height: 0.48rem /* 36/75 */;
					color: $tip-color;
					word-break: break-all;
					max-height: 4rem;
					overflow: auto;
				}
				dl {
					dt {
						padding: 0.33333rem 0.4rem;
						display: flex;
						justify-content: space-between;
						background-color: $default-bg-color;
						span {
							font-size: 0.347rem;
							color: $tip-color;
							flex: 1;
							text-align: center;
							&:first-child {
								text-align: left;
							}
							&:last-child {
								text-align: right;
							}
						}
					}
					.scorll-list {
						padding: 0 0.4rem 0.4rem /* 30/75 */;
						max-height: 6rem /* 450/75 */;
						overflow: auto;
						/*解决ios上滑动不流畅*/
						-webkit-overflow-scrolling: touch;
						&::-webkit-scrollbar {
							display: none;
						}
						dd {
							display: flex;
							justify-content: space-between;
							padding: 0.33333rem /* 25/75 */ 0;
							border-bottom: $onerem solid $border-light;
							span {
								font-size: 0.37333rem /* 28/75 */;
								color: $tip-color;
								flex: 1;
								text-align: center;
								&:first-child {
									text-align: left;
								}
								&:last-child {
									text-align: right;
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>