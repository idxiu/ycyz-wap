<template>
	<div class="activityRecord">
		<Header rooter="-1" title="活动领取记录" :hasNoBack="true" iFontsize=".58667rem"></Header>
		<div  class="content">
			<div v-show="list.length>0" class="content-fixed">
				<div class="title">
					最近一个月累计领取了{{totalMoney}}元活动奖励
				</div>
				<div class="list">
					<dl>
						<dt class="pk-1px-b">
							<span>活动名称</span>
							<span>领取金额</span>
						</dt>
					</dl>
				</div>
			</div>
			<div class="page-loadmore">
				<div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
					<pk-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
								 :top-all-loaded="topAllLoaded" @top-status-change="handleTopChange"
								 @bottom-status-change="handleBottomChange" ref="loadmore"
								 :stop-translate="stopTranslate">
						<ul>
							<li @click="handleModalShow(item)"
								:class="{'pk-1px-b':index!=list.length-1}" v-for="(item,index) in list" :key="index">
								<h2>
									<span>{{item.activityTitle}}</span>
									<span>{{item.disMoney}}</span>

								</h2>
								<p>
									<span>{{item.createTime | filterDate}}</span>
								</p>
							</li>

						</ul>
						<div class="nodata" v-show="hasData">我是有底线的</div>
					</pk-loadmore>
				</div>
			</div>
			<div v-show="list.length<=0" class="no-data">
				<div class="no-data-box">
					<i class="iconfont icon-list-zanwusj"></i>
					<p>暂无领取记录~~</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    import Header from "@/components/Header";
    import pkLoadmore from '@/components/Loadmore';
    import {getActivityRecord} from '@/api/activity';

    export default {
        name: "activityRecord",
        components: {
            Header,
            pkLoadmore
        },
        data () {
            return {
                stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
                allLoaded: false,
                topAllLoaded: false,
                topStatus: '',
                bottomStatus: '',
                wrapperHeight: 0,
                nodata: false,

                page: 1, //当前页数
                pageSize: 10, //每页请求的条数
                totalNum: 0, //总页数
                list: [],
                hasData: false,
                totalMoney:0,

            }
        },
		mounted(){
          	this.getList();
		},
        methods: {
            getList (t) {
                let postData = {
                    pageParams:{
                        page: this.page,
                        pageSize: this.pageSize,
					}

                }
                getActivityRecord(postData).then((res) => {
                    console.log('res', res)
                    let result = [];
                    this.totalMoney = res.totalMoney;
                    this.totalNum = res.totalNum;
                    result = res.list;
                    if (this.page === 1) {
                        this.list = result;
                        if (this.totalNum < this.page * this.pageSize) {
                            this.allLoaded = true;
                            this.topAllLoaded = true;
                        } else {
                            this.allLoaded = false;
                            this.topAllLoaded = false;
                        }
                    } else {
                        this.list = this.list.concat(result);
                        this.topAllLoaded = false;
                    }
                    this.$nextTick(() => {
                        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
                    })
                    if (t === 1) {
                        this.$toast({
                            message: '刷新成功',
                            duration: 2000
                        })
                    }
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                });
            },
            //下拉刷新
            handleTopChange (status) {
                this.topStatus = status;
            },
            loadTop () {
                this.page = 1;
                this.hasData = false;
                setTimeout(() => {
                    this.getList(1);
                    this.$refs.loadmore.onTopLoaded();
                    this.allLoaded = false;
                }, 1500);
            },
            //mint-ui 上拉加载
            handleBottomChange (status) {
                this.bottomStatus = status;
            },
            loadBottom () {
                this.page += 1;
                this.hasData = false;
                setTimeout(() => {
                    this.getList();
                    this.$refs.loadmore.onBottomLoaded();
                    if (this.page * this.pageSize >= this.totalNum) {
                        this.allLoaded = true; //所有数据加载完成
                        this.hasData = true;
                        this.topAllLoaded = false;
                    }
                }, 1500);
            },
        }
    }
</script>


<style lang="less" scoped>
	@import url('../../components/less/common.less');

	.no-data {
		padding: 0 .4rem /* 30/75 */;
		position: fixed;
		top: 1.22667rem /* 92/75 */;
		left: 0;
		right: 0;
		.no-data-box {
			margin-top: 2.13333rem /* 160/75 */;
			text-align: center;
			i {
				font-size: 2.53333rem /* 190/75 */;
				color: @color-w;
				opacity: .6;
			}
			p {
				text-align: center;
				font-size: .42667rem /* 32/75 */;
				color: @color-w;
				margin-top: .26667rem /* 20/75 */;
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
				margin-top: .53333rem /* 40/75 */;
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
		}
	}

	.content {
		.content-fixed {
			position: fixed;
			width: 100%;
			top: 1.22667rem /* 92/75 */;
			left: 0;
			right: 0;
			z-index: 1;
		}
		.title {
			display: flex;
			align-items: center;
			height: 1.06667rem /* 80/75 */;
			background: @color-default;
			padding-left: .4rem /* 30/75 */;
			p {
				display: inline-block;
				span {
					font-size: .37333rem /* 28/75 */;
					color: @color-primary;
				}
				button {
					margin-left: .13333rem /* 10/75 */;
					color: @color-primary;
					border: 1px solid @color-primary;
					padding: .08rem /* 6/75 */ .26667rem /* 20/75 */;
					background: @color-default;
					border-radius: .13333rem /* 10/75 */;
					font-size: .32rem /* 24/75 */;
				}
				&:last-child {
					margin-left: .57333rem /* 43/75 */;
					button {
						padding: .08rem /* 6/75 */ .6rem /* 45/75 */;
					}
				}
			}
		}
		.list {
			margin-top: .26667rem /* 20/75 */;
			dl {
				padding: 0 .4rem /* 30/75 */;
				background: @color-default;
				dt {
					display: flex;
					justify-content: space-between;
					padding: .32rem /* 24/75 */ 0;
					span {
						font-size: .42667rem /* 32/75 */;
						color: @color-C;
					}
				}
			}
		}
		.page-loadmore {
			position: fixed;
			top: 3.62667rem /* 272/75 */;
			left: 0;
			right: 0;
			ul {
				background: @color-default;
				padding: 0 .4rem /* 30/75 */;
				li {
					padding: .33333rem /* 25/75 */ 0;
					h2 {
						display: flex;
						justify-content: space-between;
						span {
							font-size: .37333rem /* 28/75 */;
							color: @color-C;
							&.inHand {
								color: @color-L;
							}
							&.success {
								color: @color-primary;
							}
							&.fail {
								color: @color-w;
							}
						}
					}
					p {
						margin-top: .26667rem /* 20/75 */;
						display: flex;
						justify-content: space-between;
						span {
							font-size: .32rem /* 24/75 */;
							color: @color-M;
						}
					}
				}
			}
		}
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: @color-default-black;
		opacity: .4;
		z-index: 2;
	}

	.mask-box {
		position: fixed;
		z-index: 3;
		top: 50%;
		transform: translateY(-50%);
		padding: 0 .4rem /* 30/75 */;
		width: 92%;
		opacity: 1;
		ul {
			background: @color-default;
			border-radius: .13333rem /* 10/75 */ .13333rem /* 10/75 */ 0 0;
			padding: .4rem /* 30/75 */;
			max-height: 6rem /* 450/75 */;
			overflow: auto;
			li {
				font-size: .37333rem /* 28/75 */;
				color: @color-C;
				line-height: 1.5;
				display: flex;
				justify-content: space-between;
				span {
					flex: 7.5;
					&:first-child {
						flex: 2.5;
						text-align: right;
					}
				}
			}
		}
		.close {
			background: @color-default;
			border-radius: 0 0 .13333rem /* 10/75 */ .13333rem /* 10/75 */;
			line-height: 1.06667rem /* 80/75 */;
			text-align: center;
			color: @color-J;
			font-size: .32rem /* 24/75 */;
		}
	}
</style>
