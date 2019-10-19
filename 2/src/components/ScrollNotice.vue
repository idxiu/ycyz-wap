<template>
    <div v-show="isShow" class="ball-notice-mask">
        <div class="btn-pop-box">
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="(item, index) in swiperSlides" :key="index">
                    <div class="content">
                        <h2>{{item.title}}</h2>
                        <p>{{item.content}}</p>
                        <div class="time">{{item.createTime | filterDate('YYYY年MM月DD日')}}</div>
                    </div>
                    <!-- <div class="close pk-1px-t" @click="close()">关闭</div> -->
                </swiper-slide>
                <div class="swiper-pagination" style="bottom:1.6rem /* 120/75 */;" slot="pagination"></div>
    
            </swiper>
            <div class="close-mask" @click="closeModal()">
                <i class="iconfont icon-input-close"></i>
            </div>
        </div>
        <div class="box-mask" @click="closeModal()"></div>
    </div>
</template>

<script>
    export default {
        props: ['scrollNotice'],
        watch: {
            scrollNotice: function() {
                this.swiperSlides = this.scrollNotice || [];
                if (this.swiperSlides.length === 1) {
                    this.Swiper.destroy(false, true);
                } else if (this.swiperSlides.length < 1) {
                    this.isShow = false;
                }
            }
        },
    
        data() {
            return {
                isShow: true,
                swiperSlides: [], //轮播列表
                swiperOption: {
                    spaceBetween: '5%',
                    notNextTick: true,
                    autoplayDisableOnInteraction: false,
                    autoHeight: true,
                    pagination: '.swiper-pagination',
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                        observeParents: true, //修改swiper的父元素时，自动初始化swiper
                        onSlideChangeEnd: function(swiper) { 
                        swiper.update() 
                    },
                },
            }
        },
        methods: {
            //点击全屏或关闭按钮
            closeModal() {
                this.isShow = false;
                this.$emit("returnScrollNoticeStatus", this.isShow)
            },
    
        },
    
    }
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
            margin: 0 auto;
            border-radius: 0.267rem;
            color: $color-primary;
            .content {
                position: relative;
                padding: 0 0.2667rem 0;
                line-height: 0.56rem;
                font-size: .32rem/* 24/75 */
                ;
                border-radius: 0.267rem;
                color: $color-C;
                overflow: auto;
                text-align: center;
                background-color: $default-color;
                h2 {
                    font-size: .48rem/* 36/75 */
                    ;
                    color: $color-C;
                    text-align: center;
                    margin-top: .4rem/* 30/75 */
                    ;
                    margin-bottom: .26667rem/* 20/75 */
                    ;
                }
                p {
                    line-height: 1;
                    max-height: 2rem;
                    overflow: auto;
                    letter-spacing: 1px;
                }
                .time {
                    font-size: .32rem/* 24/75 */
                    ;
                    padding-right: 0.2667rem;
                    text-align: right;
                    line-height: 1.06667rem;
                    color: $color-M;
                    float: right;
                }
            }
            .close-mask {
                text-align: center;
                margin-top: 1.01333rem
                /* 76/75 */
                ;
                i {
                    font-size: 1.06667rem
                    /* 80/75 */
                    ;
                    color: $default-color;
                    opacity: .5;
                }
            }
        }
    }
</style>