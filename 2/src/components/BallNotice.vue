<template>
    <div v-show="isShow" class="ball-notice-mask">
        <div class="btn-pop-box" v-if="ischangeShow">
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="(item, index) in swiperSlides" :key="index">
                    <div v-show="item.imgUrl" class="top">
                        <div class="swiper-lazy-preloader swiper-lazy-preloader-white">
                            <img src="../assets/img/zwt.png" alt="">
                        </div>
                        <!--<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>-->
                        <img :data-src="item.imgUrl" class="swiper-lazy">
                    </div>
                    <div class="content" :style="{'border-radius':!item.imgUrl?'0.267rem 0.267rem 0 0':''}">
                        <h2>{{item.title}}</h2>
                        <div class="box-cent">
                            <p v-html="item.content"></p>
                            <div class="time">{{item.startTime | filterDate('YYYY年MM月DD日')}}</div>
                        </div>
                    </div>
                    <!-- <div class="close pk-1px-t" @click="close()">不再提醒</div> -->
                </swiper-slide>
                <div class="swiper-pagination" style="bottom:0px;" slot="pagination"></div>
            </swiper>
            <div class="close-box" @click="close()">不再提醒</div>
        </div>
        <div class="box-mask" @click="closeModal()"></div>
    </div>
</template>

<script>
    export default {
        props: ["popNotice", "isShowPop"],
        data() {
            return {
                isLoaded: false,
                isShow: true,
                ischangeShow: false,
                swiperSlides: [], //轮播列表
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
                }
            };
        },
        mounted() {
            this.swiperSlides = this.popNotice || [];
            // console.log(this.swiperSlides,'---')
            /*销毁Swiper。销毁所有绑定的监听事件，移除鼠标键盘事件，释放浏览器内存。
                                deleteInstance:可选，设为false则不销毁Swiper对象，默认为true。
                                cleanupStyles:可选，设为true则清除所有swiper设定选项和样式，比如derection等，默认为false。
                                //弹窗公告 
                                a.只有1条数据 隐藏分页器，禁止滑动 处理是否显示
                                b.没有数据就不显示
                                c.多条数据 处理是否显示
                            */
            if (this.swiperSlides.length === 1) {
                // this.Swiper.destroy(false,false);
                this.dealWithPopNotice();
                this.ischangeShow = true;
            } else if (this.swiperSlides.length < 1) {
                this.isShow = false;
            } else {
                this.dealWithPopNotice();
                this.ischangeShow = true;
            }
        },
        watch: {
            popNotice: function(newVal, oldVal) {
                this.swiperSlides = newVal || [];
                this.isShow = this.swiperSlides.length > 0;
                if (this.isShow) {
                    this.dealWithPopNotice();
                    this.ischangeShow = true;
                }
            },
            isShowPop: function(newVal, oldVal) {
                if (newVal) {
                    this.ischangeShow = newVal;
                }
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
                var data = localStorage.getItem(key);
                var dataObj = JSON.parse(data);
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
            //点击不再提醒 关闭7天
            close() {
                this.ischangeShow = false;
                this.isShow = false;
                this.setStorage("closePopNoticeDay", 1);
            },
            //点击全屏或关闭按钮
            closeModal() {
                this.isShow = false;
                this.$jq("body").removeClass("dialog-open");
            },
            //处理弹窗公告显示与否 -前提是必须要后台返回了弹窗公告的数据
            dealWithPopNotice() {
                let data = this.getStorage("closePopNoticeDay", 1000 * 60 * 60 * 24 * 7); //过期时间为7天
                if (data == 1) {
                    //点击不再提醒 关闭7天
                    this.isShow = false;
                } else {
                    //closePopNotice == 1 点击了关闭弹窗公告
                    if (sessionStorage.getItem("closePopNotice") == 1) {
                        this.isShow = false;
                    }
                }
            }
        }
    };
</script>

<style lang='scss' scoped>
    @import url("./scss/skin.scss");
    .swiper-lazy-preloader {
        animation: none;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        margin-left: 0;
        margin-top: 0;
        &::after {
            display: none;
        }
    }
    
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
            // overflow: hidden;
            width: 9.2rem;
            margin: 0 auto;
            border-radius: 0.267rem;
            color: $color-primary;
            .top {
                position: relative;
                img {
                    border-radius: 0.1333rem 0.1333rem 0 0;
                    display: block;
                    width: 100%;
                    height: 3.2667rem;
                }
            }
            .content {
                position: relative;
                padding: 0 0.4rem 0.4rem;
                font-size: 0.32rem/* 24/75 */
                ;
                color: $color-C;
                max-height: 4.7467rem;
                overflow: auto;
                background-color: $default-color;
                border-radius: 0 0 0.1333rem 0.1333rem;
                h2 {
                    margin: 0.4rem 0 0.2667rem;
                    color: $color-C;
                    text-align: left;
                    max-height: 2rem;
                    overflow: auto;
                    font-size: 0.4267rem;
                    color: #090907;
                }
                .box-cent {
                    width: 100%;
                    line-height: 1;
                    max-height: 3.3333rem;
                    overflow: auto;
                    letter-spacing: 1px;
                    word-break: break-word;
                    text-align: left;
                    .time {
                        font-size: 0.32rem/* 24/75 */
                        ;
                        padding-right: 0.2667rem;
                        text-align: right;
                        line-height: 1.06667rem;
                        color: $color-M;
                        float: right;
                    }
                }
            }
            .close {
                border-radius: 0 0 0.267rem 0.267rem;
                background-color: $default-color;
                font-size: 0.32rem/* 24/75 */
                ;
                height: 1.06667rem;
                line-height: 1.06667rem;
                text-align: center;
                color: $color-J;
                // border-top: 1px solid $color-P;
            }
            .close-mask {
                text-align: center;
                margin-top: 1.01333rem/* 76/75 */
                ;
                i {
                    font-size: 1.06667rem/* 80/75 */
                    ;
                    color: $default-color;
                    opacity: 0.5;
                }
            }
        }
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
</style>