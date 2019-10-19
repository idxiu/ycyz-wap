<template>
    <div id="customer">
        <!-- 悬浮的HTML -->
        <div class="redbagBtn" v-show="redInfo.nextLotteryTime> 0 || redInfo.id" id="moveDiv" @mousedown="down" @touchstart="down" @mousemove="move" @touchmove="move" @mouseup="end" @touchend="end" @click="clickBag">
        </div>
        <div class="popup" v-show="getShow">
            <div class="popbg"></div>
            <div class="popbox" :class="checkbg">
                <!-- 存款不足 -->
                <div v-show="deposit" class="deposit">
                    <div class="title">
                        <!-- 2018.04.44 12:45<br>
                                                                    至2018.04.44 12:45<br> -->
                        {{info.inStartTime | filterDate('YYYY.MM.DD HH:mm')}}<br> 至{{info.inEndTime | filterDate('YYYY.MM.DD HH:mm')}}<br> 期间还需存款{{info.inSum}}元即可领取红包
                    </div>
                    <router-link tag="div" :to="{name:'deposit'}" class="goDeposit">去存款</router-link>
                    <div class="text">
                        红包领取时间
                        <!-- <p>2018.04.44 12:45-2018.04.44 12:45</p> -->
                        <p>{{info.startTime | filterDate('YYYY.MM.DD HH:mm')}}-{{info.endTime | filterDate('YYYY.MM.DD HH:mm')}}</p>
                    </div>
                </div>
    
                <!-- 存款成功 -->
                <div v-show="success" class="success-info">
                    <div class="title">恭喜!</div>
                    <div class="money">{{info.award}}元</div>
                    <div class="text">红包领取成功！</div>
                </div>
    
                <!-- 投注不足 -->
                <div v-show="consume" class="consume">
                    <div class="title">
                        <!-- 2018.04.44 12:45<br>
                                                                    至2018.04.44 12:45<br> -->
                        {{info.auditStartTime | filterDate('YYYY.MM.DD HH:mm')}}<br> 至{{info.auditEndTime | filterDate('YYYY.MM.DD HH:mm')}}<br> 期间还需投注{{info.betSum}}元即可领取红包
                    </div>
                    <div @click="close" class="goDeposit">去游戏</div>
                    <div class="text">
                        红包领取时间
                        <!-- <p>2018.04.44 12:45-2018.04.44 12:45</p> -->
                        <p>{{info.startTime | filterDate('YYYY.MM.DD HH:mm')}}-{{info.endTime | filterDate('YYYY.MM.DD HH:mm')}}</p>
                    </div>
                </div>
    
                <!-- 未开始 -->
                <div v-show="unbegin" class="unbegin">
                    <div class="title">
                        红包领取时间
                        <p>{{redInfo.startTime | filterDate('YYYY.MM.DD HH:mm')}}-{{redInfo.endTime | filterDate('YYYY.MM.DD HH:mm')}}</p>
                    </div>
                    <div class="countdown">
                        活动倒计时
                        <div class="time-item clearfix">
                            <div class="strong" id="day_show">{{timeinfo.days}}天</div>
                            <div class="strong" id="hour_show">{{timeinfo.hours}}时</div>
                            <div class="strong" id="minute_show">{{timeinfo.minutes}}分</div>
                            <div class="strong" id="second_show">{{timeinfo.seconds}}秒</div>
                        </div>
                    </div>
                </div>
    
                <!-- 额外存款不足 -->
                <div v-show="widthelsedraw" class="widthelsedraws">
                    <div class="title">
                        <!-- 2018.04.44 12:45<br>
                                                                    至2018.04.44 12:45<br> -->
                        {{info.auditStartTime | filterDate('YYYY.MM.DD HH:mm')}}<br> 至{{info.auditEndTime | filterDate('YYYY.MM.DD HH:mm')}}<br> 期间还需存款{{info.inSum}}元即可领取红包
                    </div>
                    <div @click="close();goDeposits()" class="goDeposit">去存款</div>
                    <div class="text">
                        红包领取时间
                        <!-- <p>2018.04.44 12:45-2018.04.44 12:45</p> -->
                        <p>{{info.startTime | filterDate('YYYY.MM.DD HH:mm')}}-{{info.endTime | filterDate('YYYY.MM.DD HH:mm')}}</p>
                    </div>
                </div>
                <div @click="close" class="close iconfont icon-sy-redbag-close"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getRedStyle,
        openRed
    } from "../services/index.js"
    
    export default {
        name: "RedBag",
        props: {
            // isShow: {
            //     type: Boolean,
            //     default: false,
            //     isLogin:'',
            //     setId:null,
            // },
        },
        data() {
            return {
                flags: false,
                position: {
                    x: 0,
                    y: 0
                },
                nx: '',
                ny: '',
                dx: '',
                dy: '',
                xPum: '',
                yPum: '',
                getShow: false,
                deposit: false,
                success: false,
                consume: false,
                unbegin: false,
                widthelsedraw: false,
                info: {},
                checkbg: '',
                canClick: true,
                isLogin: sessionStorage.getItem('token'),
                timeinfo: [],
                redInfo: {},
                isShowRedStyle: true
            }
        },
        mounted() {
            this.getRedStyleFunc();
        },
        methods: {
            getRedStyleFunc() {
                getRedStyle().then(res => {
                    if (res.success) {
                        this.redInfo = res.data;
                        if (this.redInfo.id) {
                            this.isShowRedStyle = true;
                        } else if (this.redInfo.nextLotteryTime > 0) {
                            this.isShowRedStyle = true;
                        } else {
                            this.isShowRedStyle = false;
                        }
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            // 实现移动端拖拽
            down() {
                this.flags = true;
                var touch;
                if (event.touches) {
                    touch = event.touches[0];
                } else {
                    touch = event;
                }
                this.position.x = touch.clientX;
                this.position.y = touch.clientY;
                this.dx = moveDiv.offsetLeft;
                this.dy = moveDiv.offsetTop;
            },
            move() {
                if (this.flags) {
                    var touch;
                    var div = document.getElementById('moveDiv');
                    var divwidth = div.clientWidth;
                    var divheight = div.clientHeight;
                    var winHeight = document.documentElement.clientHeight;
                    var winWidth = document.documentElement.clientWidth;
                    if (event.touches) {
                        touch = event.touches[0];
                    } else {
                        touch = event;
                    }
                    this.nx = touch.clientX - this.position.x;
                    this.ny = touch.clientY - this.position.y;
                    this.xPum = this.dx + this.nx;
                    this.yPum = this.dy + this.ny;
                    if (this.xPum <= 0) {
                        this.xPum = 0
                    }
                    if (this.yPum <= 0) {
                        this.yPum = 0
                    }
                    if (this.xPum >= winWidth - divwidth) {
                        this.xPum = winWidth - divwidth
                    }
                    if (this.yPum >= winHeight - divheight) {
                        this.yPum = winHeight - divheight
                    }
                    moveDiv.style.left = this.xPum + "px";
                    moveDiv.style.top = this.yPum + "px";
                    //阻止页面的滑动默认事件
                    document.addEventListener("touchmove", function() {
                        event.preventDefault();
                    }, false);
                }
                // 阻止冒泡
                event.stopPropagation();
                // 阻止默认事件
                event.preventDefault();
            },
            //鼠标释放时候的函数
            end() {
                this.flags = false;
            },
            clickBag() {
                console.log(this.redInfo)
                if (this.isLogin) {
    
                    if (!this.redInfo.id && this.redInfo.nextLotteryTime > 0) {
                        this.unbegin = true
                        this.success = false
                        this.deposit = false
                        this.consume = false
                        this.widthelsedraw = false
                        this.checkbg = 'successbg'
                        this.countdown(this.redInfo.nextLotteryTime);
                        this.getShow = true
                    } else {
                        let data = {
                            setId: this.redInfo.id
                        }
                        openRed(data).then(resq => {
                            let res = resq.data;
                            if (resq.success) {
                                // this.redInfo = res;
                                this.info = res;
                                
                                if (res.returnType === 1) { //成功
                                    this.success = true
                                    this.deposit = false
                                    this.consume = false
                                    this.unbegin = false
                                    this.widthelsedraw = false
                                    this.checkbg = 'successbg'
                                } else if (res.returnType === 2) { //存款不足
                                    this.deposit = true
                                    this.success = false
                                    this.consume = false
                                    this.unbegin = false
                                    this.widthelsedraw = false
                                    this.checkbg = 'depositbg'
                                } else if (res.returnType === 3) { //投注不足
                                    this.consume = true
                                    this.success = false
                                    this.deposit = false
                                    this.unbegin = false
                                    this.widthelsedraw = false
                                    this.checkbg = 'consumebg'
                                } else if (res.returnType === 4) { //未开始
                                    this.unbegin = true
                                    this.success = false
                                    this.deposit = false
                                    this.consume = false
                                    this.widthelsedraw = false
                                    this.checkbg = 'successbg'
                                    this.countdown(res.startTime)
                                } else if (res.returnType === 5) { //错误返回 额外存款不足
                                    this.widthelsedraw = true
                                    this.success = false
                                    this.deposit = false
                                    this.consume = false
                                    this.unbegin = false
                                    this.checkbg = 'widthelsedraw'
                                }
                                this.getShow = true
                                console.log(res, 'resssss')
                            } else {
                                this.$toast.fail(resq.message, {
                                    cover: true,
                                    duration: 1500
                                });
                            }
                        });
                    }
    
                } else {
                    this.$router.push({
                        name: 'login'
                    })
                }
            },
            goDeposits() {
                this.$router.push({
                    path: "/deposits"
                })
            },
            //倒计时
            downtime(intDiff) {
                const _this = this;
                let day = 0,
                    hour = 0,
                    minute = 0,
                    second = 0; //时间默认值  
                let timer = setInterval(() => {
                    if (intDiff > 0) {
                        day = Math.floor(intDiff / (60 * 60 * 24));
                        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                    }
                    if (minute <= 9) minute = '0' + minute;
                    if (second <= 9) second = '0' + second;
                    this.timeinfo = {
                        days: day,
                        hours: hour,
                        minutes: minute,
                        seconds: second
                    }
                    intDiff--;
                    if (intDiff <= 0) {
                        this.redInfo.nextLotteryTime = 0;
                        clearInterval(timer);
                        this.close();
                        this.$toast.success("有红包可以领取啦", {
                            duration: 1000,
                            onClose() {
                                _this.getRedStyleFunc();
                            }
                        });
                    }
                }, 1000);
            },
            countdown(time) {
                let endDate = new Date().getTime();
                let nTime = time - parseInt(endDate / 1000);
                let intDiff = parseInt(nTime);
                this.downtime(intDiff);
            },
            close() {
                this.getShow = false
            }
        },
    
    }
</script>

<style lang="scss" scoped>
    // @import url("../components/less/common.less");
    $color-default :#fff;
    .redbagBtn {
        width: 2.0667rem;
        height: 2.36rem;
        z-index: 100;
        position: fixed;
        top: 5.5rem;
        right: 0.4rem;
        background: url("../assets/img/image_redbag.png") no-repeat;
        background-size: 100%
    }
    
    .popup {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        .popbg {
            width: 100%;
            height: 100%;
            background: $nondefault-color;
            opacity: 0.7;
        }
        .popbox {
            width: 10rem;
            max-width: 10rem;
            height: 10.6667rem;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin: auto;
            text-align: center;
            color: $color-s;
            .deposit,
            .success-info,
            .consume,
            .unbegin,
            .widthelsedraws {
                margin: 0 auto;
                margin-top: 5.2rem;
                width: 5.6rem;
            }
            .success-info {
                margin-top: 5.6rem;
                font-weight: bold;
                line-height: 1;
                .title {
                    font-size: 0.8rem;
                }
                .money {
                    margin-top: 0.373rem;
                    margin-bottom: 0.4rem;
                    font-size: 0.96rem;
                }
                .text {
                    font-size: 0.48rem;
                }
            }
            .unbegin {
                margin-top: 6rem
            }
            .deposit,
            .consume,
            .unbegin,
            .widthelsedraws {
                .title {
                    font-size: .34rem/* 24/75 */
                    ;
                    line-height: .48rem/* 36/75 */
                    ;
                    display: -webkit-box;
                    overflow: hidden;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                }
                .goDeposit {
                    margin: .26667rem/* 20/75 */
                    auto;
                    width: 2.933rem;
                    height: 0.8rem;
                    line-height: 0.8rem;
                    font-size: 0.4rem;
                    font-weight: bold;
                    background-color: $color-s;
                    box-shadow: 0rem 0.027rem 0.067rem 0rem $color-rgab-black2;
                    ;
                    border-radius: 0.133rem;
                    color: $color-h;
                }
                .text {
                    font-size: .32rem/* 24/75 */
                    ;
                    line-height: 0.4rem;
                    p {
                        font-size: .26667rem/* 20/75 */
                        ;
                    }
                }
                .countdown {
                    margin-top: 0.3rem;
                    .time-item {
                        margin: 0.3rem auto 0;
                        width: 4.3rem;
                        .strong {
                            float: left;
                            margin-right: 0.1rem;
                            width: 1rem;
                            line-height: 0.5rem;
                            font-size: 0.38rem;
                            border-radius: 0.2rem;
                            box-shadow: 1px 1px 3px $color-rgab-black2;
                            background: $color-other-g;
                            color: $color-a;
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
        }
        .close {
            position: absolute;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 1.06667rem;
            color: $color-default;
        }
    }
    
    .successbg {
        background: url("../assets/img/image_redbag_yes.png") center no-repeat;
        background-size: 100%
    }
    
    .depositbg {
        background: url("../assets/img/image_redbag_ckbz.png") center no-repeat;
        background-size: 100%
    }
    
    .consumebg {
        background: url("../assets/img/image_redbag_xfbz.png") center no-repeat;
        background-size: 100%
    }
    
    .widthelsedraw {
        background: url("../assets/img/image_redbag_ewcubz.png") center no-repeat;
        background-size: 100%
    }
</style>
