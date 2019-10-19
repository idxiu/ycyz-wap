<template>
    <div>
        <div v-show="isShow" class="ball-notice-mask">
            <div class="btn-pop-box">
                <swiper :options="swiperOption" ref="mySwiperFull">
                    <swiper-slide  v-for="(item, index) in swiperSlides.img" :key="index">
                        <div v-show="item.img" class="top" @click="goLink(item)">
                            <img :data-src="item.img" class="swiper-lazy">
                            <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </div>
                    </swiper-slide>
                    <div class="swiper-pagination" style="bottom:1.2rem /* 120/75 */;" slot="pagination"></div>
                </swiper>
                <div class="closeBtn">
                    <div class="closeLeft" @click="close()">暂不提示</div>
                    <div class="closeRight" @click="closeModal()">关闭</div>
                </div>
            </div>
            <div class="box-mask" @click="closeModal()"></div>
        </div>
        <iframe v-if="isHfive" id="fullFive" :src="fiveUrl" width="100%" height="100%" frameborder="0"></iframe>
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
        props:['fullScreen','isShowPop','cdnUrl'],
        computed: {
            Swiper() {
                return this.$refs.mySwiperFull.swiper
            },
            // fullAnimateImg(){
            //     return this.fullScreen.img.filter(val => val.url);
            // }
        },
        mounted(){
            this.swiperSlides = this.fullScreen;
            this.swiperSlides.img = this.swiperSlides.img?this.swiperSlides.img.filter(val => val.img):[];

            /*销毁Swiper。销毁所有绑定的监听事件，移除鼠标键盘事件，释放浏览器内存。
                deleteInstance:可选，设为false则不销毁Swiper对象，默认为true。
                cleanupStyles:可选，设为true则清除所有swiper设定选项和样式，比如derection等，默认为false。
                //弹窗公告
                a.只有1条数据 隐藏分页器，禁止滑动 处理是否显示
                b.没有数据就不显示
                c.多条数据 处理是否显示
            */
          
           if(this.swiperSlides.img){
               if(this.swiperSlides.type == 2){
                    if(this.swiperSlides.img.length<1){
                        this.isShow = false;
                    }else {
                        this.dealWithPopNotice();
                    }
                    this.$emit("close",[false])
                }else if(this.swiperSlides.type == 1){
                    this.isHfive = true;
                    this.fiveUrl = this.swiperSlides.h5.h5File + '/index.html';
                    this.$emit("close",[false])
                }else{
                    this.$emit("close",[true])
                }
           }
           window.addEventListener('message',(e)=>{
                let data = e.target;
                if(data){
                    this.isHfive = false;
                    this.$emit("close",[true])
                }
            },false);
            this.dealWithPopNotice();
        },
        data(){
            return {
                fiveUrl: '',
                isLoaded:false,
                isShow:true,
                isHfive:false,
                swiperSlides: '',
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
                let data = localStorage.getItem(key);
                let dataObj = JSON.parse(data);
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
                this.setStorage('closeFull',1);
                this.$emit("close",[true])
            },
            //点击全屏或关闭按钮
            closeModal(){
                this.isShow = false;
                this.$emit("close",[true])
            },
            //处理全屏动画显示与否 -前提是必须要后台返回了全屏动画的数据
            dealWithPopNotice(){
                if(this.swiperSlides.img){
                    let data=this.getStorage('closeFull',1000*60*60*24*7);//过期时间为7天
                    if(data == 1){//点击不再提醒 关闭7天
                        this.isShow = false;
                        this.$emit("close",[true])
                    }else if(this.swiperSlides.img.length == 0){
                        this.isShow = false;
                        this.$emit("close",[true])
                    }else{
                        this.isShow = true;
                    }
                }else{
                    this.isShow = !this.isShow;
                    this.$emit("close",[true])
                }
                if(this.swiperSlides.type == 1){
                    this.isShow = false;
                    this.$emit("close",[false])
                }
            },
            goLink(item){
                console.log(item)
                if(item.linkType == 2){//外链
                    if(item.linkUrl){
                        window.open(item.linkUrl);
                    }
                }else {//内链
                    if(item.linkUrl){
                        this.$router.push({name:item.linkUrl});
                    }
                }
            },
        }
        
    }
</script>

<style lang='less' scoped>
    @import url("../../components/less/common.less");

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
            width: 9.2rem;
            margin: 0 auto;
            border-radius: 0.267rem;
            color: @color-primary;
            overflow: hidden;
            .top {
                position:relative;
                img {
                    border-radius: 0.267rem 0.267rem 0 0;
                    display: block;
                    width: 100%;
                    height: 6.4rem
                        /* 480/75 */
                    ;
                }
            }
            .closeBtn{
                width: 100%;
                height: 1.06667rem;
                line-height: 1.06667rem;
                background-color: @color-default;
                text-align: center;
                .closeLeft,.closeRight{
                    position: relative;
                    float: left;
                    width: 50%;
                    height: 100%;
                }
                .closeLeft::after{
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    height: 100%;
                    width: 1px;
                    content: '';
                    background-color: @color-primary;
                }
            }
        }
    }
    #fullFive{
        z-index: 999;
        position: fixed;
        top: 0;
        left: 0;
    }
</style>
