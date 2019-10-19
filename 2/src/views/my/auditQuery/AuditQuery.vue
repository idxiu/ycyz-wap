<template>
    <div class="auditQuery">
        <nut-navbar class="pk-title" @on-click-back="$router.go(-1)"  @on-click-more="back('index')">
            <a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png"/>
			</a>
            即时稽核查询
            <a class="backIdex" slot="more-icon" >
                <img class="imgsbank" src="../../../assets/img/my-icon/backIndex.png"/>
            </a>
        </nut-navbar>
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
                        <table class="auditQuery-item-table"  cellspacing="0">
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
                    <!-- <h3>温馨提示：</h3>
                    <p>常态稽核=会员入款金额*常态稽核倍数-放宽额度</p>
                    <p>综合(优惠)稽核 = (会员入款金额+优惠) *综合稽核倍数</p>
                    <p>出款出现以下情况将会扣除一定费用：</p>
                    <p>1.未满足常态稽核将扣除入款金额<span>{{queryData.adminMoneyRate}}%</span>的行政费用。</p>
                    <p>2.未满足综合稽核将会扣除优惠金额。</p> -->
                    <!-- <p>温馨提示：</p>
                    <p>1.单笔存款金额位 <span>0.0-1000.0</span>元</p> -->
                    <h3>温馨提示：</h3>
                    <p>常态稽核=会员入款金额*常态稽核倍数</p>
                    <p>综合稽核=（会员入款金额+入款优惠金额）*综合稽核倍数+</p>
                    <p>优惠金额*相应综合稽核倍数</p>
                    <p>出款出现以下情况将会扣除一定费用：</p>
                    <p>1.未满足常态稽核将扣除入款金额<span>{{queryData.adminMoneyRate}}%</span>的行政费用。</p>
                    <p>2.未满足综合稽核将会扣除优惠金额。</p>
                </div>
            </div>
            <!--弹窗-->
            <div class="moreTextpop" v-show="moreTextpop">
                <div class="morepopBox">
                    <div class="poptit ">投注明细</div>
                    <!-- <div class="close" @click="hidePop()">
                        <i class="iconfont icon-sykszz-close"></i>
                    </div> -->
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
    import func from '@/services/deposit';
    export default {
        name: "auditQuery",
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
                let loading = this.$toast.loading('加载中...');
                func.getAuditInfo().then(res => {
                    loading.hide();
                    if(res.success){
                        this.queryData = res.data;
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
                    }else {
                        this.$toast.fail(res.message,{cover:true,duration:4000});
                    }
                })
            },
            showPop(item) {
                this.moreTextpop = true;
                this.showPopData = item;
            },
            hidePop() {
                this.moreTextpop = false;
            },
            back(path) {
			this.$router.push({
				name: path
			});
		},
        }
    };
</script>

<style lang="scss" scoped>
    .content {
        background: $default-bg-color;
        .title {
            height: 1.06667rem/* 80/75 */
            ;
            line-height: 1.06667rem/* 80/75 */
            ;
            padding-left: 0.4rem/* 30/75 */
            ;
            font-size: 0.42667rem/* 32/75 */
            ;
            color: $color-C;
        }
        .audit-details {
            margin-top: 0.2667rem;
            ul {
                background: $default-color;
                padding: 0 0.4rem/* 30/75 */
                ;
                li {
                    &:first-child{
                        border-top: none;
                    }
                    height: 1.466667rem/* 110/75 */
                    ;
                    font-size: 0.426667rem/* 32/75 */
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
                            color: $color-C;
                        }
                        a {
                            color: $color-w;
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
                    span{
                        color:$tip-color;
                    }
                    span:last-child {
                        color: $nondefault-color;
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
                        background: $color-R;
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
                                color: $color-J;
                            }
                        }
                    }
                }
            }
        }
        .isConditions {
            background: $default-color;
            // margin-top: 0.26667rem /* 20/75 */;
            // padding: 0 0.4rem /* 30/75 */;
            p {
                //   padding: 0.33333rem /* 25/75 */ 0;
                font-size: .346667rem/* 26/75 */
                ;
                line-height: 1.5;
                color: $tip-color;
                span {
                    font-size: 0.32rem/* 24/75 */
                    ;
                    color: $color-C;
                    &.red {
                        color: $color-a !important;
                    }
                    &.green {
                        color: $audit-num !important;
                    }
                    &.num {
                        font-size: 0.4267rem;
                    }
                    &.text {
                        font-size: .426667rem; /* 32/75 */
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
                    background: $primary-color;
                    color: $default-color;
                    border: none;
                    text-align: center;
                    box-shadow: 0px 2px 5px 0px $color-rgab-black;
                    &:active {
                        background: $primary-color;
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
                font-size: 0.346667rem/* 26/75 */
                ;
                color: $color-M;
                p {
                   // line-height: 1.5;
                    span {
                        color: $primary-color;
                    }
                }
                h3 {
                  //  line-height: 1.5;
                    font-size: 0.34667rem/* 26/75 */
                    ;
                }
            }
        }
    }
    
    .auditQuery-item-tab {
        padding-bottom: .4rem;
    }
    
    .auditQuery-item-table {
        margin-top: 0.2667rem;
        width: 100%;
        font-size: .293333rem;  /* 22/75  */
        border-collapse:collapse;
        border-radius: 0.1333rem;
        border: 1px solid $tab-bord;
        box-sizing: border-box;
        background: $color-R;
    }
    
    .auditQuery-item-table tr th,
    .auditQuery-item-table tr td {
        text-align: center;
        font-family: PingFangSC-Light;
        padding: 0.4rem 0;
        box-sizing: border-box;
        font-weight: normal;
        border-bottom: 1px solid $tab-bord;
        border-right: 1px solid $tab-bord;
    }
    .auditQuery-item-table thead {
        color: #666666;
    }
    .auditQuery-item-table tbody {
        color: #333333;
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
      //  font-weight: 500;
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
        background-color: $default-color;
        color: $primary-color;
    }
    
    .morepopBox .poptit {
        padding: 0 0.4rem;
        height: 1.33333rem /* 100/75 */;
        line-height: 1.33333rem /* 100/75 */;
        font-size: .42667rem /* 32/75 */;
        font-weight: 600;
        color: $default-color;
        text-align: center;
        background: $index-login-btn-bg;
        border-radius: .06667rem /* 5/75 */ .06667rem /* 5/75 */ 0 0;
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
        background: $color-rgab-black4;
    }
    
    .moreTextpop .audit-details ul {
        li {
            border-top: 1px solid $border-light;
            border-bottom: 0;
            color: $color-C;
            span:last-child {
                color: $color-C;
            }
        }
        border-bottom-left-radius: 0.1333rem;
        border-bottom-right-radius: 0.1333rem;
    }
    
    .ma-0 {
        margin: 0 !important;
    }
</style>