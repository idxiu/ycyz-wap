<template>
    <div class="moneyWater">
        <Header rooter="-1" title="现金流水" :hasNoBack="true" iFontsize=".58667rem"></Header>
    
        <!-- 选择方式 -->
        <mt-popup :closeOnClickModal="true" :position="'bottom'" v-model="popupVisible" style="width: 100%;z-index: 2003;">
            <div class="popup-title pk-1px-b">
                <span @click="cancel()">取消</span>
                <span>选择交易方式</span>
                <span @click="sure()">确定</span>
            </div>
            <mt-picker valueKey="name" :itemHeight="itemHeight" :slots="slots" @change="onValuesChange"></mt-picker>
        </mt-popup>
    
        <!-- 选择时间 -->
        <mt-popup :closeOnClickModal="true" :position="'bottom'" v-model="popupVisibleTime" style="width: 100%;z-index: 2003;">
            <div class="popup-title pk-1px-b">
                <span @click="cancel()">取消</span>
                <span>请选择时间</span>
                <span @click="sure()">确定</span>
            </div>
            <mt-picker valueKey="value" :itemHeight="itemHeight" :slots="slotsTime" @change="onValuesChangeTime"></mt-picker>
        </mt-popup>
    
        <div class="content">
            <div class="content-fixed">
                <div class="title">
                    <p>
                        <span>方式</span>
                        <button @click="popupVisible = true">{{chooseTypeShow.name}}</button>
                    </p>
                    <p>
                        <span>时间</span>
                        <button @click="popupVisibleTime = true">{{chooseTimeShow.value}}</button>
                    </p>
                </div>
                <div v-show="list&&list.length>0" class="list">
                    <dl>
                        <!-- 全部交易 -->
                        <dt class="pk-1px-b">
                                    <span v-show="chooseTypeShow.value === 1">交易方式</span>
                                    <span v-show="chooseTypeShow.value != 1">{{chooseTypeShow.name}}</span>
        
                                    <span v-show="chooseTypeShow.value === 1">交易金额</span>
                                    <span v-show="chooseTypeShow.value === 2 || chooseTypeShow.value === 3">存款金额</span>
                                    <span v-show="chooseTypeShow.value === 4">取款金额</span>
                                    <span v-show="chooseTypeShow.value === 5">转换金额</span>
                                    <span v-show="chooseTypeShow.value === 6">注单金额</span>
                                </dt>
                    </dl>
                </div>
            </div>
    
            <div v-show="list.length>0" class="page-loadmore">
                <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                    <pk-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :top-all-loaded="topAllLoaded" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange" ref="loadmore" :stop-translate="stopTranslate">
                        <ul>
                            <li class="pk-1px-b" v-for="(item,index) in list" :key="index">
                                <h2>
                                    <span>{{item.sourceTypeName}}</span>
    
                                    <span v-show="item.doType === 2" class="fail">-{{item.doMoney}}(优惠{{item.disMoney}})</span>
                                    <span v-show="item.doType === 1" class="success">+{{item.doMoney}}(优惠{{item.disMoney}})</span>
                                </h2>
                                <p>
                                    <span>订单号：{{item.orderId}}</span>
                                    <span>{{item.createTime | filterDate('MM-DD HH:mm')}}</span>
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
                    <p>暂无数据哦~~</p>
                </div>
            </div>
    
        </div>
    </div>
</template>

<script>
    import pkLoadmore from '@/components/Loadmore'
    import Header from '@/components/Header'
    import func from '@/api/purse'    
    export default {
        name: 'moneyWater',
        components: {
            Header,
            pkLoadmore
        },
        mounted() {
            this.chooseTypeShow = this.slots[0].values[0];
            this.chooseTimeShow = this.slotsTime[0].values[1];
            this.getList();
        },
        data() {
            return {
                popupVisible: false,
                popupVisibleTime: false,
                itemHeight: parseInt(this.HTML_FONT_SIZE * 1.06667),
    
    
                slots: [{
                    flex: 1,
                    values: [
                        {
                            value: 0,
                            name: '全部'
                        },
                        {
                            value: 1,
                            name: '公司入款'
                        },
                        {
                            value: 2,
                            name: '线上入款'
                        },
                        {
                            value: 3,
                            name: '额度转换'
                        },
                        {
                            value: 4,
                            name: '人工存入'
                        },
                        {
                            value: 5,
                            name: '人工取出'
                        },
                        {
                            value: 7,
                            name: '系统取消出款'
                        },
                        {
                            value: 8,
                            name: '线上取款'
                        },
                        {
                            value: 9,
                            name: '自助优惠'
                        },
                        {
                            value: 10,
                            name: '优惠活动'
                        },
                        {
                            value: 12,
                            name: '会员返佣'
                        },
                        {
                            value: 13,
                            name: '红包优惠'
                        },
                        {
                            value: 14,
                            name: '返水优惠'
                        },
                        {
                            value: 15,
                            name: '返水冲销'
                        },
                        {
                            value: 16,
                            name: '返佣冲销'
                        },
                        {
                            value: 17,
                            name: '自助返水'
                        },
                        {
                            value: 18,
                            name: 'PK体育下注'
                        },
                        {
                            value: 19,
                            name: 'PK体育派彩'
                        },
                        {
                            value: 20,
                            name: 'PK彩票下注'
                        },
                        {
                            value: 21,
                            name: 'PK彩票派彩'
                        },
                        {
                            value: 22,
                            name: '莱利彩票下注'
                        },
                        {
                            value: 23,
                            name: '莱利彩票派彩'
                        },
                        {
                            value: 24,
                            name: 'EG电子下注'
                        },
                        {
                            value: 25,
                            name: 'EG电子派彩'
                        },
                        {
                            value: 26,
                            name: 'EG棋牌下注'
                        },
                        {
                            value: 27,
                            name: 'EG棋牌派彩'
                        },
                        // {
                        //     value: 28,
                        //     name: '入款监控'
                        // },
                        {
                            value: 29,
                            name: '会员导入'
                        },
                        {
                            value: 30,
                            name: '注册优惠'
                        },
                    ],
                    defaultIndex: 0,
                    textAlign: 'center'
                }],
                slotsTime: [{
                    flex: 1,
                    values: this.APP_CONFIG.constant.timerDrop,
                    defaultIndex: 1,
                    textAlign: 'center'
                }],
                chooseType: {},
                chooseTypeShow: {},
                chooseTime: {},
                chooseTimeShow: {},
    
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
        methods: {
            onValuesChange(picker, values) {
                this.chooseType = values[0];
            },
            onValuesChangeTime(picker, values) {
                this.chooseTime = values[0];
            },
            cancel() {
                this.popupVisible = false;
                this.popupVisibleTime = false;
                this.hasData = false;//解决我是有底线和暂无数据同时显示
            },
            sure() {
                this.popupVisible = false;
                this.popupVisibleTime = false;
                this.chooseTypeShow = this.chooseType;
                this.chooseTimeShow = this.chooseTime;
                this.page = 1;
                this.getList();
                this.hasData = false;//解决我是有底线和暂无数据同时显示
            },
            getList(t) {
                let postData = {
                    pageParams:{
                        page: this.page,
                        pageSize: this.pageSize,
                    },
                    operateType: this.chooseType.value,
                    timeType: this.chooseTime.key,
                }
                console.log(postData)
                func.getMoneyWater(postData).then((res) => {
                    // console.log(res)
                    let result = res.memberCashRecord;
                    result.map((v1, i1) => {
                        this.slots[0].values.map((v2) => {
                            if (v1.sourceType === v2.value) {
                                result[i1]['sourceTypeName'] = v2.name;
                            }
                        })
                    })
                    // console.log(result);
                    this.totalNum = res.totalNum;
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
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                });
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
    @import url('../../../components/less/common.less');
    .no-data {
        padding: 0 .4rem/* 30/75 */
        ;
        position: fixed;
        top: 1.22667rem/* 92/75 */
        ;
        left: 0;
        right: 0;
        .no-data-box {
            margin-top: 2.13333rem/* 160/75 */;
            text-align: center;
            i{
                font-size: 2.53333rem /* 190/75 */;
                color: @color-w;
                opacity: .6;
            }
            p {
                text-align: center;
                font-size: .42667rem/* 32/75 */
                ;
                color: @color-w;
                margin-top: .26667rem/* 20/75 */
                ;
            }
            button {
                width: 100%;
                height: 1.06667rem/* 80/75 */
                ;
                line-height: 1.06667rem/* 80/75 */
                ;
                color: @color-default;
                text-align: center;
                border: none;
                border-radius: .13333rem/* 10/75 */
                ;
                font-size: .37333rem/* 28/75 */
                ;
                background: @color-primary;
                box-shadow: 0px 2px 5px 0px @color-rgab-black;
                margin-top: .53333rem/* 40/75 */
                ;
                &:active {
                    background: @color-primary-active;
                }
            }
            button.look {
                margin-top: .4rem/* 30/75 */
                ;
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
            top: 1.22667rem/* 92/75 */
            ;
            left: 0;
            right: 0;
            z-index: 1;
        }
        .title {
            display: flex;
            align-items: center;
            height: 1.06667rem/* 80/75 */
            ;
            background: @color-default;
            padding-left: .4rem/* 30/75 */
            ;
            p {
                display: inline-block;
                span {
                    font-size: .37333rem/* 28/75 */
                    ;
                    color: @color-primary;
                }
                button {
                    margin-left: .13333rem/* 10/75 */
                    ;
                    color: @color-primary;
                    border: 1px solid @color-primary;
                    padding: .08rem/* 6/75 */
                    .26667rem/* 20/75 */
                    ;
                    background: @color-default;
                    border-radius: .13333rem/* 10/75 */
                    ;
                    font-size: .32rem/* 24/75 */
                    ;
                }
                &:last-child {
                    margin-left: .57333rem/* 43/75 */
                    ;
                    button {
                        padding: .08rem/* 6/75 */
                        .6rem/* 45/75 */
                        ;
                    }
                }
            }
        }
        .list {
            margin-top: .26667rem/* 20/75 */
            ;
            dl {
                padding: 0 .4rem/* 30/75 */
                ;
                background: @color-default;
                dt {
                    display: flex;
                    justify-content: space-between;
                    padding: .32rem/* 24/75 */
                    0;
                    span {
                        font-size: .42667rem/* 32/75 */
                        ;
                        color: @color-C;
                    }
                }
            }
        }
        .page-loadmore {
            position: fixed;
            top: 3.62667rem/* 272/75 */
            ;
            left: 0;
            right: 0;
            ul {
                background: @color-default;
                padding: 0 .4rem/* 30/75 */
                ;
                li {
                    padding: .33333rem/* 25/75 */
                    0;
                    h2 {
                        display: flex;
                        justify-content: space-between;
                        span {
                            font-size: .37333rem/* 28/75 */
                            ;
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
                        margin-top: .26667rem/* 20/75 */
                        ;
                        display: flex;
                        justify-content: space-between;
                        span {
                            font-size: .32rem/* 24/75 */
                            ;
                            color: @color-M;
                        }
                    }
                }
            }
        }
    }
</style>