<template>
    <div>
        <nut-navbar class="pk-title" @on-click-back="$router.go(-1)">
            <a class="spans" slot="back-icon">
                <img class="imgsbank" src="../../assets/img/my-icon/fanhui.png" />
            </a>
            活动中心
            <a class="backIdex" @click="$router.push('/')" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
            </a>
        </nut-navbar>
        <div class="skeleton vue-skeleton-loading" v-show="loading">
            <div class="skeleton-bac-animation"></div>
            <div class="skeleton-bac-content">
                <skeleton-square width="9rem" height="3rem" margin="0.2rem 0.5rem">
                </skeleton-square>
                <column>
                    <skeleton-square width="8rem" :count="2" margin="0.2rem 0.5rem"></skeleton-square>
                    <skeleton-square width="5rem" margin="0.2rem 0.5rem"></skeleton-square>
                </column>
                <skeleton-square width="9rem" height="1rem" margin="0.2rem 0.5rem">
                </skeleton-square>
            </div>
        </div>
        <div v-show="!loading" class="act-detail">
            <div class="self-img">
                <img :src="info.photo">
            </div>
            <div class="self-title">
                <h2>{{info.name}}</h2>
            </div>
            <div class="selfdetail-content" v-html="info.content"></div>
            <div class="self-btn" @click="receive">
                <div>
                    <span>点击领取</span>
                </div>
            </div>
            <div class="self-btn record">
                <div @click="toTab">
                    <span>活动领取记录</span>
                </div>
            </div>
        </div>
        <!--弹窗-->
        <div class="actPop" v-show="actPop">
            <div class="actpopBox">
                <div class="btnpopContent" v-if="stusta ==1">
                    <div class="giftPic" @click="actPop = false"><img src="../../assets/img/img_hdpop_cg.png" alt=""></div>
                    <div class="giftbox">
                        <div class="tit">恭喜!<br>{{resData.rewardMoney}}<span>元</span></div>
                        <div class="text">
                            <p>奖励金领取成功!</p>
                        </div>
                        <div class="close" @click="actPop = false">关闭</div>
                    </div>
                </div>
                <div class="btnpopContent" v-if="stusta ==2">
                    <div class="giftPic" @click="actPop = false"><img src="../../assets/img/img_hdpop_cg.png" alt=""></div>
                    <div class="giftbox">
                        <div class="tit">恭喜!<br>{{resData.rewardMoney}}<span>元</span></div>
                        <div class="text">
                            <p>奖励金领取成功!</p>
                            活动时间{{resData.beginTime |filterDate}}至{{resData.endTime | filterDate}}内,再次投注{{resData.againBet}}元即可领取{{resData.againMoney}}元奖励。
                        </div>
                        <div class="close" @click="$router.push('/')">去游戏</div>
                    </div>
                </div>
                <div class="btnpopContent fail" v-if="stusta ==3">
                    <div class="giftPic" @click="actPop = false"><img src="../../assets/img/img_hdpop_sb.png" alt=""></div>
                    <div class="giftbox">
                        <div class="tit">领取失败</div>
                        <div class="text">
                            活动时间{{resData.beginTime |filterDate}}至{{resData.endTime | filterDate}}内,投注{{resData.againBet}}元即可领取{{resData.againMoney}}元奖励。
                        </div>
                        <div class="close" @click="$router.push('/')">去游戏</div>
                    </div>
                </div>
            </div>
            <div class="box-mask" @click="close"></div>
        </div>
        <div class="bg"></div>
    </div>
</template>

<script>
    import {
        getActivity,
        receiveActivity
    } from "../../services/moneyRecord.js";
    export default {
        name: "actDetail",
        data() {
            return {
                loading: false,
                id: this.$route.query.id,
                isLogin: sessionStorage.getItem('token'),
                info: {},
                stusta: 1,
                actPop: false,
                resData: {}
            }
        },
        mounted() {
            this.getInfo();
        },
        methods: {
            getInfo() {
                this.loading = true;
                let data = {
                    activityId: 0
                }
                getActivity(data).then(res => {
                    if (res.success) {
                        res.data.list.map(v => {
                            if (this.id == v.id) {
                                this.info = v;
                            }
                        })
                        this.loading = false;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                })
            },
            receive() {
                if (!this.isLogin) {
                    this.$router.push({
                        name: 'login'
                    });
                    return;
                }
                if (this.info.status == 2) {
                    this.$toast({
                        message: '活动未开始',
                        duration: 1000
                    });
                    return;
                }
                let data = {
                    id: Number(this.id)
                }
                receiveActivity(data).then(res => {
                    let resData = res.data;
                    if (res.success) {
                        if (resData.rewardMoney <= 0 && resData.againMoney != 0 && resData.againBet != 0) {
                            //未满足
                            this.stusta = 3;
                        } else if (resData.rewardMoney > 0 && resData.againMoney != 0 && resData.againBet != 0) {
                            //满足1个梯度
                            this.stusta = 2;
                        } else if (resData.rewardMoney > 0 && resData.againMoney == 0 && resData.againBet == 0) {
                            this.stusta = 1;
                        }
                        this.resData = resData;
                        this.actPop = true;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                })
            },
            close() {
                this.actPop = false;
            },
            toTab() {
                if (this.isLogin) {
                    this.$router.push('activityRecord');
                } else {
                    this.$router.push('login');
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    img {
        max-width: 100%;
    }
    
    /deep/ .nut-navbar {
        .nav-left {
            .back {
                width: 0.5rem;
            }
        }
        .nav-right {
            width: 1rem;
            .more {
                float: none
            }
        }
    }
    
    .act-detail {
        z-index: 1;
        position: relative;
        padding-bottom: 0.5333rem;
        .self-img {
            width: 100%;
            height: 4rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .self-title {
            background: $default-color;
            h2 {
                position: relative;
                line-height: 1.2rem;
                padding-left: 0.72rem;
                font-size: .48rem/* 36/75 */
                ;
                color: $text-color;
                &:before {
                    position: absolute;
                    top: 50%;
                    left: 0.4rem;
                    transform: translateY(-50%);
                    content: '';
                    width: 0.067rem;
                    height: 0.4rem;
                    background-color: #488bfe;
                    border-radius: 0.033rem;
                }
            }
        }
        .selfdetail-content {
            background: $default-color;
            padding: 0 .4rem 0.387rem;
            font-size: 0.347rem;
            color: $tip-color;
            overflow: hidden;
            /deep/img {
                width: auto !important;
                max-width: 100% !important;
            }
        }
        .self-btn {
            margin: 0.667rem auto 0;
            width: 9.2rem;
            height: 1.2rem;
            line-height: 1.2rem;
            text-align: center;
            font-size: 0.48rem;
            letter-spacing: 0.096rem;
            color: $default-color;
            background-color: $state-unbegun;
            border-radius: 0.133rem;
        }
        .record {
            margin: 0.373rem auto 0;
            color: $state-unbegun;
            background-color: $default-color;
            border: solid 0.027rem #488bfe;
        }
    }
    
    .actPop {
        .actpopBox {
            z-index: 1000;
            position: fixed;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            width: 7.413rem;
            .btnpopContent {
                text-align: center;
                .giftPic {
                    height: 2.453rem;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .giftbox {
                    padding-bottom: 0.6rem;
                    border-radius: 0.267rem;
                    color: $default-color;
                    background: $gift-bgtop;
                    background: -webkit-gradient( linear, left top, left bottom, color-stop(0%, $gift-bgbottom), color-stop(100%, $gift-bgtop));
                    background: -webkit-linear-gradient( top, $gift-bgbottom 0%, $gift-bgtop 100%);
                    background: linear-gradient( to bottom, $gift-bgbottom 0%, $gift-bgtop 100%);
                    .tit {
                        padding-top: 0.5rem;
                        font-size: 0.64rem;
                        color: $default-color;
                        span {
                            font-size: 0.4rem;
                        }
                    }
                    .text {
                        padding: 0 0.6rem;
                        margin: 0.2rem 0 1rem;
                        text-align: left;
                        font-size: 0.32rem;
                        line-height: 0.667rem;
                        p {
                            margin-bottom: 0.2rem;
                            font-size: 0.373rem;
                            text-align: center;
                        }
                    }
                    .close {
                        margin: 0 auto;
                        width: 3.6rem;
                        height: 1.067rem;
                        font-size: 0.48rem;
                        line-height: 1.067rem;
                        background-color: $default-color;
                        border-radius: 0.533rem;
                        color: $gift-close;
                        box-shadow: 0 0.027rem 0.067rem 0 rgba($color: $default-color, $alpha: 0.4);
                    }
                }
            }
            .fail {
                .giftPic {
                    margin: 0 auto;
                    width: 6.133rem;
                    height: 2.04rem;
                }
                .tit {
                    line-height: 0.6rem;
                    padding: 1rem 0 0.5rem;
                }
            }
        }
        .box-mask {
            z-index: 999;
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: rgba($color: $nondefault-color, $alpha: 0.4);
        }
    }
    
    .bg {
        z-index: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>