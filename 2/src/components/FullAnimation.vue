<template>
    <div>
        <div v-if="swiperSlides.img.length > 0 && isShow " class="ball-notice-mask">
            <div class="btn-pop-box">
                <swiper :options="swiperOption" ref="mySwiperFull">
                    <swiper-slide v-for="(item, index) in swiperSlides.img" :key="index">
                        <div v-show="item.imageUrl" class="top">
                            <img :data-src="item.imageUrl" class="swiper-lazy" @click="goLink(item)">
                            <!-- <img :src="item.imageUrl" alt=""> -->
                            <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </div>
                    </swiper-slide>
                    <div class="swiper-pagination" style="bottom:0px;" slot="pagination"></div>
                </swiper>
                <div class="close-box" @click="close()">不再提醒</div>
            </div>
            <div class="box-mask" @click="closeModal()"></div>
        </div>
        <iframe v-if="isHfive" id="fullFive" :src="fiveUrl" width="100%" height="100%" frameborder="0"></iframe>
        <div v-if="isHfive" class="h5-close" @click="closeFive()">跳过动画</div>
    </div>
</template>

<script>
    import {
        checkUrl,
    } from "@/services/commonfn.js";
    import {
        getContactus
    } from "@/services/center.js";
    export default {
        props: ["fullScreen", "cdnUrl"],
    
        data() {
            return {
                fiveUrl: "",
                isLoaded: false,
                isShow: true,
                isHfive: false,
                swiperSlides: {
                    img: []
                },
                swiperOption: {
                    spaceBetween: "5%",
                    notNextTick: true,
                    autoplayDisableOnInteraction: false,
                    autoHeight: true,
                    pagination: {
                        el: ".swiper-pagination"
                    },
                    lazy: true, //懒加载开启
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                    onSlideChangeEnd: function(swiper) {
                        swiper.update();
                    }
                },
                contactusUrl: ""
            };
        },
        inject: ["reload"],
        created() {
            let data = this.getStorage("closeFull", 1000 * 60 * 60 * 24 * 7); //过期时间为7天
            if (data == 1) {
                this.isShow = false;
                this.$emit("close", [true]);
            } else {
                this.isShow = true;
            }
            this.getContactuFunc();
        },
        watch: {
            fullScreen: function(newVal, oldVal) {
                this.swiperSlides = this.fullScreen;
                this.swiperSlides.img = 
                    this.swiperSlides.fsaType == 2 ? this.swiperSlides.data : [];
                let isHide = sessionStorage.getItem("closeFive");
    
                if (this.swiperSlides.fsaType == 2) {
                    if (this.swiperSlides.img.length < 1) {
                        this.isShow = false;
                    }
                } else if (this.swiperSlides.fsaType == 1 && !isHide) {
                    this.isHfive = true;
                    this.fiveUrl = this.swiperSlides.data[0].h5File + "/index.html";
                } else {
                    this.$emit("close", [true]);
                }
                window.addEventListener(
                    "message",
                    e => {
                        let data = e.target;
                        if (data) {
                            this.isHfive = false;
                            this.$emit("close", [true]);
                        }
                    },
                    false
                );
            },
            isShow(newVal) {
                if (newVal) {
                    this.$jq("body").addClass("dialog-open");
                } else {
                    this.$jq("body").removeClass("dialog-open");
                }
            }
        },
        methods: {
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
            closeFive() {
                sessionStorage.setItem("closeFive", true);
                this.isHfive = false;
                this.$emit("close", [true]);
            },
            //点击不再提醒 关闭7天
            close() {
                this.isShow = false;
                this.setStorage("closeFull", 1);
                this.$emit("close", [true]);
            },
            //点击全屏或关闭按钮
            closeModal() {
                this.isShow = false;
                this.$emit("close", [true]);
            },
            goLink(item) {
                if (item.linkType == 2) {
                    //外链
                    if (item.linkUrl) {
                        if (item.linkUrl.indexOf("://") != -1) {
                            window.open(
                                item.linkUrl,
                                "_blank",
                                "toolbar=yes, width=1300, height=900"
                            );
                        } else {
                            window.open(
                                "http://" + item.linkUrl,
                                "_blank",
                                "toolbar=yes, width=1300, height=900"
                            );
                        }
                    }
                } else {
                    //内链
                    if(item.linkUrl){
                        var url = checkUrl(item.linkUrl);
                    }else{
                        var url = ''
                    }
                    //跳转到客服外链
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
            }
        }
    };
</script>

<style lang='scss' scoped>
    @import url("./scss/skin.scss");
    .box-mask {
        z-index: 998;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: $color-rgab-black7;
    }
    
    .ball-notice-mask {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: 100%;
        .btn-pop-box {
            z-index: 999;
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            width: 9.2rem;
            height: 12rem;
            border-radius: 0.2rem;
            margin: 0 auto;
            border-radius: 0.267rem;
            color: $color-primary;
            // overflow: hidden;
            .top {
                position: relative;
                width: 9.2rem;
                height: 12rem;
                text-align: center;
                line-height: 12rem;
                img {
                    vertical-align: middle;
                    width: auto;
                    height: auto;
                    max-width: 100%;
                    max-height: 100%;
                    border-radius: 0.2rem;
                }
            }
            .closeBtn {
                width: 100%;
                height: 1.06667rem;
                line-height: 1.06667rem;
                background-color: $default-color;
                text-align: center;
                .closeLeft,
                .closeRight {
                    position: relative;
                    float: left;
                    width: 50%;
                    height: 100%;
                }
                .closeLeft::after {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    height: 100%;
                    width: 1px;
                    content: "";
                    background-color: $color-primary;
                }
            }
        }
    }
    
    #fullFive {
        z-index: 999;
        position: fixed;
        top: 0;
        left: 0;
    }
    
    /deep/.swiper-container {
        padding-bottom: 0.5333rem;
    }
    
    /deep/ .swiper-pagination-bullet {
        background: $default-color;
        opacity: 1;
    }
    
    /deep/.swiper-pagination-bullet-active {
        background-color: $primary-color;
    }
    
    .close-box {
        margin-top: 0.2667rem;
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        width: 3.7333rem;
        height: 1.0667rem;
        text-align: center;
        line-height: 1.0667rem;
        border-radius: 0.5333rem;
        border: solid 0.0267rem $default-bg-color;
        font-size: 0.4267rem;
        letter-spacing: 0.08rem;
        color: $default-color;
    }
    
    .h5-close {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 1000;
        width: 3.7333rem;
        height: 1.0667rem;
        text-align: center;
        line-height: 1.0667rem;
        border-radius: 0.5333rem;
        border: solid 0.0267rem $default-bg-color;
        font-size: 0.4267rem;
        letter-spacing: 0.08rem;
        color: $default-color;
    }
</style>

