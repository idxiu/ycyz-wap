<template>
	<div class="capitalrecord">
        <nut-navbar class="pk-title" 
        @on-click-back="$router.go(-1)" @on-click-more="back('index')">
            <a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png"/>
			</a>
            <a class="backIdex" slot="more-icon" >
                <img class="imgsbank" src="../../../assets/img/my-icon/backIndex.png"/>
            </a>
            <div class="chooseTit" @click="chooseTable()">
				{{tableText}}
                <i class="kailong"></i>
			</div>
            <nut-actionsheet :is-visible="tabtype" 
                @close="switchActionSheet('tabtype')"
                :menu-items="tabItems"
                :chooseTagValue="tableText"
                cancelTxt="取消"
                @choose="chooseTablelist">
            </nut-actionsheet>
        </nut-navbar>
        <div v-show="loading" class="skeleton vue-skeleton-loading">
            <div class="skeleton-bac-animation"></div>
            <column>
                <skeleton-square 
                    width="9rem" 
                    height="1rem"
                    :count="9" 
                    margin="0.2rem 0.5rem"
                ></skeleton-square>
            </column>
        </div>
        <div v-show="!loading" class="searchBox">
            <div v-show="cashflow" class="flex-content" @click="choosecapital()">
                方式:
                <span class="input-drop">
                    <span class="text">{{capitaltext}}</span>
                    <i class="kailong"></i>
                </span>
            </div>
            <div class="flex-content" @click="choosetime()">
                时间:
                <span class="input-drop">
                    <span class="text">{{timetext}}</span>
                    <i class="kailong"></i>
                </span>
            </div>
            <nut-actionsheet :is-visible="capitaltype" 
                @close="switchActionSheet('capitaltype')"
                :menu-items="menuItems"
                :optionTag="`value`"
                :chooseTagValue="capitaltext"
                cancelTxt="取消"
                @choose="chooseItem">
            </nut-actionsheet>
            <nut-actionsheet :is-visible="timetype" 
                @close="switchActionSheet('timetype')"
                :menu-items="timeItems"
                :chooseTagValue="timetext"
                cancelTxt="取消"
                @choose="chooseTimes">
            </nut-actionsheet>
        </div>

        <!--列表数据展示 -start -->
        <!--paddingTop 用来动态计算上面层级高度，这里是可以动态改变滴-->
        <div v-show="!loading" class="generalizeLink-list table" :style="{paddingTop:paddingTop+'rem'}">

            <div v-show="listData.length > 0" class="page-loadmore">
            <!-- :style="{ height: wrapperHeight + 'px' }" -->
                <div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px'}" ref="wrapper">
                    <pk-loadmore :top-method="loadTop" :bottom-method="loadBottom" 
                    :bottom-all-loaded="allLoaded" :top-all-loaded="topAllLoaded" 
                    @top-status-change="handleTopChange" 
                    @bottom-status-change="handleBottomChange" ref="loadmore" 
                    :stop-translate="stopTranslate">
                        <div @click="showMoreinfo(item)" :class="{'haveMore':haveMore}" v-for="(item, index) of listData" :key="index" class="nut-vert-list-item tableList">
                            <nut-row class="nut-scroller-item-info" type="flex" justify="space-between" flexWrap="nowrap">
                                <nut-col :span="12">
                                    <div class="flex-content name"><span>{{item.transactionTypeName}}</span>
                                        <span v-show="haveMore && tableNumber===3" class="stateicon" :class="{'processing':item.status===1 || item.status===3,'success':item.status===2 || item.status===6,'fail':item.status===4 || item.status===5}">{{item.statusName}}</span>
                                        <span v-show="haveMore && tableNumber===2 || tableNumber ===1" class="stateicon" :class="{'processing':item.status===1,'success':item.status===2,'fail':item.status===3 || item.status===4}">{{item.statusName}}</span>
                                    </div>
                                    <div v-show="cashflow" class="flex-content order">{{item.orderId}}</div>  
                                    <div v-show="!cashflow" class="flex-content order hidden">订单号:{{item.orderId}}</div>
                                </nut-col>
                                <nut-col :span="12">
                                    <div class="flex-content money" :class="{'red':item.transactionMoney>0,'green':item.transactionMoney<=0}">{{item.transactionMoney}}
                                        <span v-show="item.discount+item.otherDiscount>0 && item.sourceType !=8">(优惠:{{item.discount+item.otherDiscount}})</span>
                                        <span v-show="item.feeMoney+item.expeneseMoney>0 && item.sourceType ===8">(费用:{{item.feeMoney+item.expeneseMoney}})</span>
                                    </div>
                                    <div class="flex-content time">{{item.createTime | filterDate}}</div>
                                </nut-col>
                            </nut-row>
                        </div>
                        <div class="noMoredata" v-show="hasData">我是有底线的</div>
                    </pk-loadmore>
                </div>
            </div>
            <no-data v-show="listData.length == 0" class="no-data-box"></no-data>
        </div>
        <!--列表数据展示 -end -->
        <!-- 查看详情弹框 -->
        <div v-show="haveMorepop" class="dialogbox popmoreBox">
            <div class="positionFixed dialog-mask"></div>
            <div class="positionFixed">
                <div class="popmoreContent">
                    <div class="title">详情
                        <span class="closebox" @click="haveMorepop = false;">
                            <nut-icon type="cross" color="#fff" size="0.4rem">
                            </nut-icon>
                        </span>
                    </div>
                    <div class="popmore-content">
                        <ul v-show="details.sourceType === 8">
                            <li class="clearfix">
                                <div class="left">类型</div>
                                <div class="right"><h1>取款</h1></div>
                            </li>
                            <li class="clearfix">
                                <div class="left">订单号</div>
                                <div class="right">{{details.orderId}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">提出额度</div>
                                <div class="right red">{{details.withdrawalMoney}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">费用</div>
                                <div class="right" :class="{'red':details.feeMoney + details.expeneseMoney>0,'green':details.feeMoney + details.expeneseMoney<=0}">{{details.feeMoney + details.expeneseMoney}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">出款金额</div>
                                <div class="right red">{{details.transactionMoney}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">取款时间</div>
                                <div class="right">{{details.createTime | filterDate}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">状态</div>
                                <div class="right">{{details.statusName}}</div>
                            </li>
                            <li class="clearfix remark">
                                <div>备注</div>
                                <div class="remarktxt">{{details.remark}}</div>
                            </li>
                        </ul>
                        <ul v-show="details.sourceType === 2 || details.sourceType === 1">
                            <li class="clearfix">
                                <div class="left">类型</div>
                                <div class="right"><h1>{{details.sourceType===1?'公司入款':'线上入款'}}</h1></div>
                            </li>
                            <li class="clearfix">
                                <div class="left">订单号</div>
                                <div class="right">{{details.orderId}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">存入机构</div>
                                <div class="right">{{details.merchat}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">存入金额</div>
                                <div class="right red">{{details.transactionMoney}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">存款优惠</div>
                                <div class="right" :class="{'red':details.discount>0,'green':details.discount<=0}">{{details.discount}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">额外优惠</div>
                                <div class="right" :class="{'red':details.otherDiscount>0,'green':details.otherDiscount<=0}">{{details.otherDiscount}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">存款时间</div>
                                <div class="right">{{details.createTime | filterDate}}</div>
                            </li>
                            <li class="clearfix">
                                <div class="left">状态</div>
                                <div class="right" :class="{'processing':details.status===1,'green':details.status===2,'red':details.status===3 || details.status===4}">{{details.statusName}}</div>
                            </li>
                            <li class="clearfix remark">
                                <div>备注</div>
                                <div class="remarktxt">{{details.remark}}</div>
                            </li>
                        </ul>
                    </div>
                    
                </div>

            </div>
        </div>
        
	</div>
</template>

<script>
    import moment from 'moment'
    import {
        getTransactionType,
        getTransactionList,
        getConversions,
        getWithdrawList,
        getDeposits
    } from "@/services/moneyRecord.js";
    import pkLoadmore from '@/components/Loadmore';	
	import noData from "@/components/NoData.vue";
    export default {
        name: "capitalrecord",
        components: {
            pkLoadmore,
			noData
        },
        data () {
            return {
                fromType: this.$route.query.fromType * 1 || '',
                loading: false,
                cashflow: false,//是否为现金流水
                tabtype: false,
                capitaltype: false,
                timetype: false,
                haveMore: false,
                haveMorepop: false,
                tableText:'资金记录',
                capitaltext: '所有',
                timetext: '今天',
                startDate:'',
                endDate: '',
                timeItems: [
                    {
                        'name': '最近两小时',
                        'value': 0
                    },
                    {
                        'name': '今天',
                        'value': 1
                    },
                    {
                        'name': '本周',
                        'value': 2
                    },
                    {
                        'name': '本月',
                        'value': 3
                    },
                    {
                        'name': '上月',
                        'value': 4
                    }
                ],
                tabItems:[
                    {'name': '资金记录','value': 0},
                    {'name': '公司入款','value': 1},
                    {'name': '线上入款','value': 2},
                    {'name': '取款','value': 3},
                    {'name': '额度转换','value': 4}
                ],
                tableNumber: 0,//当前选择的页面
                menuItems: [],
                transactionType: 0,//现金流水类型
                listData: [],
                details: '',
                isdeposit:false,
                stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
                allLoaded: false,
                topAllLoaded: false,
                topStatus: '',
                bottomStatus: '',
                wrapperHeight: 0,
				paddingTop:this.getPaddingTop(),
                page: 1, //当前页数
                pageSize: 10, //每页请求的条数
                totalNum: 0, //总页数
                hasData: false,
			}
        },
        mounted () {
            this.today();
            this.getRouteQuery(this.fromType);
			this.paddingTop = this.getPaddingTop();
        },
        methods: {
            getRouteQuery(item){
                /* fromType -- 1 公司入款 2 线上入款 3 取款，4 额度转换 */
                if(item == ''){
                    this.tabSwitch(0);
                }else{
                    this.tableText = this.tabItems[item].name;
                    this.tabSwitch(item);
                }
            },
            switchActionSheet(param) {
                this[`${param}`] = !this[`${param}`];
            },
            showMoreinfo(item){//详情
                if(this.haveMore){
                    this.haveMorepop = true;
                    this.details = item
                }
            },
            tabSwitch (index, event) {
                this.loading = true;
                if(event===1){
                    this.listData = [];
                }
                //1.公司入款，2.线上入款，3.取款，4.额度转换
                switch (index) {
                    case 0:
                    //现金流水方式
                        this.haveMore = false;
                        getTransactionType().then(res => {
                            if (res.success) {
                                this.menuItems = res.data;
                                this.menuItems.unshift({id: 0, value: "所有"});
                                this.capitaltext = res.data[0].value;
                            } else {
                                this.$toast.fail(res.message, {
                                    cover: true,
                                    duration: 1000
                                });
                            }
                        });
                        this.getransList(this.transactionType,event);
                        this.cashflow = true;
                        break;
                    case 1:
                        this.haveMore = true;
                        this.getOtherList(1,event);
                        this.cashflow = false;
                        break;
                    case 2:
                        this.haveMore = true;
                        this.getOtherList(2,event);
                        this.cashflow = false;
                        break;
                    case 3:
                        this.haveMore = true;
                        this.getOtherList(3,event);
                        this.cashflow = false;
                        break;
                    case 4:
                        this.haveMore = false;
                        this.getOtherList(4,event);//额度转换
                        this.cashflow = false;
                        break;
                }
            },
            choosecapital(){//类型选择
                this.capitaltype = true;
            },
            choosetime(){//时间选择
                this.timetype = true;
            },
            chooseTable(){//head选择
                this.tabtype = true;
            },
            chooseTablelist(item){
                this.page = 1;
                this.hasData = false;
                this.tableText = item.name;
                this.tableNumber = item.value*1;
                this.tabSwitch(this.tableNumber);
            },
            chooseItem(item) {
                this.capitaltext = item.value;
                this.transactionType = parseInt(item.id);
                this.page = 1;
                this.hasData = false;
                this.getransList(this.transactionType)
            },
            chooseTimes(item) {
                this.page = 1;
                this.hasData = false;
                this.timetext = item.name;
                switch(item.value){
                    case 0:
                        this.yesterday()
                        break;
                    case 1:
                        this.today()
                        break;
                    case 2:
                        this.week()
                        break;
                    case 3:
                        this.month()
                        break;
                    default:
                        this.lastmonth()
                }
                if(this.cashflow){
                    this.getransList(this.transactionType)
                }else{
                    this.getOtherList(this.tableNumber);
                }
            },
            back(path) {
			this.$router.push({
				name: path
			});
		},
            //列表
            getOtherList(type,t){
                let data ={
                    beginTime: Number(this.startDate),
                    endTime: Number(this.endDate),
                    page: Number(this.page),
                    pageSize: Number(this.pageSize),
                    recordType: type
                }
                //1.公司入款，2.线上入款，3.取款，4.额度转换
                switch(type){
                    case 1:
                        getDeposits(data).then(res => {
                            if (res.success) {
                                let list = [];
                                this.totalNum = res.data.count;
                                if(res.data.depositsRecord){
                                    res.data.depositsRecord.forEach(v => {
                                        list.push({
                                            transactionTypeName: '公司入款',
                                            orderId: v.order,
                                            transactionMoney: v.depositAmount,//存款金额
                                            createTime: v.depositTime,
                                            status: v.status,
                                            statusName: v.statusName,
                                            remark: v.remark,
                                            otherDiscount: v.otherDiscount,
                                            discount: v.depositDiscount,
                                            sourceType: v.depositType,//资金记录类型
                                            merchat: v.merchat,//商户名称
                                        })
                                    });
                                }else{
                                    list = []
                                }
                                this.rendering(list,t);
                            } else {
                                this.$toast.fail(res.message, {
                                    cover: true,
                                    duration: 1000
                                });
                            }
                        });
                        break;
                    case 2:
                        getDeposits(data).then(res => {
                            if (res.success) {
                                let list = [];
                                this.totalNum = res.data.count;
                                if(res.data.depositsRecord){
                                    res.data.depositsRecord.forEach(v => {
                                        list.push({
                                            transactionTypeName: '线上入款',
                                            orderId: v.order,
                                            transactionMoney: v.depositAmount,//存款金额
                                            createTime: v.depositTime,
                                            status: v.status,
                                            statusName: v.statusName,
                                            remark: v.remark,
                                            otherDiscount: v.otherDiscount,
                                            discount: v.depositDiscount,
                                            sourceType: v.depositType,//资金记录类型
                                            merchat: v.merchat,//商户名称
                                        })
                                    });
                                }else{
                                    list = []
                                }

                                this.rendering(list,t);
                            } else {
                                this.$toast.fail(res.message, {
                                    cover: true,
                                    duration: 1000
                                });
                            }
                        });
                        break;
                    case 3:
                        getWithdrawList(data).then(res => {
                            if (res.success) {
                                let list = [];
                                this.totalNum = res.data.count;
                                if(res.data.withdrawal){
                                    res.data.withdrawal.forEach(v => {
                                        list.push({
                                            transactionTypeName: '取款',
                                            orderId: v.orderId,
                                            transactionMoney: v.outwardMoney,
                                            createTime: v.createTime,
                                            status: v.outStatus,
                                            discount: v.favourableMoney,
                                            statusName: v.statusName,
                                            remark: v.remark,
                                            withdrawalMoney: v.withdrawalMoney,
                                            feeMoney: v.feeMoney,//手续费
                                            expeneseMoney: v.expeneseMoney,//行政费用
                                            sourceType: v.sourceType//取款的资金记录类型
                                        })
                                    });
                                }else{
                                    list = []
                                }

                                this.rendering(list,t);
                            } else {
                                this.$toast.fail(res.message, {
                                    cover: true,
                                    duration: 1000
                                });
                            }
                        });
                        break;
                    default:
                        getConversions(data).then(res => {
                            if (res.success) {
                                let list = [];
                                this.totalNum = res.data.count;
                                if(res.data.conversion){
                                    res.data.conversion.forEach(v => {
                                        list.push({
                                            transactionTypeName: v.converSionName,
                                            orderId: v.orderId,
                                            transactionMoney: v.transMoney,
                                            createTime: v.createTime,
                                            sourceType: v.sourceType//取款的资金记录类型
                                        })
                                    });
                                }else{
                                    list = []
                                }
                                this.rendering(list,t);
                            } else {
                                this.$toast.fail(res.message, {
                                    cover: true,
                                    duration: 1000
                                });
                            }
                        });
                }
            },
            getransList(item,t){
                let data ={
                    beginBetTime: Number(this.startDate),
                    endBetTime: Number(this.endDate),
                    transactionType: [item],
                    page: this.page,
                    pageSize: this.pageSize
                }
                if(item ===0){
                    data.transactionType = []
                }
                getTransactionList(data).then(res => {
                    if (res.success) {
                        let list = [];
                        if(res.data.fundListApps){
                            res.data.fundListApps.forEach(v => {
                                list.push({
                                    transactionTypeName: v.transactionTypeName,
                                    orderId: v.remark,
                                    transactionMoney: v.transactionMoney,
                                    createTime: v.createTime,
                                    otherDiscount: v.otherDiscount,
                                    discount: v.discount,
                                    sourceType: v.transactionType
                                })
                            });
                        }else{
                            list = []
                        }
                        this.totalNum = res.data.totalCount;
                        this.rendering(list,t);
                        this.loading = false;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            rendering(result,t){
                if (this.page === 1) {
                    this.listData = result;
                    if (this.totalNum < this.page * this.pageSize) {
                        this.allLoaded = true;
                        this.topAllLoaded = true;
                    } else {
                        this.allLoaded = false;
                        this.topAllLoaded = false;
                    }
                } else {
                    this.listData = this.listData.concat(result);
                    this.topAllLoaded = false;
                }
                if (t === 1) {
                    this.$toast.text('刷新成功');
                }
                this.$nextTick(() => {
                    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
                    this.paddingTop = this.getPaddingTop();
                })
                this.loading = false;
            },
            //下拉刷新
            //动态计算 层级哪里的高度
            getPaddingTop(){
                //92是header的固定高度
                return (this.$(".generalizeLink-top").height()+92) / 75;
			},
            handleTopChange (status) {
                this.topStatus = status;
            },
            loadTop () {
                this.page = 1;
                this.hasData = false;
                setTimeout(() => {
                    this.tabSwitch(this.tableNumber,1);
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
                    this.tabSwitch(this.tableNumber);
                    this.$refs.loadmore.onBottomLoaded();
                    if (this.page * this.pageSize >= this.totalNum) {
                        this.allLoaded = true; //所有数据加载完成
                        this.hasData = true;
                        this.topAllLoaded = false;
                    }
                }, 1500);
            },
            // 今日
            today() {
                var today = moment().subtract('days', 0).format('YYYY-MM-DD')
                this.startDate = Date.parse(today + ' 00:00:00')/1000
                this.endDate = Date.parse(today + ' 23:59:59')/1000
            },
            // 最近2小时
            yesterday() {
                this.startDate = Date.parse(moment().subtract('h', 2).format('YYYY-MM-DD HH:mm:ss'))/1000
                this.endDate = Date.parse(moment().subtract('days', 0).format('YYYY-MM-DD HH:mm:ss'))/1000
            },
            // 本周
            week() {
                let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
                let start = moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD') // 周一日期
                let end = moment().add(6 - weekOfday + 1, 'days').format('YYYY-MM-DD') // 周日日期
                this.startDate = Date.parse(start + ' 00:00:00')/1000
                this.endDate = Date.parse(end + ' 23:59:59')/1000
            },
            // 本月
            month() {
                const startDate = moment().subtract('month', 0).format('YYYY-MM') + '-01'
                const endDate = moment().subtract('days', 0).format('YYYY-MM-DD HH:mm:ss')
                this.startDate = Date.parse(startDate + ' 00:00:00')/1000
                this.endDate = Date.parse(endDate)/1000
            },
            // 上月
            lastmonth() {
                var start= moment().subtract('month', 1).format('YYYY-MM') + '-01'
                var end = moment(start).subtract('month', -1).add('days', -1).format('YYYY-MM-DD')
                this.startDate = Date.parse(start + ' 00:00:00')/1000
                this.endDate = Date.parse(end + ' 23:59:59')/1000
            },
        }
    }
</script>

<style scoped lang="scss">
.capitalrecord{
    background-color: $default-color;
    .chooseTit{
        position: relative;
        .kailong{
            position: absolute;
            top: 0.475rem;
            right: 1.346667rem;
            border-top-color: $default-color;
        }
    }
    .searchBox{
        padding: 0 $four;
        height: 1.2rem;
        line-height: 1.2rem;
        .flex-content{
            float: left;
            margin-right: $twentyrem;
            color: $tip-color;
            .input-drop{
                position: relative;
                padding: $tenrem/2 $seventrem $tenrem/2 $tenrem;
                border: $onerem solid $border-color;
                border-radius: $onerem*3;
                color: $text-color;
                font-size: 0.32rem;
                i{
                    position: absolute;
                    top: 50%;
                    right: 0.2rem;
                    margin-top: -0.11rem;
                }
            }
        }
        /deep/ .nut-actionsheet-panel{
            .nut-actionsheet-menu{
                height: 5.4rem;
                overflow-y: scroll;
            }
        }
    }
    .table{
        position: absolute;
        top: 2.57rem;
        z-index: 3;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        .page-loadmore-wrapper{
            overflow-y: scroll;
            padding: 0 .4rem /* 30/75 */;
            background: $default-color;
            /*解决ios上滑动不流畅*/
            -webkit-overflow-scrolling: touch;
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .tableList{
            background-color: $default-color;
            border-bottom: $onerem solid $bet-record-bdr;
            /deep/ .nut-col{
                padding: $font12 $four;
                line-height: $fourtrem/2;
                font-size: .346667rem;
                font-weight: normal;
                color: $label-color;
                &:nth-child(2){
                    text-align: right;
                }
                .order{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow:ellipsis;
                }
                .name,.money{
                    margin-bottom: $tenrem;
                    font-size: .426667rem;
                    color: $text-color;
                }
                .name{
                    position: relative;
                    .stateicon{
                        display: inline-block;
                        margin-left: 0.4rem;
                        padding: 0 0.2rem;
                        height: 0.4rem;
                        text-align: center;
                        line-height: 0.4rem;
                        border-radius: 0.2rem;
                        font-size: 0.24rem;
                        color: $default-color;
                    }
                    .success{
                        background: $success-color;
                        color: $default-color !important;
                    }
                    .fail{
                        background: $fail-color;
                        color: $default-color !important;
                    }
                    .processing{
                        background: $processing-color;
                        color: $default-color !important;
                    }
                }
            }
        }
        .haveMore{
            background: $default-color;
        }
    }
    .popmoreBox{
        .popmoreContent{
            position: fixed;
            left: 50%;
            top: 50%;
            -webkit-transform: translate(-50%,-50%);
            transform: translate(-50%,-50%);
            width: 9rem;
            height: 11rem;
            border-radius: 0.14rem;
            overflow: hidden;
            .title{
                position: relative;
                width: 100%;
                height: 1.3rem;
                line-height: 1.3rem;
                text-align: center;
                font-size: 0.42666rem;
                color: $default-color;
                background: $primary-color;
                .closebox{
                    position: absolute;
                    top: 0;
                    right: 0.2rem;
                    color: $default-color;
                }
            }
            .popmore-content{
                height: 9.7rem;
                background: $default-color;
                overflow-y: scroll;
                /*解决ios上滑动不流畅*/
                -webkit-overflow-scrolling: touch;
                &::-webkit-scrollbar {
                    display: none;
                }
                ul{
                    padding: 0 0.4rem;
                    li{
                        line-height: 1.2rem;
                        font-size: 0.32rem;
                        color: $tip-color;
                        border-bottom: $onerem solid $border-color;
                        .left{
                            float: left;
                        }
                        .right{
                            float: right;
                            font-size: 0.373rem;
                            color: $text-color;
                        }
                    }
                    li.remark{
                        .remarktxt{                  
                            line-height: 0.4rem;
                            word-wrap:break-word
                        }
                    }
                }
            }
        }
    }
    
    .noData{
        padding: 1rem 0;
        margin: 1rem auto;
        p{
            font-size: 0.4rem;
            text-align: center;
        }
    }
    .green{
        color: $green-color !important;
    }
    .red{
        color: $color-a !important;
    }
    .processing{
        color: $yellow-color !important;
    }
}

/*向下三角形*/
.kailong{
	width:0;
	height:0;
	border-right:0.2rem solid transparent;
	border-left:0.2rem solid transparent;
	border-top:0.22rem solid $text-color;
}
</style>