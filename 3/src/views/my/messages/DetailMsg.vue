<template>
	<div class="msg-detail">
		<Header :title="title"></Header>

		<div class="divs" v-show="tab===1">
			<div class="dmsg-content" v-show="sourceType === 8">
				<div class="dmsg-top pk-1px-b">
					<div class="money">¥{{info.money|currency('')}}</div>
					<div class="tits">提现金额</div>
				</div>
				<ul class="dmsg-bot">
					<li>
						<span>订单号：</span>
						<span>{{info.orderId}}</span>
					</li>
					<li>
						<span>提出额度：</span>
						<span>{{info.withdraw |currency('',2)}}</span>
					</li>
					<li>
						<span>费用：</span>
						<span>{{info.cost |currency('',2)}}</span>
					</li>
					<li>
						<span>实际提现：</span>
						<span>{{info.withdraw |currency('',2)}}</span>
					</li>
					<li>
						<span>提现时间：</span>
						<span>{{info.in_time|filterDate}}</span>
					</li>
					<li>
						<span>状态：</span>
						<!-- 1=待审核 2=已出款 3=预备出款 4=取消出款 5=拒绝出款 -->
						<span class="status-mid">{{info.status | filterWithDrawStatus}}</span>
					</li>
				</ul>
			</div>
			<div class="dmsg-content" v-show="sourceType !== 8">
				<div class="dmsg-top pk-1px-b status-success">
					<div class="money">¥{{info.money|currency('',2)}}</div>
					<div class="tits">充值金额</div>
				</div>
				<ul class="dmsg-bot">
					<li>
						<span>订单号：</span>
						<span>{{info.orderId}}</span>
					</li>
					<li>
						<span>充值机构：</span>
						<span>{{info.bankName}}</span>
					</li>
					<li>
						<span>充值账号：</span>
						<span>{{info.bankNum}}</span>
					</li>
					<li>
						<span>充值金额：</span>
						<span>{{info.money|currency('',2)}}</span>
					</li>
					<li>
						<span>充值优惠：</span>
						<span>{{info.offer|currency('',2)}}</span>
					</li>
					<li>
						<span>额外优惠：</span>
						<span>{{info.additional|currency('',2)}}</span>
					</li>
					<li>
						<span>充值时间：</span>
						<span>{{info.inTime|filterDate}}</span>
					</li>
					<li>
						<span>提交时间：</span>
						<span>{{info.addTime|filterDate}}</span>
					</li>
					<li>
						<span>状态：</span>
						<span class="status-mid">{{info.status | filterDepositStatus }}</span>
					</li>
				</ul>
			</div>
		</div>

		<div class="divs" v-show="tab===2 || tab === 3">
			<div class="notice">
				<div class="notice-top">{{info.title}}</div>
				<div class="times">发布时间：{{info.publishTime | filterDate }}</div>
				<div class="contents" v-html="info.content"></div>
			</div>
		</div>
	</div>
</template>
<script>
import Header from "@/components/Header";
import {
	getBillChangeInfo,
	getGongGaoNoticeMsgInfo,
	getSysNoticeMsgInfo
} from "@/services/msgs";

// tab 1帐变 2公告 3系统
export default {
	components: {
		Header
	},
	data() {
		return {
			tab: this.$route.query.tab * 1,
			sourceType: 0,
			title: "",
			info: {}
		};
	},
	mounted() {
		if (this.tab === 1) {
            this.sourceType = this.$route.query.sourceType * 1;
            // sourceType 8=出款 其他都是入款的
			this.title = this.sourceType === 8 ? "提现详情" : "充值详情";
			this.getInfo();
		}
		if (this.tab === 2) {
			this.title = "公告";
			this.getGongGao();
		}
		if (this.tab === 3) {
			this.title = "系统消息";
			this.getSysMsg();
		}
	},
	methods: {
		//获取账变信息
		async getInfo() {
			let postData = {
				orderId: this.$route.query.orderId,
				doType: this.$route.query.doType * 1,
				sourceType: this.sourceType
			};
			let res = await getBillChangeInfo(postData);
			if (res.success) {
				this.info = res.data;
				console.log(res);
			} else {
				this.$toast.text(res.message);
			}
		},

		//获取公告消息
		async getGongGao() {
			let res = await getGongGaoNoticeMsgInfo({
				apiId: this.$route.query.apiId * 1
			});
			if (res.success) {
				this.info = res.data;
			} else {
				this.$toast.text(res.message);
			}
		},

		//获取系统消息
		async getSysMsg() {
			let res = await getSysNoticeMsgInfo({
				id: this.$route.query.id * 1
			});
			if (res.success) {
				this.info = res.data;
			} else {
				this.$toast.text(res.message);
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.msg-detail {
	position: absolute;
	width: 100%;
	background: $default-bg-color;
	.divs {
		padding-bottom: px2rem(24);
	}
	.dmsg-content {
		margin-top: px2rem(24);
		background: $default-color;
		padding: px2rem(32);
		.dmsg-top {
			padding: px2rem(32) 0;
			flex-direction: column;
			text-align: center;
			justify-content: center;
			color: $banner-index;
			font-weight: bold;
			padding-bottom: px2rem(64);
			.money {
				font-size: px2rem(48);
			}
			.tits {
				font-size: px2rem(28);
			}
			&.status-success {
				color: $primary-color;
			}
		}
		.dmsg-bot {
			li {
				font-size: px2rem(28);
				margin-top: px2rem(32);
				display: flex;
				span {
					width: px2rem(140);
					text-align: right;
					color: $label-color;
					&:last-child {
						flex: 1;
						text-align: left;
						color: $tip-color;
					}
					&.status-mid {
						color: $label-color;
					}
					&.status-success {
						color: $primary-color;
					}
					&.status-fail {
						color: $color-w;
					}
				}
			}
		}
	}
	.notice {
		background: $default-color;
		margin-top: px2rem(8);
		.notice-top {
			padding: px2rem(24) px2rem(32);
			font-size: px2rem(36);
			color: $tip-color;
		}
		.times {
			color: $label-color;
			font-size: px2rem(24);
			margin-bottom: px2rem(24);
			padding: 0 px2rem(32);
		}
		.contents {
			padding: 0 px2rem(32);
			font-size: px2rem(28);
			line-height: px2rem(60);
		}
		.img {
			width: auto;
			height: px2rem(275);
			padding: 0 px2rem(32);
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
