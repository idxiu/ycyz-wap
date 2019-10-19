<template>
	<div class="try-play">
		<!-- 试玩申请 -->
		<div class="try-apply" v-if="type === 1">
			<div class="try-top">
				<div class="try-top-text">
					<h2>申请成功！</h2>
					<p>您可以试玩72小时，到期系统自动注销</p>
				</div>
				<img src="../assets/img/dl_sw_sqcg@2x.png" alt />
			</div>
			<div class="try-center">
				<div class="left pk-1px-r">
					<span>系统分配账户</span>
					<h2>{{userInfo.account}}</h2>
				</div>
				<div class="right">
					<span>试玩金额</span>
					<h2>{{userInfo.balance | currency('￥',2)}}</h2>
				</div>
			</div>
			<div class="try-btn">
				<div class="update" @click="update">升级账号</div>
				<div class="ok" @click="ok">我知道了</div>
			</div>
		</div>

		<!-- 试玩升级 -->
		<div class="try-update" v-if="type === 2">
			<div class="try-box">
				<img src="../assets/img/img_zhsj@2x.png" alt />
				<div class="try-text">
					<h2>当前为试玩账号</h2>
					<p>暂无相关权限</p>
					<div @click="update" class="btn-update">立即升级</div>
				</div>
			</div>
			<div class="try-close">
				<i @click="close" class="iconfont iconicon_info_chat_redbagO_close"></i>
			</div>
		</div>
	</div>
</template>
<script>
import Bus from "@/services/im/bus";

export default {
	props: {
		type: {
			type: Number
		},
		userInfo: {
			type: Object
		}
	},
	mounted(){
		console.log('---->',this.userInfo)
	},
	methods: {
		update() {
			this.$router.push({ name: "register" });
			this.close();
		},
		ok() {
			this.$router.push({ name: "games" });
			this.close();
		},
		close() {
			Bus.$emit("toggle-try-play-modal", false);
		}
	}
};
</script>
<style lang="scss" scoped>
.try-play {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
}
.try-apply {
	width: px2rem(630);
	background: $default-color;
	border-radius: px2rem(15);
	.try-top {
		position: relative;
		img {
			width: 100%;
			display: block;
		}
		.try-top-text {
			position: absolute;
			padding: px2rem(40) px2rem(32);
			h2 {
				color: $default-color;
				font-size: px2rem(32);
			}
			p {
				color: $default-color;
				font-size: px2rem(24);
			}
		}
	}
	.try-center {
		display: flex;
		justify-content: space-around;
		margin: px2rem(64) 0;
		.left {
			text-align: center;
			flex: 1;
			span {
				font-size: px2rem(28);
				color: $tip-color;
			}
			h2 {
				font-size: px2rem(24);
				color: $primary-color;
				margin-top: px2rem(24);
			}
		}
		.right {
			@extend .left;
			h2 {
				color: $color-w;
			}
		}
	}
	.try-btn {
		padding: 0 px2rem(32);
		.update {
			background: $primary-color;
			line-height: px2rem(80);
			color: $default-color;
			font-size: px2rem(28);
			border-radius: px2rem(10);
			text-align: center;
			box-shadow: 0px 6px 12px 0px rgba(26, 127, 23, 0.2);
		}
		.ok {
			@extend .update;
			background: $default-color;
			color: $label-color;
			box-shadow: none;
			border-radius: 0;
		}
	}
}

.try-update {
	width: px2rem(630);
	border-radius: px2rem(15);
	.try-box {
		position: relative;
		img {
			width: 100%;
			display: block;
		}
		.try-text {
			position: absolute;
			top: px2rem(320);
			left: 0;
			width: 100%;
			h2 {
				font-size: px2rem(32);
				color: $tip-color;
				text-align: center;
			}
			p {
				margin-top: px2rem(30);
				font-size: px2rem(24);
				color: $label-color;
				text-align: center;
			}
			.btn-update {
				width: px2rem(340);
				line-height: px2rem(80);
				text-align: center;
				font-size: px2rem(28);
				color: $default-color;
				background: $primary-color;
				border-radius: px2rem(10);
				margin: px2rem(40) auto 0;
				box-shadow: 0px 6px 12px 0px rgba(26, 127, 23, 0.2);
			}
		}
	}
	.try-close {
		text-align: center;
		margin-top: px2rem(60);
		i {
			font-size: px2rem(70);
			color: $default-color;
		}
	}
}
</style>