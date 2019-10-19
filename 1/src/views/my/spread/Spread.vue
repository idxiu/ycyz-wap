<template>
	<div class="spread">
		<Header :title="'我要推广'" :showRight="true" :rooter="'-1'" ></Header>
		<div class="content">
            <div class="backCommission-top">
                <div class="backCommission-top-box">
                    <p>推广越多，返佣越多！</p>

					<div v-show="info.spreadAllMember != 0 || info.spreadAllMoney !=0 ">
						<h2>您已推广<span>{{info.spreadAllMember}}</span>人，</h2>
						<h2>累计获得<span>{{info.spreadAllMoney}}</span>元返佣！</h2>
					</div>


					<div v-show="info.spreadAllMember === 0 && info.spreadAllMoney === 0" class="no-data-box">
						<i class="iconfont icon-list-zanwusj"></i>
						<span>您暂时还未获得返佣哦~</span>
					</div>

                    <button @click="goSpread">我要推广</button>
                </div>
            </div>

            <div class="backCommission-list">
                <ul>
					<li class="pk-1px-t">
						<div class="left">
							<i class="iconfont icon-woyaotuiguang-tuiguangtongji"></i>
						</div>
						<router-link to="/statis" tag="div" class="right pk-1px-b">
							<span>推广统计</span>
							<i class="iconfont icon-list-more"></i>
						</router-link>
					</li>

					<li class="pk-1px-b">
						<div class="left">
							<i class="iconfont icon-woyaotuiguang-xiajibaobiao"></i>
						</div>
						<router-link to="/subordinate" tag="div" class="right">
							<span>下级报表</span>
							<i class="iconfont icon-list-more"></i>
						</router-link>
					</li>

					<li class="pk-1px-t">
						<div class="left">
							<i class="iconfont icon-wd-tuiguang"></i>
						</div>
						<router-link to="/generalizeLink" tag="div" class="right pk-1px-b">
							<span>推广链接</span>
							<i class="iconfont icon-list-more"></i>
						</router-link>
					</li>

					<li class="pk-1px-b">
						<div class="left">
							<i class="iconfont icon-woyaotuiguang-xiajihuiyuanguanli"></i>
						</div>
						<router-link to="/memberManagement" tag="div" class="right pk-1px-b">
							<span>下级会员管理</span>
							<i class="iconfont icon-list-more"></i>
						</router-link>
					</li>

					<li class="pk-1px-tb">
						<div class="left">
							<i class="iconfont icon-wd-banben"></i>
						</div>
						<router-link to="/explain" tag="div" class="right pk-1px-b">
							<span>推广说明</span>
							<i class="iconfont icon-list-more"></i>
						</router-link>
					</li>
                </ul>
            </div>


		</div>
	</div>
</template>

<script>
    import Header from "@/components/Header";
    import func  from "@/api/my";

    export default {
        components: {
            Header
        },
        name: "spread",
        data () {
            return {
              	info:{},
            };
        },
        mounted () {
           this.getInfo();
        },
        methods: {
            //获取推广信息
            getInfo(){
                func.getMemberCenter().then(res => {
                    console.log('推广基本信息',res);
					this.info = res.info;
                })
                .catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                });
			},

            goSpread(){
				this.$router.push({name:'generalizeLink'});
			}
            
        }
    };
</script>

<style lang="less" scoped>
	@import url("../../../components/less/common.less");

	.content {
		padding-top: 1.22667rem /* 92/75 */;
		.backCommission-top {
			height: 3.81333rem /* 286/75 */;
			background-image: linear-gradient(@color-B, @color-B), linear-gradient(@color-other-o, @color-other-o);
			background-blend-mode: normal, normal;
			padding: .66667rem /* 50/75 */ .4rem /* 30/75 */ 0;
			box-sizing: border-box;
			.backCommission-top-box {
				background: @color-default;
				border-radius: .13333rem /* 10/75 */;
				padding: .53333rem /* 40/75 */ 1.06667rem /* 80/75 */;
				box-shadow: 0px 5px 10px 0px @color-rgab-black;
				text-align: center;
				p {
					font-size: .32rem /* 24/75 */;
					color: @color-C;
					margin-bottom: .4rem /* 30/75 */;
					position: relative;
					&::after {
						content: "";
						display: block;
						width: 20%;
						height: 1px;
						background: @color-P;
						position: absolute;
						top: 50%;
						right: -10%;
						transform: translate(-50%) scaleY(0.5);
					}
					&::before {
						content: "";
						display: block;
						width: 20%;
						height: 1px;
						background: @color-P;
						position: absolute;
						top: 50%;
						left: 10%;
						transform: translate(-50%) scaleY(0.5);
					}
				}
				h2 {
					font-size: .37333rem /* 28/75 */;
					color: @color-C;
					font-weight: normal;
					line-height: 1.5;
					span {
						color: @color-p;
						font-size: .48rem /* 36/75 */;
						font-weight: bold;
					}
				}
				button {
					width: 100%;
					height: 1.06667rem /* 80/75 */;
					line-height: 1.06667rem /* 80/75 */;
					color: @color-default;
					text-align: center;
					border: none;
					border-radius: .13333rem /* 10/75 */;
					font-size: .37333rem /* 28/75 */;
					background: @color-primary;
					box-shadow: 0px 2px 5px 0px @color-rgab-black;
					margin-top: .26667rem /* 20/75 */;
					&:active {
						background: @color-primary-active;
					}
				}
				button.look {
					margin-top: .4rem /* 30/75 */;
					background: @color-default;
					border: 1px solid @color-primary;
					color: @color-primary;
				}

				.no-data-box {
					text-align: center;
					i {
						font-size:1.07rem;
						color: @color-w;
						opacity: .6;
					}
					span {
						display: block;
						text-align: center;
						font-size: .26667rem /* 20/75 */;
						color: @color-w;
						margin-top: .26667rem /* 20/75 */;
					}
				}
			}
        }
        .backCommission-list {
            margin-top:1.87rem;
			padding-bottom: 0.53333rem /* 40/75 */;
			ul {
				li {
					background-color: @color-default;
					display: flex;
					&:active {
						background: @color-rgab-b2;
					}
					.left {
						flex: 1;
						padding: 0.27rem 0.4rem /* 30/75 */;
						.iconfont {
							font-size: 0.53333rem /* 40/75 */;
							display: block;
						}
					}
					.right {
						color: @color-C;
						flex: 10;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding-right: 0.4rem /* 30/75 */;
						font-size: 0.42667rem /* 32/75 */;
						.iconfont {
							font-size: 0.32rem /* 24/75 */;
							color: @color-K;
						}
						.has-msg {
							position: relative;
							&::before {
								content: "";
								display: block;
								position: absolute;
								width: 0.18667rem /* 14/75 */;
								height: 0.18667rem /* 14/75 */;
								background-color: @color-a;
								right: 0.45333rem /* 34/75 */;
								border-radius: 50%;
								top: 50%;
								margin-top: -0.09333rem /* 7/75 */;
							}
						}
					}
					&:last-child {
						.right {
							border-bottom: none;
						}
					}
					&:nth-child(2n+1) {
						margin-top: 0.26667rem /* 20/75 */;
					}
				}

			}
        }
	}
</style>
