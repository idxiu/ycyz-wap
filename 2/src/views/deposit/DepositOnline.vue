<template>
	<div class="alipay">
        <nut-navbar class="pk-title" @on-click-back="$router.go(-1)">
			<a class="spans" slot="back-icon">
				<img class="imgsbank" src="@/assets/img/my-icon/fanhui.png"/>
			</a>
            线上存款
            <a class="backIdex" @click="$router.push('/')" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
            </a>
        </nut-navbar>

		<div v-html="html"></div>
		<div class="content">

            <nut-actionsheet class="isShowChooseBank" :is-visible="isShowChooseBank" 
                @close="switchActionSheet('isShowChooseBank')"
                :menu-items="bankList"
                :optionTag="`bankName`"
                cancelTxt="取消"
				:chooseTagValue="chooseCard.bankName"
                @choose="chooseItem">
            </nut-actionsheet>

			<div class="title clearfix">
				<span>支付方式</span>
				<span>{{baseInfoData.payName}}</span>
			</div>
			<div class="choose-depositMoney">
				<div v-show="baseInfoData.payType !== 1" class="sys-depositMoney pk-1px-b">
					<span>系统余额</span>
					<span>{{baseInfoData.balance}}</span>
				</div>

                <!-- payType  1=网银 2=微信 3=支付宝   -->
                <div v-show="baseInfoData.payType === 1" class="in-money pk-1px-b">
					<h2>
						<span class="must">银行</span>
						<input @click="isShowChooseBank = true" readonly required type="text" v-model="chooseCard.bankName"
							   placeholder="请选择银行卡">
						<i class="iconfont icon-list-more"></i>
					</h2>
				</div>

				<div class="in-depositMoney">
					<h2>
						<span>存款金额</span>
						<input type="number" @focus="iNow = -1" @keyup="validateRegExp()"
							   v-model="depositMoney" placeholder="请输入存款金额">
						<b v-show="baseInfoData.isRandom == 1">.{{pointNum}}</b>
					</h2>
					<div class="in-money-chinese">{{depositMoneyChinese}}</div>

					<ul>
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
			<div class="tip">
				<p class="text-dots">温馨提示：单笔存款金额为 <span>{{baseInfoData.depositMin}}~{{baseInfoData.depositMax}}</span>元</p>
				<p>存款金额里的小数点数字是系统自动生成，方便快速存款。</p>
			</div>

			<div class="pk-submit-bottom">
				<img src="../../assets/img/submit_bg.png" alt="">
				<div class="submit">
					<button @click="handleDeposit">立即存款</button>
				</div>
			</div>


		</div>
	</div>
</template>

<script>
    import func from '@/services/deposit'
    export default {
        name: 'online',
        mounted () {
            this.getBaseInfo();
        },
        data () {
            return {
                iNow: -1,//快捷金额样式
                fastMoneyArr: [1000, 500, 200, 100],
                depositMoney: '',//存款金额
                depositMoneyChinese:'',//存款金额-中文大写
                remark: '',//备注
                html: '',//form表单提交
                baseInfoData: {
                    balance: 0
                },
                pointNum: '00',//随机小数
                isShowChooseBank: false,//是否显示选择银行卡
                bankList:[],//银行卡列表
                chooseCard:{}//选择的银行卡
            }
        },
        methods: {
            getBaseInfo () {
                let loading = this.$toast.loading('加载中...');
                func.getOnlineInfo({
                    id: this.$route.query.id * 1,
                }).then((res) => {
                    loading.hide();
                    if(res.success){
                        this.baseInfoData = res.data;
                        this.baseInfoData.depositMax += 0.99;
                        if(this.baseInfoData.payType === 1){
                            this.getBankSelect(this.baseInfoData.payId);
                        }
                        this.setPointNum();
                    }else {
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                })
            },

            switchActionSheet(param) {
                this[`${param}`] = !this[`${param}`];
            },
            chooseItem(itemParams) {
                this.chooseCard = itemParams;
            },
            //获取银行卡列表
            getBankSelect (payId) {
                func.getBankSelect({
                    payId: payId.toString()
                }).then((res) => {
                    if(res.success){
                        this.bankList = res.data
                    }else {
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                })
            },

            validateRegExp(){
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

            //快捷选择存款金额
            handleFast (index) {
                //系统余额小于所选的快捷金额
                if ((this.fastMoneyArr[index] + (this.pointNum / 100)) > this.baseInfoData.depositMax) {
                    this.$toast.fail(`存款金额不得高于${this.baseInfoData.depositMax}元`,{cover:true});
                    return;
                }
                if ((this.fastMoneyArr[index] + (this.pointNum / 100)) < this.baseInfoData.depositMin) {
                    this.$toast.fail(`存款金额不得低于${this.baseInfoData.depositMin}元`,{cover:true});
                    return;
                }
                this.iNow = index;
                this.depositMoney = this.fastMoneyArr[index];
            },

            //立即存款
            handleDeposit () {
                if(!this.validate()) return;
                let postData = {
                    setId: this.baseInfoData.setId * 1,
                    depositMoney: this.depositMoney * 1 + this.pointNum / 100,
                    remark: this.remark,
                    payType: this.baseInfoData.payType * 1,
                }

                let loading = this.$toast.loading('提交中...');
                func.postOnline(postData).then((res) => {
                    loading.hide();
                    if(res.success){
                        this.goThree(res.data);
                    }else {
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                })
            },

            validate(){
                //网银
                if(this.baseInfoData.payType === 1){
                    if (!this.chooseCard.bankName) {
                        this.$toast.fail('请选择银行卡',{cover:true});
                        return false;
                    }
                }
                //网银 支付宝 微信
                if (!this.depositMoney) {
                    this.$toast.fail('请输入存款金额',{cover:true});
                    return false;
                }else if (this.depositMoney * 1 + (this.pointNum / 100) > this.baseInfoData.depositMax || this.depositMoney * 1 + (this.pointNum / 100) < this.baseInfoData.depositMin) {
                    this.$toast.fail(`存款金额为${this.baseInfoData.depositMin}-${this.baseInfoData.depositMax}`,{cover:true});
                    return false;
                }else {
                    return true;
                }
            },
            //跳转第三方
            goThree (item) {
                let postData = {
                    order: item.order,
                    amount: (this.depositMoney * 1 + this.pointNum / 100).toString(),
                    payType: this.baseInfoData.payType * 1,
                    merId: this.baseInfoData.merId * 1,
                    businessnum: this.baseInfoData.businessNum,
                    bank: this.chooseCard.bankcode,
				}
                func.goThreeWay(postData).then((res) => {
                    if(res.success){
                        this.html = res.data.page;
                        this.$nextTick(() => {
                            document.getElementById("form1").submit();
                            this.$router.push({
                                'name': 'payResult'
                            })
                        })
                    }else {
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
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

<style lang="scss" scoped>
	.alipay {
		.content{
			padding-bottom: 1.87rem;
			.title {
				padding: .32rem /* 24/75 */ .4rem /* 30/75 */;
				font-size: .42667rem /* 32/75 */;
				color: $tip-color;
				span {
                    font-size:.34667rem /* 26/75 */;
                    float: left;
					&:last-child {
						float: right;
						color:$text-color;
						font-size: 0.42rem /* 32/75 */;
					}
				}
			}

			.choose-depositMoney {
				background: $default-color;

				/*选择银行*/
				.in-money {
					h2 {
						margin-left: .4rem /* 30/75 */;
						padding-right: .4rem /* 30/75 */;
						line-height: 1.47rem;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-weight:400;
						span {
							font-size: 0.42rem /* 32/75 */;
							color: $tip-color;
							flex: 3;
							&:last-child {
								color: $color-P;
								i {
									font-size: .32rem /* 24/75 */;
									color: $color-K;
								}
							}
						}

						input {
							flex: 10;
							text-align: right;
							border: none;
							color: $text-color;
							font-size: .42rem;
						}
						input::-webkit-input-placeholder {
							color: $label-color;
							font-size: .42rem;
						}
						i {
							font-size: .42rem;
							vertical-align: middle;
							color: $color-K;
						}
						b{
							font-size: 0.32rem;
							font-weight: 400;
						}
					}
				}

				/*存款金额*/
				.in-depositMoney {
					h2 {
						padding:0 .4rem /* 30/75 */;
						line-height: 1.47rem;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-weight:400;
						span {
							font-size: 0.42rem /* 32/75 */;
							color: $tip-color;
							flex: 3;
							&:last-child {
								color: $primary-color;
							}
						}

						input {
							flex: 10;
							text-align: right;
							border: none;
							color: $text-color;
							font-size: .42rem;
						}
						input::-webkit-input-placeholder {
							color: $label-color;
							font-size: .42rem;
						}
						b{
							font-size: .42rem;
							font-weight: 400;
							color: $color-primary;
						}
					}
					ul {
						background:$default-bg-color;
						padding: 0 .4rem /* 30/75 */ .34667rem /* 26/75 */;
						display: flex;
						justify-content: space-between;
						li {
							font-size: .37333rem /* 28/75 */;
							color: $primary-color;
							width: 2.00rem /* 150/75 */;
							height: 1.06667rem /* 80/75 */;
							text-align: center;
							line-height: 1.06667rem /* 80/75 */;
							border: 1px solid $primary-color;
							border-radius: .13333rem /* 10/75 */;
							box-sizing: border-box;
							&.active {
								color: $default-color;
								background: $primary-color;
							}
						}
					}
				}


				/*系统余额*/
				.sys-depositMoney {
					padding: .34667rem /* 26/75 */ .4rem /* 30/75 */ .34667rem /* 26/75 */ 0;
					margin-left: .4rem /* 30/75 */;
					display: flex;
					justify-content: space-between;
					span {
                        font-size: .42rem /* 32/75 */;
						color: $tip-color;
						&:last-child {
							color: $nondefault-color;
						}
					}
				}
				.remark {
					padding: .34667rem /* 26/75 */ .4rem /* 30/75 */ .34667rem /* 26/75 */ 0;
					margin-left: .4rem /* 30/75 */;
					display: flex;
					justify-content: space-between;
					span {
						font-size: .42rem /* 32/75 */;
						color: $tip-color;
						&:last-child {
							color: $primary-color;
						}
						flex: 2;
					}
					input {
						flex: 10;
						text-align: right;
						border: none;
						color: $text-color;
						font-size: .42rem;
					}
					input::-webkit-input-placeholder {
						color: $label-color;
						font-size: .42rem;
					}
				}
			}


			/*提示区域*/
			.tip {
				padding: .4rem /* 30/75 */;
				p {
					font-size: .34rem /* 26/75 */;
					color: $label-color;
					line-height: .48rem /* 36/75 */;
					span {
						color: $primary-color;
					}
				}
			}



		}



	}



	.in-money-chinese{
		text-align: right;
		padding-right: .4rem;
		background:$default-bg-color;
		line-height:0.93rem;
		height:0.93rem;
		font-size:0.35rem;
		color: $text-color;
	}
</style>


