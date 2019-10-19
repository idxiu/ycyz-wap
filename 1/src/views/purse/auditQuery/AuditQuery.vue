<template>
    <div class="auditQuery">
        <Header rooter="-1" title="即时稽核查询" :hasNoBack="true" iFontsize=".58667rem"></Header>
        <div class="content">
            <div class="audit-details">
                <ul>
                    <li>
                        <span>稽核时间</span>
                        <span>{{queryData.startTime | filterDate('YYYY-MM-DD')}} ~ {{queryData.endTime | filterDate('YYYY-MM-DD')}}</span>
                    </li>
                    <li class="pk-1px-tb">
                        <span>存款金额</span>
                        <span>{{queryData.totalMoney}}</span>
                    </li>
                    <li class="pk-1px-tb">
                        <span>存款优惠</span>
                        <span>{{queryData.totalDepositDiscount}}</span>
                    </li>
                    <li class="pk-1px-tb">
                        <span>总实际有效投注</span>
                        <span>{{totalBetMoney}}</span>
                    </li>
                    <li class="pk-1px-tb isConditions">
                        <p v-if="ctMoney> 0">
                            需投注<span class="red num">{{ctMoney}}</span>元才能满足最后一笔常态性稽核。
                        </p>
                        <p v-if="ctMoney<= 0">
                            <span class="green text">已满足</span>最后一笔常态性稽核。
                        </p>
                    </li>
                    <li class="pk-1px-tb isConditions">
                        <p v-if="zhMoney > 0">
                            需投注<span class="red num">{{zhMoney}}</span>元才能满足最后一笔综合稽核。
                        </p>
                        <p v-if="zhMoney <=0">
                            <span class="green text">已满足</span>最后一笔综合稽核。
                        </p>
                    </li>
                    <div class="auditQuery-item-tab">
                        <table class="auditQuery-item-table">
                            <thead>
                                <tr>
                                    <th>存款时间</th>
                                    <th>存款金额</th>
                                    <th>存款优惠</th>
                                    <th>投注额</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in queryData.allData" :key="item.id">
                                    <td>{{item.startTime | filterDate('YYYY-MM-DD')}}</td>
                                    <td>{{item.preSave}}</td>
                                    <td>{{item.depositMoney}}</td>
                                    <td @click="showPop(item)">{{item.betValid}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
    
                </ul>
            </div>
            <div class="auditQuery-bottom">
                <!-- <div class="submit-btn">
                                <button class="close" @click="$router.go(-1)">确认</button>
                            </div> -->
                <div class="hint">
                    <h3>温馨提示：</h3>
                    <p>常态稽核=会员入款金额*常态稽核倍数-放宽额度</p>
                    <p>综合(优惠)稽核 = (会员入款金额+优惠) *综合稽核倍数</p>
                    <p>出款出现以下情况将会扣除一定费用：</p>
                    <p>1.未满足常态稽核将扣除入款金额<span>{{queryData.adminMoneyRate}}%</span>的行政费用。</p>
                    <p>2.未满足综合稽核将会扣除优惠金额。</p>
    
                </div>
            </div>
            <!--弹窗-->
            <div class="moreTextpop" v-show="moreTextpop">
                <div class="morepopBox">
                    <div class="poptit ">投注明细</div>
                    <div class="close" @click="hidePop()">
                        <i class="iconfont icon-sykszz-close"></i>
                    </div>
                    <div class="audit-details ma-0">
                        <ul>
                            <li>
                                <span>彩票游戏</span>
                                <span>{{showPopData.gameLottery}}</span>
                            </li>
                            <li>
                                <span>棋牌游戏</span>
                                <span>{{showPopData.gameChess}}</span>
                            </li>
                            <li>
                                <span>视讯直播</span>
                                <span>{{showPopData.gameVideo}}</span>
                            </li>
                            <li>
                                <span>电子游艺</span>
                                <span>{{showPopData.gameElectronics}}</span>
                            </li>
                            <li>
                                <span>体育赛事</span>
                                <span>{{showPopData.gameSports}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="box-mask" @click="hidePop()"></div>
            </div>
        </div>
    
    </div>
</template>

<script>
    import Header from "@/components/Header";
    import func from "@/api/purse";
    export default {
        name: "auditQuery",
        components: {
            Header
        },
        data() {
            return {
                isShowDetails: false,
                queryData: {},
                totalBetMoney: 0,
                adminMoneyNum: 0,
                depositMoney: 0,
                moreTextpop: false,
                showPopData: {},
                ctMoney: 0,
                zhMoney: 0
            };
        },
        created() {
            this.getQueryData();
        },
        watch: {
            moreTextpop(newVal, oldVal) {
                if (newVal) {
                    this.ModalHelper.open();
                } else {
                    this.ModalHelper.close();
                }
            }
        },
        methods: {
            getQueryData() {
                func
                    .getAuditInfo()
                    .then(res => {
                        console.log(res);
                        this.queryData = res;
                        if (!this.queryData) {
                            this.queryData.allData = [];
                        }
                        this.queryData.allData.map(v => {
                            console.log(v.betValid);
                            this.totalBetMoney += v.betValid * 1;
                            if (v.normal == 2) {
                                this.adminMoneyNum += v.adminMoney * 1;
                            }
                            if (v.multiple == 2) {
                                this.depositMoney += v.depositMoney * 1;
                            }
                        });
                        this.ctMoney = this.queryData.allData[this.queryData.allData.length-1].ctChaMoney || 0;
                        this.zhMoney = this.queryData.allData[this.queryData.allData.length-1].zhChaMoney || 0;
                    })
                    .catch(err => {
                        this.$toast({
                            message: err,
                            duration: 2000
                        });
                    });
            },
            showPop(item) {
                this.moreTextpop = true;
                this.showPopData = item;
            },
            hidePop() {
                this.moreTextpop = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    @import url("../../../components/less/common.less");
    .content {
        padding: 1.22667rem/* 92/75 */
        0;
        .title {
            height: 1.06667rem/* 80/75 */
            ;
            line-height: 1.06667rem/* 80/75 */
            ;
            padding-left: 0.4rem/* 30/75 */
            ;
            font-size: 0.42667rem/* 32/75 */
            ;
            color: @color-C;
        }
        .audit-details {
            margin-top: 0.2667rem;
            ul {
                background: @color-default;
                padding: 0 0.4rem/* 30/75 */
                ;
                li {
                    height: 1.06667rem/* 80/75 */
                    ;
                    font-size: 0.37333rem/* 28/75 */
                    ;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .details {
                        display: flex;
                        flex-direction: column;
                        font-size: 0.37333rem/* 28/75 */
                        ;
                        text-align: right;
                        b {
                            font-size: 0.37333rem/* 28/75 */
                            ;
                            font-weight: normal;
                            color: @color-C;
                        }
                        a {
                            color: @color-w;
                            text-decoration: underline;
                            font-size: 0.32rem/* 24/75 */
                            ;
                            margin-top: 0.26667rem/* 20/75 */
                            ;
                        }
                    }
                    &.h114 {
                        height: 1.52rem/* 114/75 */
                        ;
                    }
                    span:last-child {
                        color: @color-primary;
                    }
                }
                .details-content {
                    overflow: hidden;
                    ol {
                        margin-bottom: 0.26667rem/* 20/75 */
                        ;
                        border-radius: 0.13333rem/* 10/75 */
                        ;
                        display: flex;
                        justify-content: space-between;
                        background: @color-R;
                        li {
                            height: 2.13333rem/* 160/75 */
                            ;
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            span {
                                flex: 1;
                                width: 100%;
                                text-align: center;
                                line-height: 1.06667rem/* 80/75 */
                                ;
                                font-size: 0.37333rem/* 28/75 */
                                ;
                                color: @color-J;
                            }
                        }
                    }
                }
            }
        }
        .isConditions {
            background: @color-default;
            // margin-top: 0.26667rem /* 20/75 */;
            // padding: 0 0.4rem /* 30/75 */;
            p {
                //   padding: 0.33333rem /* 25/75 */ 0;
                font-size: 0.32rem/* 24/75 */
                ;
                line-height: 1.5;
                span {
                    font-size: 0.32rem/* 24/75 */
                    ;
                    color: @color-C;
                    &.red {
                        color: @color-a !important;
                    }
                    &.green {
                        color: @color-primary !important;
                    }
                    &.num {
                        font-size: 0.4267rem;
                    }
                    &.text {
                        font-size: 0.3733rem;
                    }
                }
            }
        }
        .auditQuery-bottom {
            overflow: hidden;
            padding: 0 0.4rem/* 30/75 */
            0.53333rem/* 40/75 */
            ;
            .submit-btn {
                margin-top: 0.4rem/* 30/75 */
                ;
                display: flex;
                justify-content: space-around;
                button {
                    height: 1.06667rem/* 80/75 */
                    ;
                    line-height: 1.06667rem/* 80/75 */
                    ;
                    border-radius: 0.13333rem/* 10/75 */
                    ;
                    background: @color-primary;
                    color: @color-default;
                    border: none;
                    text-align: center;
                    box-shadow: 0px 2px 5px 0px @color-rgab-black;
                    &:active {
                        background: @color-primary-active;
                    }
                }
                button.close {
                    width: 100%;
                    font-size: 0.48rem/* 36/75 */
                    ;
                }
            }
            .hint {
                margin-top: 0.4rem/* 30/75 */
                ;
                font-size: 0.32rem/* 24/75 */
                ;
                color: @color-M;
                p {
                    line-height: 1.5;
                    span {
                        color: @color-a;
                    }
                }
                h3 {
                    line-height: 1.5;
                    font-size: 0.34667rem/* 26/75 */
                    ;
                }
            }
        }
    }
    
    .auditQuery-item-tab {
        padding-bottom: 0.2667rem;
    }
    
    .auditQuery-item-table {
        margin-top: 0.2667rem;
        width: 100%;
        font-size: 0.32rem;
        color: @color-C;
    }
    
    .auditQuery-item-table tr th,
    .auditQuery-item-table tr td {
        text-align: center;
        padding: 0.4rem 0;
        box-sizing: border-box;
        background: @color-R;
        border-bottom: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
    }
    
    .auditQuery-item-table tr th:last-child,
    .auditQuery-item-table tr td:last-child {
        border-right: 0;
    }
    
    .auditQuery-item-table tr:last-child td {
        border-bottom: 0;
    }
    
    .auditQuery-item-table tr th:first-child {
        border-top-left-radius: 0.1333rem;
    }
    
    .auditQuery-item-table tr th:last-child {
        border-top-right-radius: 0.1333rem;
    }
    
    .auditQuery-item-table tr:last-child td:first-child {
        border-bottom-left-radius: 0.1333rem;
    }
    
    .auditQuery-item-table tr:last-child td:last-child {
        border-bottom-right-radius: 0.1333rem;
    }
    
    .auditQuery-item-table tr td:last-child {
        text-decoration: underline;
        font-weight: 500;
    }
    
    
    /*------弹窗样式------*/
    
    .moreTextpop {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;
        height: 100%;
    }
    
    .morepopBox {
        z-index: 299;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        overflow: visible;
        width: 90%;
        margin: 0 auto;
        max-width: 9.2rem;
        height: auto;
        border-radius: 0.1333rem;
        background-color: @color-default;
        color: @color-primary;
    }
    
    .morepopBox .poptit {
        padding: 0 0.4rem;
        height: 1.0667rem;
        line-height: 1.0667rem;
        font-size: 0.3733rem;
        font-weight: 500;
        color: @color-primary;
    }
    
    .morepopBox .close {
        z-index: 9;
        position: absolute;
        top: 0;
        right: 0;
        width: 1.0667rem;
        height: 1.0667rem;
        text-align: center;
        line-height: 1.0667rem;
        font-size: 0.32rem;
    }
    
    .box-mask {
        z-index: 199;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: @color-rgab-black4;
    }
    
    .moreTextpop .audit-details ul {
        li {
            border-top: 1px solid @color-W;
            border-bottom: 0;
            color: @color-C;
            span:last-child {
                color: @color-C;
            }
        }
        border-bottom-left-radius: 0.1333rem;
        border-bottom-right-radius: 0.1333rem;
    }
    
    .ma-0 {
        margin: 0 !important;
    }
</style>