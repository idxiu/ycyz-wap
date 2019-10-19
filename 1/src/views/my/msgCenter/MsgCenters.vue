<template>
    <div id="passwordmge">
        <F-header :title="title" :rooter="rooter" :hasNoBack="hasNoBack" :isShowHome="false"></F-header>
        <div class="hasbox"></div>
        <div class="hasmenu">
    
            <mt-navbar v-model="indexx">
                <mt-tab-item>
                    <div @click="goel">通知消息</div>
                </mt-tab-item>
                <mt-tab-item id="2">游戏公告</mt-tab-item>
                <mt-tab-item>
                    <div @click="goQs">问卷调查</div>
                </mt-tab-item>
            </mt-navbar>
            <!-- tab-container -->
            <div class="page-loadmore">
                <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                    <pk-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :top-all-loaded="topAllLoaded" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange" ref="loadmore" :stop-translate="stopTranslate">
                        <mt-tab-container v-model="indexx">
                            <mt-tab-container-item id="2">
                                <div class="contenerf">
                                    <div class="content cellpel cellpro">
                                        <div v-for="(item, i) in list" :key="i" @click="setValue(item)">
                                            <div class="block-tit pk-1px-b">
                                                <div class="tip-icon">
                                                    <h2 class="h2s">
                                                        {{fixmsg(item.title,16)}}
                                                    </h2>
                                                    <span class="dates">{{item.createTime | filterDate('YYYY年MM月DD日') }}</span>
                                                </div>
                                                <p class="msg">{{fixmsg(item.content,50)}}</p>
                                            </div>
                                        </div>
                                        <div class="nodata" v-show="hasData">我是有底线的</div>
                                        <message-boxer :ok="ok" :content="contentf" :timerText="timerTextf" :title="titlef"></message-boxer>
                                    </div>
                                </div>
                            </mt-tab-container-item>
                        </mt-tab-container>
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
    import FHeader from "../../../components/Header";
    import MessageBoxer from "../../../components/MessageBox";
    import pkLoadmore from "../../../components/Loadmore";
    import {
        Button,
        Navbar,
        TabItem,
        MessageBox,
        CellSwipe
    } from "mint-ui";
    import {
        setTimeout
    } from "timers";
    import {
        hasMsgNotice,
        getNoticeList
    } from "@/api/msgCenter";
    
    export default {
        components: {
            Button,
            FHeader,
            Navbar,
            MessageBox,
            MessageBoxer,
            Wipe: CellSwipe,
            TabItem,
            pkLoadmore
        },
        data() {
            return {
                clickFlag: true,
                ok: 0,
                rooter: "/my",
                name: "",
                password: "",
                repassword: "",
                email: "",
                code: "",
                title: "消息中心",
                hasNoBack: true,
                index: 0,
                message: "操作成功",
                indexx: "2",
                isAndroid: false,
                $msgbox: "",
                isiOS: false,
                list: [],
                oks: 0,
                contentf: "",
                timerTextf: "",
                titlef: "",
                messagef: "",
                lists: [],
                allLoaded: false,
                topAllLoaded: false,
                stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
                hasData: false,
                bottomStatus: "",
                wrapperHeight: 0,
                page: 1, //当前页数
                pageSize: 10, //每页请求的条数
                totalNum: 0 //总页数
            };
        },
        mounted() {
            //头部样式部分
            this.$(".mint-navbar > .mint-tab-item")
                .children(".mint-tab-item-label")
                .css({
                    "font-size": "0.42667rem",
                    "line-height": "1.25333rem",
                    height: "100%"
                });
            this.aori();
            this.getList();
        },
        methods: {
            getList(t) {
                getNoticeList(this.page, this.pageSize).then(res => {
                    console.log(res, "res");
                    let result = res.messageList;
                    this.totalNum = res.totalNum;
    
                    if (this.page === 1) {
                        this.list = result;
                        if (this.totalNum < this.page * this.pageSize) {
                            this.allLoaded = true;
                            this.topAllLoaded = true;
                        } else {
                            this.allLoaded = false;
                            this.topAllLoaded = false;
                        }
                    } else {
                        this.list = this.list.concat(result);
                        this.topAllLoaded = false;
                    }
    
                    if (t === 1) {
                        this.$toast({
                            message: "刷新成功",
                            duration: 2000
                        });
                    }
                    this.$nextTick(() => {
                        this.wrapperHeight =
                            document.documentElement.clientHeight -
                            this.$refs.wrapper.getBoundingClientRect().top;
                    });
                });
            },
            proMesg() {
                this.ok = new Date().getTime();
            },
            goel() {
                this.$router.push({
                    name: "msgcenter"
                });
            },
            goQs() {
                this.$router.push({
                    name: "questionnaireList"
                });
            },
            //接受子集所传的值
            aori() {
                let u = navigator.userAgent;
                let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
                let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                this.isAndroid = isAndroid;
                this.isiOS = isiOS;
            },
            fixmsg(msg, len) {
                if (msg.length > len) {
                    return msg.slice(0, len) + "...";
                } else {
                    return msg;
                }
            },
            setValue(item) {
                this.contentf = item.content;
                this.timerTextf = this.filterDate(item.createTime, "YYYY年MM月DD日");
                this.titlef = item.title;
                this.proMesg();
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
            }
        }
    };
</script>

<style lang="less" scoped>
    @import url("./msgcenter.less");
    .block-tit {
        padding-left: 0.4rem/* 30/75 */
        ;
        padding-right: 0.13333rem/* 10/75 */
        ;
    }
</style>
