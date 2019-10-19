<template>
	<div class="alipay">
		<mt-popup :closeOnClickModal="true" :position="'bottom'" v-model="popupVisible"
				  style="width: 100%;z-index: 2003;">
			<div class="popup-title pk-1px-b">
				<span @click="cancel()">取消</span>
				<span>请选择银行卡</span>
				<span @click="sure()">确定</span>
			</div>
			<mt-picker :itemHeight="itemHeight" valueKey="bankName" :slots="slots" @change="onValuesChange"></mt-picker>
		</mt-popup>

		<Header rooter="-1" title="线上存款" :hasNoBack="true" iFontsize=".58667rem"></Header>
		<div v-html="html"></div>

		<div class="content">

			<div class="title clearfix">
				<span>支付方式</span>
				<span>{{baseInfoData.payName}}</span>
			</div>
			<div class="choose-money">
				<div class="in-money pk-1px-b">
					<h2>
						<span class="must">银行</span>
						<input @click="popupVisible = true" readonly required type="text" v-model="chooseCard.bankName"
							   placeholder="请选择银行卡">
						<i class="iconfont icon-list-more"></i>
					</h2>

				</div>
				<div class="in-money">
					<h2>
						<span>存款金额</span>
						<input type="number" @focus="iNow = -1" @keyup="validateRegExp()" v-model="depositMoney" placeholder="请输入存款金额">
						<b v-show="baseInfoData.isRandom == 1">.{{pointNum}}</b>
					</h2>
					<div class="in-money-chinese">{{depositMoneyChinese}} </div>
					<ul class="pk-1px-b">
						<li :class="{'active':iNow === index}" v-for="(item,index) in fastMoneyArr" :key="index"
							@click="handleFast(index)">{{item}}元
						</li>
					</ul>
				</div>
				<div class="remark">
					<span>备注</span>
					<input type="text" v-model="remark" placeholder="请输入其他备注信息">
				</div>

			</div>
			<div class="submit">
				<button @click="handleDeposit()">立即存款</button>
				<p v-show="baseInfoData.isHigh == 1" class="text-dots">
					温馨提示：单笔存款金额为 <span>{{baseInfoData.depositMin}}~{{baseInfoData.depositMax}}</span>元</p>
				<p v-show="baseInfoData.isHigh == 2" class="text-dots">
					温馨提示：单笔存款金额为<span>{{baseInfoData.singleMin}}~{{baseInfoData.singleMax}}</span>元</p>
				<p>存款金额里的小数点数字是系统自动生成，方便快速存款。</p>

			</div>
		</div>
	</div>
</template>

<script>
    import Header from '@/components/Header'
    import func from '@/api/purse'

    export default {
        name: 'onlineEBank',
        components: {
            Header
        },
        created () {
            this.getBaseInfo();
        },
        data () {
            return {
                popupVisible: false,
                itemHeight: parseInt(this.HTML_FONT_SIZE * 1.06667),
                chooseCard: '',
                chooseCardTem: '',
                slots: [{
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }],
                depositMoney: '',//存款金额
                depositMoneyChinese:'',//存款金额中文大写
                iNow: -1,
                fastMoneyArr: [1000, 500, 200, 100],
                remark: '',
                html: "",
                baseInfoData: {
                    balance: 0
                },
                pointNum: '00'

            }
        },
        methods: {
            getBaseInfo () {
                func.getOnlineInfo({
                    setId: this.$route.query.setId * 1,
                    payType: this.$route.query.payType * 1
                }).then((res) => {
                    console.log('基本信息',res);
                    this.baseInfoData = res;
                    this.baseInfoData.depositMax +=0.99;
                    this.baseInfoData.singleMax +=0.99;
                    this.getBankSelect(res.payId);
                    this.setPointNum();
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                })
            },
			validateRegExp(){
                console.log(this.baseInfoData)
				if(this.baseInfoData.isRandom === 1){//随机生成小数
                    this.depositMoney = this.depositMoney.replace(/[^\d]/,''); //只能输入整数
                }else {//不随机生成小数
                    if(this.baseInfoData.isWhole === 1){//只能输入整数
                        this.depositMoney = this.depositMoney.replace(/[^\d]/,'');
                    }else {
                        this.depositMoney = this.depositMoney.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
                    }
				}
			},
            setPointNum () {
                //随机生成2位数点
                if (this.baseInfoData.isRandom === 1) {
                    while (true) {
                        this.pointNum = parseInt(Math.random() * 100);
                        if (this.pointNum <= 99 && this.pointNum >= 11) {
                            return;
                        }
                    }
                } else {
                    this.pointNum = '00';
                }
            },
            //获取银行卡列表
            getBankSelect (payId) {
                func.getBankSelect({
                    payId: payId.toString()
                }).then((res) => {
                    console.log('银行卡列表数据',res)
                    this.slots[0].values = res.bank;
                }).catch(err => {
                })
            },
            onValuesChange (picker, values) {
                this.chooseCardTem = values[0];
            },
            cancel () {
                this.popupVisible = false;
                this.chooseCard = '';

            },
            sure () {
                this.chooseCard = this.chooseCardTem;
                this.popupVisible = false;
                console.log('选择的银行卡数据',this.chooseCard);
            },

            //快捷选择存款金额
            handleFast (index) {
                //系统余额小于所选的快捷金额
				console.log((this.fastMoneyArr[index] + (this.pointNum / 100)))
				if(this.baseInfoData.isHigh === 1){

                    if ((this.fastMoneyArr[index] + (this.pointNum / 100)) > this.baseInfoData.depositMax) {
                        this.$toast({
                            message: `存款金额不得高于${this.baseInfoData.depositMax}元`,
                            duration: 2000
                        });
                        return;
                    }
				}else {
                    if ((this.fastMoneyArr[index] + (this.pointNum / 100)) > this.baseInfoData.singleMax) {
                        this.$toast({
                            message: `存款金额不得高于${this.baseInfoData.singleMax}元`,
                            duration: 2000
                        });
                        return;
                    }
				}

                this.iNow = index;
                this.depositMoney = this.fastMoneyArr[index];
            },

            //立即存款
            handleDeposit () {
                if (!this.chooseCard) {
                    this.$toast({
                        message: '请选择银行卡',
                        duration: 2000
                    });
                    return;
                }
                if (!this.depositMoney) {
                    this.$toast({
                        message: '请输入存款金额',
                        duration: 2000
                    });
                    return;
                }

                if(this.baseInfoData.isHigh === 1){
                    if (this.depositMoney * 1 + (this.pointNum / 100) > this.baseInfoData.depositMax || this.depositMoney * 1 + (this.pointNum / 100) < this.baseInfoData.depositMin) {
                        this.$toast({
                            message: `存款金额为${this.baseInfoData.depositMin}-${this.baseInfoData.depositMax}`,
                            duration: 2000
                        });
                        return;
                    }
				}else {
                    if (this.depositMoney * 1 + (this.pointNum / 100) > this.baseInfoData.singleMax || this.depositMoney * 1 + (this.pointNum / 100) < this.baseInfoData.singleMin) {
                        this.$toast({
                            message: `存款金额为${this.baseInfoData.singleMin}-${this.baseInfoData.singleMax}`,
                            duration: 2000
                        });
                        return;
                    }
				}


                let postData = {
                    setId: this.baseInfoData.setId * 1,
                    depositMoney: this.depositMoney * 1 + this.pointNum / 100,
                    remark: this.remark,
                    paidType: this.$route.query.payType * 1,
                    isFast: 2,
                }
                console.log('线上-网银提交的数据--->',postData)
                func.postOnline(postData).then((res) => {
                    this.goThree(res);
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                })

            },
            goThree (item) {
                let postData = {
                    order: item.order,
                    amount: (this.depositMoney + this.pointNum / 100).toString(),
                    payway: this.baseInfoData.payType * 1,
                    payType: this.baseInfoData.payType * 1,
                    merId: this.baseInfoData.merId * 1,
                    businessnum: this.baseInfoData.businessNum,
                    bank: this.chooseCard.bankcode,
                }
                func.goThreeWay(postData).then((res) => {
                    this.html = res.url;
                    this.$nextTick(() => {
                        document.getElementById("form1").submit();
                        this.$router.push({
                            'name': 'payResult'
                        })
                    })
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                })
            },

        },
		watch:{
            depositMoney(newVal,oldVal){
                let money = newVal*1+this.pointNum/100;
                this.depositMoneyChinese = this.filterAmount(money);
			}
		}
    }
</script>

<style lang="less" scoped>
	@import url('../../../components/less/common.less');

	.content {
		padding-top: 1.22667rem /* 92/75 */;
	}

	.popup-title {
		height: 1.06667rem /* 80/75 */;
		padding: 0 .4rem /* 30/75 */;
		font-size: .4rem /* 30/75 */;
		color: @color-C;
		text-align: center;
		display: flex;
		justify-content: space-between;
		align-items: center;
		span {
			flex: 1;
			height: 1.06667rem /* 80/75 */;
			line-height: 1.06667rem /* 80/75 */;
		}
		span:first-child {
			color: @color-C;
			text-align: left;
		}
		span:last-child {
			color: @color-primary;
			text-align: right;
		}
	}

	.alipay {
		.title {
			padding: .32rem /* 24/75 */ .4rem /* 30/75 */;
			font-size: .42667rem /* 32/75 */;
			color: @color-C;
			span {
				float: left;
				&:last-child {
					float: right;
				}
			}
		}
		.choose-money {
			background: @color-default;
			.sys-money {
				margin-left: .4rem /* 30/75 */;
				padding-right: .4rem /* 30/75 */;
				line-height: 1.06667rem /* 80/75 */;
				display: flex;
				justify-content: space-between;
				span {
					font-size: .37333rem /* 28/75 */;
					color: @color-C;
					&:last-child {
						color: @color-P;
						i {
							font-size: .32rem /* 24/75 */;
							color: @color-K;
						}
					}
				}
			}
			.in-money {
				h2 {
					.sys-money;
					align-items: center;
					span {
						flex: 3;
					}
					input {
						flex: 10;
						text-align: right;
						border: none;
						color: @color-C;
						font-size: .32rem /* 24/75 */;
					}
					input::-webkit-input-placeholder {
						color: @color-P;
					}
					i {
						font-size: .32rem /* 24/75 */;
						vertical-align: middle;
						color: @color-K;
					}
					b{
						font-size: 0.32rem;
						font-weight: 400;
					}
				}
				.in-money-chinese{
					text-align: right;
					padding-right: .4rem;
				}
				ul {
					padding: .34667rem /* 26/75 */ .4rem /* 30/75 */ .34667rem /* 26/75 */ 0;
					margin-left: .4rem /* 30/75 */;
					display: flex;
					justify-content: space-between;
					li {
						font-size: .37333rem /* 28/75 */;
						color: @color-primary;
						width: 2.13333rem /* 160/75 */;
						height: 1.06667rem /* 80/75 */;
						text-align: center;
						line-height: 1.06667rem /* 80/75 */;
						border: 1px solid @color-primary;
						border-radius: .13333rem /* 10/75 */;
						box-sizing: border-box;
						&.active {
							color: @color-default;
							background: @color-primary;
						}
					}
				}
			}
			.remark {
				.sys-money;
				span {
					flex: 1;
					&:first-child::before {
						display: none;
					}
				}
				input {
					flex: 10;
					text-align: right;
					border: none;
					color: @color-C;
					font-size: .32rem /* 24/75 */;
				}
				input::-webkit-input-placeholder {
					color: @color-P;
				}
			}
		}
		.submit {
			padding: .4rem /* 30/75 */;
			button {
				width: 100%;
				border: none;
				background: @color-primary;
				padding: .36rem /* 27/75 */ 0;
				font-size: .37333rem /* 28/75 */;
				color: @color-default;
				border-radius: .13333rem /* 10/75 */;
				margin-bottom: .26667rem /* 20/75 */;
				box-shadow: 0px 2px 5px 0px @color-rgab-black;
				&:active {
					background: @color-primary-active;
				}
			}
			p {
				font-size: .32rem /* 24/75 */;
				color: @color-M;
				line-height: 1.5;
				span {
					color: @color-primary;
				}
			}
		}
	}
</style>


