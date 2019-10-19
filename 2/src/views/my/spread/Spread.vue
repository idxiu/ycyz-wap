<template>
	<div class="spread">
        <nut-navbar class="pk-title"  @on-click-back="$router.go(-1)" @on-click-more="$router.push({name:'index'})">
			我要推广
			<a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png"/>
			</a>
            <a class="backIdex" slot="more-icon" >
                <img class="imgsbank" src="../../../assets/img/my-icon/backIndex.png"/>
            </a>
        </nut-navbar>
        <div class="spread-num">
            <div class="spread-num-top">
                <div class="spread-p">
                    <span class="spread-title">推广人数</span>
                    <p>{{info.retreatAllMember}}</p>
                </div>
                <div class="spread-p spread-money">
                    <span class="spread-title">累计返佣</span>
                    <p>{{info.retreatAllMoney | currency('',2)}}</p>
                </div>
            </div>
            <div class="spread-num-bottom">
                <h2>
                    <span>返佣余额</span>
                    <span>{{info.retreatBalance | currency('',2)}}</span>
                </h2>
                <p @click="transferTobag">转出到钱包</p>
            </div>
            
        </div>
		<div class="botSpread">
			<ul class="mgb20">
				<li @click="back('statisics')">
					<div class="lileft">
						<i>
							<img src="../../../assets/img/spread/promp.png">
						</i>
						<p>推广统计</p>
					</div>
					<div class="liright">
						<img :src="leftSrc">
					</div>
				</li>
			</ul>
			<ul class="mgb20">
				<!-- <li @click="back('generalizeLink')">
					<div class="lileft">
						<i>
							<img src="../../../assets/img/spread/spreadlink.png">
						</i>
						<p class="pk-1px-b">推广链接</p>
					</div>
					<div class="liright">
						<img :src="leftSrc">
					</div>
				</li> -->
				
                <li @click="back('subordinate')">
					<div class="lileft pk-1px-b">
						<i>
							<img src="../../../assets/img/spread/xiaji.png">
						</i>
						<p>下级报表</p>
					</div>
					<div class="liright">
						<img :src="leftSrc">
					</div>
				</li>
                <li @click="back('memberManagement')">
					<div class="lileft">
						<i>
							<img src="../../../assets/img/spread/xiamember.png">
						</i>
						<p>推广记录</p>
					</div>
					<div class="liright">

						<img :src="leftSrc">
					</div>
				</li>
			</ul>
			<ul>
				<li @click="back('promote')">
					<div class="lileft">
						<i>
							<img src="../../../assets/img/spread/spreadShuo.png">
						</i>
						<p>推广说明</p>
					</div>
					<div class="liright">
						<img :src="leftSrc">
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import {getUserInfo} from '@/services/about';
import trans from '@/services/spread';
export default {
	data() {
		return {
            info:{
                retreatAllMember:0,
                retreatAllMoney:0,
                retreatBalance:0,
            },
			leftSrc:
				"data:image/svg+xml,%3Csvg viewBox='0 0 5 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.215 9.757l3.577-4.17a.931.931 0 0 0 0-1.173L1.215.244a.642.642 0 0 0-1.007 0 .929.929 0 0 0 0 1.172L3.283 5 .208 8.584a.93.93 0 0 0 0 1.173.643.643 0 0 0 1.007 0z' fill='rgb(200,200,205)'/%3E%3C/svg%3E"
		};
	},
	mounted() {
        this.getUserInfo();
	},
	methods: {
		back(path) {
			this.$router.push({
				name: path
			});
        },
         //获取推广信息
        getUserInfo(){
            let loading = this.$toast.loading('加载中...');
            getUserInfo().then(res => {
                loading.hide();
                if(res.success){
                    this.info = res.data.user;
                }else {
                    this.$toast.fail(res.message,{cover:true,duration:4000});
                }
            })
        },
        transferTobag(){
            if(this.info.retreatBalance === 0){
                this.$toast.fail('金额不足无法转出',{cover:true,duration:4000});
                return;
            }
            trans.transferToBag({
                money:this.info.retreatBalance
            }).then(res => {
                this.getUserInfo();
                if(res.success){
                    this.$toast.success('转出成功',{cover:true,duration:2000});
                }else {
                    this.$toast.fail(res.message,{cover:true,duration:4000});
                }
            })
        }
	}
};
</script>

<style lang="scss" scoped>
	@import "../../../components/scss/pk-pwd.scss";
	.spread {
        background: $center-newbg;
        color: $default-color;
		.levelBlue {
			color: $default-color;
			font-size: 0.48rem /* 36/75 */;
		}
		.spansright {
			.imgsbank {
				position: absolute;
				width: 0.58667rem /* 44/75 */;
                top: .24rem /* 18/75 */;
                right: .2rem /* 15/75 */;
			}
		}
    .botSpread {
			margin-top: 0.2rem;
			ul {
				background: #f2f2f2;
				li {
					border: none;
					padding-left: 0.4rem;
					background-color: $default-color;
					box-shadow: 0px 1px 0px 0px #c8c8cc, 0px -1px 0px 0px #c8c8cc;
					position: relative;
					height: 1.46667rem /* 110/75 */;
					line-height: 1.46667rem /* 110/75 */;
                    font-size: 0.42667rem /* 32/75 */;
                    box-shadow: none;
					.lileft {
						position: relative;
						color: #323233;
						padding-left: 0.8rem;
						p {
							padding-right: 0.74667rem /* 56/75 */;
							position: relative;
						}
						i {
							width: .66667rem /* 50/75 */;
							height: .66667rem /* 50/75 */;
							position: absolute;
							left: 0;
							top: .4rem /* 30/75 */;
							img {
								width: 100%;
								display: block;
							}
						}
					}
					.liright {
						img {
							position: absolute;
							right: 0.45333rem /* 34/75 */;
							top: 0.55rem /* 27/75 */;
							width: 0.18667rem /* 14/75 */;
						}
					}
				}
			}
		}
    }
    
    .no-data-box {
        text-align: center;
        i {
            font-size:1.07rem;
            color: $primary-color;
            opacity: .6;
        }
        span {
            display: block;
            text-align: center;
            font-size: .26667rem /* 20/75 */;
            color: $primary-color;
            margin-top: .26667rem /* 20/75 */;
        }
    }
	.nut-cell .nut-cell-title,
	.nut-cell .nut-cell-right {
		font-size: 0.34667rem /* 26/75 */;
	}
	.nut-cell .nut-cell-icon img {
		height: 0.33333rem; /* 25/75 */
	}
	.pk-1px-b:after {
		border-color: $border-light;
	}

    .spread-num{
        margin:0.4rem;
        .spread-num-top{
            display:flex;
            justify-content: space-between;
            .spread-p{
                height:1.82667rem /* 137/75 */;
                width:43%;
                background:url('../../../assets/img/bg-tgrs.png') no-repeat;
                background-size: cover;
                padding-left:0.4rem;
                border-radius:0.13333rem;
                display:flex;
                flex-direction: column;
                justify-content: center;
                .spread-title{
                    font-size:0.34666rem;
                }
                p{
                    font-size:0.48rem;
                }
            }
            .spread-money{
                background:url('../../../assets/img/bg-ljfy.png') no-repeat;
                background-size: cover;

            }
        }
        .spread-num-bottom{
            margin-top:0.4rem;
            height:2.48rem;
            background:url('../../../assets/img/bg-yy.png') no-repeat;
            background-size: cover;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding:0 0.53333rem;
            h2{
                font-size:0.42666rem;
                display:flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,.4);
                height: 50%;
            }
            p{
                font-size:0.37333rem;
                height: 50%;
                display:flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
