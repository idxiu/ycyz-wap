<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-09 08:36:48
 * @LastEditTime: 2019-10-09 13:01:09
 * @LastEditors: Please set LastEditors
 -->
<template>
	<!-- 消息，群组，热门推荐，最近玩过列表-item -->
	<div class="item">
		<div class="item-logo">
			<i v-if="msgObj.tab === 3" class="sys-icon"><img src="../../../assets/img/icon_info_xitongxx.png" alt=""></i> <!-- 系统消息 -->
			<i v-if="msgObj.tab === 1" class="zb-icon"><img src="../../../assets/img/icon_info_zhangbianxx.png" alt=""></i><!-- 账变消息 -->
			<i v-if="msgObj.tab === 2" class="tz-icon"><img src="../../../assets/img/icon_info_gonggaotz.png" alt=""></i><!-- 公告通知 -->
			<i class="red-point" v-show="msgObj.hasMsg"></i>
			<img src="../../../assets/img/game-icon/yxdt_lts.png" v-if="msgObj.isChat" class="pk-chat-icon" />
			<img :src="msgObj.img" v-if="msgObj.img" />
			<img
				src="../../../assets/img/game-icon/yxdt_icon_none.png"
				v-if="!msgObj.img && msgObj.tab === 0"
			/>
		</div>
		<div class="item-body pk-1px-b">
			<div class="item-body-one">
				<span class="top text-dots">{{msgObj.top}}</span>
				<span class="right">{{msgObj.right}}</span>
			</div>
			<div v-show="msgObj.left || msgObj.bottom" class="item-body-one">
				<span class="left text-dots" :class="{'cp':msgObj.isCp}">{{msgObj.left}}</span>
				<span class="bt">{{msgObj.bottom}}</span>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ["item"],
	watch: {
		item: {
			handler(newVal, oldVal) {
				this.msgObj = newVal;
				console.log("变化了", this.msgObj);
			},
			deep: true
		}
	},
	data() {
		return {
			msgObj: {}
		};
	},
	mounted() {
		this.msgObj = this.item;
		console.log(this.msgObj);
	}
};
</script>
<style scoped lang="scss">
.item {
	height: px2rem(138);
	display: flex;
	background: $default-color;
	position: relative;

	.item-logo {
		width: px2rem(152);
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		img {
			width: px2rem(96);
			height: px2rem(96);
			display: block;
			border-radius: 50%;
		}
		.red-point {
			width: px2rem(24);
			height: px2rem(24);
			background: $color-a;
			border-radius: 50%;
			border: px2rem(2) solid $default-color;
			position: absolute;
			top: px2rem(20);
			right: px2rem(20);
		}
		.pk-chat-icon {
			position: absolute;
			top: px2rem(6);
			right: px2rem(6);
			width: px2rem(32);
			height: px2rem(32);
		}
		.sys-icon {
			font-size: px2rem(96);
			color: $primary-color;
		}
		.zb-icon {
			font-size: px2rem(96);
			color: #00b7ee;
		}
		.tz-icon {
			font-size: px2rem(96);
			color: #ffaa46;
		}
	}

	.item-body {
		flex: 1;
		padding: px2rem(20) px2rem(32) px2rem(20) 0;

		display: flex;
		flex-direction: column;
		justify-content: space-around;
		.item-body-one {
			display: flex;
			justify-content: space-between;
			.top {
				font-size: px2rem(28);
				color: $tip-color;
				font-weight: bold;
				max-width: px2rem(370);
			}
			.right {
				font-size: px2rem(24);
				color: $label-color;
			}
			.left {
				font-size: px2rem(24);
				color: $label-color;
				max-width: px2rem(546);
			}
			.bt {
				font-size: px2rem(24);
				color: $label-color;
			}
			.cp {
				background: $primary-color;
				color: $default-color;
				border-radius: px2rem(12);
				display: inline-block;
				padding: 0 px2rem(16);
				font-size: px2rem(18);
			}
		}
	}
}
</style>