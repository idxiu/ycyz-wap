<template>
    <div id="activity">
        <nut-navbar class="pk-title" @on-click-back="$router.go(-1)">
            <a class="spans" slot="back-icon">
                <img class="imgsbank" src="../../assets/img/my-icon/fanhui.png" />
            </a>
            活动中心
            <a class="backIdex" @click="toTab()" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/icon-gift.png">
            </a>
        </nut-navbar>
        <div v-show="loading" class="skeleton vue-skeleton-loading">
            <div class="skeleton-bac-animation"></div>
            <column>
                <skeleton-square width="9rem" height="3rem" :count="6" margin="0.2rem 0.5rem"></skeleton-square>
            </column>
        </div>
        <!-- swiper nav -->
        <swiper v-show="!loading && actType != null" :options="swiperOptionThumbs" class="acttype" ref="swiperThumbs">
            <swiper-slide :class="{active:index===nowIndex}" v-for="(type, index) in actType" :key="index">
                <span @click="toggleTabs(index,type.id)">{{type.activityTypeName}}</span>
            </swiper-slide>
        </swiper>
        <div v-show="!loading" class="content" :style="{'top':(actType == null ? 0:'1rem')}">
            <div @click="toTurntable()" v-show="turntable && turnlist.id != 0" class="activity-list luckdraw">
                <img src="../../assets/img/huodong-dzp.png">
            </div>
            <div v-for="actLists in actList" :key="actLists.id" class="activity-list" :class="{'active':actLists.status === 1}">
                <div v-if="actLists.status === 3" @click="details(actLists.status,actLists.id)" class="maxMask"></div>
                <img v-show="actLists.photo != ''" :src="actLists.photo" @click="details(actLists.status,actLists.id)">
                <img v-show="actLists.photo == ''" src="../../assets/img/errorimg.png" @click="details(actLists.status,actLists.id)">
                <div class="activity-status" :class="{'over':actLists.status === 3,'unbegin':actLists.status === 2}">
                    <span v-if="actLists.status === 1">进行中</span>
                    <span v-else-if="actLists.status === 2">未开始</span>
                    <span v-else-if="actLists.status === 3">已结束</span>
                </div>
                <div class="activity-list-fotter">
                    <!-- <div v-if="actLists.status === 2" class="minMask"></div> -->
                    <div class="title">
                        <span>{{actLists.name}}</span>
                    </div>
                    <div class="button" @click="receive(actLists.id)" :class="{'unbeginTxt':actLists.status === 2 || actLists.status === 3}">
                        <div>
                            <span v-show="actLists.status === 1">立即领取</span>
                            <span v-show="actLists.status === 2">未开始</span>
                            <span v-show="actLists.status === 3">已结束</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="actList == null" class="noData">
                <img src="../../assets/img/bet-record-no-data.png">
                <p>暂无数据</p>
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
    </div>
</template>

<script>
    import "swiper/dist/css/swiper.css";
    import {
        getActtype,
        geTurntable,
        getActivity,
        receiveActivity
    } from "@/services/moneyRecord.js";
    export default {
        name: "activity",
        data() {
            return {
                loading: false,
                isLogin: sessionStorage.getItem("token"),
                turntable: false,
                reHeadLeft: false,
                reHeadRight: false,
                actPop: false,
                actList: [],
                turnlist: [],
                stusta: 0,
                resData: {},
                actType: [],
                nowIndex: 0,
                swiperOptionThumbs: {
                    spaceBetween: 0,
                    loop: true,
                    slidesPerView: 4,
                    loopedSlides: 4, //looped slides should be the same
                    slideToClickedSlide: false
                }
            };
        },
        watch: {
            actPop(newVal, oldVal) {
                if (newVal) {
                    this.ModalHelper.open();
                } else {
                    this.ModalHelper.close();
                }
            }
        },
        mounted() {
            this.getType();
        },
        methods: {
            toggleTabs(index, id) {
                this.nowIndex = index;
                this.getList(id);
            },
            details(status, id) {
                if (status === 1) {
                    //正
                    this.$router.push({
                        name: "actDetail",
                        query: {
                            id: id
                        }
                    });
                } else if (status === 2) {
                    this.$toast.fail("活动未开始", {
                        cover: true,
                        duration: 1000
                    });
                } else if (status === 3) {
                    //结束
                    this.$toast.fail("活动已结束", {
                        cover: true,
                        duration: 1000
                    });
                }
            },
            quickApply(status) {
                if (status === 1) {
                    //正
                    this.actPop = true;
                } else if (status === 2) {
                    //未开始
                    this.$toast.fail("活动未开始", {
                        cover: true,
                        duration: 1000
                    });
                }
            },
            close() {
                this.actPop = false;
            },
            getType() {
                this.loading = true;
                getActtype().then(res => {
                    if (res.success) {
                        console.log(res, "....");
                        this.actType = res.data;
                        if (this.actType != null) {
                            this.actType.unshift({
                                activityTypeName: "全部",
                                id: 0
                            });
                        }
                        this.getList(0);
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            getList(id) {
                let data = {
                    activityId: id
                };
                getActivity(data).then(res => {
                    if (res.success) {
                        this.actList = res.data.list;
                        console.log(res.data, id, ">>>>");
                        if (id === 0) {
                            this.turntable = true;
                            this.turnlist = {
                                title: "幸运大转盘"
                            };
                            this.getTurntable();
                        } else {
                            this.turntable = false;
                        }
                        this.loading = false;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            receive(id) {
                if(!this.isLogin){
                         this.$router.push('login');
                         return;
                }
                let data = {
                    id: id
                };
                receiveActivity(data).then(res => {
                    let resData = res.data;
                    if (res.success) {
                        if (
                            resData.rewardMoney <= 0 &&
                            resData.againMoney != 0 &&
                            resData.againBet != 0
                        ) {
                            //未满足
                            this.stusta = 3;
                        } else if (
                            resData.rewardMoney > 0 &&
                            resData.againMoney != 0 &&
                            resData.againBet != 0
                        ) {
                            //满足1个梯度
                            this.stusta = 2;
                        } else if (
                            resData.rewardMoney > 0 &&
                            resData.againMoney == 0 &&
                            resData.againBet == 0
                        ) {
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
                });
            },
            getTurntable() {
                if (this.isLogin) {
                    geTurntable().then(res => {
                        if (res.success) {
                            if (res.data.status === 1) {
                                this.turntable = true;
                                this.turnlist = res.data;
                            } else {
                                this.turntable = false;
                            }
                        } else {
                            this.$toast.fail(res.message, {
                                cover: true,
                                duration: 1000
                            });
                        }
                    });
                }
            },
            toTurntable() {
                if (!this.isLogin) {
                    this.$router.push({
                        name: "login"
                    });
                    return;
                }
                if (this.turnlist.status === 1) {
                    this.$router.push({
                        name: "luckdraw",
                        query: {
                            id: this.turnlist.id
                        }
                    });
                } else {
                    this.$toast.fail("不在此层级，请联系客服", {
                        cover: true,
                        duration: 1000
                    });
                }
            },
            toTab(){
                if(this.isLogin){
                    this.$router.push('activityRecord');
                }else{
                    this.$router.push('login');
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    #activity {
        position: relative;
        height: 100%;
        /deep/ .acttype {
            z-index: 99;
            position: fixed;
            top: 1.17rem;
            left: 0;
            width: 100%;
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            font-size: 0.42rem;
            background-color: $default-color;
            .active {
                position: relative;
                color: $border-color-active;
                &::before {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    content: "";
                    width: 100%;
                    height: $onerem * 2;
                    background-color: $border-color-active;
                }
            }
        }
        /deep/ .pk-title {
            z-index: 10;
        }
        .content {
            position: absolute;
            top: 1rem;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: scroll;
            /*解决ios上滑动不流畅*/
            -webkit-overflow-scrolling: touch;
            &::-webkit-scrollbar {
                display: none;
            }
            .activity-list {
                z-index: 1;
                margin: 0.4rem auto 0.4rem;
                width: 9.2rem;
                height: 4.8rem;
                border-radius: 0.267rem;
                overflow: hidden;
                position: relative;
                img {
                    width: 100%;
                    height: 4rem;
                    border-radius: 0.267rem 0.267rem 0 0;
                    display: block;
                }
                .activity-status {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 0 0.2rem;
                    height: 0.58667rem;
                    line-height: 0.58667rem;
                    background-color: $state-ongoing;
                    border-radius: 0rem 0.133rem 0rem 0.133rem;
                    color: $default-color;
                    text-align: center;
                    span {
                        font-size: 0.32rem;
                        line-height: 0.48rem;
                    }
                }
                .over {
                    background-color: $state-end;
                }
                .unbegin {
                    background-color: $state-unbegun;
                }
                .activity-list-fotter {
                    position: absolute;
                    width: 100%;
                    height: 0.933rem;
                    line-height: 0.933rem;
                    background: $default-color;
                    bottom: 0;
                    display: flex;
                    .minMask {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba($color: $nondefault-color, $alpha: 0.12);
                    }
                    .title {
                        flex: 4;
                        color: $text-color;
                        padding-left: 0.3rem;
                        font-size: 0.347rem;
                    }
                    .button {
                        color: $state-unbegun;
                        // flex: 1;
                        width: 1.86667rem/* 140/75 */
                        ;
                        text-align: center;
                        font-size: 0.347rem;
                    }
                    .unbeginTxt {
                        color: $label-color;
                    }
                }
                .maxMask {
                    z-index: 999;
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background-color: rgba($color: $nondefault-color, $alpha: 0);
                }
            }
            .active {
                box-shadow: 0 0.15rem 0.4rem 0 rgba($color: $state-unbegun, $alpha: 0.25);
            }
            .luckdraw {
                height: auto;
                img {
                    height: auto;
                }
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
    }
</style>