<template>
	<div>
		<div class="download">
			<div class="title">
				<div class="title-img">
					<img src="../../assets/img/download/title.png" alt="" />
				</div>
			</div>
			<div class="desc">
				<p>
					<span>即时通讯</span>
					<span>聊天便捷</span>
					<span>自主研发</span>
					<span>安全保障</span>
				</p>
				<p class="mgt6">
					<span>边聊边玩</span>
					<span>随心切换</span>
					<span>畅游新体验</span>
				</p>
			</div>
			<div class="b-btn">
				<a
					class="desc-b-btn"
					:href="downloadDomain"
					target="_blank"
				></a>
			</div>

			<div class="bottom">
				<div class="download-btn">
					<p class="mgt6">苹果用户特别推荐</p>
					<p>
						安装并信任<span class="spans">描述文件</span
						>，app永不掉签！
					</p>
					<a class="instal" :href="courseUrl" target="_blank"
						>前往安装</a
					>
				</div>
				<h2><img src="../../assets/img/download/guide_icon.png" alt=""></h2>
			</div>
		</div>
        <div class="teacher">
            <img src="../../assets/img/download/tu_01.png" alt="">
            <img src="../../assets/img/download/tu_02.png" alt="">
            <img src="../../assets/img/download/tu_03.png" alt="">
        </div>
	</div>
</template>
<script>
import { getDownloadUrl } from "@/api/index";
export default {
	data() {
		return {
			downloadDomain: "",
			courseUrl: "" //信任教程地址
		};
	},
	mounted() {
		this.getDownloadUrl();
	},
	methods: {
		getDownloadUrl() {
			getDownloadUrl().then(res => {
				console.log(res);
				if (res.isDownApp === 1) {
					this.downloadDomain = res.downloadDomain;
					this.courseUrl = "http://" + res.navUrl;
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
	.download {
		.mgt6 {
			margin-top: 0.16rem /* 12/75 */;
		}
		background: url("../../assets/img/download/bg.png") center center no-repeat;
		background-size: cover;
		width: 100%;
		height: 17.78667rem /* 1334/75 */;
		position: relative;

		.title {
			padding-top: 1rem;
			.title-img {
				display: flex;
				justify-content: center;
				img {
					width: 7.6rem;
					height: 1.73rem;
					display: block;
				}
			}
		}
		.desc {
			margin-top: 0.51rem;
			p {
				font-size: 0.42667rem /* 32/75 */;
				color: #242838;
				display: flex;
				justify-content: space-evenly;
			}
		}
		.b-btn {
			width: 100%;
			display: flex;
			justify-content: center;
		}
		.desc-b-btn {
			background: url('../../assets/img/auth-icon/desc-btn.png') center center no-repeat;
			display: block;
			margin-top: 0.51rem;
			width: 5.06667rem /* 380/75 */;
			height: 1.6rem /* 120/75 */;
			background-size: 100% 100%;
		}
		.bottom {
			position: absolute;
			bottom: 0;
            height: 3.47rem;
			width: 100%;
			background: url('../../assets/img/download/btn_bg.png') center center no-repeat;
			background-size: cover;
			z-index: 1;
			.download-btn {
				display: flex;
				flex-direction: column;
				align-items: center;
				z-index: 1;
				font-size: 0.4rem /* 30/75 */;
				color: #04966c;
                font-weight: 500;
                line-height: 1.5;
                margin-bottom: .26667rem /* 20/75 */;
				.mgt6 {
					margin-top: 0.16rem /* 12/75 */;
				}
				.spans {
					color: #e87d1a;
				}
				.instal {
					margin-top: 0.10667rem /* 8/75 */;
					margin-bottom: 0.13333rem /* 10/75 */;
					border-radius: 0.13333rem /* 10/75 */;
					border: solid 0.02667rem /* 2/75 */ #04966c;
					color: #04966c;
					padding: 0.13333rem /* 10/75 */ 0.84rem /* 63/75 */;
				}
			}
			h2 {
				font-weight: normal;
				text-align: center;
				img {
					width: .4rem /* 30/75 */;
					vertical-align: middle;
				}
			}
		}
    }
    .teacher{
        img{
            width:100%;
            display: block;

        }
    }
</style>
