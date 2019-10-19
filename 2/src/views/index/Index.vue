<template>
    <div class="pk-index">
        <trial-login :isTrial='isTrial' :TrialAccount ='TrialAccount' :TrialBalance='TrialBalance'></trial-login>
        <Trial :isDemo='isDemo' @trialClose='trialClose'></Trial>
        <header class="index-header">
            <div class="logo-menu">
                <img class="menu-icon" @click="showMenu = true" src="../../assets/img/icon/celan-cd.png" alt>
                <img class="logo" :src="siteInfo.logo" alt>
            </div>
            <div class="userinfo">
                <div class="un-login" v-if="!isLogin">
                    <button class="userinfo-trial-btn"><router-link :to="{ name: 'trial'}">试玩</router-link></button>
                    <button class="userinfo-login-btn"><router-link :to="{ name: 'login'}">登录</router-link></button>
                    <button class="userinfo-register-btn"><router-link :to="{ name: 'register'}">注册</router-link></button>
                </div>
                <div class="login" v-if="isLogin" @click="showChangeMoney = true" >
                    <p>{{userinfo.account}}</p>
                    <p>
                        <img src="../../assets/img/icon/icon_account@2x.png" alt> ￥{{userinfo.balance}}
                    </p>
                    <!-- <i class="iconfont icon-bank-normal more"></i> -->
                    <img src="../../assets/img/index-icon/header_right_more.png" alt class="more">
                </div>
            </div>
        </header>
    
        <div class="skeleton vue-skeleton-loading" v-show="showLoading">
            <div class="skeleton-bac-animation"></div>
            <div class="skeleton-bac-content">
                <row style="width:100%">
                    <skeleton-square style="width:100%;height:3.7333rem"></skeleton-square>
                </row>
                <row padding="0.2rem 0 0 0 " style="width:100%">
                    <skeleton-square style="width:100%;height:0.5333rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="1.3333rem" style="height:1.3333rem" margin="0 0 0 0.2853rem"></skeleton-square>
                    <skeleton-square width="1.3333rem" style="height:1.3333rem" margin="0 0 0 0.2853rem"></skeleton-square>
                    <skeleton-square width="1.3333rem" style="height:1.3333rem" margin="0 0 0 0.2853rem"></skeleton-square>
                    <skeleton-square width="1.3333rem" style="height:1.3333rem" margin="0 0 0 0.2853rem"></skeleton-square>
                    <skeleton-square width="1.3333rem" style="height:1.3333rem" margin="0 0 0 0.2853rem"></skeleton-square>
                    <skeleton-square width="1.3333rem" style="height:1.3333rem" margin="0 0 0 0.2853rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:0.8rem" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="2.1667rem" style="height:0.8rem" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="2.1667rem" style="height:0.8rem" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="2.1667rem" style="height:0.8rem" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
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
            </div>
        </div>
        <!-- <nut-scroller :is-un-more="isUnMore" :is-loading="isLoading" :type="'vertical'" @pulldown="loadMoreVert">-->
        <!-- <div class=" nut-hor-list-item" slot="list"> -->
        <div class="index-cent" v-show="!showLoading">
            <!-- <div class="domain">主页域名：<span>{{domain}}</span></div> -->
            <div class="banner" v-if="showBanner && bannerImg.length > 0 ">
                <div>
                    <swiper :options="swiperOptionBanner">
                        <swiper-slide v-for="(item,index) in bannerImg" :key="index">
                            <img :src="item.imgUrl" @click="toLink(item)">
                        </swiper-slide>
                    </swiper>
                </div>
                <div class="banner-download" v-if="(hideDownload && showDownLoad == 1) && !isShowScrollTop">
                    <i class="iconfont icon-input-close" @click="hideDownload = false"></i>
                    <span>更多精彩游戏，请下载手机app!</span>
                    <button @click="download">立即下载</button>
                </div>
            </div>
            <div class="noticebar" v-if="announcement.length > 0" @click="toSystemAnnounce">
                <div class="noticebar-label">
                    <button>公告</button>
                </div>
                <marquee class="marquee" direction="left" align="bottom" height="40" width="100%" scrollamount="4" scrolldelay="1">
                    <div class="noticeText" v-for="(noticeDatas,index) in announcement" :key="index">{{noticeDatas.content}}</div>
                </marquee>
            </div>
            <div class="all-game" v-if="gameList.length > 0" ref="allGame" :class="{'box-height':isMoveTop}">
                <!-- swiper nav -->
                <swiper :options="swiperOption" class="gallery-top" ref="swiperTop" @slideChange="pageChange()">
                    <swiper-slide class="game-type-list" :class="{'fixedStyleType':isMoveTop}" v-for="(type, index) in gameList" :key="index">
                        <div class="game-parent">
                            <div class="game-item" v-for="(game,idx) in type.siteApis" :key="idx" @click="toList(type,game)" v-if="type.apiType == 3 || type.apiType == 5 || type.apiType == 2 || type.apiType == 6">
                                <div class="game-icon-style">
                                    <img src="../../assets/img/paly.png" alt class="play-icon" v-if="game.swHref &&  game.whStatus == 1 && type.apiType != 6 && accountType">
                                    <img v-lazy="gameImgUrl+'/'+game.apiPlatform+'/'+game.apiPlatform+'.png'" alt class="game-icon">
                                    <img src="../../assets/img/weuhu.png" alt class="play-icon" v-if="game.whStatus == 2">
                                </div>
                                <p>{{game.name}}</p>
                            </div>
                        </div>
    
                        <div class="game-parent game-three" v-if="type.apiType == 1 || type.apiType == 4">
                            <div v-for="(gameChild,idx) in gameTypeActiveList.gameList" :key="idx" class="game-item" @click="toPlay(gameTypeActiveList,gameChild)">
                                <div class="game-icon-style">
                                    <img src="../../assets/img/paly.png" alt class="play-icon" v-if="gameTypeActiveList.swHref &&  gameTypeActiveList.whStatus == 1 && accountType">
                                    <img v-lazy="gameImgUrl+'/'+gameTypeActiveList.apiPlatform+'/'+gameChild.fcType+'.png'" alt v-if="gameTypeActiveList.apiTypeId == 1 && !hasChangeGameType" class="game-icon">
                                    <img v-lazy="gameImgUrl+'/'+gameTypeActiveList.apiPlatform+'q/'+gameChild.image" alt v-if="gameTypeActiveList.apiTypeId == 4 && !hasChangeGameType" class="game-icon">
                                    <img src="../../assets/img/weuhu.png" alt class="play-icon" v-if="gameTypeActiveList.whStatus == 2 || gameChild.isWh == 1">
                                </div>
                                <p>{{gameChild.aspiName}}</p>
                            </div>
                        </div>
                    </swiper-slide>
                    <div class="swiper-pagination swiper-pagination-bullets" slot="pagination" :class="{'fixedStyle':isMoveTop}"></div>
                </swiper>
                <div class="game-type-nav" v-show="(activeGameType.apiType == 1 || activeGameType.apiType == 4 ) && showActiveGameType" :class="{'game-type-nav-fixed':isMoveTop}">
                    <swiper :options="swiperOptionv1" v-show="activeGameType.apiType == 4">
                        <swiper-slide v-for="(game,idx) in activeGameType.siteApis" :key="idx" class="game-type-nav-item" :class="{'game-type-active':gameTypeActive == idx}">
                            <div @click="selectGameType(idx,game)">
                                <img v-lazy="{src: gameImgUrl+'/'+game.apiPlatform+'/'+game.apiPlatform+'.png', error: errorImg}" alt>
                                <span>{{game.name}}</span>
                            </div>
                        </swiper-slide>
                    </swiper>
                    <swiper :options="swiperOptionv4" v-show="activeGameType.apiType == 1">
                        <swiper-slide v-for="(game,idx) in activeGameType.siteApis" :key="idx" class="game-type-nav-item" :class="{'game-type-active':gameTypeActive == idx}">
                            <div @click="selectGameType(idx,game)">
                                <img v-lazy="{src: gameImgUrl+'/'+game.apiPlatform+'/'+game.apiPlatform+'.png', error: errorImg}" alt>
                                <span>{{game.name}}</span>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
        </div>
        <!--  </div> -->
        <!-- </nut-scroller> -->
    
        <!-- 左侧菜单 -->
        <div class="left-menu" :class="{'show-menu':showMenu}">
            <div class="menu-mask" @click="showMenu = false"></div>
            <div class="menu-info">
                <!-- <i class="iconfont icon-sykszz-close menu-close" @click="showMenu = false"></i> -->
                <div class="user-info">
                    <div class="un-login" v-if="!isLogin">
                        <p>欢迎光临，请先登录</p>
                        <router-link :to="{ name: 'login'}" tag="button">用户登录</router-link>
                    </div>
                    <div class="login" v-if="isLogin">
                        <img src="../../assets/img/index-icon/icon_sidebar_mine.png" alt>
                        <p>{{userinfo.account}}</p>
                        <router-link :to="{ name: 'my'}" tag="button">个人中心</router-link>
                    </div>
                </div>
                <div class="menu-list">
                    <ul>
                        <li class="active" @click="toPage('index',false)">
                            <img src="../../assets/img/index-icon/icon_sidebar_home.png" alt>首页
                        </li>
                        <li @click="toPage('activity',false)">
                            <img src="../../assets/img/index-icon/icon_sidebar_huodong.png" alt>活动中心
                        </li>
                        <li @click="toPage('betRecord',true)">
                            <img src="../../assets/img/index-icon/icon_sidebar_order.png" alt>投注记录
                        </li>
                        <li @click="toPage('msgCenter',true)">
                            <img src="../../assets/img/index-icon/icon_sidebar_msg.png" alt>通知消息
                        </li>
                        <li @click="toPage('spread',true)" v-show="money.isSpread">
                            <img src="../../assets/img/index-icon/icon_sidebar_share.png" alt>分享返佣
                        </li>
                        <li v-if="contactusUrl" class="link-out">
                            <a class="link" :href="contactusUrl" target="_balk">
                                <img src="../../assets/img/index-icon/icon_sidebar_kefu.png" alt>联系客服
                            </a>
                        </li>
                        <li>
                            <img src="../../assets/img/index-icon/bannerimg.png" alt> 首页广告
                            <nut-switch :active.sync="showBanner"></nut-switch>
                        </li>
                        <li>
                            <img src="../../assets/img/index-icon/hotbig.png" alt> 浮动红包
                            <nut-switch :active.sync="shwoRed"></nut-switch>
                        </li>
                    </ul>
                    <button class="btnf" @click="logout" v-if="isLogin">退出登录</button>
                </div>
            </div>
        </div>
        <!-- 快捷额度转换 -->
        <div class="change-money" :class="{'show-changeMoney':showChangeMoney}">
            <div class="changeMoney-mask" @click="showChangeMoney = false"></div>
            <div class="change-money-box">
                <ul>
                    <li>
                        <label>总资产</label>
                        <p>{{userinfo.totalBalance}}￥</p>
                    </li>
                    <li>
                        <label>钱包</label>
                        <p>{{userinfo.balance}}￥</p>
                    </li>
                </ul>
                <div class="game-list">
                    <ul>
                        <li v-for="game in userinfo.apis" :key="game.apiId">
                            <label>{{game.apiName}}</label>
                            <p>{{game.balance}}￥</p>
                        </li>
                    </ul>
                    <div class="btn-group">
                        <button  @click="recoveryFunc">一键回收</button>
                        <router-link :to="{ name: 'deposit'}" tag="button">存款</router-link>
                    </div>
                </div>
            </div>
        </div>
        <!-- 红包 -->
        <Redbag v-show="shwoRed"></Redbag>
        <!-- 弹窗公告 未登录-->
        <div v-show="fullwindow">
            <ball-notice :popNotice="popNotice"></ball-notice>
        </div>
        <!--全屏动画 登录或未登录-->
        <animation v-if="fullScreen" :fullScreen="fullScreen" :cdnUrl="gameImgUrl" v-on:close="closeAnimation"></animation>
        <!-- 快捷额度转换 -->
        <Gamepop :allmoneyPop="userinfo.balance" :gameType="gameType" :state="toast_control" :platformId="platformId" :platformName="platformName" :gameName="productName" :gameId="gameId" :isDW="userinfo.isShill == 1" :balances="balance" @returnState="returnState"></Gamepop>
        <!-- 问卷调查入口 -->
        <div class="qs-index" :class="{'no-banner':isHideBottomBanner || bottomBanner.length <= 0 }" v-if="showQS">
            <i class="iconfont icon-input-close qs-index-close" @click="hideQSIdx"></i>
            <div @click="toQSInfo">
                <img src="../../assets/img/qs-index.png" class="qs-index-img">
                <p class="qs-index-title">{{qsIndex.title}}</p>
            </div>
        </div>
        <!-- 底部广告 -->
        <div class="bottom-banner" v-if="!isHideBottomBanner && bottomBanner.length > 0 ">
            <i class="iconfont icon-input-close" @click="hideBottomBanner"></i>
            <swiper :options="swiperOptionBannerBottom">
                <swiper-slide v-for="(item,index) in bottomBanner" :key="index">
                    <img :src="item.advImg" @click="toLink(item)">
                </swiper-slide>
            </swiper>
        </div>
        <!-- 底部导航 -->
        <nut-tabbar @tab-switch="tabSwitch3" :tabbarList="tabList3" :bottom="true"></nut-tabbar>
    </div>
</template>

<script>
    import ck from "../../assets/img/index-icon/cunkuan.png";
    import qk from "../../assets/img/index-icon/qukuan.png";
    import zh from "../../assets/img/index-icon/eduzhuanhuan.png";
    import yh from "../../assets/img/index-icon/youhui.png";
    import kf from "../../assets/img/index-icon/kefu.png";
    import errorImg from "../../assets/img/cs-error.png";
    import tyIcon from "../../assets/img/icon/tiyu.png";
    import dzIcon from "../../assets/img/icon/dianzi.png";
    import zrIcon from "../../assets/img/icon/shixun.png";
    import cpIcon from "../../assets/img/icon/caipiao.png";
    import qpIcon from "../../assets/img/icon/qipai.png";
    import byIcon from "../../assets/img/icon/buyu.png";
    
    import "swiper/dist/css/swiper.css";
    import Redbag from "../../components/RedBag";
    import trialLogin from "../../components/TrialLogin";
    import Trial from "../../components/Trial";
    import BallNotice from "../../components/BallNotice";
    import Animation from "../../components/FullAnimation";
    import ScrollNotice from "../../components/ScrollNotice";
    import Gamepop from "../../components/Gamepop";
    import {
        getInfo,
        logout,
        getDownloadUrl,
        checkRatio,
        trialLoginInfo,
    } from "../../services/auth.js";
    import {
        getCarouse,
        getAnnouncement,
        getGameList,
        getImgUrl,
        getAnimation,
        recovery,
        getPopMsg,
        getBottomBanner,
        thdQQlogin,
        getLogo,
        openGame,
        getQS
    } from "../../services/index.js";
    import {
        getContactus
    } from "@/services/center.js";
    import {
        checkUrl
    } from "@/services/commonfn.js";
    
    export default {
        components: {
            Redbag,
            BallNotice,
            Animation,
            ScrollNotice,
            Gamepop,
            trialLogin,
            Trial
        },
        data() {
            return {
                isTrial :false,
                isDemo:false,
                accountType:true,
               
                TrialAccount:'',
                TrialBalance:0,
                swiperOption: {},
                errorImg: errorImg,
                shwoRed: true,
                showBanner: true,
                isUnMore: false,
                isLoading: false,
                fullwindow: false,
                isLoginPopNotice: false,
                tabList3: [{
                        tabTitle: "存款",
                        curr: false,
                        icon: ck,
                        activeIcon: ck
                    },
                    {
                        tabTitle: "取款",
                        curr: false,
                        icon: qk,
                        activeIcon: qk
                    },
                    {
                        tabTitle: "额度转换",
                        curr: false,
                        icon: zh,
                        activeIcon: zh
                    },
                    {
                        tabTitle: "活动",
                        curr: false,
                        icon: yh,
                        activeIcon: yh
                    },
                    {
                        tabTitle: "客服",
                        curr: false,
                        icon: kf,
                        activeIcon: kf
                    }
                ],
                meunList: ["deposit", "withdraw", "transfer", "activity", "otherUrl"],
                showLoading: false,
                domain: location.host,
                bannerImg: [],
                bottomBanner: [],
                isHideBottomBanner: sessionStorage.getItem("hideBottomBanner"),
                popNotice: [],
                announcement: [],
                gameList: [],
                hideDownload: true,
                fullScreen: [],
                //------info
                isLogin: sessionStorage.getItem("token"),
                showMenu: false,
                showChangeMoney: false,
                userinfo: {},
                money: {
                    isSpread: true
                },
                swiperOptionBanner: {
                    autoplay: {
                        delay: 2500,
                        disableOnInteraction: false
                    }
                },
                swiperOptionBannerBottom: {
                    autoplay: {
                        delay: 2500,
                        disableOnInteraction: false
                    }
                },
                swiperOptionTop: {
                    spaceBetween: 0,
                    loop: true,
                    loopedSlides: 6, //looped slides should be the same
                    autoHeight: true //enable auto height
                },
                swiperOptionThumbs: {
                    spaceBetween: 0,
                    slidesPerView: 6,
                    touchRatio: 0.2,
                    loop: true,
                    loopedSlides: 6, //looped slides should be the same
                    slideToClickedSlide: true
                },
                swiperOptionv1: {
                    slidesPerView: 2,
                    freeMode: true
                },
                swiperOptionv4: {
                    slidesPerView: 4,
                    freeMode: true
                },
                gameImgUrl: "",
                gameTypeActive: -1,
                gameTypeActiveList: {},
                loginPopNotice: {},
                //---额度转换
                platformId: 0,
                platformName: "",
                productName: "",
                gameId: 0,
                gameType: 0,
                balance: 0,
                toast_control: false,
                siteInfo: {},
                freeWalletSwitch: 2,
                showDownLoad: 2,
                qsIndex: {},
                showQS: localStorage.getItem("showQS"),
                contactusUrl: "",
                hasChangeGameType: false,
                domeTop: 0,
                isMoveTop: false,
                isShowScrollTop: false,
                activeGameType: {},
                showActiveGameType: true,
                isDW: false
            };
        },
        inject: ["reload"],
        mounted() {
            console.log(localStorage.getItem("Trial")==1, '???')

            if(this.$route.query.isTrial){
            this.isTrial = this.$route.query.isTrial;
            }
            console.log('isTrial', this.isTrial)
            let tid = this.$route.query.tid;
            if (tid) {
                this.setStorage("tid", tid);
                this.$router.push({
                    name: "register"
                });
                return;
            }
    
            this.shwoRed = sessionStorage.getItem("shwoRed") ?
                sessionStorage.getItem("shwoRed") == 1 || false :
                true;
            this.showBanner = sessionStorage.getItem("showBanner") ?
                sessionStorage.getItem("showBanner") == 1 || false :
                true;
    
            this.showLoading = false;
    
            //判断是否三方登录进入的请求
            function GetQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
                var context = "";
                if (r != null) context = r[2];
                reg = null;
                r = null;
                return context == null || context == "" || context == "undefined" ?
                    "" :
                    context;
            }
    
            this.codes = GetQueryString("code");
    
            if (this.codes == "") {
                // alert(GetQueryString("code"));
            } else {
                let data = {
                    qqAuthCode: this.codes
                };
                if (!this.isLogin) {
                    thdQQlogin(data).then(res => {
                        if (res.success) {
                            sessionStorage.setItem("token", res.data);
                            window.location.href = window.location.origin;
                        } else {
                            this.$toast.fail(res.message, {
                                cover: true,
                                duration: 1500
                            });
                        }
                    });
                }
            }
    
            if (this.isLogin) {
                this.getInfoFunc();
                this.getQSListFunc();
            }
            this.getCarouseFunc();
            this.getAnnouncementFunc();
            this.getGameListFunc();
            this.getImgUrlFunc();
            this.getAnimationFunc();
            this.getBottomBannerFunc();
            this.getLogoFunc();
            this.getDownloadUrlFunc();
            this.getContactuFunc();
    
            const _this = this;
            window.onscroll = function(e) {
                var e = e || window.event;
                var scrolltop =
                    document.documentElement.scrollTop || document.body.scrollTop;
                let top = _this.showBanner ? scrolltop + 50 + 140 : scrolltop + 50;
                // console.log(top, _this.showBanner, _this.domeTop)
                if (scrolltop + 50 >= _this.domeTop) {
                    _this.isMoveTop = true;
                    _this.isShowScrollTop = true;
                } else {
                    // console.log(123123);
                    _this.isMoveTop = false;
                    _this.isShowScrollTop = false;
                }
            };
        },
        watch: {
            shwoRed: function() {
                let status = this.shwoRed ? 1 : 2;
                sessionStorage.setItem("shwoRed", status);
            },
            showBanner: function() {
                let status = this.showBanner ? 1 : 2;
                sessionStorage.setItem("showBanner", status);
                setTimeout(() => {
                    if (this.$refs.allGame) {
                        this.domeTop = this.$refs.allGame.offsetTop;
                    }
                }, 100);
            },
            showMenu: function() {
                if (this.showMenu) {
                    this.$jq("body").addClass("dialog-open");
                } else {
                    this.$jq("body").removeClass("dialog-open");
                }
            },
            showChangeMoney: function() {
                if (this.showChangeMoney) {
                    this.$jq("body").addClass("dialog-open");
                } else {
                    this.$jq("body").removeClass("dialog-open");
                }
            },
            gameList() {
                setTimeout(() => {
                    this.domeTop = this.$refs.allGame.offsetTop;
                }, 100);
            }
        },
        methods: {
            trialClose(step){
            this.isDemo = step;
            console.log(this.isDemo, 'this.isDemo')
            },//关闭升级弹框

             toTrial(){
                 //试玩登陆
               const data = {
                };
                trialLoginInfo(data).then(res => {
                     if (res.success) {
                        console.log(res, '')
                        sessionStorage.setItem("token", res.data);
                        if (this.remember) {
                            localStorage.setItem("account", this.account);
                            localStorage.setItem("password", encodeURIComponent(this.password));
                        } else {
                            localStorage.removeItem("account");
                            localStorage.removeItem("password");
                        }
                        this.$router.push({
                            name: "index",
                            query:{ isTrial: true }
                        });
                    } else {
                        this.getCaptchaImg();
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            trialShow(){
                 this.isDemo = localStorage.getItem("Trial")==1 ? true :false;
                 
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
    
            getDownloadUrlFunc() {
                // showDownLoad
                getDownloadUrl().then(res => {
                    if (res.success) {
                        this.showDownLoad = res.data.isDownApp;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getLogoFunc() {
                getLogo().then(res => {
                    if (res.success) {
                        this.siteInfo = res.data;
                        localStorage.setItem("nodeTitle", this.siteInfo.siteName);
                        document.title = this.siteInfo.siteName;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getBottomBannerFunc() {
                getBottomBanner().then(res => {
                    if (res.success) {
                        this.bottomBanner = res.data;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getInfoFunc() {
                getInfo().then(res => {
                    if (res.success) {
                        this.userinfo = res.data.user;
                        this.money = res.data.switch;
                        this.freeWalletSwitch = this.money.freeWalletSwitch;
                        this.isDW = this.userinfo.isShill == 1;
                        this.TrialAccount = this.userinfo.account ;
                        this.TrialBalance = this.userinfo.balance;
                        localStorage.setItem("Trial", res.data.user.isDemo);
                        this.accountType= res.data.user.isDemo==1;
                        sessionStorage.setItem(
                            "freeWalletSwitch",
                            this.money.freeWalletSwitch
                        );
                        localStorage.setItem("name", this.userinfo.account);
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getCarouseFunc() {
                getCarouse().then(res => {
                    if (res.success) {
                        this.bannerImg = res.data.banner || [];
                        this.popNotice = res.data.phoneDialog || [];
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getAnnouncementFunc() {
                getAnnouncement(-1).then(res => {
                    if (res.success) {
                        this.announcement = res.data.announcement || [];
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getGameListFunc() {
                this.showLoading = true;
                const _this = this;
                getGameList().then(res => {
                    if (res.success) {
                        this.showLoading = false;
                        this.swiperOption = {
                            autoHeight: true,
                            pagination: {
                                el: ".swiper-pagination",
                                clickable: true,
                                renderBullet(index, className) {
                                    var str = "";
                                    if (res.data[index].apiType == 5) {
                                        str = `<div class="${className} swiper-pagination-bullet-custom"><img src="${tyIcon}" alt><p>体育</p></div>`;
                                    } else if (res.data[index].apiType == 2) {
                                        str = `<div class="${className} swiper-pagination-bullet-custom"><img src="${dzIcon}" alt><p>电子</p></div>`;
                                    } else if (res.data[index].apiType == 3) {
                                        str = `<div class="${className} swiper-pagination-bullet-custom"><img src="${zrIcon}" alt><p>视讯</p></div>`;
                                    } else if (res.data[index].apiType == 1) {
                                        str = `<div class="${className} swiper-pagination-bullet-custom"><img src="${cpIcon}" alt><p>彩票</p></div>`;
                                    } else if (res.data[index].apiType == 4) {
                                        str = `<div class="${className} swiper-pagination-bullet-custom"><img src="${qpIcon}" alt><p>棋牌</p></div>`;
                                    } else if (res.data[index].apiType == 6) {
                                        str = `<div class="${className} swiper-pagination-bullet-custom"><img src="${byIcon}" alt><p>捕鱼</p></div>`;
                                    }
                                    return str;
                                }
                            },
                            on: {
                                sliderMove() {
                                    // _this.showActiveGameType = false;
                                },
                                touchEnd() {
                                    _this.showActiveGameType = true;
                                }
                            }
                        };
                        setTimeout(() => {
                            this.gameList = res.data || [];
                            console.log(this.$jq(".all-game").offsetTop);
                            this.selectGameType(0, this.gameList[0].siteApis[0]);
                            this.activeGameType = this.gameList[0];
                        }, 100);
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getImgUrlFunc() {
                getImgUrl().then(res => {
                    if (res.success) {
                        this.gameImgUrl = res.data || [];
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getAnimationFunc() {
                getAnimation().then(res => {
                    if (res.success) {
                        if (res.data.data.length == 0) {
                            if (!this.isLogin) {
                                this.fullwindow = true;
                            } else {
                                this.getPopMsgFunc();
                            }
                        } else {
                            this.fullScreen = res.data || [];
                        }
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getPopMsgFunc() {
                getPopMsg().then(res => {
                    if (res.success) {
                        if (res.data) {
                            this.loginPopNotice = res.data;
                            this.isLoginPopNotice = true;
                            let self = this;
                            if (res.data.count || res.data.count > 0) {
                                this.$dialog({
                                    id: "dialog_back", //如果希望同时弹出多个Dialog，请给不同的Dialog设置不同的id。
                                    lockBgScroll: true,
                                    closeOnClickModal: false, //点击蒙层是否关闭对话框 默认true
                                    textAlign: "left", //content 对齐方式，默认'center',这里根据新版设计稿需要给'left'
                                    title: res.data.title,
                                    content: res.data.wapImg ?
                                        `<img src="${res.data.wapImg}">` + res.data.content : res.data.content,
                                    customClass: "pk-dialog",
                                    okBtnTxt: "下一条",
                                    cancelBtnTxt: "关闭",
                                    onOkBtn() {
                                        self.getPopMsgFunc(); //关闭对话框 这个this不是vue的实例
                                    }
                                });
                            } else {
                                this.$dialog({
                                    id: "dialog_back", //如果希望同时弹出多个Dialog，请给不同的Dialog设置不同的id。
                                    lockBgScroll: true,
                                    closeOnClickModal: false, //点击蒙层是否关闭对话框 默认true
                                    textAlign: "left", //content 对齐方式，默认'center',这里根据新版设计稿需要给'left'
                                    title: res.data.title,
                                    content: res.data.wapImg ?
                                        `<img src="${res.data.wapImg}">` + res.data.content : res.data.content,
                                    customClass: "pk-dialog-single",
                                    noCancelBtn: true,
                                    onOkBtn() {
                                        this.close(); //关闭对话框 这个this不是vue的实例
                                    }
                                });
                            }
                        }
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getQSListFunc() {
                getQS().then(res => {
                    let list = res.data.investigationFrontMessage;
                    if (res.success) {
                        if (res.data.id != 0) {
                            this.showQS = true;
                            this.qsIndex = res.data;
                        } else {
                            this.showQS = false;
                        }
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            hideQSIdx() {
                localStorage.removeItem("showQS");
                this.showQS = false;
            },
            toQSInfo() {
                this.$router.push({
                    name: "questionnaire",
                    query: {
                        id: this.qsIndex.id
                    }
                });
            },
            getContactuFunc() {
                getContactus().then(res => {
                    if (res.success) {
                        let list = res.data;
                        if (list.length >= 5) {
                            list.map(item => {
                                if (item.itype == 6) {
                                    this.contactusUrl = item.content;
                                }
                            });
                        }
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            selectGameType(index, game) {
                if (this.gameTypeActive == index) {
                    return;
                }
                this.hasChangeGameType = true;
                this.gameTypeActive = index;
                setTimeout(() => {
                    this.gameTypeActiveList = game;
                    this.hasChangeGameType = false;
                }, 10);
            },
            pageChange() {
                const idx = this.$refs.swiperTop.swiper.realIndex;
                if (this.gameList[idx]) {
                    this.activeGameType = this.gameList[idx];
                    if (
                        this.gameList[idx].apiType == 1 ||
                        this.gameList[idx].apiType == 4 ||
                        this.gameList[idx].apiType == 6
                    ) {
                        this.gameTypeActive = 0;
                        this.gameTypeActiveList = "";
    
                        setTimeout(() => {
                            this.gameTypeActiveList = this.gameList[idx].siteApis[0];
                        }, 10);
                    }
                }
            },
            toList(type, game) {
                //this.accountType= localStorage.getItem("Trial")==1;
                if(!this.isLogin){
                   this.$toast.fail("请登陆...", {
                        cover: true,
                        duration: 1500
                    });
                    this.$router.push({
                                name: "login"
                            });
                    return; 
                }
                if (type.apiType == 2) {
                    sessionStorage.setItem("dzClass", JSON.stringify(type));
                    this.$router.push({
                        name: "games",
                        query: {
                            gameClassId: game.apiId
                        }
                    });
                } else {
                    if (game.whStatus == 2) {
                        console.log('tag', '2')
                        this.$toast.fail("游戏维护中...", {
                            cover: true,
                            duration: 1500
                        });
                        return;
                    }
                    if (this.isLogin && game.swHref && game.whStatus == 1) {
                        console.log('gamee1', '')
                        if (game.swHref.indexOf("://") != -1) {
                            console.log('gamee2', '')
                            window.open(
                                game.swHref,
                                "_blank",
                                "toolbar=yes, width=1300, height=900"
                            );
                        } else {
                            console.log('gamee3', '')
                            window.open(
                                "http://" + game.swHref,
                                "_blank",
                                "toolbar=yes, width=1300, height=900"
                            );
                        }
                    } else {
                        console.log('gamee4', this.accountType,this.isLogin,game.swHref,game.whStatus)
                        console.log('game.swHref', game)
                        if(this.accountType){
                            this.trialShow();
                            return
                        }
                        if (this.isLogin) {
                            console.log('gamee5', '')
                            this.userinfo.apis.map(gameApi => {
                                console.log(game.apiPlatformId, gameApi.apiId);
                                if (game.apiPlatformId == gameApi.apiId) {
                                    this.balance = gameApi.balance;
                                    this.platformId = game.apiPlatformId;
                                    this.platformName = game.apiPlatform;
                                    this.productName = game.name;
                                    this.gameId = game.apiId;
                                    this.gameType = game.apiTypeId;
                                    if (this.freeWalletSwitch == 2) {
                                        this.checkIntogame(game, 2);
                                    } else {
                                        this.intoGame(game);
                                    }
                                }
                            });
                        } else {
                            this.$router.push({
                                name: "login"
                            });
                        }
                    }
                }
            },
            //试玩
        toTryPlay(game){

            if(this.isDemo === 1){
                if(game.swHref){
                    window.open(game.swHref, "_blank");
                }else {
                   // Bus.$emit("toggle-try-play-modal", true, 2);
                }
                return false;
            }
            return true;
        },
            toPlay(game, gameChild) {
                console.log(this.isLogin, 'this.isLogin')
                if(!this.isLogin){
                   this.$toast.fail("请登陆游戏...", {
                        cover: true,
                        duration: 1500
                    });
                    this.$router.push({
                                name: "login"
                            });
                    return; 
                }
                if (game.whStatus == 2 || gameChild.isWh == 1) {
                     console.log('game1', '')
                    this.$toast.fail("游戏维护中...", {
                       
                        cover: true,
                        duration: 1500
                    });
                    return;
                }

                if (this.isLogin && game.swHref && game.whStatus == 1) {
                    console.log('game2', '')
                    if (game.swHref.indexOf("://") != -1) {
                        window.open(
                            game.swHref,
                            "_blank",
                            "toolbar=yes, width=1300, height=900"
                        );
                    } else {
                        window.open(
                            "http://" + game.swHref,
                            "_blank",
                            "toolbar=yes, width=1300, height=900"
                        );
                    }
                } else {
                    console.log('game3', game,)
                    if(this.accountType){
                            this.trialShow();
                            return
                        }
                    if (this.isLogin) {
                        console.log('game4', '')
                        this.userinfo.apis.map(gameApi => {
                            if (game.apiPlatformId == gameApi.apiId) {
                                this.balance = gameApi.balance;
                                this.platformId = game.apiPlatformId;
                                this.platformName = game.apiPlatform;
                                this.productName = game.name;
                                this.gameId = game.apiId;
                                this.gameType = game.apiTypeId;
                                if (this.freeWalletSwitch == 2) {
                                    if (game.apiPlatform == "pkplus") {
                                        let url = window.location.origin + "/pkpl/?fc_id=" + gameChild.fcHref;
                                        window.location.href = url;
                                        // window.open(url);
                                    } else {
                                        this.checkIntogame(game, 1);
    
                                    }
                                } else {
                                    this.intoGame(game, gameChild);
                                }
                            }
                        });
                    } else {
                        this.$router.push({
                            name: "login"
                        });
                    }
                }
            },
            intoGame(type, gameChild) {
                //----判断当前彩票为系统彩票
                console.log(type, gameChild, "--------");
                if (type.apiPlatform == "pkplus") {
                    let url = window.location.origin + "/pkpl/?fc_id=" + gameChild.fcHref;
                     window.location.href = url;
                    // window.open(url);
                } else {
                    let data = {
                        gameType: type.apiTypeId,
                        platform: type.apiPlatform,
                        gameId: type.apiId + ""
                    };
                    openGame(data).then(res => {
                        if (res.success) {
                            if (res.data) {
                                window.open(
                                    res.data,
                                    "_blank",
                                    "toolbar=yes, width=1300, height=900"
                                );
                            }
                        } else {
                            this.$toast.fail(res.message, {
                                cover: true,
                                duration: 1500
                            });
                        }
                    });
                }
            },
            checkIntogame(val, type) {
                //钱包为快捷额度转换
                var postData = {
                    platformId: val.apiPlatformId * 1,
                    platformName: val.apiPlatform
                };
                checkRatio(postData).then(res => {
                    if (res.success) {
                        if (res.data.remark == "") {
                            this.toast_control = true;
                        } else {
                            this.intoGame(val);
                        }
                    } else {
                        this.toast_control = true;
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            returnScrollNoticeStatus(status) {
                // this.announcement = status;
            },
            closeAnimation() {
                if (!this.isLogin) {
                    this.fullwindow = true;
                } else {
                    this.getPopMsgFunc();
                }
            },
            tabSwitch3: function(value, index) {
                if(localStorage.getItem("Trial")==1){
                    this.trialShow();
                } else if (this.isLogin) {
                    console.log(this.meunList[index], "otherUrl");
                    if (this.meunList[index] == "otherUrl") {
                        console.log(this.contactusUrl);
                        window.open(
                            this.contactusUrl,
                            "_blank",
                            "toolbar=yes, width=1300, height=900"
                        );
                    } else {
                        this.$router.push({
                            name: this.meunList[index]
                        });
                    }
                } else {
                    if (this.meunList[index] == "otherUrl") {
                        console.log(this.contactusUrl);
                        window.open(
                            this.contactusUrl,
                            "_blank",
                            "toolbar=yes, width=1300, height=900"
                        );
                    } else if (this.meunList[index] == "activity") {
                        this.$router.push({
                            name: "activity"
                        });
                    } else {
                        this.$router.push({
                            name: "login"
                        });
                    }
                }
            },
            logout() {
                logout().then(res => {
                    if (res.success) {
                        sessionStorage.setItem("token", "");
                        localStorage.setItem("Trial", 0);
                        this.$router.push("/login");
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            recoveryFunc() {
                if(localStorage.getItem("Trial")==1){
                    this.trialShow();
                    this.showChangeMoney = false;
                    return ;
                } 
                recovery().then(res => {
                    if (res.success) {
                        this.$toast.success("正在回收所有api资金，请稍后...", {
                            cover: true,
                            duration: 1500
                        });
                        this.getInfoFunc();
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            //---
            returnState(state) {
                this.getInfoFunc();
                this.toast_control = state;
            },
            //-----
            hideBottomBanner() {
                this.isHideBottomBanner = true;
                sessionStorage.setItem("hideBottomBanner", true);
            },
            toLink(item) {
                if (item.isLink == 1) {
                    //外链
                    if (item.advUrl) {
                        if (item.advUrl.indexOf("://") != -1) {
                            window.open(
                                item.advUrl,
                                "_blank",
                                "toolbar=yes, width=1300, height=900"
                            );
                        } else {
                            window.open(
                                "http://" + item.advUrl,
                                "_blank",
                                "toolbar=yes, width=1300, height=900"
                            );
                        }
                    }
                } else {
                    //内链
                    let url = checkUrl(item.advUrl);
                    //跳转到客服外链
                    if (typeof url == "object") {
                        this.$router.push({
                            name: url.name,
                            query: {
                                id: url.id,
                                position: url.t
                            }
                        });
                    } else {
                        //跳转到客服外链
                        if (url === "kefu") {
                            window.open(this.contactusUrl);
                        } else {
                            if (url === "index") {
                                this.reload();
                            } else {
                                this.$router.push({
                                    name: url
                                });
                            }
                        }
                    }
                }
            },
            toPage(address, isLogin) {
                if(localStorage.getItem("Trial")==1){
                    this.trialShow();
                    this.showMenu = false;
                    return ;
                } 
                if (isLogin) {
                    if (this.isLogin) {
                        this.$router.push({
                            name: address
                        });
                    } else {
                        this.$router.push({
                            name: "login"
                        });
                    }
                } else {
                    console.log(address);
                    if (address == "index") {
                        this.reload();
                    } else {
                        this.$router.push({
                            name: address
                        });
                    }
                }
            },
            download() {
                this.$router.push({
                    name: "download"
                });
                // const {
                //     href
                // } = this.$router.resolve({
                //     path: '/download',
    
                // })
                // window.open(href, '_blank')
            },
            toSystemAnnounce() {
                this.$router.push({
                    name: "systemAnnounce",
                    query: {
                        active: 1
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "./index.scss";
</style>