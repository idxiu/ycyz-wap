<template>
    <div v-show="isShow" class="ball-notice-mask">
        <div class="btn-pop-box">
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide  v-for="(item, index) in swiperSlides" :key="index">
                    <div v-show="item.wapImg" class="top">
                        <div class="swiper-lazy-preloader">
                            <img src="../../assets/img/zwt.png" alt="">
                        </div>
                        <!--<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>-->
                        <img  :data-src="item.wapImg" class="swiper-lazy">
                    </div>
                    <div class="content" :style="{'border-radius':!item.wapImg?'0.267rem 0.267rem 0 0':''}">
                        <h2>{{item.title}}</h2>
                        <p>{{item.content}}</p>
                        <div class="time">{{item.createTime | filterDate('YYYY年MM月DD日')}}</div>
                    </div>
                    <div class="close pk-1px-t" @click="close()">不再提醒</div>
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
    import {
        swiper,
        swiperSlide
    } from 'vue-awesome-swiper'
    export default {
        components:{
            swiper,
            swiperSlide
        },
        props:['popNotice','isShowPop'],
        computed: {
            Swiper() {
                return this.$refs.mySwiper.swiper
            }
        },
        mounted(){
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
            if(this.swiperSlides.length===1){
                // this.Swiper.destroy(false,false);
                this.dealWithPopNotice();
            }else if(this.swiperSlides.length<1){
                this.isShow = false;
            }else {
                this.dealWithPopNotice();
            }
        },
        data(){
            return {
                isLoaded:false,
                isShow:true,
                swiperSlides: [], //轮播列表
                swiperOption: {
                    spaceBetween: '5%',
                    notNextTick: true,
                    autoplayDisableOnInteraction:false,
                    autoHeight:true,
                    pagination:'.swiper-pagination',
                    lazyLoading : true,//懒加载开启
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents:true,//修改swiper的父元素时，自动初始化swiper
                    onSlideChangeEnd: function(swiper){ 
                        swiper.update() 
                    },
                },
            }
        },
        methods:{
            setStorage(key,value) {
                let curTime = new Date().getTime();
                localStorage.setItem(key,JSON.stringify({data:value,time:curTime}));
            },
            getStorage(key,exp){
                var data = localStorage.getItem(key);
                var dataObj = JSON.parse(data);
                if(dataObj){
                    if (new Date().getTime() - dataObj.time>exp) {
                        console.log('信息已过期');
                    }else{
                        return dataObj.data;
                    }
                }else {
                    return null;
                }
            },
            //点击不再提醒 关闭7天
            close(){
                this.isShow = false;
                this.setStorage('closePopNoticeDay',1);
            },
            //点击全屏或关闭按钮
            closeModal(){
                this.isShow = false;
            },
            //处理弹窗公告显示与否 -前提是必须要后台返回了弹窗公告的数据
            dealWithPopNotice(){
                let data=this.getStorage('closePopNoticeDay',1000*60*60*24*7);//过期时间为7天
                if(data == 1){//点击不再提醒 关闭7天
                    this.isShow = false;
                }else {
                    //closePopNotice == 1 点击了关闭弹窗公告
                    if(sessionStorage.getItem('closePopNotice')==1){
                        this.isShow = false;
                    }
                }
            }
        },

    }
</script>

<style lang='less' scoped>
    @import url("../../components/less/common.less");

    .swiper-lazy-preloader{
        animation:none;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        margin-left: 0;
        margin-top: 0;
        &::after{
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
        background: @color-rgab-black4;
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
            color: @color-primary;

            .top {
                position:relative;
                img {
                    border-radius: 0.267rem 0.267rem 0 0;
                    display: block;
                    width: 100%;
                    height: 3.68rem
                        /* 276/75 */
                    ;
                }
            }

            .content {
                position: relative;
                padding: 0 0.2667rem 0;
                line-height: 0.56rem;
                font-size: .32rem/* 24/75 */;
                color: @color-C;
                max-height: 4rem;
                overflow: auto;
                text-align: center;
                background-color: @color-default;

                h2 {
                    font-size: .48rem/* 36/75 */;
                    color: @color-C;
                    text-align: center;
                    margin-top: .4rem/* 30/75 */;
                    margin-bottom:.26667rem /* 20/75 */;
                    max-height: 2rem;
                    overflow: auto;
                }
                p{
                    line-height: 1;
                    height: .96rem;
                    overflow: auto;
                    letter-spacing: 1px;
                }

                .time {
                    font-size: .32rem/* 24/75 */;
                    padding-right: 0.2667rem;
                    text-align: right;
                    line-height: 1.06667rem;
                    color: @color-M;
                    float: right;
                }
            }

            .close {
                border-radius: 0 0 0.267rem 0.267rem;
                background-color: @color-default;
                font-size: .32rem
                    /* 24/75 */
                ;
                height: 1.06667rem;
                ;
                line-height: 1.06667rem;
                ;
                text-align: center;
                color: @color-J;
                // border-top: 1px solid @color-P;
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
                    color: @color-default;
                    opacity: .5;
                }

            }

        }
    }
</style>