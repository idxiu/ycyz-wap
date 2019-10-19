<template>
    <div>
        <F-header title="银行卡管理" rooter="-1" :hasNoBack="true" :isShowHome="false">
        </F-header>
        <div class="hasbox"></div>
        <mt-popup v-model="popupVisible" position="bottom">
            <div class="cards">
                <div>
                    <div type="default" class="li pk-1px-tb" @click="setDefault()">设为默认</div>
                    <div type="default" class="li pk-1px-b" @click="popupVisible = false">取消</div>
                </div>
            </div>
        </mt-popup>
        <div class="content">
            <div class="acctCard" v-for="(item,i) in bankList" :key="i" @click="open(item)">
                <div class="bank-name">{{item.bankName}}</div>
                <div class="username">{{item.username}}</div>
                <div class="subbranch">{{item.subbranch}}</div>
                <div class="subbranch">{{item.province}} <span v-if="item.city">-{{item.city}}</span> </div>
                <div class="card">{{item.card | filterBankNum}}</div>
                <div class="acctBg dis-inb">
                    <i class="iconfont icon-bank-normal" v-show="item.isDefault === 1"></i>
                    <i class="iconfont icon-qb-bank-tongyong1 f200"></i>
                </div>
            </div>
        </div>
        <div class="contentf" v-if="bankList.length<3">
            <router-link to="/bankCardadd" tag="div" class="dntAcct">
                <div class="dntAcctBox">
                    <div class="divbox"><i class="iconfont icon-qb-bank-add f70"></i></div>
                    <p>点击添加银行卡</p>
                </div>
            </router-link>
        </div>
    </div>
</template>


<script>
    import FHeader from "../../../components/Header";
    import {
        Picker,
        Button
    } from "mint-ui";
    import {
        todoBankCard,
        bankCardList
    } from '@/api/bankCard';
    export default {
        components: {
            Picker,
            FHeader,
            Button
        },
        data() {
            return {
                bankList: [],
                itemHeight: parseInt(this.HTML_FONT_SIZE * 1.06667),
                popupVisible: false,
                chooseMainVal: "",
                chooseMain: "",
                sixId: 0,
                makeShow: false
            };
        },
    
        mounted() {
            this.hasBankMsg();
        },
        methods: {
            hasBankMsg() {
                bankCardList().then(res => {
                    console.log(res, 'res')
                    this.bankList = res.memberBankList;
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 1000
                    });
                });
            },
            open(item) {
                //如果是默认的就不能显示弹框设置
                if (item.isDefault === 1) {
                    return;
                }
                this.popupVisible = true;
                this.sixId = item.id;
            },
            setDefault() {
                todoBankCard(this.sixId).then(res => {
                    this.$toast({
                        message: '设置成功',
                        duration: 2000
                    });
                    this.popupVisible = false;
                    this.hasBankMsg();
                }).catch(err => {
                    this.popupVisible = false;
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                });
            }
        }
    };
</script>



<style lang="less" scoped>
    @import url("../../../components/less/common.less");
    .mint-popup-bottom {
        width: 100%;
    }
    
    .cards {
        width: 100%;
        padding: 0.26667rem 0;
        text-align: center;
        height: 4rem/* 300/75 */
        ;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .li {
            font-size: .37333rem/* 28/75 */
            ;
            width: 100%;
            height: 1.06667rem/* 80/75 */
            ;
            line-height: 1.06667rem;
            border-radius: 0;
            color: @color-other-m;
            background: @color-default;
        }
    }
    
    //
    .hasbox {
        width: 100%;
        height: 1.22667rem !important/* 92/75 */
        ;
    }
    
    .contentf {
        padding-left: 0.4rem/* 30/75 */
        !important;
        padding-right: 0.4rem !important;
        max-width: 100%;
        overflow: hidden;
    }
    
    .dntAcct {
        text-align: center;
        max-width: 100%;
        height: 3.06667rem/* 230/75 */
        ;
        padding-top: 0.4rem/* 30/75 */
        ;
        &:first-child {
            padding-top: 0;
        }
    }
    
    .f70 {
        font-size: .93333rem/* 70/75 */
        ;
    }
    
    .f200 {
        font-size: 2.66667rem/* 200/75 */
        ;
        color: @color-other-n;
    }
    
    .dntAcct .dntAcctBox {
        padding-top: 1.62667rem/* 122/75 */
        ;
        height: 1.01333rem/* 76/75 */
        ;
        font-size: 0.37333rem/* 28/75 */
        ;
        color: @color-J;
        border-radius: 0.06667rem/* 5/75 */
        ;
        border: 1px dashed @color-P;
        box-shadow: 0 1px 0.04rem @color-rgab-black;
        background-size: 0.8rem/* 60/75 */
        ;
        .divbox {
            margin-top: -1.01333rem/* 76/75 */
            ;
            margin-bottom: .26667rem/* 20/75 */
            ;
        }
    }
    
    .content {
        padding: 0.4rem 0.4rem/* 30/75 */
        0;
    }
    
    .acctCard {
        position: relative;
        padding: 0.4rem 0.54667rem/* 41/75 */
        ;
        background-image: linear-gradient(-90deg, @color-i 0%, @color-o 100%);
        box-shadow: 0px 2px 5px 0px @color-rgab-black;
        border-radius: 0.13333rem/* 10/75 */
        ;
        margin-bottom: 0.4rem/* 30/75 */
        ;
        color: @color-default;
        .bank-name {
            font-size: 0.48rem;
            margin-bottom: 0.2667rem;
        }
        .username {
            font-size: 0.3733rem;
            margin-bottom: 0.4rem;
        }
        .subbranch{
            font-size: 0.32rem;
            margin-bottom: 0.2667rem;
        }
        .card{
            font-size: 0.48rem;
        }
        .acctBg {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 40%;
            text-align: right;
            i.icon-qb-bank-tongyong1 {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 3.8rem;
                opacity: .2;
            }
            i.icon-bank-normal {
                position: absolute;
                font-size: 1.06667rem/* 80/75 */
                ;
                color: @color-default;
                opacity: 0.8;
                right: .26667rem/* 20/75 */
                ;
                top: -.08rem/* 6/75 */
                ;
            }
        }
        &:nth-child(2n) {
            background-image: linear-gradient(-90deg, #3064ff 0%, #6ba9ff 100%);
            box-shadow: 0px 2px 5px 0px @color-rgab-black;
        }
        &:nth-child(3n) {
            background-image: linear-gradient(-90deg, #10c3b4 0%, #2dd99e 100%);
            box-shadow: 0px 2px 5px 0px @color-rgab-black;
        }
    }
</style>
