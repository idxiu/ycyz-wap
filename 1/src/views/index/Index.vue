<template>
    <div class="body">
        <Gamepop :allmoney="allmoney" :state="toast_control" :platformId="platformId" :platformName="platformName" :gameName="productName" :gameType="gameType" :balances="balances" @returnState="returnState">
        </Gamepop>
    
    
        <side :isRight="true" :drawerWidth="w">
            <div slot="position">
                <div class="header">
                    <div class="logo"><img :src="logoimg" alt=""></div>
                    <div class="headbox">
                        <div v-show="isLogin" class="userName">{{userInfo.account}}</div>
                        <div v-show="!isLogin" class="botton">
                            <!--<div class="btns">试玩</div>-->
                            <router-link tag="div" :to="{name:'register'}" class="btns registerbtn">注册</router-link>
                            <router-link tag="div" :to="{name:'login'}" class="btns loginbtn">登录</router-link>
                        </div>
                    </div>
                </div>
    
                <!-- 请求完成才能渲染页脚 -->
                <Footer :url="contactUrl"></Footer>
                <!--redbag-->
                <Redbag v-show="bagSwitch"></Redbag>
            </div>
            <div slot="drawer">
                <div class="sideBox">
                    <div class="sideHead pk-1px-b">
                        <div v-show="!isLogin" class="unlisted">
                            <router-link tag="div" :to="{name:'login'}" class="portrait iconfont icon-sidebar_head"></router-link>
                            <span>点击头像登录</span>
                            <a v-if="haveqqlogin" class="qqlogin" :href="goUrl">
                                <i class="iconfont icon-daohangqq"></i>
                                <span>QQ登录</span>
                            </a>
                            <div v-if="havewechatlogin" class="wechatlogin">
                                <i class="iconfont icon-qb-weixin"></i>
                                <span>微信登录</span>
                            </div>
                            <router-link tag="div" :to="{name:'register'}" class="sidebtn">用户注册</router-link>
                            <!--<div class="sidebtn">点击试玩</div>-->
                        </div>
                        <div v-show="isLogin" class="loginInfo">
                            <div class="portrait iconfont icon-sidebar_head"></div>
                            <div class="sideaccount">{{userInfo.account}}</div>
                            <div class="sidebalance">{{userInfo.balance}}</div>
                        </div>
                    </div>
                    <ul class="sideNav pk-1px-b">
                        <router-link tag="li" :to="{name:'activity'}" class="iconfont icon-sidebar_huodong">活动中心
                        </router-link>
                        <router-link tag="li" :to="{name:'purse'}" class="iconfont icon-sidebar_wallet">我的钱包
                        </router-link>
                        <router-link tag="li" :to="{name:'my'}" class="iconfont icon-sidebar_mine">个人中心</router-link>
                        <router-link tag="li" :to="{name:'lottery'}" class="iconfont icon-sidebar_order">投注记录
                        </router-link>
                        <router-link tag="li" :to="{name:'msgcenter'}" class="iconfont icon-sidebar_message">
                            通知消息
                            <div class="numb" v-show="count>0&&count<100">
                                {{count}}
                            </div>
                            <div class="numb" v-show="count>99">
                                99+
                            </div>
                        </router-link>
                    </ul>
                    <ul class="sideNav pk-1px-b">
                        <router-link tag="li" :to="{name:'spread'}" class="iconfont icon-sidebar_share" v-show="isSpread">分享返佣
                        </router-link>
                        <!-- <router-link tag="li" :to="{name:'contactus'}" class="iconfont icon-sidebar_kefu">联系客服</router-link> -->
                        <li class="iconfont icon-sidebar_kefu"><a class="link" :href="contactUrl" target="_balk">联系客服</a></li>
                        <router-link tag="li" :to="{name:'settings'}" class="iconfont icon-sidebar_setting">系统设置
                        </router-link>
                        <li class="iconfont icon-sidebar_download" @click="download" v-if="isDownApp == 1">下载专区</li>
                        <li class="iconfont icon-icon_clear" @click="clearAll()">清除缓存</li>
                    </ul>
                    <ul class="sideNav sideBottom">
                        <div v-show="swiperSlidesCarousel.length>0" class="switch">
                            首页广告
                            <mt-switch class="switchBtn" v-model="bannerSwitch" @change="floatBanner"></mt-switch>
                        </div>
                        <div class="switch">
                            浮动红包
                            <mt-switch class="switchBtn" :disabled="disabledBag" v-model="bagSwitch" @change="floatBag"></mt-switch>
                        </div>
                    </ul>
                </div>
            </div>
            <div slot="content">
    
    
                <div class="page-loadmore">
                    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                        <pk-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore" :stop-translate="stopTranslate">
                            <div class="indexBody">
                                <div class="banner" v-show="bannerSwitch">
                                    <swiper :options="swiperOptionCarousel" ref="mySwiperIndex">
                                        <swiper-slide v-for="(item, index) in swiperSlidesCarousel" :key="index">
                                            <a>
                                                <img :src="item.imgUrl" alt="">
                                            </a>
                                        </swiper-slide>
                                        <div class="swiper-pagination" style="bottom:0.26666rem;" slot="pagination"></div>
                                    </swiper>
                                    <span class="close" @click="closeadv('banner')">关闭</span>
                                </div>
                                <div @click="closeadv('notice')" v-show="noticeData.length>0" class="notive">
                                    <div class="icon iconfont icon-sy-tzgg"></div>
                                    <marquee direction="left" align="bottom" height="25" width="100%" onmouseout="this.start()" onmouseover="this.stop()" scrollamount="4" scrolldelay="1">
                                        <div class="noticeText" v-for="(noticeDatas,index) in noticeData" :key="index">
                                            {{noticeDatas.content}}
                                        </div>
                                    </marquee>
                                </div>
                                <div v-if="hotGame.length != 0 || haveHis" class="recommend" @touchmove="show">
                                    <div class="hottabs">
                                        <mt-navbar v-model="selected">
                                            <mt-tab-item v-show="hotGame.length != 0" @click.native="changeTab(2)" id="1">热门推荐
                                            </mt-tab-item>
                                            <mt-tab-item v-show="haveHis" @click.native="changeTab(1)" id="2">最近玩过
                                            </mt-tab-item>
                                        </mt-navbar>
                                    </div>
                                    <!-- tab-container -->
                                    <mt-tab-container v-model="selected">
                                        <mt-tab-container-item class="hotGame" id="1">
                                            <ul>
                                                <li v-for="(gamelists,index) in hotGame" :key="index">
                                                    <div @click="gamepop(gamelists)" class="gameRegion">
                                                        <div class="game-pic">
                                                            <img v-if="gamelists.id == 217" v-lazy="gamelists.iconUrl" :key="gamelists.iconUrl" />
                                                            <img v-else-if="gamelists.id != 217" v-lazy="cdnUrl+gamelists.iconUrl" :key="cdnUrl+gamelists.iconUrl" />
                                                        </div>
                                                        <div class="game-text" v-if="gamelists.topType == 2">
                                                            {{gamelists.gameName}}
                                                        </div>
                                                        <div class="game-text" v-else-if="gamelists.topType == 1">
                                                            {{gamelists.productName}}
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </mt-tab-container-item>
                                        <mt-tab-container-item class="history" id="2">
                                            <ul>
                                                <li v-for="(gamelists,index2) in playedList" :key="index2">
                                                    <div @click="gamepop(gamelists)" class="gameRegion">
                                                        <div class="game-pic"><img v-lazy="cdnUrl+gamelists.iconUrl" :key="cdnUrl+gamelists.iconUrl" />
                                                        </div>
                                                        <div class="game-text">
                                                            {{gamelists.gameName}}
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </mt-tab-container-item>
                                    </mt-tab-container>
                                </div>
                                <IndexGameList v-if="gameinfo.length>0" :gameinfo="gameinfo" :cdnUrl='cdnUrl' @gameReturnState="gameReturnState"></IndexGameList>
                                <!--<div class="copyright">-->
                                <!--<div class="copytext">copyright © 2010-2018 E-Tong Technology co,itd</div>-->
                                <!--<a class="checkpc">欢迎使用</a>-->
                                <!--</div>-->
                            </div>
    
                        </pk-loadmore>
                    </div>
                </div>
    
    
            </div>
        </side>
    
        <!-- 滚动公告 -->
        <ScrollNotice v-if="indexAllData.notice && isShowScrollNotice" :scrollNotice="indexAllData.notice" @returnScrollNoticeStatus="returnScrollNoticeStatus"></ScrollNotice>
    
        <!-- 弹窗公告 未登录-->
        <div v-show="fullwindow">
            <ballNotice v-if="indexAllData.popNotice && !isLogin" :popNotice="indexAllData.popNotice"></ballNotice>
        </div>
        <!--全屏动画 登录或未登录-->
        <animation v-if="indexAllData.fullScreen" :fullScreen="indexAllData.fullScreen" :cdnUrl='cdnUrl' v-on:close="state"></animation>
    
    
        <!--通知消息 登录-->
        <div v-if="isLoginPopNotice" class="twoBtnPop">
            <div class="btnpopBox">
                <div class="btnpopContent">
                    <div class="tit">{{loginPopNotice.title}}</div>
                    <img v-if="loginPopNotice.wapImg" :src="loginPopNotice.wapImg" class="noticePic">
                    <div class="content">
                        {{loginPopNotice.content}}
                        <div class="time">{{loginPopNotice.createTime | filterDate('YYYY年MM月DD日')}}</div>
                    </div>
                    <div @click="nextNotice()" class="halfBtn next" v-if="loginPopNotice.count !=0">下一条</div>
                    <div @click="isLoginPopNotice=false" class="halfBtn close" v-if="!loginPopNotice.count">关闭</div>
                </div>
                <div @click="isLoginPopNotice=false" class="halfBtn cancel" v-if="loginPopNotice.count !=0">取消</div>
            </div>
            <div class="box-mask"></div>
        </div>
        <!-- 问卷调查入口 -->
        <div class="qs-index" v-if="showQS" :class="{'no-banner':isHideBottomBanner || bottomBanner.length <= 0 }">
            <i class="iconfont icon-input-close qs-index-close" @click="hideQSIdx"></i>
            <div @click="toQSInfo">
                <img src="../../assets/img/qs-index.png" class="qs-index-img">
                <p class="qs-index-title">
                    {{qsIndex.title}}
                </p>
            </div>
    
        </div>
        <!-- 底部广告 -->
        <div class="bottom-banner" v-if="!isHideBottomBanner && bottomBanner.length > 0 ">
            <i class="iconfont icon-input-close" @click="hideBottomBanner"></i>
            <swiper :options="swiperOptionBannerBottom">
                <swiper-slide v-for="(item,index) in bottomBanner" :key="index">
                    <img :src="item.content" @click="toLink(item)" />
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script>
    // import 'swiper/dist/css/swiper.css'
    import Gamepop from "./Gamepop";
    import Side from "../../components/Side";
    import Footer from "../../components/IndexFooter";
    import func from "@/api/purse";
    import Redbag from "../../components/RedBag";
    import IndexGameList from "./IndexGameList";
    import pkLoadmore from "@/components/Loadmore";
    import ballNotice from "./BallNotice";
    import animation from "./FullAnimation";
    import ScrollNotice from "./ScrollNotice";
    import {
        MessageBox
    } from "mint-ui";
    import {
        indexInfo,
        ratios,
        gameInto,
        getGamed,
        getLoginPopNotice,
        thdLoginQq,
        thdQQlogin,
        getThreeInfo,
        getDownloadUrl,
        getQS
    } from "@/api/index";
    import {
        getQSList
    } from "@/api/msgCenter";
    import notice from "@/api/my";
    
    import {
        swiper,
        swiperSlide
    } from "vue-awesome-swiper";
    
    export default {
        name: "index",
        components: {
            swiper,
            swiperSlide,
            IndexGameList,
            Gamepop,
            Side,
            Footer,
            Redbag,
            pkLoadmore,
            ballNotice,
            animation,
            ScrollNotice,
            MessageBox
        },
        inject: ["reload"],
        data() {
            return {
                w: 4.8 * this.HTML_FONT_SIZE,
                cdnUrl: "",
                toast_control: false,
                userInfo: [],
                login: true,
                selected: "1", //控制第一个tab切换
                tab: 2,
                swiperOptionCarousel: {
                    notNextTick: true,
                    initialSlide: 1,
                    autoplay: 3000,
                    loop: true,
                    autoplayDisableOnInteraction: false,
                    pagination: ".swiper-pagination"
                },
                swiperOptionBannerBottom: {
                    autoplay: 3000,
                },
                indexData: [],
                logoimg: "",
                swiperSlidesCarousel: [], //轮播列表
                noticeData: [], //公告列表
                isShowScrollNotice: false, //是否显示滚动公告
                noticeIndex: 0,
                hotGame: [],
                playedList: [], //玩过的游戏列表
                haveHis: false,
                isLogin: sessionStorage.getItem("session"),
                menuList: [{
                        icon: "icon-tab_cunkuan",
                        name: "存款",
                        link: "deposit"
                    },
                    {
                        icon: "icon-tab_qukuan",
                        name: "提现",
                        link: "withdraw"
                    },
                    {
                        icon: "icon-tab_eduzh",
                        name: "额度转换",
                        link: "transfer"
                    },
                    {
                        icon: "icon-tab_huodong",
                        name: "活动",
                        link: "activity"
                    },
                    {
                        icon: "icon-tab_kefu",
                        name: "客服",
                        link: "contactus"
                    }
                ],
                count: "", //消息条数
                bannerSwitch: true,
                bagSwitch: false,
                disabledBag: false,
                //---额度转换
                platformId: 0,
                platformName: "",
                productName: "",
                gameType: 0,
                balances: 0,
                allmoney: 0,
                //------接口修改
                indexAllData: "",
                gameinfo: [],
                modalNext: false,
    
                stopTranslate: parseInt(this.HTML_FONT_SIZE * 3),
                topStatus: "",
                wrapperHeight: 0,
                isShowPoPNotice: sessionStorage.getItem("isShowPoPNotice"), //1关闭显示 0不再提醒
                isShowPop: true,
                contactUrl: "",
                fullwindow: false,
                loginPopNotice: {}, //用户登录了获取通知消息
                isLoginPopNotice: false,
                appId: '',
                callbackUrl: '',
                goUrl: '',
                gobackUrl: '',
                codes: '',
                haveqqlogin: false,
                havewechatlogin: false,
                qsIndex: {},
                showQS: localStorage.getItem('showQS'),
                bottomBanner: [],
                isHideBottomBanner: sessionStorage.getItem('hideBottomBanner'),
                isDownApp: 2,
                isSpread:true
            };
        },
        computed: {
            Swiper() {
                return this.$refs.mySwiperIndex.swiper;
            }
        },
        mounted() {
            let tid = this.$route.query.tid;
            if (tid) {
                this.setStorage('tid', tid);
                this.$router.push({
                    name: "register",
                });
                return;
            }
    
    
            let dataObjData = this.getStorage("indexData", 1000 * 60 * 60 * 24 / 2); //过期时间为半天
            if (dataObjData) {
                console.log(1)
                this.dealWithData(dataObjData);
            } else {
                console.log("获取的信息已经过期");
                this.infoData();
            }
    
            //判断是否三方登录进入的请求
            function GetQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
                var context = "";
                if (r != null)
                    context = r[2];
                reg = null;
                r = null;
                return context == null || context == "" || context == "undefined" ? "" : context;
            }
    
            this.codes = GetQueryString("code")
    
            if (this.codes == '') {
                // alert(GetQueryString("code"));
                console.log(sessionStorage.getItem("session"), 'donee');
            } else {
                console.log(sessionStorage.getItem("session"), 'donee');
                if (!sessionStorage.getItem("session")) {
                    thdQQlogin(this.codes).then(res => {
                        sessionStorage.setItem("session", res.sessionId);
                        this.isLogin = true;
                        this.hasmsgNum();
                        // window.location.href=window.location.origin
                        // this.$router.push("/");
                        console.log(res);
                        window.location.href = window.location.origin;
                    });
                }
            }
    
            this.hasmsgNum();
            this.historyGame();
            this.thdLogin();
            this.havThree();
            this.$nextTick(() => {
                this.wrapperHeight =
                    document.documentElement.clientHeight -
                    this.$refs.wrapper.getBoundingClientRect().top;
            });
            if (this.isLogin) {
                this.getLoginPopNotice();
                this.getQSList();
            }
    
            this.Swiper.on('click', (swiper) => {
                let item = this.swiperSlidesCarousel[swiper.realIndex];
                console.log(item);
                if (item.isLink == 1) { //外链
                    if (item.linkUrl) {
                        window.open(item.linkUrl);
                    }
                } else { //内链
                    if (item.linkUrl) {
                        this.$router.push({
                            name: item.linkUrl
                        });
                    }
                }
            });
            getDownloadUrl().then((res) => {
                console.log(res)
                if (res.isDownApp === 1) {
                    this.isDownApp = res.isDownApp;
                }
            })
    
    
        },
        methods: {
            getQSList() {
                getQS().then(res => {
                    console.log(res);
                    if (res.id) {
                        this.showQS = true;
                        this.qsIndex = res;
                    } else {
                        this.showQS = false;
                    }
                }).catch(err => {
    
                })
            },
            hideQSIdx() {
                localStorage.removeItem('showQS');
                this.showQS = false;
            },
            toQSInfo() {
                this.$router.push({
                    name: "questionnaireInfo",
                    query: {
                        id: this.qsIndex.id
                    }
                });
            },
            havThree() {
                if (!this.isLogin) {
                    getThreeInfo().then(res => {
                            console.log("res", res);
                            if (res.isQq === 1) {
                                this.haveqqlogin = true
                            }
                            if (res.isWechat === 1) {
                                this.havewechatlogin = true
                            }
                        })
                        .catch(err => {
                            this.$toast({
                                message: err,
                                duration: 2000
                            });
                        });
                }
            },
            goLink(item) {
                console.log(item)
                if (item.isLink == 1) { //外链
                    if (item.linkUrl) {
                        window.open(item.linkUrl);
                    }
                } else { //内链
                    if (item.linkUrl) {
                        this.$router.push({
                            name: item.linkUrl
                        });
                    }
                }
            },
            thdLogin() {
                thdLoginQq().then(res => {
                    this.gobackUrl = window.location.href;
                    console.log(res, 'ddd');
                    this.appId = res.appId;
                    this.callbackUrl = res.callbackUrl;
                    this.goUrl = 'https://graph.qq.com/oauth2.0/authorize?client_id=' + this.appId + '&redirect_uri=' + this.callbackUrl + '&response_type=code&state=' + this.gobackUrl
                })
            },
            clearAll() {
                var _this = this;
                MessageBox({
                    title: " ",
                    message: "确认清除缓存?",
                    showCancelButton: true
                }).then(resp => {
                    if (resp === "confirm") {
                        localStorage.clear();
                        sessionStorage.clear();
                        _this.clearCookie();
                        _this.reload();
                        // window.location.href=window.location.origin
                    }
                });
            },
            clearCookie() {
                //清除所有cookie函数
                var date = new Date();
                date.setTime(date.getTime() - 10000);
                var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
                if (keys) {
                    for (var i = keys.length; i--;)
                        document.cookie =
                        keys[i] + "=0; expire=" + date.toGMTString() + "; path=/";
                }
            },
            //获取通知公告
            getLoginPopNotice() {
                getLoginPopNotice().then(res => {
                    console.log("/////", res);
                    if (res.title) {
                        this.isLoginPopNotice = true;
                        this.loginPopNotice = res;
                    }
                });
            },
            //下一条通知公告
            nextNotice() {
                this.getLoginPopNotice();
            },
            setStorage(key, value) {
                let curTime = new Date().getTime();
                localStorage.setItem(
                    key,
                    JSON.stringify({
                        data: value,
                        time: curTime
                    })
                );
            },
            getStorage(key, exp) {
                let data = localStorage.getItem(key);
                let dataObj = JSON.parse(data);
                if (dataObj) {
                    if (new Date().getTime() - dataObj.time > exp) {
                        console.log("信息已过期");
                    } else {
                        return dataObj.data;
                    }
                } else {
                    return null;
                }
            },
            state: function(res) {
                this.fullwindow = res[0]
            },
            //弹窗公告组件点击关闭告诉父组件 在下拉刷新的时候再次开启弹框
            returnCloseStatus(status) {
                this.isShowPop = status;
            },
            show(event) {
                // 阻止冒泡
                event.stopPropagation();
                // 阻止默认事件
                // event.preventDefault();
            },
            closeadv(item) {
                if (item == "banner") {
                    this.bannerSwitch = false;
                    sessionStorage.setItem("banner", 0); //点击轮播图关闭
                }
                if (item == "notice") {
                    this.isShowScrollNotice = true;
                }
            },
            //tab切换
            changeTab(type) {
                this.tab = type;
            },
            infoData() {
                //logo-轮播
                indexInfo()
                    .then(res => {
                        console.log("res", res);
                        this.dealWithData(res);
                        this.setStorage("indexData", res);
                        localStorage.setItem("nodeTitle", res.title);
                        document.title = res.title;
                    })
                    .catch(err => {
                        this.$toast({
                            message: err,
                            duration: 2000
                        });
                    });
            },
            dealWithData(res) {
                this.cdnUrl = res.cdn + "/";
                this.gameinfo = res.gameInfo;
                this.indexAllData = res;
                console.log(this.indexAllData)
    
                this.contactUrl = this.indexAllData.contactUrl;
                this.swiperSlidesCarousel = this.indexAllData.flash || [];
                this.logoimg = this.indexAllData.logoUrl;
                this.noticeData = this.indexAllData.notice || [];
                this.hotGame = this.indexAllData.hotGame || [];
                this.bottomBanner = this.indexAllData.adv || [];
                console.log(this.bottomBanner, 1000000);
    
    
                //后台是否返回红包
                if (!this.indexAllData.red) {
                    this.disabledBag = true;
                    this.bagSwitch = false;
                } else {
                    this.disabledBag = false;
                    this.bagSwitch = true;
                }
                if (sessionStorage.getItem("bag") == 0) {
                    this.bagSwitch = false;
                    sessionStorage.setItem("bag", 0);
                } else {
                    sessionStorage.setItem("bag", this.bagSwitch ? 1 : 0);
                }
    
    
                console.log('flash个数', this.swiperSlidesCarousel.length);
    
                if (this.swiperSlidesCarousel.length <= 1) {
                    this.swiperOptionCarousel.loop = false;
                    this.Swiper.stopAutoplay();
                } else {
                    this.Swiper.startAutoplay();
                }
                //后台是否返回轮播
                if (this.swiperSlidesCarousel.length > 0) {
                    console.log(this.bagSwitch)
                    //点击了关闭
                    if (sessionStorage.getItem("banner") == 0) {
                        this.bannerSwitch = false;
                        sessionStorage.setItem("banner", 0);
                    } else { //没有点击关闭
                        this.bannerSwitch = true;
                        sessionStorage.setItem("banner", 1);
                    }
                    if (this.swiperSlidesCarousel.length == 1) {
                        this.swiperOptionCarousel.loop = false;
                        this.Swiper.stopAutoplay();
                    } else {
                        this.Swiper.startAutoplay();
                    }
    
                } else { //没有返回
                    this.bannerSwitch = false;
                }
    
    
            },
            historyGame() {
                if (this.isLogin) {
                    getGamed()
                        .then(res => {
                            console.log(res, "玩过的游戏");
                            if (res.game.length == 0) {
                                this.haveHis = false;
                            } else {
                                this.haveHis = true;
                                this.playedList = res.game;
                            }
                        })
                        .catch(err => {
                            this.$toast({
                                message: err,
                                duration: 2000
                            });
                        });
                }
            },
            returnState(state) {
                this.toast_control = state;
            },
            //处理游戏下面的点击弹出额度转换弹框
            gameReturnState(
                state,
                allmoney,
                platformId,
                platformName,
                productName,
                gameType,
                balances
            ) {
                this.toast_control = state;
                console.log(allmoney);
                this.allmoney = allmoney;
                this.platformId = platformId;
                this.platformName = platformName;
                this.productName = productName;
                this.gameType = gameType;
                this.balances = balances;
            },
            //获取消息未读数和个人资料
            hasmsgNum() {
                if (this.isLogin) {
                    notice.getMemberCenter().then(res => {
                        console.log('-=-=-0=', res)
                        this.count = res.unread.count;
                        this.userInfo = res.info;
                        this.isSpread = res.switch.isSpread;
                        localStorage.setItem('freeWalletSwitch', res.switch.freeWalletSwitch);
    
                    }).catch(err => {
                        this.$toast({
                            message: err,
                            duration: 2000
                        });
                    });
                }
            },
            //快捷額度轉換
            gamepop(item) {
                console.log('item', item)
                if (this.isLogin) {
                    //登錄
                    this.platformId = item.platformId * 1;
                    this.platformName = item.platformName;
                    this.productName = item.productName;
                    this.gameType = item.typeId * 1;
    
                    //isChange 视讯是否开启额度转换 1开启->弹框额度转换 !1 ->跳游戏
                    if (item.isChange == 1) {
                        //freeWalletSwitch 1=免转钱包 2=多钱包模式
                        if (localStorage.getItem('freeWalletSwitch') == 1) {
                            this.intoGame();
                        } else {
                            this.ratio(item.platformId, item.platformName);
                        }
                    } else {
                        this.intoGame();
                    }
                } else {
                    //未登錄
                    // 1.存在试玩路线swHref 就去试玩，不存在去登录
                    if (item.swHref) {
                        window.open(
                            item.swHref,
                            "_blank",
                            "toolbar=yes, width=1300, height=900"
                        );
                    } else {
                        this.$router.push("/login");
                    }
                }
            },
            getSelectData() {
                if (this.isLogin) {
                    func
                        .getWalletInfo()
                        .then(res => {
                            let list = res.walletCenterResp;
                            this.allmoney = list.balance;
                            for (let i in list.gameBalance) {
                                if (list.gameBalance[i].id == this.platformId) {
                                    this.balances = list.gameBalance[i].balance;
                                }
                            }
                        })
                        .catch(err => {
                            this.$toast({
                                message: err,
                                duration: 2000
                            });
                        });
                }
            },
            ratio(id, name) {
                ratios(id, name)
                    .then(res => {
                        console.log(res);
                        if (res.remark == "") {
                            this.getSelectData();
                            this.toast_control = true;
                        } else {
                            this.$toast({
                                message: res.remark,
                                duration: 5000
                            });
                            this.intoGame();
                        }
                    })
                    .catch(err => {
                        this.transErr(err);
                    });
            },
            //進遊戲
            intoGame() {
                gameInto(this.platformName, this.platformId, this.gameType)
                    .then(res => {
                        window.open(
                            res.loginUrl,
                            "_blank",
                            "toolbar=yes, width=1300, height=900"
                        );
                    })
                    .catch(err => {
                        this.$toast({
                            message: err,
                            duration: 2000
                        });
                    });
            },
            //快捷转入失败
            transErr(err) {
                this.$messagebox({
                    title: " ",
                    message: err,
                    showCancelButton: true,
                    confirmButtonText: "继续",
                    cancelButtonText: "否"
                }).then(action => {
                    if (action == "confirm") {
                        this.intoGame();
                    } else {
                        this.getSelectData();
                        this.toast_control = true;
                    }
                });
            },
            floatBag() {
                //红包显示隐藏
                sessionStorage.setItem("bag", this.bagSwitch ? 1 : 0);
            },
            floatBanner() {
                if (this.bannerSwitch) {
                    //点击侧边栏首页广告 switch 重新开始banner自动播放
                    this.Swiper.startAutoplay();
                }
                sessionStorage.setItem("banner", this.bannerSwitch ? 1 : 0); //点击轮播图关闭
            },
            returnScrollNoticeStatus(status) {
                this.isShowScrollNotice = status;
            },
            //下拉刷新
            handleTopChange(status) {
                console.log(status, 787878787)
                this.topStatus = status;
            },
            loadTop() {
                setTimeout(() => {
                    this.infoData();
                    this.$refs.loadmore.onTopLoaded();
                }, 1500);
            },
            hideBottomBanner() {
                this.isHideBottomBanner = true;
                sessionStorage.setItem('hideBottomBanner', true);
            },
            toLink(item) {
                if (item.isLink == 1) { //外链
                    if (item.advUrl) {
                        window.open(item.advUrl);
                    }
                } else { //内链
                    if (item.advUrl) {
                        this.$router.push({
                            name: item.advUrl
                        });
                    }
                }
            },
            download() {
                const {
                    href
                } = this.$router.resolve({
                    path: '/download',
    
                })
                window.open(href, '_blank')
            }
        },
        beforeRouteLeave(to, from, next) {
            this.ModalHelper.close();
            next();
        }
    
    };
</script>

<style lang="less" scoped>
    @import url("./index.less");
    .page-loadmore-wrapper .mint-loadmore {
        height: inherit;
        overflow: auto;
    }
    
    .body {
        .header {
            z-index: 9;
            position: fixed;
            top: 0;
            width: 100%;
            height: 1.22667rem;
            background-image: -webkit-gradient(linear, left top, left bottom, from(@color-B), to(@color-B)), -webkit-gradient(linear, left top, left bottom, from(@color-D), to(@color-X)), -webkit-gradient(linear, left top, left bottom, from(@color-S), to(@color-S));
            background-image: linear-gradient(@color-B, @color-B), linear-gradient(180deg, @color-D 0%, @color-X 100%), linear-gradient(@color-S, @color-S);
            .logo {
                position: absolute;
                top: 50%;
                left: 0.4rem;
                transform: translateY(-50%);
                height: 0.72rem;
                img {
                    height: 100%;
                }
            }
            .headbox {
                position: absolute;
                right: 1.22667rem;
                height: 1.22667rem;
                .userName {
                    line-height: 1.22667rem;
                    font-size: 0.373rem;
                    color: @color-primary;
                }
                .botton {
                    padding-top: 0.293335rem;
                    font-size: 0.373rem;
                    .btns {
                        display: inline-block;
                        margin-right: 0.2rem;
                        width: 1.28rem;
                        height: 0.64rem;
                        text-align: center;
                        line-height: 0.64rem;
                        border: 1px solid @color-primary;
                        color: @color-primary;
                        border-radius: 0.133rem;
                    }
                    .loginbtn {
                        color: @color-B;
                        background-color: @color-primary;
                    }
                }
            }
        }
        .sideNav a.link {
            color: @color-primary;
        }
    }
    
    .bottom-banner {
        position: fixed;
        bottom: 1.3067rem;
        left: 0;
        z-index: 7;
        width: 100%;
        height: 2.6667rem;
        background: @color-rgab-black4;
        .iconfont {
            position: absolute;
            right: 0;
            top: -0.64rem;
            z-index: 2;
            font-size: 0.6667rem;
            color: @color-default;
            padding: 0.2667rem;
        }
        .swiper-wrapper {
            img {
                width: 100%;
                height: 2.6667rem;
            }
        }
    }
</style>

