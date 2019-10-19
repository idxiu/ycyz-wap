<template>
    <div class="dz-game-list pk-index">
        <nut-navbar class="pk-title" @on-click-more="isShowSearchBox = true" @on-click-back="back">
            <a class="spans" slot="back-icon">
                <img class="imgsbank" src="../../assets/img/my-icon/fanhui.png" />
            </a>
            游戏大厅
            <a class="spans" slot="more-icon">
                <img src="../../assets/img/index-icon/query.png" alt="">
            </a>
        </nut-navbar>
    
        <div v-if="bannerImg.length > 0" class="game-list-banner">
            <swiper>
                <swiper-slide v-for="(item,index) in bannerImg" :key="index">
                    <img :src="item.advImg" @click="toLink(item)" />
                </swiper-slide>
            </swiper>
        </div>
        <div class="all-game" v-if="classArr.siteApis.length > 0">
            <!-- swiper nav -->
            <swiper :options="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs">
                <swiper-slide :class="'slide-'+type.apiId" v-for="(type, index) in classArr.siteApis" :key="index">
                    <span>{{type.name}}</span>
                </swiper-slide>
            </swiper>
            <!-- swiper data -->
            <div>
                <swiper :options="swiperOptionTop" class="gallery-top" ref="swiperTop" @slideChange="pageChange()" @slideChangeTransitionStart="pageChangeStart()">
                    <swiper-slide class="game-type-list" v-for="(type, index) in classArr.siteApis" :key="index" :class="'slide-'+type.apiId">
                        <div class="game-type-nav">
                            <swiper :options="swiperOptionv" class="swiper-container-style">
                                <swiper-slide v-for="(gameType,idx) in gameTypeArr" :key="idx" class="game-type-nav-item" :class="{'game-type-active':gameTypeActive == idx}">
                                    <div @click="selectGameType(idx,gameType)" class="game-type-name">
                                        <span>{{gameType.value}}</span>
                                    </div>
                                </swiper-slide>
                            </swiper>
                        </div>
                        <div class="game-parent">
                            <div v-for="(gameChild,idx) in gameList" :key="idx" class="game-item" @click="toPlay(gameTypeActiveObj)">
                                <img src="../../assets/img/paly.png" alt="" class="play-icon" v-if="gameTypeActiveObj.swHref &&  gameChild.whStatus == 1">
                                <img v-lazy="gameImgUrl+'/'+gameTypeActiveObj.apiPlatform+'/'+gameChild.image" alt="" v-if="gameClassId != 217">
                                <img v-lazy="gameChild.image" alt="" v-if="gameClassId == 217">
                                <p>{{gameChild.name}}</p>
                                <img src="../../assets/img/weuhu.png" alt="" class="play-icon" v-if="gameTypeActiveObj.whStatus == 2">
                            </div>
                        </div>
                        <no-data v-show="gameList<=0 && !showLoading"></no-data>
                        <div class="skeleton vue-skeleton-loading" v-if="showLoading && gameList<=0">
                            <div class="skeleton-bac-animation"></div>
                            <div class="skeleton-bac-content" v-for="idx in skeletonLen" :key="idx">
                                <row padding="0.2rem  0 0 0 ">
                                    <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                                    <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                                    <skeleton-square width="2.9777rem" style="height:2.9777rem" margin="0 0 0 0.2667rem"></skeleton-square>
                                </row>
                            </div>
    
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <div class="search-box" v-if="isShowSearchBox">
            <div class="search-box-mask" @click="isShowSearchBox = false;searchGameName = ''"></div>
            <div class="search-box-cent">
                <input type="text" v-model="searchGameName">
                <button @click="searchGameNameFunc">搜索</button>
            </div>
        </div>
        <!-- 快捷额度转换 -->
        <Gamepop :allmoneyPop="userinfo.balance" :gameType="gameType" :state="toast_control" :platformId="platformId" :platformName="platformName" :gameName="productName" :gameId="gameId" :isDW="userinfo.isShill == 1" :balances="balance" @returnState="returnState"></Gamepop>
    </div>
</template>

<script>
    import NoData from "@/components/NoData.vue";
    import Gamepop from "../../components/Gamepop";
    import {
        getImgUrl,
        getGameType,
        getDzGameList,
        getGameBanner,
        openGame
    } from "../../services/index.js";
    import {
        getInfo,
    } from "../../services/auth.js";
    export default {
        name: "games",
        components: {
            NoData,
            Gamepop
        },
        data() {
            return {
                showLoading: true,
                skeletonLen: 4,
                gameClassId: "",
                classArr: {
                    siteApis: []
                },
                swiperOptionTop: {
                    spaceBetween: 0,
                     freeMode: true
                },
                swiperOptionThumbs: {
                    spaceBetween: 0,
                    slidesPerView: 4,
                    touchRatio: 0.2,
                    loop: true,
                    loopedSlides: 6, //looped slides should be the same
                    slideToClickedSlide: true,
                    width: undefined //enable auto height
                },
                swiperOptionv: {
                    slidesPerView: 4,
                    freeMode: true
                },
                userinfo: {},
                gameList: [],
                gameListAll: [],
                gameListOldSearch: [],
                gameImgUrl: "",
                gameTypeActiveObj: {},
                gameTypeActive: 0,
                gameTypeActiveId: 0,
                gameTypeActiveList: {},
                gameTypeArr: [],
                isShowSearchBox: false,
                searchGameName: "",
                bannerImg: [],
                isLogin: sessionStorage.getItem("token"),
                //---额度转换
                userinfo: {},
                platformId: 0,
                platformName: "",
                productName: "",
                gameId: 0,
                gameType: 0,
                balance: 0,
                toast_control: false,
            };
        },
        created() {
            // this.gameClassId = this.$route.query.gameClassId * 1;
        },
        mounted() {
            this.classArr = JSON.parse(sessionStorage.getItem("dzClass"));
            this.gameClassId = this.classArr.siteApis[0].apiId;
            this.gameTypeActiveObj = this.classArr.siteApis[0];
            this.getImgUrlFunc();
            this.getGameTypeFunc();
            this.getGameListFunc();
            this.getGameBannerFunc();
            if (this.isLogin) {
                this.getInfoFunc();
            }
        },
    
        methods: {
             getInfoFunc() {
                getInfo().then(res => {
                    if (res.success) {
                        this.userinfo = res.data.user;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getGameBannerFunc() {
                let data = {
                    itype: 2,
                    typeId: 1
                }
                getGameBanner(data).then(res => {
                    if (res.success) {
                        this.bannerImg = res.data || [];
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            selectGameType(index, gameType) {
                this.gameTypeActive = index;
                this.gameTypeActiveId = gameType.key;
                this.showLoading = true;
                let arr = [];
                this.gameList = [];
                if (this.gameTypeActiveId) {
                    this.gameListAll.map(game => {
                        if (game.topId == gameType.key) {
                            arr.push(game);
                        }
                    })
                } else {
                    arr = this.gameListAll;
                    
                }
                setTimeout(() => {
                    this.gameList = arr;
                    this.gameListOldSearch = this.gameList;
                    this.showLoading = false;
                }, 10);
            },
            pageChangeStart() {
                this.showLoading = true;
            },
            pageChange() {
                const idx = this.$refs.swiperTop.swiper.realIndex;
                this.gameTypeActive = 0;
                this.gameTypeActiveId = 0;
                this.gameList = [];
                setTimeout(() => {
                    this.gameClassId = this.classArr.siteApis[idx].apiId;
                    this.gameTypeActiveObj = this.classArr.siteApis[idx];
                    this.getGameListFunc();
                }, 10);
            },
            getGameListFunc() {
                this.showLoading = true;
                let data = {
                    productId: this.gameClassId
                };
                if (this.gameTypeActiveId) {
                    data.typeId = this.gameTypeActiveId * 1;
                }
                getDzGameList(data).then(res => {
                    if (res.success) {
                        this.gameList = res.data.casinoGames || [];
                        this.gameListAll = this.gameList || [];
                        this.gameListOldSearch = this.gameList;
                        this.showLoading = false;
                       
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getGameTypeFunc() {
                getGameType().then(res => {
                    if (res.success) {
                        this.gameTypeArr = res.data;
                        this.gameTypeArr.unshift({
                            key: 0,
                            value: "全部",
                            sort: 0
                        });
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
                        this.gameImgUrl = res.data;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            searchGameNameFunc() {
                this.isShowSearchBox = false;
                this.showLoading = true;
                let arr = this.gameListOldSearch,
                    searchArr = [];
                this.gameList = [];
                if (!this.searchGameName) {
                    searchArr = arr;
                } else {
                    arr.map(game => {
                        if (game.name.indexOf(this.searchGameName) > -1) {
                            searchArr.push(game);
                        }
                    });
                }
    
                setTimeout(() => {
                    this.gameList = searchArr;
                    this.showLoading = false;
                    this.searchGameName = "";
                }, 10);
            },
            toPlay(game) {
                if (game.whStatus == 2) {
                    this.$toast.fail("游戏维护中...", {
                        cover: true,
                        duration: 1500
                    });
                    return;
                }
                if (!this.isLogin && game.swHref && game.whStatus == 1) {
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
                    if (this.isLogin) {
                        this.userinfo.apis.map(gameApi => {
                            console.log(game.apiPlatformId, gameApi.apiId);
                            if (game.apiPlatformId == gameApi.apiId) {
                                this.balance = gameApi.balance;
                                this.platformId = game.apiPlatformId;
                                this.platformName = game.apiPlatform;
                                this.productName = game.name;
                                this.gameId = game.apiId;
                                this.gameType = game.apiTypeId;
                                console.log(123123);
                                if (this.freeWalletSwitch == 2) {
                                    this.toast_control = true;
                                } else {
                                    this.intoGame();
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
            intoGame() {
                let data = {
                    gameType: 2,
                    platform: this.platformName,
                    gameId: this.gameId + '',
                    isDW: this.isDW
                }
                openGame(data).then(res => {
                    if (res.success) {
                        if (res.data) {
                            console.log(res.data);
                            window.open(res.data, '_blank', 'toolbar=yes, width=1300, height=900')
                        }
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
            back() {
                this.$router.go(-1);
    
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
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "./index.scss";
    /deep/.nut-navbar {
        .nav-right {
            margin: 0;
            transform: translate(0, -50%);
            height: 0.64rem;
        }
    }
    
    .spans {
        img {
            width: 0.64rem;
        }
    }
</style>
