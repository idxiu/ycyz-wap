<template>
	<div class="backCommissionRatio">
		<Header rooter="-1" title="返佣" :showRight="true" :hasNoBack="true" iFontsize=".58667rem"></Header>
		<div class="content">
			<marquee class="marquee" direction="left" align="bottom" height="25" width="100%" scrollamount="4" scrolldelay="1" v-if="infoList.length > 0">
				<!-- <div>{{infoList[1].name}}打码<span class="num">{{topInfo[1].validMoney}}</span>元可得<span class="num">10</span>元,打码<span class="num">1000</span>元可得<span class="num">100</span>元,以此类推</div> -->
                有效打码至 <span v-for="(item, index) in topInfo" :key="index" class="num">{{item.validMoney}}元 </span> 为各模块梯度。如{{infoList[1].name}}打码<span class="num">{{infoList[1].child[0].validMoney}}</span>元，返佣<span class="num">{{infoList[1].child[0].rate}}%</span>；以此类推。
			</marquee>
			<div id="offsetTop" class="container-fluid">
				<div id="left_div">
					<div id="left_div1">
						<table id="left_table1" class="table table-bordered">
							<tr><th>{{title}}<em class="iconfont icon-fanyong-zhi"></em></th></tr>
						</table>
					</div>
					<div id="left_div2" :style="{'height':heightH+'px'}">
						<table id="left_table2" class="table table-bordered">
							<tr v-if="index != 0" v-for="(left,index) in infoList" :key="index"><th><div class="mui-ellipsis">{{left.name}}</div></th></tr>
						</table>
					</div>
				</div>
				<div id="right_div">
					<div id="right_div1">
						<div id="right_divx">
							<table id="right_table1" class="table table-bordered">
								<tr>
									<th v-for="(item, index) in topInfo" :key="index"><div class="mui-ellipsis">{{item.validMoney}}</div></th>
								</tr>
							</table>
						</div>
					</div>
					<div id="right_div2" :style="{'height':heightH+'px'}">
						<table id="right_table2" class="table table-bordered">
							<tr v-if="index != 0" v-for="(item, index) in infoList" :key="index">
								<td v-for="(list, index) in item.child" :key="index"><div class="mui-ellipsis">{{list.rate}}</div></td>
							</tr>
						</table>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
    import Header from '@/components/Header'
    import func from '@/api/purse'

    export default {
        name: "backCommissionRatio",
        components: {
            Header
        },
        data () {
            return {
				infoList: [],//返水比例详情
				title: '',
				topInfo: [],
				centerInfo: [],
				heightH: '',
                top:'',
                gameName:""
            }
        },
        created () {
			this.getBackCommissionRatio();
		},
		mounted(){
			document.getElementById("left_div2").addEventListener('touchstart',this.scrollLeft, false);
			document.getElementById("right_div2").addEventListener('touchstart',this.scrollRight, false);
		},
        methods: {
			getAbsPoint(e){
				let top = document.getElementById("left_div2").offsetTop + document.getElementById("offsetTop").offsetTop;
				this.heightH = document.documentElement.clientHeight - top;
			},
            getBackCommissionRatio () {
				var _this = this;
                let postData = {
                    page: 1,
                    pageSize: 10,
                }
                func.getBackCommission(postData).then((res) => {
                    console.log('res',res);
					_this.infoList = res.protion;
					var info = _this.infoList; 
					for(var i in info){
						if(i == 0){
							_this.title = info[i].name;
							_this.topInfo = info[i].child;
						}
                    }
                    console.log(_this.topInfo)
					this.getAbsPoint();
				})
			},
			scrollLeft(){
				let left_div = document.getElementById("left_div2");
				left_div.onscroll = function () {
					let right_top = this.scrollTop || this.pageYOffset;
					document.getElementById("right_div2").scrollTop = right_top;
				}
			},
			scrollRight(){
				let right_div = document.getElementById("right_div2");
				right_div.onscroll = function () {//右侧滑动区域
					let right_div2_top = this.scrollTop || this.pageYOffset;
					let right_div2_left = this.scrollLeft || this.pageXOffset;
					document.getElementById("left_div2").scrollTop = right_div2_top;
					document.getElementById("right_div1").scrollLeft = right_div2_left;
				}
			}
        }
    }
</script>

<style scoped lang="less">
	@import url('../../../components/less/common.less');
	.content {
		padding-top: 1.33333rem /* 100/75 */;
		position: fixed;
		width: 100%;
		height: 100%;
		.marquee{
			height: 1rem;
			line-height: 1rem;
			font-size: 0.37rem;
			span.num{
				color: @color-primary
			}
		}
		.container-fluid{
			position: absolute;
			top: 2.4rem;
			width: 100%;
			height: 100%;
			font-size: 0.373rem;
			text-align: center;
			overflow: hidden;
			#left_div{
				position: relative;
				z-index: 9;
				width: 2rem;
				float: left;
				box-shadow: 2px 0 5px 0 @color-rgab-black;
				#left_div1 {
					width: 100%;
					#left_table1{
						width: 100%;
						th {
							background: @color-default;
							text-align: center;
							height: 1.06667rem;
						}
						.iconfont{
							font-size: 0.32rem;
							color: @color-k;
						}
					}
				}
				#left_div2 {
					width: 100%;
					height: 100%;
					overflow: hidden;
					overflow-y: scroll;
					#left_table2{
						width: 100%;
						th {
							font-weight: 400;
							height: 1.06667rem;
							.mui-ellipsis{
								width: 2rem; 
								text-align: center;
								overflow: hidden; 
								white-space: nowrap; 
								text-overflow: ellipsis;
							}
						}
						tr:nth-child(2n) th{
							background-color: @color-default;
						}
					}
				}
			}
			#right_div {
				width: 8rem;
				float: left;
				#right_div1 {
					position: relative;
					z-index: 8;
					width: 100%;
					overflow: hidden;
					box-shadow: 2px 0 5px 0 @color-rgab-black;
					#right_table1{
						th {
							background: @color-default;
							text-align: center;
							.mui-ellipsis{
								width: 2.5rem;
								height: 1.06667rem;
								line-height: 1.06667rem;
							}
						}
					}
				}

				#right_div2 {
					width: 100%;
					height: 100%;
					overflow: auto;
					#right_table2 {
						white-space: nowrap;
						td {
							text-align: center;
							color: @color-primary;
							.mui-ellipsis{
								width: 2.5rem;
								height: 1.06667rem;
								line-height: 1.06667rem;
							}
						}
						tr:nth-child(2n) td{
							background-color: @color-default
						}
					}
				}
			}
		}
	}
</style>