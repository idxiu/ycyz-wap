<style lang="scss" scoped>
	.no-data {
		height: 5.33333rem /* 400/75 */;
		width: 100%;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		.contentp {
			font-size: 0.37333rem /* 28/75 */;
			text-align: center;
			.imgs {
				display: block;
				width: 4rem /* 400/75 */;
				img {
					display: block;
					width: 100%;
				}
			}
		}
		.contentmsg {
			display: flex;
			flex-direction: column;
			align-items: center;
			p {
                margin-top:0.53rem;
				font-size: 0.34rem;
				color: $primary-color;
			}
		}
	}
</style>
<template>
	<div class="no-data">
		<div class="contentp contentmsg">
			<img class="imgs" :src="noDataimg" />
			<p class="levelBlue">{{text}}~</p>
		</div>
	</div>
</template>
<script>
import noDataimg from "../assets/img/no-data.png";
export default {
	props: {
		dataText: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			noDataimg: noDataimg,
			text: '暂无数据~'
		};
	},
	mounted() {
		if(this.dataText){
			this.text = this.dataText
		}
	}
};
</script>



