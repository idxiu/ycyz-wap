<template>
    <div class="more-tab">
        <div class="popup">
            <div class="popup-name">视讯</div>
            <div class="popup-btn">
                <input @click="popupVisible = true" readonly v-model="chooseMainVal.name" type="text" placeholder="全部">
            </div>
            <div class="popup-name">时间</div>
            <div class="popup-btn">
                <input @click="popupTime = true" readonly v-model="chooseTimeVal.value" type="text" placeholder="今天">
            </div>
        </div>
        <div v-if="list.length != 0" class="order-list">
            <div class="order-list-title pk-1px-b">
                <div class="left">名称</div>
                <div class="right">盈利</div>
                <div class="right">可赢</div>
                <div class="right">投注</div>
            </div>
        </div>
        <div v-if="list.length != 0" class="order-list">

            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <pk-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :top-all-loaded="topAllLoaded" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange" ref="loadmore" :stop-translate="stopTranslate">
                    <ul>
                        <li class="pk-1px-b" @click="toggle(directvideos)" v-for="directvideos in list" :key="directvideos.id">
                            <div class="top clearfix">
                                <div class="text-dots left">{{directvideos.productName}}</div>
                                <div class="text-dots right winlose">{{directvideos.statusName?directvideos.statusName:'未结算'}}</div>
                                <div class="text-dots right">{{directvideos.betAll}}</div>
                                <div class="text-dots right">{{directvideos.win}}</div>
                            </div>
                            <div class="center clearfix">
                                <div class="left"></div>
                            </div>
                            <div class="bottom clearfix">
                                <div class="text-dots left">注单号：{{directvideos.orderId}}</div>
                                <div class="text-dots right">{{directvideos.betTime|filterDate}}</div>
                                <div class="text-dots right">{{directvideos.periodsOrTable}}期</div>
                            </div>
                            <div class="noteShow clearfix" v-show="directvideos.show">
                                <!-- <div class="details position">
                                                <div class="details-tit">盈亏：</div>
                                                <div class="details-cont">{{directvideos}}</div>
                                            </div>
                                            <div class="details clearfix">
                                                <div class="details-tit">桌号：</div>
                                                <div class="details-cont">{{directvideos}}</div>
                                            </div> -->
                                <div class="details clearfix">
                                    <div class="details-tit">游戏明细：</div>
                                    <div class="details-cont">{{directvideos.betDetail}}</div>
                                </div>
                            </div>
                            <div class="arrowIcon iconfont icon-order-moreinfo fs-10" v-bind:class="{'up':directvideos.show,'down':!directvideos.show}"></div>
                        </li>
                    </ul>
                <div class="nodata" v-show="hasData">我是有底线的</div>
            </pk-loadmore>
        </div>

        </div>
        <div v-else-if="list.length === 0" class="no-data">
            <div class="no-data-img">
                <i class="iconfont icon-list-zanwusj"></i>
            </div>
            <p class="no-data-text">当前还没有投注记录</p>
        </div>
        <mt-popup :closeOnClickModal="true" :position="'bottom'" v-model="popupVisible" style="width: 100%;z-index: 2003;">
            <div class="popup-title pk-1px-b">
                <span @click="cancelGame()">取消</span>
                <span></span>
                <span @click="sureGame()">确定</span>
            </div>
            <mt-picker :itemHeight="itemHeight" valueKey="name" :slots="mainType" @change="onGameValuesChange"></mt-picker>
        </mt-popup>
        <mt-popup :closeOnClickModal="true" :position="'bottom'" v-model="popupTime" style="width: 100%;z-index: 2003;">
            <div class="popup-title pk-1px-b">
                <span @click="cancelTime()">取消</span>
                <span></span>
                <span @click="sureTime()">确定</span>
            </div>
            <mt-picker :itemHeight="itemHeight" valueKey="value" :slots="mainTimeType" @change="onTimeValuesChange"></mt-picker>
        </mt-popup>
    </div>
</template>

<script>
    import {
        getDrop,
        lotteryList
    } from "@/api/Order";
    import pkLoadmore from '@/components/Loadmore'

    export default {
        name: "lottery",
        components:{
            pkLoadmore,
        },
        data() {
            return {
                popupVisible: false,
                popupTime: false,
                chooseMain: '',
                chooseMainOld: '',
                chooseTime: {
                    key: 2,
                    name: "今天"
                },
                chooseTimeOld: '',
                chooseMainVal:{
                    value:''
                },
                chooseTimeVal: {
                    key:2
                },
                mainType: [{
                    flex: 1,
                    values: [],
                    className: 'mainType',
                    textAlign: 'center'
                }],
                mainTimeType: [{
                    flex: 1,
                    values: this.APP_CONFIG.constant.timerDrop,
                    className: 'mainType',
                    textAlign: 'center'
                }],

                allLoaded: false,
                topAllLoaded:false,
                topStatus: '',
                bottomStatus: '',
                wrapperHeight: 0,
                stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
                hasData: false,
    
                page: 1, //当前页数
                pageSize: 10, //每页请求的条数
                list: [],
                totalNum: 0,
            }
        },
        created() {
            this.itemHeight = parseInt(this.HTML_FONT_SIZE * 1.06667);
        },
        mounted() {
            this.getDrop();
            this.getList();
        },
        methods: {
            toggle(directvideos) {
                directvideos.show = !directvideos.show;
            },
            getDrop() {
                getDrop(2)
                    .then(res => {
                        // console.log(res);
                        res.betType.unshift({
                            name: "全部",
                            value: ""
                        });
                        this.mainType[0].values = res.betType;
                    })
                    .catch(err => {
                        this.$toast({
                            message: err,
                            duration: 2000
                        });
                    });
            },
            getList(t) {
                lotteryList(2, this.chooseTimeVal.key , this.chooseMainVal.value , this.page, this.pageSize, '')
                    .then(res => {
                        // console.log(res.BetReportInfo, "res");
                        if (res.BetReportInfo.length > 0) {
                            res.BetReportInfo.map(v => {
                                v.show = false;
                            });
                            this.totalNum = res.totalNum;
                            let result = res.BetReportInfo;

                            if (this.page === 1) {
                                this.list = result;
                                if(this.totalNum < this.page * this.pageSize){
                                    this.allLoaded = true;
                                    this.topAllLoaded = true;
                                }else {
                                    this.allLoaded = false;
                                    this.topAllLoaded = false;
                                }
                            } else {
                                this.list = this.list.concat(result);
                                this.topAllLoaded = false;
                            }
                            if (t === 1) {
                                this.$toast({
                                    message: '刷新成功',
                                    duration: 2000
                                })
                            }
                            this.$nextTick(() => {
                                this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
                            })
                        } else {
                            this.list = [];
                        }
                    })
                    .catch(err => {
                        // console.log(err);
                        this.$toast({
                            message: err,
                            duration: 2000
                        });
                    });
    
            },
            //选择器
            onGameValuesChange(picker, values) {
                if (values[0]) {
                    this.chooseMain = values[0];
                }
    
            },
            cancelGame() {
                this.popupVisible = false;
            },
            sureGame() {
                this.popupVisible = false;
                if (this.chooseMainOld.value != this.chooseMain.value) {
                    this.chooseMainOld = this.chooseMain;
                    this.chooseMainVal = this.chooseMain;
                    this.getList();
                }
            },
    
    
            onTimeValuesChange(picker, values) {
                if (values[0]) {
                    this.chooseTime = values[0];
                }
            },
            cancelTime() {
                this.popupTime = false;
            },
            sureTime() {
                this.popupTime = false;
                if (this.chooseTimeOld.key != this.chooseTime.value) {
                    this.chooseTimeOld = this.chooseTime;
                    this.chooseTimeVal = this.chooseTime;
                    this.getList();
                }
            },
            //下拉刷新
            handleTopChange(status) {
                this.topStatus = status;
            },
            loadTop() {
                this.page = 1;
                this.hasData = false;
                setTimeout(() => {
                    this.getList(1);
                    this.$refs.loadmore.onTopLoaded();
                    this.allLoaded = false;
                }, 1500);
            },
            //mint-ui 上拉加载
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottom() {
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
    .more-tab{
        position: fixed;
        z-index: 2;
        top: 2.8rem;
        width: 100%;
        box-sizing: border-box;
    }
    .popup-title {
        height: 1.06667rem/* 80/75 */
        ;
        padding: 0 0.4rem/* 30/75 */
        ;
        font-size: 0.4rem/* 30/75 */
        ;
        color: @color-C;
        text-align: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
            flex: 1;
            height: 1.06667rem/* 80/75 */
            ;
            line-height: 1.06667rem/* 80/75 */
            ;
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
    

    .order-list {
        font-size: 0.427rem;
        color: @color-C;
        font-weight: 500;
        .order-list-title {
            background: @color-default;
            height: 1rem;
            line-height: 1rem;
            padding: 0 0.4rem;
            .left {
                max-width: 3.2rem;
            }
        }
        ul {
            padding: 0 0.4rem;
            background: @color-default;
            li {
                padding: 0.347rem 0 0.3rem;
                color: @color-C;
                .top {
                    font-weight: bold;
                    font-size: 0.373rem;
                    .winlose {
                        color: @color-primary;
                        font-weight: normal;
                        font-stretch: normal;
                    }
                }
                .center {
                    margin: 0.25rem 0;
                    font-size: 0.32rem;
                }
                .bottom {
                    color: @color-M;
                    .left,
                    .right {
                        font-size: 0.32rem;
                        height: 0.33rem;
                        line-height: 0.33rem;
                    }
                }
                .noteShow {
                    position: relative;
                    margin-top: 0.24rem;
                    padding: 0.2rem 0.28rem;
                    font-size: 0.32rem;
                    color: @color-J;
                    background-color: @color-R;
                    border-radius: 0.133rem;
                    .details {
                        line-height: 0.5rem;
                        .details-tit {
                            float: left;
                            width: 1.6rem;
                            text-align: right;
                        }
                        .details-cont {
                            color: @color-p;
                            float: left;
                            word-break: break-word;
                        }
                    }
                    .position {
                        position: absolute;
                        top: 0.2rem;
                        right: 0.28rem;
                    }
                }
                .arrowIcon {
                    position: absolute;
                    top: 0.933rem;
                    right: 0;
                    color: @color-x;
                    transition: all .2s;
                }
                .up {
                    transform: rotate(180deg);
                }
            }
        }
        .left {
            float: left;
            max-width: 5rem;
        }
        .right {
            float: right;
            width: 2rem;
            text-align: center;
        }
    }
    
    .no-data {
        padding-top: 0.8rem;
        text-align: center;
        i {
            font-size: 2.53333rem/* 190/75 */
            ;
            color: @color-w;
            opacity: .6;
        }
        .no-data-img {
            margin: 0 auto;
            width: 2.533rem;
            height: 2.267rem;
            img {
                width: 100%;
            }
        }
        .no-data-text {
            padding: 0.25rem 0 0.8rem;
            font-size: 0.427rem;
            color: @color-w;
        }
    }
    
    .popup {
        margin: 0.267rem 0;
        padding: 0 0.4rem;
        height: 1rem;
        line-height: 1rem;
        font-size: 0.32rem;
        color: @color-primary;
        background-color: @color-default;
        .popup-name {
            float: left;
            font-size: 0.373rem;
        }
        .popup-btn {
            float: left;
            margin: 0 0.5rem 0 0.13rem;
            input {
                width: 1.8rem;
                height: 0.64rem;
                text-align: center;
                line-height: 0.64rem;
                background-color: @color-default;
                border-radius: 0.133rem;
                border: solid 0.027rem @color-primary;
                ;
                color: @color-primary;
                &::-webkit-input-placeholder {
                    color: @color-primary;
                }
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
</style>