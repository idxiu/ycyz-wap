

<template>
	<!-- 充值记录 -->
	<div class="capitalrecord">
		<Header title="额度转换记录"></Header>

		<div v-show="loading" class="skeleton vue-skeleton-loading">
			<div class="skeleton-bac-animation"></div>
			<column>
				<skeleton-square width="9rem" height="1rem" :count="9" margin="0.2rem 0.5rem"></skeleton-square>
			</column>
		</div>

		<div v-show="!loading" class="searchBox">
			<div class="flex-content" @click="choosetime()">
				时间:
				<p class="input-drop">
					<span class="text">{{timeText[0]}}</span>
					<i class="kailong iconfont iconicon_mine_rmore"></i>
				</p>
			</div>

			<nut-picker
				:is-visible="isShowTimeChoose"
				:list-data="timeItems"
				:default-value-data="defaultTime"
				@close="switchActionSheet('isShowTimeChoose')"
				@confirm="setTimeSelected"
			></nut-picker>
		</div>

		<!--列表数据展示 -start -->
		<div v-show="!loading" class="generalizeLink-list table">
			<div v-show="list.length > 0" class="page-loadmore">
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
							<li class="pk-1px-b" v-for="(item, index) of list" :key="index">
								<div class="title green" :class="{'red':item.status == 2,'green':item.status == 3}">
									<p>
										<span>{{item.converSionName}}</span>
										<span class="status">{{item.statusName}}</span>
									</p>
									<span class="money">{{item.transMoney | currency('￥',2)}}</span>
								</div>
								<div class="order">
									<span class="number">订单号：{{item.orderId}}</span>
									<span class="time">{{item.createTime | filterDate}}</span>
								</div>
							</li>
						</ul>
						<div class="noMoredata" v-show="hasData">我是有底线的</div>
					</pk-loadmore>
				</div>
			</div>
			<no-data v-show="list.length == 0"></no-data>
		</div>
		<!--列表数据展示 -end -->
	</div>
</template>

<script>
import { getConversions } from "@/services/moneyRecord";
import { timeStamp } from "@/services/commonfn";
import pkLoadmore from "@/components/Loadmore";
import noData from "@/components/NoData";
import Header from "@/components/Header";

export default {
	name: "capitalrecord",
	components: {
		pkLoadmore,
		noData,
        Header,
        getConversions
	},
	data() {
		return {
			//充值类型选择
			isShowDepositChoose: false,
			selectData: [
				{ id: 2, value: "线上充值" },
				{ id: 1, value: "线下充值" }
			],
			depositSelectData: [],
			transactionType: [], //后端需要传递一个数组

			//时间选择
			isShowTimeChoose: false,
			timeItems: [],
			timeText: [],
			defaultTime: [],
			beginTime: 0,
			endTime: 0,

			//分页
			list: [],
			stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
			allLoaded: false,
			topAllLoaded: false,
			topStatus: "",
			bottomStatus: "",
			wrapperHeight: 0,
			page: 1, //当前页数
			pageSize: 10, //每页请求的条数
			totalNum: 0, //总页数
			hasData: false,

			fromType: this.$route.query.fromType * 1 || "",
			loading: false,
			info: ""
		};
	},
	mounted() {
		//[["线上充值", "线下充值"]]
		this.depositSelectData = [this.selectData.map(item => item.value)];

		//设置传递给后端的值 默认 全部
		this.transactionType = [this.selectData[0].id];

		this.timeItems = [timeStamp.map(item => item.name)];

		//设置需要传递给后端的值 默认是今天
		this.beginTime = timeStamp[1].value.startDate;
		this.endTime = timeStamp[1].value.endDate;
		this.timeText = [timeStamp[1].name];
		this.defaultTime = this.timeText;
		this.getList();
	},
	methods: {
		//时间选择
		choosetime() {
			this.isShowTimeChoose = true;
		},
		//充值类型选择确定
		setDepositSelected(data) {
			let item = this.selectData.filter(item => item.value === data[0]);
			this.transactionType = [item[0].id];
			this.getList();
		},
		//时间选择确定
		setTimeSelected(data) {
			let item = timeStamp.filter(item => item.name === data[0]);
			this.beginTime = item[0].value.startDate;
			this.endTime = item[0].value.endDate;
			this.timeText = [item[0].name];
			this.getList();
		},
		switchActionSheet(param) {
			this[`${param}`] = !this[`${param}`];
		},
		getList() {
			let data = {
				beginTime: this.beginTime,
				endTime: this.endTime,
				recordType: this.transactionType[0],
				page: this.page,
				pageSize: this.pageSize
			};

			getConversions(data).then(res => {
				if (res.success) {
					let result = [];
					this.totalNum = res.data.count;
                    result = res.data.conversion || [];
                    console.log(result, 'result')
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
					this.$nextTick(() => {
						this.wrapperHeight =
							document.documentElement.clientHeight -
							this.$refs.wrapper.getBoundingClientRect().top;
					});
					this.loading = false;
				} else {
					this.$toast.text(res.message, {
						cover: true,
						duration: 1000
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
				this.getList();
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
	}
};
</script>

<style scoped lang="scss">
.capitalrecord {
	.searchBox {
		background: $default-color;
		margin-top: px2rem(24);
		padding: 0 px2rem(32);
		height: px2rem(88);
		line-height: px2rem(88);
		display: flex;
		flex-direction: row;
		.flex-content {
			margin-right: $twentyrem;
			color: $tip-color;
			display: flex;
			align-items: center;
			.input-drop {
				width: px2rem(200);
				height: px2rem(56);
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 px2rem(8);
				margin-left: px2rem(8);
				box-sizing: border-box;
				// padding: $tenrem/2 $seventrem $tenrem/2 $tenrem;
				border: $onerem solid $border-color;
				border-radius: px2rem(8);
				color: $text-color;
				font-size: px2rem(24);
				i {
					transform: rotate(90deg);
					font-size: px2rem(20);
				}
			}
		}
	}
}

.page-loadmore {
	position: fixed;
	top: px2rem(224);
	left: 0;
	right: 0;
	.page-loadmore-wrapper {
		overflow-y: scroll;
		/*解决ios上滑动不流畅*/
		-webkit-overflow-scrolling: touch;
		&::-webkit-scrollbar {
			display: none;
		}
	}
	ul {
		background: $default-color;
		padding-left: px2rem(30);
		li {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			height: px2rem(140);
			padding-right: px2rem(30);
			.title {
				display: flex;
				justify-content: space-between;
				font-size: px2rem(28);
				color: $tip-color;
				.status {
					width: px2rem(88);
					height: px2rem(32);
					line-height: px2rem(32);
					display: inline-block;
					border-radius: px2rem(16);
					font-size: px2rem(24);
					text-align: center;
					color: $default-color;
					background: $backwater-no-btn;
					font-size: px2rem(22);
					margin-left: px2rem(22);
					padding: px2rem(4) px2rem(10);
				}
				.money {
					color: $label-color;
				}
				&.green {
					.status {
						background: $primary-color;
					}
					.money {
						color: $primary-color;
					}
				}
				&.red {
					.status {
						background: $color-a;
					}
					.money {
						color: $color-a;
					}
				}
			}
			.order {
				display: flex;
				justify-content: space-between;
				color: $label-color;
				.number {
					flex: 2;
				}
				.time {
					flex: 1;
					text-align: right;
				}
			}
		}
	}
}

</style>