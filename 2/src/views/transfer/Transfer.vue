<template>
	<div class="transfer">
        <nut-navbar class="pk-title" @on-click-back="$router.go(-1)" @on-click-more="back('index')">
			<a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../assets/img/my-icon/fanhui.png"/>
			</a>
			额度转换
            <a class="backIdex" slot="more-icon" >
                <img class="imgsbank" src="../../assets/img/my-icon/backIndex.png"/>
            </a>
		</nut-navbar>
		<div class="transfer-fixed">
			<div class="pk-trans-type">
				<h2 @click="isShowTransType = true"><span>转换方式</span><i>?</i></h2>
				<div>
					<nut-radiogroup v-model="freeWalletSwitch">
						<nut-radio class="my-radio"  v-for="item in transType" :key="item.value" :label="item.value">{{item.key}}
						</nut-radio>
					</nut-radiogroup>
				</div>

				<div v-show="isShowTransType" @click="isShowTransType = false;">
					<div class="mask" @touchmove.self.prevent></div>
					<div class="mask-box">
						<div class="mask-box-title"><span>钱包说明</span>
							<!-- <nut-icon @click.native="isShowTransType = false;" size="0.4rem" type="cross">
							</nut-icon> -->
						</div>
						<div class="mask-box-content">
							<img src="../../assets/img/purse_type.png" alt="">
						</div>
					</div>
				</div>
			</div>

			<div class="total-asset-info">
				<div class="total-money-num">
					<span>总资产</span>
					<i>{{moneyInfo.balance | currency('',2)}}</i>
				</div>
				<div class="total-money-num">
					<span>钱包余额</span>
					<i>{{moneyInfo.walletBalance | currency('',2)}}</i>
				</div>
			</div>

			<div class="btn">
				<div @click="allTransfer()">一键归户</div>
				<div @click="refresh()">一键刷新</div>
				<div v-show="freeWalletSwitch === 2" @click="getFastSettingInfo()">设置快捷转入</div>
			</div>

			<div v-show="date" class="money-synchronise">
				<span>资金已完成同步：</span>
				<i>{{date | filterDate}}</i>
			</div>
		</div>
		<div class="all-items" v-if="!isShowSkeleton && list.length > 0">
			<nut-row  :gutter="0.5">
				<nut-col  :span="8" v-for="(item,index) in list" :key="index">
					<div class="flex-content">
						<p class="item-name">
							<span>{{item.textName}}</span>
							<i class="iconfont icon-wallet-refresh" @click="refresh(item.textName)" v-show="freeWalletSwitch === 1"></i>
							<i  @click="handleConversion(2,item)" v-show="freeWalletSwitch === 2">转入</i>
						</p>
						<b class="item-num">
							<span>{{item.value | currency('',2)}}</span>
							<i :class="{'disabled':item.value<=0}" @click="handleConversion(1,item)" v-show="freeWalletSwitch === 2">转出</i>
						</b>
					</div>
				</nut-col>

			</nut-row>
        </div>
        
        <div class="all-items" v-show="isShowSkeleton">
            <div class="skeleton vue-skeleton-loading">
                <div class="skeleton-bac-animation"></div>
                <div class="skeleton-bac-content">
                    <row padding="0.2rem  0 0 0 ">
                        <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                        <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                        <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                    </row>
                    <row padding="0.2rem  0 0.2rem 0 ">
                        <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                        <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                        <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                    </row>
                    <row padding="0.2rem  0 0.2rem 0 ">
                        <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                        <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                        <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                    </row>
                </div>
            </div>
        </div>

        


		<!--额度转换弹框 -start -->
		<nut-dialog
				title="额度转换"
				customClass="pk-dialog-transfer"
				:visible="isShowTransInOrOut"
				:lockBgScroll="true"
                :closeOnClickModal="false"
                :noFooter="true"
                @close="isShowTransInOrOut=false"
                >
			<div class="title pk-1px-b">
				<span>{{doType === 2?'系统余额':transInfo.text}}</span>
				<span>{{doType === 2?'转入':'转出'}}</span>
				<span>{{doType === 2?transInfo.text:'系统余额'}}</span>
			</div>
			<div class="money">
				<div class="label">{{doType === 2?'转入':'转出'}}金额</div>
				<div class="money-input">
					<div class="num">
						<input type="tel" maxlength="10" :placeholder="doType === 2?'请输入转入金额':'请输入转出金额'" v-model.number="transferAmount">
						<span>.00</span>
					</div>

				</div>
			</div>
			<p class="in-money-chinese">{{moneyChinese}}</p>


			<nut-row class="fast-money" :gutter="5">
				<nut-col :span="6"
						 v-for="(item,index) in fastMoneyArr"
						 :key="index"
						 :class="{'active':fastMoneyIndex === index}"
						 @click.native="handleFast(index)">
					<div class="fast-money-item"
					>{{item}}元</div>
				</nut-col>

			</nut-row>

            <div class="btns">
                <div class="sure" @click="transferSubmit()">确认转换</div>
                <div class="cancel" @click="isShowTransInOrOut=false">取消</div>
            </div>


		</nut-dialog>
        <!--额度转换弹框 -end -->
        

                <!-- 设置快捷转入弹框 -start -->
        <div v-show="popupQuick" class="quickBox">
            <div class="quickCont">
                <div class="title">设置快捷转入</div>
                <div class="input">
                    <div class="input-top pk-1px-b">
                        <div class="input-left">快捷转入比例</div>
                        <div class="input-right"><input maxlength="3" type="tel" v-model="balanceRatio"
                                                        placeholder="请输入正整数">%
                        </div>
                    </div>
                    <div class="input-bottom pk-1px-b">
                        <div class="input-left">当天首次</div>
                        <div class="input-right">
                            <nut-switch :active.sync="dayFirst"></nut-switch>
                        </div>
                    </div>
                </div>
                <p>
                    *设置比例后，每次进入游戏直接按照所设置余额比例自动 转入游戏中；
                    <br> *勾选“当天首次”，为当天首次进入游戏时按余额比例转入， 随后进入不再自动转入。
                </p>
                <div class="button">
                    <div class="button-right">
                        <button @click="saveFastSetting" type="button">保存设置</button>
                    </div>

                    <div class="button-left">
                        <button @click="cancelFastSetting" type="button">取消</button>
                    </div>
                    
                </div>
            </div>
            <div class="box-mask" @click="cancelFastSetting"></div>
        </div>
        <!-- 设置快捷转入弹框 -end -->


	</div>

</template>

<script>
    import func from '@/services/deposit';

    export default {
        name: "transfer",
        data () {
            return {
                moneyInfo:{
                    balance:0,
                    walletBalance:0
                },
                date:'',
                transType: [{key: '免转钱包', value: 1}, {key: '多钱包', value: 2}],
                freeWalletSwitch:0,//选择的模式 1=免转钱包 2=多钱包；
                isShowTransType: false,//钱包说明
                isShowTransInOrOut:false,//转入转出
                list: [],
                fastMoneyArr: [1000, 500, 200, 100],
                fastMoneyIndex:'',
                transferAmount:'',//转入转出金额
                moneyChinese:'',//转入,转出金额中文大写

                doType:2,//2=转入 1=转出
                transInfo:{},
                isShowSkeleton:true,
                balanceRatio: 0, //系统余额比例
                dayFirst: false, //当天首存 1选中 2未选中
                popupQuick: false, //是否显示设置快捷转入


            }
        },
        mounted(){
            this.getNoAutoTransferInfo();
        },
		methods:{
            getNoAutoTransferInfo(type){
                func.getNoAutoTransferInfo().then((res)=>{
                    if(res.success){
                        if(res.data){
                            this.isShowSkeleton = false;
                            this.freeWalletSwitch = res.data.autoPay?1:2;
                            this.list = res.data.select;
                            this.moneyInfo = {
                                balance:res.data.balance,//总资产
                                walletBalance:res.data.walletBalance//钱包余额
                            }
                            this.date = new Date();
                            if(type){
                                this.$toast.success('刷新成功!',{cover:true});
                            }
                        }
                    }else {
                        this.list = [];
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                })
            },
            //一键回归
            allTransfer(){
                let self = this;
                this.$dialog({
                    id:'dialog_back',
                    lockBgScroll:true,
                    closeOnClickModal:false,
                    textAlign:'left',
                    title: "温馨提示",
                    content:"您确定将所有视讯余额转出到系统吗？",
                    customClass:'pk-dialog',
                    onOkBtn() {
                        let loading = this.$toast.loading('提交中...');
                        func.recoveryById().then((res) => {
                            loading.hide();
                            if(res.success){
                                self.$toast.success('转出成功',{cover:true});
                                self.getNoAutoTransferInfo();
                            }else {
                                self.$toast.fail(res.message,{cover:true,duration:4000});
                            }
                            this.close(); //关闭对话框
                        })
                    },
                });
			},
            //快捷选择转换金额
            handleFast (index) {
                this.fastMoneyIndex = index;
                this.transferAmount = this.fastMoneyArr[index];
			},
            back(path) {
                this.$router.push({
                    name: path
                });
            },
			//转入 转出
            handleConversion(doType,item){
                this.doType = doType;
                this.transInfo = item;
                this.reset();

                //转出 金额为0就不弹出框
                if(doType === 1){
                    this.isShowTransInOrOut = item && item.value>0;
                }else {
                    this.isShowTransInOrOut = true;
                }
			},
            transferSubmit(){
                let postData = {
                    transferAmount:this.transferAmount
                };
                if(this.doType === 1){//转出
                    postData.transferOut = this.transInfo.textName;
                    postData.transferOutId = this.transInfo.texId;
                }else {
                    postData.transferInto = this.transInfo.textName;
                    postData.transferIntoId = this.transInfo.texId; 

                }
                
                if(!postData.transferAmount){
                    this.$toast.fail('请输入转换金额',{cover:true});
                    return;
                }
                if(/\D/.test(postData.transferAmount)){
                    this.$toast.fail('转换金额必须是数字',{cover:true});
                    return;
                }

                if(this.doType === 1){
                    if(postData.transferAmount < 0 || postData.transferAmount>this.transInfo.value){
                        this.$toast.fail(`转出金额范围0-${this.transInfo.value}`,{cover:true});
                        return;
                    }
                }else {
                    if(postData.transferAmount < 0 || postData.transferAmount > this.moneyInfo.walletBalance){
                        this.$toast.fail(`转入金额范围0-${this.moneyInfo.walletBalance}`,{cover:true});
                        return;
                    }
                }

                let loading = this.$toast.loading('提交中...');
                func.transfersMoney(postData).then((res) => {
                    loading.hide();
                    if(res.success){
                        this.$toast.success('转换成功',{cover:true});
                        this.isShowTransInOrOut=false;
                        this.getNoAutoTransferInfo();
                        this.reset();
                    }else {
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                })

            },

            reset(){
                this.transferAmount = '';
                this.fastMoneyIndex = '';
            },

            refresh(apiId){
                if(apiId){//单个刷新
                    let loading = this.$toast.loading('刷新中...');
                    func.refreshApi({
                        apiId
                    }).then((res) => {
                        loading.hide();
                        if(res.success){
                            this.list.map((item,index) => {
                                if(res.data.apiName === item.textName){
                                    item.value = res.data.balance;
                                }
                            })
                            this.$toast.success('刷新成功',{cover:true});
                        }else {
                            this.$toast.fail(res.message,{cover:true,duration:4000});
                        }
                    })
                }else {
                    this.getNoAutoTransferInfo(2);
                }
			},
            changeTransType(newVal){
                let loading = this.$toast.loading('切换中...');
                func.postTransferModeChange({
                        freeWalletSwitch: newVal
                    }).then((res) => {
                        loading.hide();
                    if(res.success){
                        this.$toast.success(`${newVal === 1? '免转钱包' : '多钱包'}切换成功`,{cover:true});
                    }else {
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                })
            },
             //获取快捷转入设置信息
            getFastSettingInfo () {
                this.popupQuick = true;
                func.getFastSettingInfo().then((res) => {
                    if(res.success){
                        this.balanceRatio = res.data.balanceRatio;
                        this.dayFirst = res.data.dayFirst === 1;
                    }else{
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                   
                })
            },
            //取消设置快捷转入
            cancelFastSetting () {
                this.popupQuick = false;
                this.dayFirst = false;
                this.balanceRatio = 0;
            },
            //保存快捷转入设置
            saveFastSetting () {
                let reg = /^([0-9]\d?|100)$/;
                if (!reg.test(this.balanceRatio)) {
                    this.$toast.text('请输入0-100的正整数',{cover:true});
                    return;
                }
                let postData = {
                    dayFirst: this.dayFirst ? 1 : 2,//当天首存 1选中 2未选中
                    balanceRatio: this.balanceRatio * 1,
                }
                func.postFastSetting(postData).then((res) => {
                    if(res.success){
                        this.popupQuick = false;
                        this.$toast.success('设置成功',{cover: true});
                    }else {
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                })
            },
		},
        
        watch: {
            freeWalletSwitch (newVal, oldVal) {
               if(newVal != oldVal && oldVal!=0){
                    this.changeTransType(newVal);
				}
            },
            transferAmount(newVal,oldVal){
				this.moneyChinese = this.filterAmount(newVal * 1);
            },
            popupQuick(newVal,oldVal){
                if (newVal) {
                    this.ModalHelper.open();
                } else {
                    this.ModalHelper.close();
                }
            },
            isShowTransType(newVal,oldVal){
                 if (newVal) {
                    this.ModalHelper.open();
                } else {
                    this.ModalHelper.close();
                }
            }
        },
    }
</script>

<style scoped lang="scss">

    /deep/.nut-switch.nut-switch-active {
        border: 1px solid $primary-color;
        background: $primary-color;
        .nut-switch-btn{
          //  border: 1px solid $primary-color;
            background: #fff;
        }
    }
    .nut-switch.nut-switch-base{
        border: 1px solid #DADADA;
        .nut-switch-btn{
            border: none !important;
        }
    } 
    .nut-switch .nut-switch-btn{
        border: none !important;
    }
	.my-radio {
		font-size: 0.37rem;
		line-height: 1.07rem;
        color: $tip-color;
		/deep/ input {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='20' height='15' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 8l2.5-2.5 5 4.5 10-9.5L20 3 8 15H7z' fill='%23FFF' fill-rule='evenodd'/%3E%3C/svg%3E");
        background-color: #DADADA;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 60%;
			width: 0.45rem;
			height: 0.45rem;
        }
        /deep/input:checked{
                background-color: #488bfe !important;
        }
		/deep/ .nut-radio-label {
			font-size: 0.37rem;
			margin-right: 0.27rem;
        }
    }
	/deep/ .nut-radiogroup {
		display: inline-block;
		margin-left: .4rem;
	}

	.transfer-fixed {
		position: fixed;
		top: 1.17rem;
		left: 0;
		width: 100%;
	}

	.pk-trans-type {
		background: $default-bg-color;
		height: 1.06667rem;
		line-height: 1.06667rem;
		padding-left: .4rem;
		h2 {
			display: flex;
			justify-content: center;
			align-items: center;
			float: left;
			font-size: 0.43rem;
			color: $tip-color;
			font-weight: 400;
			i {
				display: inline-block;
				width: 0.37333rem;
				height: 0.37333rem;
				line-height:1;
				text-align: center;
				font-style: normal;
				border-radius: 50%;
				border: 1px solid #ff8d3a;
				color: #ff8d3a;
				margin-left: 0.13333rem;
                cursor: pointer;
                font-weight: normal;
                font-size: 0.38rem;
			}
		}
	}
.fast-money{
    width: 95%;margin: 0 auto;
}
	.total-asset-info {
		width: 100%;
		height: 1.95rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		padding: 0.37rem 0;
		border-bottom: 1px solid $border-color;
		background-color: $default-color;
		.total-money-num {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			span {
				color: $primary-color;
				font-size: 0.35rem;
			}
			i {
				color: $primary-color;
				font-size: 0.43rem;
				font-style: normal;
				font-weight: 500;
			}
			&:last-child {
				border-left: 1px solid $border-color;
				span {
					color: #0ec392;
				}
				i {
					color: #0ec392;
				}
			}
		}
	}

	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		div {
			width: 50%;
			height: 1.20rem;
			line-height: 1.20rem;
			text-align: center;
			font-size: 0.43rem;
			color: $default-color;
			background: $primary-color;
            &:nth-child(2){
                background:#0ec392;
            }
			&:last-child {
				background: #af72fb;
			}

		}
	}

	.money-synchronise {
		height: 1.20rem;
		background-color: #F7F7F7;
		color: $normal-color;
		font-size: 0.35rem;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid $border-color;
		font-size: 0.32rem;
		i {
			font-style: normal;
		}
	}

	.all-items {
        /deep/.nut-row{
            display: flex;
            flex-wrap: wrap;
        }
		padding-top: 5.45rem;
		.flex-content {
            text-transform:uppercase;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
			padding: 0.27rem 0.29rem;
			border-right: 1px solid $border-color;
			border-bottom: 1px solid $border-color;
			background: $default-color;

			.item-name {
				width: 100%;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-start;
				margin-bottom: 0.27rem;
				span {
					color: $text-color;
					flex: 1;
					padding-right: 10px;
					font-size: 0.32rem;
				}
				i.icon-wallet-refresh {
					font-size: 0.40rem;
					vertical-align: middle;
				}
				i {
					font-style: normal;
					color: $primary-color;
				}
			}
			.item-num {
				color: $text-color;
				font-weight: normal;
				font-size: 0.32rem;
				width: 100%;
				display: flex;
				justify-content: space-between;
				i {
					font-style: normal;
					color: #0ec392;
					&.disabled{
						color:$placeholder-color;
						cursor: not-allowed;
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
		background: $nondefault-color;
		opacity: .7;
		z-index: 2;
	}

	.mask-box {
		position: fixed;
		z-index: 3;
		top: 50%;
		transform: translateY(-50%);
		width: 92%;
		opacity: 1;
		.mask-box-title {
			height: 1.07rem;
			line-height: 1.07rem;
			background: $primary-color;
			border-radius: 0.27rem 0.27rem 0 0;
			padding: 0 .4rem;
			font-size: 0.43rem;
			color: $default-color;
			display: flex;
            justify-content: center;
            letter-spacing: .08rem /* 6/75 */;
			.close {
				border-radius: 0 0 .13333rem /* 10/75 */
				.13333rem /* 10/75 */
			;
				line-height: 1.06667rem /* 80/75 */
			;
				text-align: center;
				color: $text-color;
				font-size: .32rem /* 24/75 */
			;
				width: 1rem;
				text-align: center;
				margin-right: -.4rem;
			}
		}

		.mask-box-content {
			padding: .4rem;
			background: $default-color;
			border-radius: 0 0 0.27rem 0.27rem;
			img {
				width: 100%;
				display: block;
			}
		}

	}



    .quickBox {
        z-index: 999;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        .quickCont {
            z-index: 1000;
            position: fixed;
            top: 50%;
            left: 50%;
            margin: 0 auto;
            width: 9.2rem;
            color: $default-color;
            background-color: $default-color;
            border-radius: 0.133rem;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            overflow: hidden;
            .title {
                padding: 0 0.4rem;
                height: 1.33333rem;
                line-height: 1.2rem;
                font-weight: bold;
                font-size: 0.427rem;
                color: $default-color;
                text-align:center;
                background:$primary-color;
                letter-spacing: .08rem /* 6/75 */;
            }
            .input {
                padding: 0 0.4rem;
                background-color: $default-color;
                .input-top,
                .input-bottom {
                    display: -webkit-flex;
                    display: flex;
                    -webkit-box-pack: justify;
                    justify-content: space-between;
                    height: 1.46667rem /* 110/75 */;
                    line-height: 1.46667rem /* 110/75 */;
                    overflow: hidden;
                    .input-left {
                        font-size: .42667rem /* 32/75 */;
                        color: $tip-color;
                    }
                    .input-right {
                        font-weight: bold;
                        font-size: .42667rem /* 32/75 */;
                        color: $primary-color;
                        display: flex;
                        align-items: center;
                        input {
                            border: 0;
                            text-align: right;
                            font-size: .42667rem /* 32/75 */;
                        }
                        input::-webkit-input-placeholder {
                            color: $label-color;
                            font-size: .42667rem /* 32/75 */;
                        }
                        .mint-switch {
                            margin-top: 0.213rem;
                            width: 1.333rem;
                            height: 0.64rem;
                        }
                    }
                }
            }
            p {
                padding: 0.24rem 0.4rem;
                line-height: 1.5;
                font-size: .29333rem /* 22/75 */;
                color: $tip-color;
            }
            .button {
                display: -webkit-flex;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding:0 0.4rem;
                .button-left,
                .button-right {
                    button {
                        width:100%;
                        display: block;
                        margin: 0 auto;
                        height: 1.06667rem /* 80/75 */;
                        font-size: .48rem /* 36/75 */;
                        color: $color-J;
                        border-radius: 0.133rem;
                        border: 0;
                        margin-bottom:0.4rem;
                        background: $default-color;
                        border:1px solid $primary-color;
                        color: $primary-color;
                        letter-spacing: .08rem /* 6/75 */;
                    }
                }
                .button-right {
                    button {
                        background-color: $primary-color;
                        color: $default-color;

                    }
                }
            }
        }
    }
</style>