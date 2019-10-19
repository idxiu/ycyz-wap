<template>
	<div class="company-alipay">
        <nut-navbar class="pk-title" @on-click-back="$router.go(-1)">
			<a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../assets/img/my-icon/fanhui.png"/>
			</a>
            公司存款
             <a class="backIdex" @click="$router.push('/')" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
            </a>
		</nut-navbar>

         <!-- <nut-datepicker class="begin-time"
                :is-visible="isShowTime"
                type="datetime"
                title="请选择存款时间" 
                :is-show-chinese="false"
                :defaultValue="dataVal"
                @close="beginPicker('isShowTime')"
                @choose="beginChoose"
            >
            </nut-datepicker> -->


		<div class="content">
			<div class="deposit-account">
				<h2 class="title">存款账户</h2>
				<div class="deposit-account-box">
                    <!-- 有二维码 展示的内容-->
					<div v-show="baseInfoData.payType === 2" class="left">
						<h2 class="pk-1px-b" v-show="baseInfoData.bankNum">
							<p>存款账号</p>
							<span @click="copy(baseInfoData.bankNum)">{{baseInfoData.bankNum}}  <i class="iconfont icon-qb-copy"></i></span>
						</h2>
						<h2 class="pk-1px-b"  v-show="baseInfoData.bankUser">
							<p>收款人</p>
							<span>{{baseInfoData.bankUser}}</span>
						</h2>
						<h2 class="pk-1px-b remark" >
							<p>
                                备注码
                                <span>您在转账时填写备注码，会提高您存款到账速度</span>
                            </p>
							<span>{{randomNum}}</span>
						</h2>
						
					</div>

                    <!-- 无二维码 展示的内容-->
                    <div v-show="baseInfoData.payType === 1" class="left">
                        <h2 class="pk-1px-b" >
                            <p>存款银行</p>
                            <span>{{baseInfoData.bankName}}</span>
                        </h2>
                        <h2 class="pk-1px-b" >
                            <p>户主</p>
                            <span>{{baseInfoData.bankUser}}</span>
                        </h2>
                        <h2 class="pk-1px-b">
                            <p>账号</p>
                            <span @click="copy(baseInfoData.bankNum)">{{baseInfoData.bankNum}}<i class="iconfont icon-qb-copy"></i></span>
                        </h2>
                        <h2 class="remark">
                            <p>备注码
                                <span>您在转账时填写备注码，会提高您存款到账速度</span>
                            </p>
                            <span>{{randomNum}}</span>
                        </h2>
                       
                    </div>


                    <!-- payType 1=无二维码 2=有二维码 -->
					<div v-show="baseInfoData.payType === 2" class="right">
						<h3>
                            <p><span>二维码</span>（点击右侧二维码下载图片）</p>
                            <span>下载后请勿私自保存二维码以防过期</span>
                        </h3>
						<img :src="baseInfoData.payImg" alt="">
						<!-- <a>下载二维码</a> -->
					</div>
				</div>
			</div>
			<div class="deposit-info">
				<h2 class="title">填写存款信息</h2>
				<ul>
					<li>
						<span class="must">存款金额</span>
						<input name="money" type="tel" @keyup="validateRegExp()" v-model="postData.depositMoney" placeholder="请输入存款金额" >
					</li>
					<div class="money-chinese">{{depositMoneyChinese}}</div>

					<li class="pk-1px-b">
						<span class="must">存款人姓名</span>
						<input name="inAccount" type="text" v-model="postData.realName" placeholder="请输入存款人姓名">
					</li>
					<li class="pk-1px-b">
						<span class="must">存款时间</span>
						<input name="inTime" @click="showDateTimePicker" type="text" v-model="postData.depositTime"
							    readonly placeholder="请选择时间">
						<i class="iconfont icon-qb-time"></i>
					</li>

					<li>
						<span>备注</span>
						<input type="number" v-model.number="postData.remark" placeholder="可输入订单号后四位">
					</li>
				</ul>
			</div>
			
			<div class="tip">
				<div class="hint">
					<p>温馨提示：</p>
					<p>1、公司银行账号不定期更换。请每次存款前，务必先至[公司存款]查看账号。</p>
					<p>2、在金额转出之后请务必准确填写存款信息，以便财务能够及时确认并添加金额到您的会员帐户中。</p>
					<p>3、单笔存款金额为<span>{{baseInfoData.lineDepositMin}}~{{baseInfoData.lineDepositMax}}</span>元</p>
				</div>
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
   import {LOCAL_TODAY} from '@/filter'
   import func from '@/services/deposit'
    export default {
        name: 'company',
        mounted () {
            this.getBaseInfo();
            while (true) {
                this.randomNum = parseInt(Math.random() * 10000);
                if (this.randomNum <= 9999 && this.randomNum >= 1111) {
                    return;
                }
            }
        },
        computed: {
            //金额大写要用
            depositMoney(){
                return this.postData.depositMoney;
            }
        },
        data () {
            return {	
				// dataVal: this.filterDate(new Date()),
                // isShowTime:false,
                baseInfoData: {},
                postData: {
                    depositMoney: "",
                    realName: "",
                    depositTime:  this.filterTimeStamp(new Date()),
                    remark: "",
                    orderNum: "",
                },
                depositMoneyChinese:'',//存款金额中文大写
                randomNum: '',
            }
		},
        methods: {
            showDateTimePicker() {
                if (!this.dateTimePicker) {
                    this.dateTimePicker = this.$createDatePicker({
                        title: '请选择存款时间',
                        min: LOCAL_TODAY(-1),
                        max: LOCAL_TODAY(),
                        value: new Date(this.postData.depositTime.replace(/-/g, "/")),
                        columnCount: 6,
                        onSelect: this.selectHandle,
                        onCancel: this.cancelHandle
                    })
                }
                this.dateTimePicker.show()
            },
            selectHandle(date, selectedVal, selectedText) {
                this.postData.depositTime = this.filterTimeStamp(date);
            },
            cancelHandle() {
                console.log("cancel time")
            },
            beginPicker(param) {
                this[`${param}`] = !this[`${param}`];
            },
            beginChoose(param) {
				this.postData.depositTime = param[5];
            },
            copy (msg) {
                this.$copyText(msg).then((e) => {
                    this.$toast.success('复制成功',{cover:true});
                }, (e) => {
                    this.$toast.fail('复制失败',{cover:true});
                })
            },
            getBaseInfo () {
                let loading = this.$toast.loading('加载中...');
                func.getCompanyInfo({id: this.$route.query.id * 1}).then((res) => {
                    loading.hide();
                    if(res.success){
                        this.baseInfoData = res.data;
                        this.postData.realName = res.data.realName;
                    }else {
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                })
            },
            handleDeposit () {
                let postData = {
                    setId: parseInt(this.baseInfoData.id),
                    depositAccount: this.postData.realName,
                    depositMoney: parseFloat(this.postData.depositMoney),
                    depositTime: this.filterTimeStamp(this.postData.depositTime,2),
                    remark: this.postData.remark.toString(),
                    orderCode: this.randomNum,
                }
                console.log(postData.depositTime,'postData');
                if(!this.validate(postData)) return;

                let loading = this.$toast.loading('提交中...');
                func.postCompany(postData).then((res) => {
                    loading.hide();
                     if(res.success){
                        this.$router.push({
                            name: 'paySuccess',
                            query: {
                                fromType: 2,
                                order: res.data.order,
                            }
                        })
                    }else {
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                })
            },

            validateRegExp(){
                if(this.baseInfoData.isInteger === 1){//只能输入整数
                    this.postData.depositMoney = this.postData.depositMoney.replace(/[^\d]/,'');
                }else {
                    this.postData.depositMoney = this.postData.depositMoney.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
                }
            },

            validate(postData){
                if (!postData.depositMoney) {
                    this.$toast.fail('请输入存款金额',{cover:true});
                    return false;
                }else if (postData.depositMoney * 1  > this.baseInfoData.lineDepositMax || postData.depositMoney * 1  < this.baseInfoData.lineDepositMin) {
                    this.$toast.fail(`存款金额为${this.baseInfoData.lineDepositMin}-${this.baseInfoData.lineDepositMax}`,{cover:true});
                    return false;
                }else if(!postData.depositAccount){
                    this.$toast.fail('请输入存款人姓名',{cover:true});
                    return false;
                }else if(!postData.depositTime){
                    this.$toast.fail('请选择存款时间',{cover:true});
                    return false;
                }
                // else if(postData.depositTime > this.dataVal){
                //     this.$toast.fail('存款时间不能大于当前时间',{cover:true});
                //     return false;
                // }
                else if(postData.remark){
                    if(!/^\d{4}$/.test(postData.remark)){
                        this.$toast.fail('备注请输入4位数字',{cover:true});
                        return false;
                    }else{
                        return true;
                    }
                }else {
                    return true;
                }
            }
        },
        watch:{
            depositMoney(newVal,oldVal){
                this.depositMoneyChinese = this.filterAmount(newVal * 1);
            }
        }

	}
</script>

<style lang="scss" scoped>
	.company-alipay {
		.content {
			padding-bottom: 2.80rem;
			.deposit-account {
                .title {
					height: 1.06667rem /* 80/75 */;
					line-height: 1.06667rem /* 80/75 */;
					padding-left: .4rem /* 30/75 */;
					font-size: .34667rem /* 26/75 */;
                    color: $tip-color;
                    font-weight:400;
				}
				.deposit-account-box {
					padding: .32rem /* 24/75 */ .4rem /* 30/75 */;
					background: $default-color;
					// display: flex;
					// justify-content: space-between;
					.left {
						h2 {
                            line-height: 2;
                            font-weight: 400;
                            height:1.46667rem /* 110/75 */;
                            line-height:1.46667rem /* 110/75 */;
                            display:flex;
                            justify-content: space-between;
							p {
                                font-size: .42667rem /* 32/75 */;
								color: $tip-color;
								display: inline-block;
                                span {
                                    display: block;
                                    line-height: 1.5;
                                    font-size: .29333rem /* 22/75 */;
                                    color:$label-color;
                                }
							}
							span {
								display: inline-block;
								font-size: .42667rem /* 32/75 */;
								color: $text-color;
								i {
									font-size: .42667rem /* 32/75 */;
									margin-left: .13333rem /* 10/75 */;
								}
                            }
                            &.remark{
                                line-height: 2;
                                padding: .34667rem /* 26/75 */ 0;
                            }
						}
						h3 {
							line-height: 1.5;
							color: $label-color;
                            font-size: .32rem /* 24/75 */;
                            font-weight:400;
							
						}
					}
					.right {
						display: flex;
                        justify-content: space-between;
                        padding-top:0.26666rem;
						h3 {
                           
							font-size: 0.3466rem;
							color: $text-color;
                            text-align: left;
                            font-weight:400;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            p{
                                color:$tip-color;
					            font-size: .34rem /* 26/75 */;
                                span{
					                font-size: .42667rem /* 32/75 */;
                                }
                            }
                            span{
                                color:$label-color;
                                font-size: .29333rem /* 22/75 */;
                            }
						}
						img {
							width: 1.4933333rem;
							height: 1.4933333rem;
							display: block;
						}
						a {
							font-size: .32rem /* 24/75 */;
							color: $color-x;
							text-decoration: underline;
							text-align: center;
						}
					}
				}
			}
			.deposit-info {
				.title {
					height: 1.06667rem /* 80/75 */;
					line-height: 1.06667rem /* 80/75 */;
					padding-left: .4rem /* 30/75 */;
					font-size: .34667rem /* 26/75 */;
                    color: $tip-color;
                    font-weight:400;
				}
				ul {
                    background: transparent;
					.money-chinese{
						text-align: right;
                        padding-right: .4rem;
                        height:0.9333rem;
                        line-height:0.9333rem;
                        font-size:0.34rem;
                        color:$text-color;
					}
					li {
                        padding-left:.4rem /* 30/75 */;
					    background: $default-color;
						margin-left: 0;
						padding-right: .4rem /* 30/75 */;
						height: 1.4666rem /* 110/75 */;
						line-height:1.4666rem /* 110/75 */;
						display: flex;
						justify-content: space-between;
                        font-size: 0.42rem /* 32/75 */;
                        color:$tip-color;
						span {
							flex: 3;
						}
						i {
							font-size: 0.5rem;
							color: $color-P;
							vertical-align: middle;
						}
						input {
							flex: 7;
							text-align: right;
							border: none;
                            color: $text-color;
                            font-size: 0.42rem /* 32/75 */;
						}
						input::-webkit-input-placeholder {
							color: $color-P;
							font-size: 0.42rem /* 32/75 */;
						}
					}
				}
			}
		}
		.deposit-info {
			.title {
				height: 1.06667rem /* 80/75 */;
				line-height: 1.06667rem /* 80/75 */;
				padding-left: .4rem /* 30/75 */;
				font-size: .42667rem /* 32/75 */;
				color: $text-color;
			}
			ul {
				background: $default-color;
				li {
					margin-left: .4rem /* 30/75 */;
					padding-right: .4rem /* 30/75 */;
					height: 1.06667rem /* 80/75 */;
					line-height: 1.06667rem /* 80/75 */;
					display: flex;
					justify-content: space-between;
					font-size: .37333rem /* 28/75 */;
					position: relative;
					span {
                        flex: 3;
                        font-weight:400;
					}
					i {
						font-size: .37333rem /* 28/75 */;
						color: $color-P;
						vertical-align: middle;
					}
					input {
						flex: 7;
						text-align: right;
						border: none;
						color: $text-color;
					}
					input::-webkit-input-placeholder {
						color: $color-P;
                        font-size: .32rem /* 24/75 */;
                        font-weight:400;
					}
					i.error-icon {
						position: absolute;
						right: 0;
						font-size: .4rem /* 30/75 */;
						color: $color-a;
					}

				}
			}
		}
		.error-hint {
			font-size: .32rem /* 24/75 */;
			color: $color-a;
			padding-left: .4rem /* 30/75 */;
			height: .8rem /* 60/75 */;
			line-height: .8rem /* 60/75 */;
		}
		.tip {
			padding: .4rem /* 30/75 */;
            background: $default-bg-color;
			.hint {
				margin-top: .26667rem /* 20/75 */;
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
</style>


