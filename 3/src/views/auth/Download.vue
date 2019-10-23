<template>
	<div>
		<Header title="立即下载"></Header>

		<div class="download">
			<div class="title">
				<div class="title-img">
					<img src="../../assets/img/download/title.png" alt />
					<h2>游戏社交&nbsp;&nbsp;业内首创</h2>
					<h3>
						<span>原生应用&nbsp;&nbsp;流畅体验</span>
					</h3>
				</div>
			</div>
			<div class="desc">
				<p>
					<img src="../../assets/img/download/xx_bj1.png" alt />
					<span>计划跟投&nbsp;&nbsp;投注跟单</span>
				</p>
				<p>
					<img src="../../assets/img/download/xx_bj1.png" alt />
					<span>即时聊天，边聊边玩</span>
				</p>
				<p>
					<img src="../../assets/img/download/xx_bj2.png" alt />
					<span>公群/私群，红包互动</span>
				</p>
				<p>
					<img src="../../assets/img/download/xx_bj1.png" alt />
					<span>会员权限，随意控制</span>
				</p>
			</div>
			<div class="b-btn">
				<a class="desc-b-btn" :href="downloadDomain" target="_blank"></a>
			</div>
			<div class="b-img">
				<img src="../../assets/img/download/bg.png" alt />
				<div class="down-bottom">
					<div class="download-btn">
						<p class="mgt6">苹果用户特别推荐</p>
						<p>
							安装并信任
							<span class="spans">描述文件</span>，app永不掉签！
						</p>
						<a class="instal" :href="courseUrl" target="_blank">前往安装</a>
					</div>
					<h2>
						<img src="../../assets/img/download/guide_icon.png" alt />
					</h2>
				</div>
			</div>
		</div>
		<div class="teacher">
			<img src="../../assets/img/download/tu_01.png" alt />
			<img src="../../assets/img/download/tu_02.png" alt />
			<img src="../../assets/img/download/tu_03.png" alt />
		</div>
	</div>
</template>
<script>
import { getDownloadUrl } from "@/services/auth";
import Header from '../../components/Header';
export default {
	components:{
		Header
	},
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
				if (res.success) {
					if (res.data.isDownApp === 1) {
						this.downloadDomain = res.data.downloadDomain;
						this.courseUrl = "http://" + res.data.navUrl;
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.download {
	background: #fff;
	.title {
		.title-img {
			display: flex;
			justify-content: center;
			flex-direction: column;
			h2 {
				text-align: center;
				font-size: 0.82667rem;
				color: #17c492;
				margin-top: -0.8rem;
			}
			h3 {
				text-align: center;
				span {
					position: relative;
					font-size: 0.61333rem;
					color: #1ecf9c;
					&::before {
						content: "";
						display: block;
						width: 0.4rem;
						height: 0.10667rem;
						background-color: #ffab5b;
						border-radius: 0.05333rem;
						position: absolute;
						left: -0.66667rem;
						top: 50%;
						transform: translateY(-50%);
					}
					&::after {
						content: "";
						display: block;
						width: 0.4rem;
						height: 0.10667rem;
						background-color: #ffab5b;
						border-radius: 0.05333rem;
						position: absolute;
						right: -0.66667rem;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
			img {
				width: 100%;
				height: px2rem(174);
				display: block;
			}
		}
	}
	.desc {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		width: 55%;
		p {
			margin-top: 0.4rem;
			position: relative;
			img {
				height: 0.37333rem;
			}
			span {
				position: absolute;
				font-size: 0.37333rem;
				color: #333;
				top: -0.08rem;
				left: 0.48rem;
				width: 100%;
			}
			&:nth-child(2n) {
				align-self: flex-end;
			}
		}
	}
	.b-btn {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.b-img {
        position: relative;
		img {
			width: 100%;
        }
        .down-bottom {
		position: absolute;
		bottom: 1.06667rem;;
		height: 3.47rem;
		width: 100%;
		background: url("../../assets/img/download/btn_bg.png") center center
			no-repeat;
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
				width: 0.53333rem /* 40/75 */;
				vertical-align: middle;
			}
		}
	}
	}
	.desc-b-btn {
		background: url("../../assets/img/download/download-button.png") center
			center no-repeat;
		display: block;
		margin-top: 0.51rem;
		width: 5.06667rem /* 380/75 */;
		height: 1.6rem /* 120/75 */;
		background-size: 100% 100%;
	}
	
}
.teacher {
	img {
		width: 100%;
		display: block;
	}
}
</style>
