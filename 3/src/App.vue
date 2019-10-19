
<template>
	<div id="app" class="defalut">
		<router-view v-if="isRouterAlive" />
		<try-play v-if="isShowTryPlayModal" :type="type" :userInfo="userInfo" />
	</div>
</template>
<script>
import TryPlay from "@/components/TryPlay";
import Bus from "@/services/im/bus";
import { getInfo } from "@/services/auth";
export default {
	name: "app",
	components: {
		TryPlay
	},
	provide() {
		return {
			reload: this.reload
		};
	},
	data() {
		return {
			isShowTryPlayModal: false, // 是否显示 试玩会员弹框
			type: 1, // 试玩会员 1=申请 2=升级
			isRouterAlive: true,
			userInfo: {}
		};
	},
	mounted() {
		Bus.$on("toggle-try-play-modal", (data, type) => {
			this.isShowTryPlayModal = data;
			this.type = type;
			if (this.isShowTryPlayModal && this.type === 1) {
				this.getUserInfo();
			}
		});
	},
	methods: {
		reload() {
			this.isRouterAlive = false;
			this.$nextTick(function() {
				this.isRouterAlive = true;
			});
		},
		async getUserInfo() {
			let res = await getInfo();
			console.log(res);
			if (res.success) {
				this.userInfo = res.data.user;
				localStorage.setItem("isDemo", this.userInfo.isDemo);
			} else {
				this.$toast.text(res.message);
			}
		}
	},
	watch: {
		isShowTryPlayModal(newVal) {
			if (newVal) {
				this.ModalHelper.open();
			} else {
				this.ModalHelper.close();
			}
		}
	}
};
</script>
<style lang='scss'>
@import url("./assets/fonts/iconfont.css");
@import url("./styles/common.scss");
.my-radio {
    line-height: px2rem(52.5);
    color: $tip-color;
    /deep/ input {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='20' height='15' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 8l2.5-2.5 5 4.5 10-9.5L20 3 8 15H7z' fill='%23FFF' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-color: $dark-color;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 60%;
        width: px2rem(28);
        height: px2rem(28);
        border-radius: 50%;
    }
    /deep/input:checked{
            background-color: $primary-color !important;
    }
    /deep/ .nut-radio-label {
        font-size:px2rem(26);
        margin-right:  px2rem(20.25);
    }
}
</style>
