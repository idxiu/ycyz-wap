<template>
	<div class="follow-plan">
		<div class="follow-plan-box">
			<div class="header">
				<h2>
					<div class="left">{{info.fcName}}</div>
					<!-- <div class="time">封盘时间：00:00:12</div> -->
				</h2>
				<p>期号：{{info.betNo}}</p>
			</div>
			<ul>
				<li class="pk-1px-t">
					<span>投注玩法</span>
					<span class="txt">{{info.playName}}</span>
				</li>
				<li class="pk-1px-t">
					<span>投注内容</span>
					<span class="txt">{{info.betWay}}</span>
				</li>
				
			

				<!-- 跟投显示 -->
				<li v-if="type === 1" class="pk-1px-t">
					<span>投注金额</span>
					<h2 class="bei-number">
						<input class="tou" v-model="value" placeholder="填写整数如20" type="number" />
						<span class="ju-color">元</span>
					</h2>
				</li>

				<!-- 跟单显示 -->
				<li v-if="type === 2" class="pk-1px-t">
					<span>投注金额</span>
					<span class="txt">{{info.bet | currency('¥',2)}}</span>
				</li>

				<!-- 跟单显示 -->
				<li v-if="type === 2" class="pk-1px-t">
					<h2 class="bei-number">
						<span>倍数</span>
						<input class="dan" v-model="value" type="number" />
						<span class="ju-color">倍</span>
					</h2>
					<h2 class="bei-number">
						合计：
						<span class="ju-color">{{totalMoney | currency('¥',2)}}</span>
					</h2>
				</li>
			</ul>
			<div class="btn-group pk-1px-t">
				<div class="btn pk-1px-r" @click="$emit('close-plan-modal')">取消</div>
				<div class="btn ju-color" @click="submit">{{type === 1?'跟投':'跟单'}}</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		type: {
			// 1=跟投 2=跟单
			type: Number,
			default: 1
		},
		planInfo: {
			type: Object,
		}
	},
	data() {
		return {
			totalMoney: 0,
			info:{},
			value: this.type === 2?1:'',
		};
	},

	mounted() {
		console.log('modal接受',this.planInfo)
        this.info = this.planInfo;
		if(this.type ===2 ){
			this.info.fcName = this.info.msg.fcName;
			this.info.betNo = this.info.msg.period;
			this.info.playName = this.info.msg.playName;
			this.info.betWay = this.info.msg.playDetails;
			this.info.bet = this.info.msg.bet;
			this.totalMoney = this.info.bet * this.value;
		}

	},
	methods: {
		submit() {
			this.info.bet = this.value * 1;
			if(this.value && this.value!=0){
				this.$emit("submit-plan", this.type, this.info);
			}
		}
	},
	watch: {
		value(newVal, oldVal) {
			this.value = newVal.replace(/[^0-9]/g, "");
			this.totalMoney = this.info.bet * this.value;
		}
	}
};
</script>
<style lang="scss" scoped>
.ju-color {
	color: $color-w !important;
	font-size: px2rem(28) !important;
}
.follow-plan {
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.3);
	z-index: 99;
	display: flex;
	justify-content: center;
	align-items: center;
	.follow-plan-box {
		background: $default-color;
		width: px2rem(630);
		border-radius: px2rem(10);
		.header {
			padding: px2rem(32);
			font-size: 0;
			h2 {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left {
					font-size: px2rem(28);
					color: $tip-color;
				}
				.time {
					font-size: px2rem(24);
					color: #f73939;
					font-weight: normal;
				}
			}
			p {
				font-size: px2rem(24);
				color: $label-color;
				margin-top: px2rem(23);
			}
		}
		ul {
			padding: 0 px2rem(32);
			li {
				padding: px2rem(20) 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				span {
					font-size: px2rem(24);
					color: $tip-color;
					&.txt {
						color: $label-color;
					}
				}
				.bei-number {
					display: flex;
					align-items: center;
					font-size: px2rem(28);
					color: $tip-color;
					span {
						font-size: px2rem(28);
						font-weight: normal;
					}
					/deep/ .nut-stepper {
						margin: 0 px2rem(10);
					}
					.tou {
						width: px2rem(268);
						height: px2rem(50);
						border: 1px solid $color-w;
						border-radius: px2rem(10);
						margin-right: px2rem(10);
						text-align: center;
						color: $color-w;
						padding: 0 px2rem(10);
						&::-webkit-input-placeholder {
							color: #ffbe9e;
						}
					}
					.dan {
						width: px2rem(110);
						height: px2rem(50);
						border: 1px solid $color-w;
						border-radius: px2rem(10);
						margin: 0 px2rem(10);
						text-align: center;
						color: $color-w;
						padding: 0 px2rem(10);
						&::-webkit-input-placeholder {
							color: #ffbe9e;
						}
					}
				}
			}
		}
		.btn-group {
			height: px2rem(80);
			display: flex;
			justify-content: space-between;
			align-items: center;
			.btn {
				flex: 1;
				text-align: center;
				height: 100%;
				line-height: px2rem(80);
				color: $label-color;
			}
		}
	}
}
</style>