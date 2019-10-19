<template>
	<div class="msgs">
		<Header :title="title" backPath="/index"></Header>

		<!-- 账变消息 -->
		<div class="real-msg" v-show="tab===1">
			<div class="top-msg">
				<div class="avatar">
					<img src="../../../assets/img/msg-icon/icon_info_zhangbianxx.png" alt />
				</div>
				<div class="word">欢迎您使用IM聊天，如果您在使用过程中有任何的问题和建议，记得给我发消息反馈哦！祝你使用愉快！</div>
			</div>
			<ul class="msginfo">
				<li v-for="(item,i) in rechargeNotice" :key="i" @click="goPath(item)">
					<div class="times">{{item.sendTime|filterDate("MM-DD HH:mm")}}</div>
					<div class="msginfo-content">
						<div class="msginfo-top">{{item.msg.sourceTypeName}}</div>
						<div class="cont pk-1px-b">
							<div class="money">￥{{item.msg.money|currency('')}}</div>
							<div class="instr">金额</div>
						</div>
						<div class="foots">
							<div class="todetail" v-show="item.msg.isInfo">
								查看详情
								<i class="iconfont iconicon_mine_rmore right-icon"></i>
							</div>
							<!-- <div class="order">
								<span>订单号：</span>
								{{item.msg.remark.split(item.msg.sourceTypeName)[0]}}
							</div>
							 <ul class="real-detail">
								<li>
									<span>提现银行：</span>中国工商银行
								</li>
								<li>
									<span>提现时间：</span>
									{{item.sendTime}}
								</li>
								<li>
									<span>到账时间：</span>
									{{item.sendTime}}
								</li>
							</ul>-->
						</div>
					</div>
				</li>
			</ul>
		</div>

		<!-- 公告通知 -->
		<div class="real-msg" v-show="tab===2">
			<div class="top-msg">
				<div class="avatar">
					<img src="../../../assets/img/msg-icon/icon_info_gonggaotz.png" alt />
				</div>
				<div class="word">
					hello，我是IM系统公告，所有公告内容都会在这里告诉你，如果对公告内容有疑问，请联系
					<a>人工客服</a> ,我们将在第一时间为您解释。
				</div>
			</div>
			<ul class="msginfo">
				<li v-for="(item,i) in postNotice" :key="i" @click="toGongGaoInfo(item)">
					<div class="times">{{item.sendTime|filterDate("MM-DD HH:mm")}}</div>
					<div class="msginfo-content">
						<div class="check-peos">
							<span>{{item.msg.title | fixmsg}}</span>
							<!-- <span class="stats">未填写</span> -->
						</div>
						<div class="cont pk-1px-b">
							<div class="tits">{{ item.msg.content | fixmsg}}</div>
						</div>
						<div class="foots">
							<div class="todetail">
								查看详情
								<i class="iconfont iconicon_mine_rmore right-icon"></i>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>

		<!-- 系统消息 -->
		<div class="real-msg" v-show="tab===3">
			<div class="top-msg">
				<div class="avatar">
					<img src="../../../assets/img/msg-icon/icon_info_xitongxx.png" alt />
				</div>
				<div class="word">欢迎您使用IM聊天，如果您在使用过程中有任何的问题和建议，记得给我发消息反馈哦！祝你使用愉快！</div>
			</div>
			<ul class="msginfo">
				<li v-for="(item,i) in systemNotices" :key="i" @click="goPath(item)">
					<div class="times">{{item.sendTime | filterDate("MM-DD HH:mm")}}</div>
					<div class="msginfo-content">
						<div class="check-peos">
							<span>{{item.msg.title|fixmsg}}</span>
						</div>
						<div class="cont pk-1px-b">
							<div class="tits">{{item.msg.content|fixmsg}}</div>
						</div>
						<div class="foots" v-show="item.msg.isInfo">
							<div class="todetail">
								查看详情
								<i class="iconfont iconicon_mine_rmore right-icon"></i>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import Header from "@/components/Header";
import { getNotices } from "@/services/im/chat";
import MSG_TYPE from "@/services/im/constant";

// tab 1帐变 2公告 3系统
export default {
	components: {
		Header
	},
	data() {
		return {
			MSG_TYPE,
			tab: this.$route.query.tab * 1,
			title: "",
			systemNotices: [],
			rechargeNotice: [],
			postNotice: []
		};
	},
	mounted() {
		this.getNotice();
		this.title =
			this.tab === 1
				? "账变消息"
				: this.tab === 2
				? "公告通知"
				: this.tab === 3
				? "系统消息"
				: "";
	},
	methods: {
		async getNotice() {
			let res = await getNotices();
			if (res.success) {
				let result = res.data.data;

				this.systemNotices =
					result.systemNotices &&
					result.systemNotices.length > 0 &&
					result.systemNotices.reverse().map(item => {
						item.msg = JSON.parse(item.message);
						return item;
					});
				this.rechargeNotice =
					result.rechargeNotice &&
					result.rechargeNotice.length > 0 &&
					result.rechargeNotice.reverse().map(item => {
						item.msg = JSON.parse(item.message);
						return item;
					});
				this.postNotice =
					result.postNotice &&
					result.postNotice.length > 0 &&
					result.postNotice.reverse().map(item => {
						item.msg = JSON.parse(item.message);
						return item;
					});
			}
        },
        
		goPath(item) {
			//账变消息
			if (this.tab === 1) {
				if (!item.msg.isInfo) return;
				this.$router.push({
					name: "detailMsg",
					query: {
						tab: this.tab,
						sourceType: item.msg.sourceType,
						doType: item.msg.doType,
						orderId: item.msg.orderId
					}
				});
			}

			//系统消息
			if (this.tab === 3) {
				if (!item.msg.isInfo) return;
				this.$router.push({
					name: "detailMsg",
					query: {
						tab: this.tab,
						id: this.msg.id
					}
				});
			}
        },
        
		toGongGaoInfo(item) {
			if (item.noticeType === MSG_TYPE.IM_NOTICE_MESS_TYPE_POST) {
				//公告
				this.$router.push({
					name: "detailMsg",
					query: {
						tab: this.tab,
						apiId: item.msg.id
					}
				});
			}

			//去问卷调查
			if (item.noticeType === MSG_TYPE.IM_NOTICE_MESS_TYPE_WJDC) {
				this.$router.push({
					name: "questionnaire",
					query: {
						id: item.msg.id
					}
				});
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.msgs {
	position: absolute;
	width: 100%;
	background: $default-bg-color;
	.top-msg {
		display: flex;
		padding-left: px2rem(32);
		margin-top: px2rem(40);
		.avatar {
			width: px2rem(80);
			height: px2rem(80);
			img {
				width: 100%;
				height: 100%;
			}
		}
		.word {
			margin-left: px2rem(16);
			width: px2rem(420);
			background: $default-color;
			font-size: px2rem(28);
			color: $tip-color;
			line-height: 2em;
			padding: px2rem(23) px2rem(26);
			border-radius: px2rem(10);
			position: relative;
			a {
				text-decoration: underline;
				color: $primary-color;
			}
			&::after {
				content: "";
				position: absolute;
				width: 0;
				height: 0;
				border: px2rem(12) solid transparent;
				border-right: px2rem(12) solid $default-color;
				top: 10%;
				left: px2rem(-24);
			}
		}
	}
	.msginfo {
		padding-bottom: px2rem(20);
		li {
			.times {
				font-size: px2rem(24);
				line-height: px2rem(48);
				color: $label-color;
				text-align: center;
				padding: px2rem(20) 0;
			}
			.msginfo-content {
				background: $default-color;
				border-radius: px2rem(10);
				margin: 0 px2rem(32);
				.msginfo-top,
				.check-peos {
					font-size: px2rem(28);
					font-weight: bold;
					color: $tip-color;
					padding: px2rem(30) px2rem(33);
				}
				.check-peos {
					display: flex;
					justify-content: space-between;
					.stats {
						font-weight: 400;
						color: $msg-error;
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
				.cont {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
                    padding: px2rem(30) px2rem(126);
                    max-height: px2rem(140);
					color: $primary-color;
                    text-align: center;
					.money {
						font-size: px2rem(48);
						margin-bottom: px2rem(12);
						font-weight: bold;
					}
					.instr {
						font-size: px2rem(28);
					}
					.tits {
						font-size: px2rem(32);
						color: $tip-color;
                        font-weight: bold;
                        overflow: hidden;
					}
				}
			}
		}
	}
	.foots {
		padding-left: px2rem(32);
		font-size: px2rem(28);
		.todetail {
			// height: px2rem(88);
			position: relative;
			color: $tip-color;
			padding: px2rem(28) 0;
			.right-icon {
				position: absolute;
				right: px2rem(32);
				top: px2rem(32);
				color: $label-color;
				// &::after{
				//     content: '';
				//     position: absolute;
				//     background: url('')
				// }
			}
		}
		.order {
			color: $tip-color;
			padding: px2rem(28) 0;
			span {
				color: $label-color;
			}
		}
		.real-detail {
			li {
				color: $tip-color;
				padding: px2rem(14) 0;
				span {
					color: $label-color;
				}
				&:last-child {
					padding-bottom: px2rem(28);
				}
			}
		}
	}
}
</style>
