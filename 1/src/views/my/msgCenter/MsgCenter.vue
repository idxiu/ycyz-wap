<template>
    <div id="passwordmge">
        <F-header title="消息中心" :rooter="'-1'" :hasNoBack="true" :isShowHome="false"></F-header>
        <div class="hasbox"></div>
        <div class="hasmenu">
            <mt-navbar v-model="indexx">
                <mt-tab-item id="1">通知消息</mt-tab-item>
                <mt-tab-item>
                    <div @click="goel">游戏公告</div>
                </mt-tab-item>
                <mt-tab-item>
                    <div @click="goQs">问卷调查</div>
                </mt-tab-item>
            </mt-navbar>
            <!-- tab-container -->
            <div class="page-loadmore">
                <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                    <pk-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :top-all-loaded="topAllLoaded" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange" ref="loadmore" :stop-translate="stopTranslate">
                        <mt-tab-container v-model="indexx">
                            <mt-tab-container-item id="1">
                                <div class="contenerf">
                                    <div class="content cellpel">
                                        <div v-for="(item, i) in list" :key="i+100" @click="setValue(item)">
                                            <Wipe class="msgb pk-1px-b" :right="[
                                                        {
                                                        content: '删除',
                                                        style: { background: 'red', color: '#fff' },
                                                        handler: () => todo(item.id)
                                                        }
                                                    ]">
                                                <div class="block-tit">
                                                    <div class="tip-icon">
                                                        <h2 class="h2s">
                                                            {{fixmsg(item.title,16)}}
                                                        </h2>
                                                        <span class="spans" v-show="item.status==1"></span>
                                                        <span class="dates">{{item.createTime | filterDate('YYYY年MM月DD日')}}</span>
                                                    </div>
                                                    <p class="msg" v-html="fixmsg(item.content,50)"></p>
                                                </div>
                                            </Wipe>
                                        </div>
                                        <div class="nodata" v-show="hasData">我是有底线的</div>
    
                                        <message-boxer :ok="ok" :content="contentf" :timerText="timerTextf" :title="titlef" :message="messagef"></message-boxer>
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
    import pkLoadmore from "../../../components/Loadmore";
    import {
        hasMsgNotice,
        msgInfo,
        msgDel
    } from "@/api/msgCenter";
    
    export default {
        components: {
            Button,
            FHeader,
            Navbar,
            MessageBox,
            MessageBoxer,
            Wipe: CellSwipe,
            pkLoadmore,
            TabItem
        },
        data() {
            return {
                ok: 0,
                indexx: "1",
                isAndroid: false,
                $msgbox: "",
                isiOS: false,
                contentf: "默认内容",
                timerTextf: "",
                titlef: "",
                messagef: "",
                lists: [],
                list: [],
                oks: 0,
                contentfs: "",
                timerTextfs: "",
                titlefs: "",
                messagefs: "",
                allLoaded: false,
                topAllLoaded: false,
                topStatus: "",
                stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
                hasData: false,
                bottomStatus: "",
                wrapperHeight: 0,
                page: 1, //当前页数
                pageSize: 10, //每页请求的条数
                totalNum: 0 //总页数
            };
        },
        computed: {},
        watch: {},
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
            // console.log(this.list.length)
        },
        methods: {
            todo(id) {
                msgDel(id * 1).then(res => {
                    // console.log(res);
                    this.$toast("删除成功");
                    this.getList();
                });
            },
            getList(t) {
                hasMsgNotice(this.page, this.pageSize).then(res => {
                    console.log(res, "res");
                    this.totalNum = res.totalNum;
                    let result = res.messageList;
    
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
                setTimeout(() => {
                    Object.keys(this.$(".block-tit")).map((v, i) => {
                        if (!isNaN(v * 1)) {
                            this.$(".block-tit")
                                .parent()
                                .siblings("mint-cell-title")
                                .css("display", "none");
                        }
                    });
                }, 0.5);
            },
            goel() {
                this.$router.push({
                    name: "msgcenters"
                });
            },
            goQs() {
                this.$router.push({
                    name: "questionnaireList"
                });
            },
            proMesg() {
                this.ok = new Date().getTime();
            },
            aori() {
                let u = navigator.userAgent;
                let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
                let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                this.isAndroid = isAndroid;
                this.isiOS = isiOS;
                //划出删除
                // this.$(".cellpel .mint-cell-title").css({ display: "none" });
                this.$(".block-tit,.mint-cell-value").css({
                    width: "100%"
                });
                this.$(".msgb .mint-cell-value").css("padding-top", ".06667rem ");
                this.$(".cellpel .mint-cell-swipe")
                    .last()
                    .css({
                        "border-bottom": "none"
                    });
                this.$(".mint-cell-value").css("height", "2.26667rem");
                this.$(".msgb .mint-cell-swipe-button").css("line-height", "2.04rem");
                this.wrapperHeight =
                    document.documentElement.clientHeight -
                    this.$refs.wrapper.getBoundingClientRect().top;
            },
            fixmsg(msg, len) {
                if (msg.length > len) {
                    return msg.slice(0, len) + "...";
                } else {
                    return msg;
                }
            },
            //messageBox
            setValue(item) {
                msgInfo(item.id * 1).then(res => {
                    this.contentf = res.content;
                    this.timerTextf = this.filterDate(res.createTime, "YYYY年MM月DD日");
                    this.titlef = res.title;
                    item.status = 2;
                    this.proMesg();
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
        width: 100%;
    }
</style>

<style>
    .mint-cell-value {
        width: 100% !important;
    }
    
    .mint-cell-swipe-button {
        line-height: 2.04rem;
    }
    
    .block-tit,
    .mint-cell-value {
        height: 2.26667rem/* 170/75 */
        ;
    }
</style>
