<template>
    <div class="noinfo">
        <div class="advBox">
            <div v-if="haveHot" class="adv-top">
                <div class="game-title">热门推荐</div>
                <div class="advScroll">
                    <ul class="clearfix">
                        <li @click="gameInto(item)" v-for="(item,index) in gamelist" :key="index">
                            <div class="game-pic"><img v-lazy="cdnUrl+item.iconUrl" /></div>
                            <div class="game-text">
                                <div class="top">{{item.productName}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="adv-bottom" v-show="isAdv">
                <swiper :options="swiperOption" ref="mySwiper">
                    <swiper-slide v-for="(item, index) in swiperSlides" :key="index">
                        <img :src="item.advImg" alt="" @click="toLink(item)">
                    </swiper-slide>
                </swiper>
                <span class="close" @click="closeadv">关闭</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getGameBanner,
        postAdvStatis,
        getHotGames,
        getImgUrl,
        openGame
    } from "@/services/index";
    import "swiper/dist/css/swiper.css";
    import {
        swiper,
        swiperSlide
    } from "vue-awesome-swiper";
    import {
        checkUrl,
    } from "@/services/commonfn.js";
    import {
        getContactus
    } from "@/services/center.js";
    export default {
        components: {
            swiper,
            swiperSlide
        },
        name: "Advertisement",
        props: ["itype", "typeId"],
        data() {
            return {
                cdnUrl: "",
                haveHot: false,
                isAdv: true,
                gamelist: [],
                swiperOption: {
                    autoplay: {
                        delay: 3000, //3秒切换一次
                        disableOnInteraction: false //，用户操作swiper之后自动切换不会停止，每次都会重新启动autoplay。
                    },
                    spaceBetween: "5%"
                },
                swiperSlides: [],
                contactusUrl: ""
            };
        },
        computed: {
            Swiper() {
                return this.$refs.mySwiper.swiper;
            }
        },
        mounted() {
            console.log(123123);
            this.getHotGame();
            this.getCdnUrl();
            this.getContactuFunc();
            // let _this = this;
            // this.Swiper.on("tap", function() {
            //     let item = _this.swiperSlides[this.clickedIndex];
            //     console.log(item);
            //     postAdvStatis({
            //         advTitle: item.title,
            //         id: item.id,
            //         advType: 1,
            //         advLink: item.advUrl
            //     }).then(res => {
            //         if (res.success) {
            //             console.log(123123123);
            //             if (item.isLink == 1) {
            //                 //外链
            //                 if (item.advUrl) {
            //                     if (item.advUrl.indexOf("://") != -1) {
            //                         window.open(item.advUrl);
            //                     } else {
            //                         window.open("http://" + item.advUrl);
            //                     }
            //                 }
            //             } else {
            //                 //内链
            //                 let url = checkUrl(item.advUrl);
            //                 //跳转到客服外链
            //                 if (url === "kefu") {
            //                     window.open(_this.contactusUrl);
            //                 } else {
            //                     _this.$router.push({
            //                         name: url
            //                     });
            //                 }
            //             }
            //         } else {
            //             _this.$toast.fail(res.msg, {
            //                 cover: true,
            //                 duration: 4000
            //             });
            //         }
            //     });
            // });
        },
        methods: {
            closeadv: function() {
                this.isAdv = !this.isAdv;
            },
            getHotGame() {
                //itype-游戏类型ID 1 彩票 2 电子 3 视讯 4 棋牌 5 体育 1存款成功 2取款成功
                //typeId-广告类型 1=游戏广告 2=其他公告
                getGameBanner({
                    itype: this.itype,
                    typeId: this.typeId
                }).then(res => {
                    if (res.success) {
                        this.swiperSlides = res.data;
                        this.isAdv = this.swiperSlides.length > 0;
                        //如果只有一个slide就销毁swiper
                        if (this.swiperSlides.length <= 1) {
                            this.Swiper.destroy();
                        }
                    } else {
                        this.$toast.fail(res.msg, {
                            cover: true,
                            duration: 4000
                        });
                    }
                });
            },
            async getCdnUrl() {
                let cdnUrl = await getImgUrl();
                if (cdnUrl.data) {
                    let result = await getHotGames();
                    if (result.data) {
                        this.haveHot = true;
                        this.cdnUrl = cdnUrl.data + "/";
                        this.gamelist = result.data;
                    }
                }
            },
            gameInto(item) {
                let data = {
                    platform: item.platformName,
                    gameId: item.platformId + ""
                };
                openGame(data).then(res => {
                    if (res.success) {
                        let loginUrl = res.data;
                        if (loginUrl) {
                            if (loginUrl.indexOf("://") != -1) {
                                window.open(
                                    loginUrl,
                                    "_blank",
                                    "toolbar=yes, width=1300, height=900"
                                );
                            } else {
                                window.open(
                                    "http://" + loginUrl,
                                    "_blank",
                                    "toolbar=yes, width=1300, height=900"
                                );
                            }
                        }
                    } else {
                        this.$toast.fail(res.msg, {
                            cover: true,
                            duration: 4000
                        });
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
            toLink(item) {
                let url = checkUrl(item.advUrl);
                if (item.isLink == 1) {
                    //外链
                    if (item.advUrl) {
                        if (item.advUrl.indexOf("://") != -1) {
                            window.open(
                                item.advUrl);
                        } else {
                            window.open(
                                "http://" + item.advUrl);
                        }
                    }
                } else {
                    if (typeof(url) == 'object') {
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
                            this.$router.push({
                                name: url
                            });
                        }
                    }
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .noinfo {
        .advBox {
            width: 100%;
            .adv-top {
                .game-title {
                    padding-left: 0.4rem;
                    font-size: 0.43rem;
                    font-weight: bold;
                    text-align: left;
                    color: $tip-color;
                    font-weight: 400;
                }
                .advScroll {
                    width: 100%;
                    height: auto;
                    white-space: nowrap;
                    overflow: hidden;
                    overflow-x: scroll;
                    /* 1 */
                    -webkit-backface-visibility: hidden;
                    -webkit-overflow-scrolling: touch;
                    /* 2 */
                    text-align: justify;
                    /* 3 */
                    &::-webkit-scrollbar {
                        display: none;
                    }
                    ul {
                        li {
                            display: inline-block;
                            margin: 0.27rem 0 0.4rem;
                            width: 1.89rem;
                            text-align: center;
                            font-size: 0.32rem;
                            .game-pic {
                                margin: 0 auto;
                                width: 1.63rem;
                                height: 1.63rem;
                                border-radius: 50%;
                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .game-text {
                                margin-top: 0.25rem;
                                .top {
                                    color: $color-primary;
                                }
                                .bottom {
                                    margin-top: 0.13rem;
                                    color: $color-w;
                                }
                            }
                        }
                    }
                }
            }
            .adv-bottom {
                position: relative;
                height: 3.2rem;
                width: 100%;
                .swiper-container,
                img {
                    width: 100%;
                    height: 100%;
                }
                .close {
                    z-index: 999;
                    position: absolute;
                    top: 0.27rem;
                    right: 0.4rem;
                    display: block;
                    width: 1.07rem;
                    height: 0.64rem;
                    line-height: 0.64rem;
                    text-align: center;
                    font-size: 0.32rem;
                    color: $default-color;
                    background-color: $color-N;
                    border-radius: 0.13rem;
                    opacity: 0.6;
                }
            }
        }
    }
</style>
