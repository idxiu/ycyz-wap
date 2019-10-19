<template>
    <div class="container">
        <Header :title="'幸运大抽奖'" :rooter="'-1'" :hasNoBack="true" :iFontsize="'.58667rem'"></Header>

        <div class="conts">
            <div class="lucky-title">{{drawList.table.title}}</div>
            <div class="box-bg">
                <div class="box">
                    <div class="pointer" @click="chou()"></div>
                    <div class="boxbg" :style="{transform:rotate_angle,transition:rotate_transition}">
                        <div class="turn">
                            <div :class="{'wheel-bg6':true}">
                                <div class="prize-list">
                                    <ul class="ulOne">
                                        <li v-for="(item,index) in arrOne" :key="index" :class="{'redbg':index%2 == 0}" :style="{ zIndex: item.zIndex,transform: item.deg }"></li>
                                    </ul>
                                    <ul class="ulTwo">
                                        <li v-if="prize_list.length==6" v-for="(item,index) in arrTwo" :key="index" :class="{'redbg':index%2 == 1}" :style="{ zIndex: item.zIndex,transform: item.deg }"></li>
                                        <li v-if="prize_list.length==8" v-for="(item,index) in arrTwo" :key="index" :class="{'redbg':index%2 == 0}" :style="{ zIndex: item.zIndex,transform: item.deg }"></li>
                                        <li v-if="prize_list.length==10" v-for="(item,index) in arrTwo" :key="index" :class="{'redbg':index%2 == 1}" :style="{ zIndex: item.zIndex,transform: item.deg }"></li>
                                        <li v-if="prize_list.length==12" v-for="(item,index) in arrTwo" :key="index" :class="{'redbg':index%2 == 0}" :style="{ zIndex: item.zIndex,transform: item.deg }"></li>
                                        
                                        <li v-if="prize_list.length==3" style="border:none;z-index:4; transform: rotate(329deg)"></li>
                                    </ul>
                                    <div></div>
                                </div>
                                <div class="prize-list">
                                    <div class="prize-item" :class="{'yellow':index%2 != 0}"  v-for="(item,index) in prize_list" :key="index" :style="{transform:item.troter,width:item.width}">
                                        <div class="prize-pic">
                                            <!--<img v-if="item.prizeType==0" src="../../static/img/xiexie.png">-->
                                        </div>
                                        <div class="prize-name">
                                            {{item.prizeName}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="drawBg"></div>
                </div>
            </div>
        </div>
        <div class="popup" v-show="toast_control">
            <div class="popbg"></div>

            <!-- 中了 特等奖/一等奖/二等奖/三等奖/再来一次 -->
            <div class="popbox" v-show="drawn">
                <div class="popcontent-bg">
                    <img class="faguang" src="../../assets/img/turntable_bg02.png"/>
                    <div class="popcontent">
                        <img class="jingbi" src="../../assets/img/turntable_img_sc.png"/>
                        <div class="content-top">
                            <div class="lucking">
                                <div class="title">恭喜!</div>
                                <div class="money" v-show="hasPrize.prizeType != 2">获得{{hasPrize.prizeName}}</div>
                                <!-- 抽到再来一次 -->
                                <div class="money" v-show="hasPrize.prizeType === 2">获得一次抽奖机会</div>
                            </div>
                        </div>
                        <div class="content-bottom">
                            <div class="btns" @click="toast_control=false">确定</div>
                            <div class="btns again" @click="again">继续抽奖</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 中了 谢谢参与 -->
            <div class="popbox" v-show="eyeshow">
                <div class="popcontent-bg">
                    <div class="popcontent">
                        <img class="jingbi" src="../../assets/img/turntable_img_sc02.png"/>
                        <div class="content-top">
                            <div class="nochanges lucking">
                                <div class="title">
                                    <p>没有中奖，</p> 
                                    <p>请再接再厉哦！</p> 
                                </div>
                            </div>
                        </div>
                        <div class="content-bottom">
                            <div class="btns" @click="toast_control=false">确定</div>
                            <div class="btns again" @click="again">继续抽奖</div>
                        </div>
                    </div>
                </div>
            </div>

                <!-- 没有机会了 -->
            <div class="popbox" v-show="lottery">
                <div class="popcontent-bg" >
                    <div class="popcontent">
                        <img class="jingbi" src="../../assets/img/turntable_img_sc02.png"/>
                        <div class="content-top">
                            <div class="nochanges lucking nochange-2">
                                <div class="title" :style="{'padding-top': saving==0 && spending==0 ?'1.5rem':'0.66667rem'}">
                                    <p>您已经没有抽奖机会了</p> 
                                    <!-- 1.存款和投注 都不为0 ->显示 存款 -->
                                    <p v-show="saving!=0 && spending!=0">存款<span>{{saving}}元</span></p> 

                                    <!-- 2.存款不为0，投注为0 ->显示存款 -->
                                    <p v-show="saving!=0 && spending==0">存款<span>{{saving}}元</span></p> 

                                    <!-- 3.存款为0，投注不为0 ->显示投注 -->
                                    <p v-show="saving==0 && spending!=0">投注<span>{{spending}}元</span></p> 

                                    <p v-show="saving!=0 || spending!=0">即可获得<span>1次</span>抽奖机会！</p>
                                </div>
                            </div>
                        </div>
                        <div class="content-bottom">
                            <div class="btns" @click="toast_control=false">取消</div>
                            <router-link tag="div" v-show="saving!=0" :to="{name:'deposit'}" class="btns again">立即存款</router-link>
                            <router-link tag="div" v-show="saving==0 && spending==0" :to="{name:'deposit'}" class="btns again">立即存款</router-link>
                            <router-link tag="div" v-show="saving==0 && spending!=0" class="btns again" :to="{name:'games'}">立即投注</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!--bottom-->
        <div class="main">
            <div class="content">
                <p>您还有<span class="lottery_ticket">{{lottery_ticket}}</span>次抽奖机会!</p>
               
                <!-- 如果投注为O->显示存款 -->
                <p v-show="saving!=0 && spending==0" class="deposit-money">
                    存款<span class="lottery_ticket">{{saving}}</span>元即可获得一次抽奖机会，<router-link :to="{name:'deposit'}">立即存款</router-link>
                </p>

                <!-- 如果存款为O->显示投注 -->
                <p v-show="spending!=0 && saving==0" class="deposit-money">
                    投注<span class="lottery_ticket">{{spending}}</span>元即可获得一次抽奖机会，<router-link :to="{name:'games'}">我要玩游戏</router-link>
                </p>

                <!-- 如果存款和投注都不为O就->显示存款和投注 -->
                <p v-show="saving!=0 && spending!=0" class="deposit-money">
                    存款<span class="lottery_ticket">{{saving}}</span>元即可获得一次抽奖机会，<router-link :to="{name:'deposit'}">立即存款</router-link>
                </p>
                <p v-show="spending!=0 && saving!=0" class="deposit-money">
                    投注<span class="lottery_ticket">{{spending}}</span>元即可获得一次抽奖机会，<router-link :to="{name:'games'}">我要玩游戏</router-link>
                </p>


                 
            </div>
            <div class="statistics">
                <div class="topbox"></div>
                <div class="stat-box">
                    <div class="stat-cont">
                        <div class="stat-cont-top">
                            <ul>
                                <li v-for="(prizeLists,index) in prizeList" :key="index">
                                    <div class="before">
                                        <div class="money">{{prizeLists.money}}元</div>现金</div>
                                    <div class="after"><span>{{prizeLists.title}}</span></div>
                                </li>
                            </ul>
                        </div>
                        <div class="stat-cont-list">
                            <div class="stat-cont-scroll">
                                <ul>
                                    <li v-for="(history,index) in historyList" class="clearfix" :key="index">
                                        <div class="left">玩家 {{history.memberName | filterPlayerName}} 抽中{{history.prizeName}}</div>
                                        <div class="right">{{history.winningTime | filterDate('H:m')}}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from "../../components/Header";
    import {
        getTurntableInfo,
        getTurntableLottey,
        getTurntableHistory,
        receiveTurntable

    } from '@/api/activity'
    export default {
        components: {
            Header,
        },
        watch: {
            toast_control(newVal, oldVal) {
                console.log('newVal',newVal)
                if (newVal) {
                    this.ModalHelper.open();
                } else {
                    this.ModalHelper.close();
                }
            }
        },
        data() {
            return {
                popbg: 'commonbg',
                drawn: false,
                eyeshow: false,
                animate: false,
                prizeList: [],
                historyList: [],
                drawList: {
                    table: {
                        title: ""
                    }
                },
                thisId: '',
                turnId: '',
                lottery_ticket: 0, //抽奖次数
                winnum: '0', //中奖的下标
                toast_control: false, //抽奖结果和活动规则弹出框控制器
                click_flag: true, //是否可以旋转抽奖
                start_rotating_degree: 0, //转盘初始旋转角度
                rotate_angle: 0, //转盘将要旋转的角度
                start_rotating_degree_pointer: 0, //指针初始旋转角度
                rotate_angle_pointer: 0, //指针将要旋转的度数
                rotate_transition: "", //初始化选中的过度属性控制
                rotate_transition_pointer: "transform 12s ease-in-out", //初始化指针过度属性控制
                prize_list: [], //奖品列表
                arrOne: [],
                arrTwo: [],
                shopUid: '',
                userinfo: '',
                hasPrize: {
                    prizeName: ''
                }, //抽奖之后弹出框信息
                numb: 1,
                lottery: false,
                saving:0,//存款多少元即可获得一次抽奖机会
                spending:0,//消费多少元即可获得一次抽奖机会
            };
        },
        mounted() {
            this.setSan();
            this.history();
        },
        created() {
            setInterval(this.scroll, 1000)
        },
        methods: {
            chou() {
                if (this.lottery_ticket <= 0) {
                    this.click_flag = false;
                    this.lottery = true;
                    this.toast_control = true;
                } else if (this.click_flag) {
                    getTurntableLottey(this.thisId).then(res => {
                        console.log(res);
                        let turnDraw = this.drawList.prizes;
                        for(let i = 0 ; i < turnDraw.length; i++){
                            if (turnDraw[i].id == res.id) {
                                this.winnum = i
                                this.turnId = turnDraw[i].id
                            }
                        }
                        console.log(this.winnum);
                        console.log(this.turnId);


                        this.rotating(this.winnum,()=>{
                            if (this.prize_list[this.winnum].prizeType === 3) {//谢谢参与
                                this.toast_control = true;
                                this.eyeshow = true;
                                this.drawn = false;
                            } else if (this.prize_list[this.winnum].prizeType === 2) {//再来一次
                                this.toast_control = true;
                                this.drawn = true;
                                this.eyeshow = false;
                            }else {
                                this.toast_control = true;
                                this.drawn = true;
                                this.eyeshow = false;
                            }
                            if (this.lottery_ticket <= 0) {
                                this.eyeshow = false;
                                this.drawn = false;
                                this.click_flag = false;
                                this.lottery = true;
                                this.toast_control = true;
                            }
                        });
                        
                    }).catch(err => {
                        this.$toast({
                            message: err,
                            duration: 2000
                        });
                    });
                }
            },
            setSan() {
                this.thisId = this.$route.query.id;
                getTurntableInfo(this.thisId).then(res => {
                    console.log(res,"aaa")
                    this.drawList = res;
                    this.prize_list = res.prizes;
                    console.log(this.prize_list,'---')
                    this.lottery_ticket = res.num || 0;//剩余抽奖次数
                    this.saving = res.table.saving; //存款多少可以抽奖
                    this.spending = res.table.spending;//消费多少可以抽奖
                    let przlist = [];
                    for (let k in res.prizes) {
                        if (res.prizes[k].prizeFee > 0) {
                            przlist.push({
                                money: res.prizes[k].prizeFee,
                                title: res.prizes[k].prizeName
                            })
                        }
                    }
                    this.prizeList = przlist;

                    this.arrOne = [];
                    this.arrTwo = [];
                    this.rotate_angle = "rotate(" + Math.floor(-360 * 100 / this.prize_list.length) / 200 + "deg)";
                    this.start_rotating_degree = Math.floor(-360 * 100 / this.prize_list.length) / 200;
                    for (let i = 0; i < this.prize_list.length; i++) {
                        this.prize_list[i].troter = "rotate(" + Math.floor(360 * 100 / this.prize_list.length) / 100 * (0.5 + Number(i)) + "deg) translateX(-50%)"
                        this.prize_list[i].width = Math.floor(3.14 * 5.6 / this.prize_list.length) + "rem"
                        let item = {
                            value: this.prize_list[i].name,
                            zIndex: Number(i) + 1,
                            deg: "rotate(" + Math.floor(360 * 100 / this.prize_list.length) * i / 100 + "deg)",
                            degnum: i,
                        };
                        if (i < this.prize_list.length / 2) {
                            this.arrOne.push(item)
                        } else {
                            this.arrTwo.push(item)
                        }
                    }
                    console.log(this.prize_list,'prize_list')
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                });
            },
            rotating(index,cb) { //转盘转动函数，index值为中奖的下标，后台会返回中奖的id，这边会首先for循环判断中奖的下标

                this.rotate_transition = "transform 3s cubic-bezier(0.25,0.1,0.01,1)";
                if (!this.click_flag) return;
                let type = 0; // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
                let during_time = 2; // 默认为1s
                let result_index = index; // 最终要旋转到哪一块，对应prize_list的下标
                this.click_flag = false; // 旋转结束前，不允许再次触发
                if (type == 0) {
                    if (this.start_rotating_degree < 0) {
                        this.start_rotating_degree = 0
                    } else {
                        this.start_rotating_degree = this.start_rotating_degree + Math.floor(360 * 100 / this.prize_list.length) / 200
                    }
                    let rotate_angle = this.start_rotating_degree + 360 * 5 + Math.floor(-360 * 100 / this.prize_list.length) / 200 - Math.floor(360 * 100 / this.prize_list.length) * result_index / 100;
                    this.start_rotating_degree = rotate_angle;
                    this.rotate_angle = "rotate(" + rotate_angle + "deg)";
                    // 旋转结束后，允许再次触发
                    setTimeout(() =>{
                        this.game_over();
                        cb?cb():"";
                    }, during_time * 1000 + 1500); // 延时，保证转盘转完
                }
            },
            game_over() {
                this.start_rotating_degree = 360 * (5 * this.numb) - Math.floor(360 * 100 / this.prize_list.length) / 200;
                this.numb++;
                receiveTurntable(this.thisId, this.turnId).then(res => {
                    this.toast_control = true;
                    // this.lottery_ticket--
                    //中了 再来一次 请求次数
                    this.thisId = this.$route.query.id;
                    getTurntableInfo(this.thisId).then(res => {
                        console.log(res,'---')
                        this.lottery_ticket = res.num || 0;
                    }).catch(err => {
                        this.$toast({
                            message: err,
                            duration: 2000
                        });
                    })
                    this.history();


                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                    this.hasPrize.prizeName = err;
                    this.eyeshow = true;
                    this.drawn = false;
                    this.popbg = 'commonbg'
                    this.toast_control = true;
                });
                this.hasPrize = this.prize_list[this.winnum];
                setTimeout(() =>{
                    this.click_flag = true;
                },500);

            },
            again() {
                this.toast_control = false;
                this.chou();
            },
            history() {
                getTurntableHistory(this.thisId).then(res => {
                    console.log('history',res)
                    this.historyList = res.turntableWinningRecord
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                })
            },
            scroll() {
                if (this.historyList.length > 4) {
                    this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
                    setTimeout(() => { //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
                        this.historyList.push(this.historyList[0]); // 将数组的第一个元素添加到数组的
                        this.historyList.shift(); //删除数组的第一个元素
                        this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动
                    }, 500)
                }
            }
        },
        beforeRouteLeave (to, from, next) {
            this.ModalHelper.close();
            next();
        }
    }
</script>


<style lang="less" scoped>
    @import url('../../components/less/common.less');
    .container {
        padding-top: 1.22667rem/* 92/75 */
        ;
        width: 100%;
        background: linear-gradient(@color-other-i, @color-other-j);
        overflow-x: hidden;
        .conts {
            width: 100%;
            padding-top: 0.68rem;
            background-size: 10rem;
            overflow: hidden;
            .lucky-title {
                text-align: center;
                font-size: 0.8rem;
                color:@color-f;
                text-shadow: 0px 5px 5px @color-rgab-d3;
                font-weight: bold;
                max-width: 8rem;
                margin: 0 auto;
            }
            .activitytime {
                height: 0.5rem;
                width: 100%;
                position: absolute;
                .timebg {
                    width: 100%;
                    height: 100%;
                    background: @color-default-black;
                    opacity: 0.3;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                .time {
                    color: @color-default;
                    line-height: 0.5rem;
                    padding-left: 0.2rem;
                    font-size: 0.24rem;
                    position: relative;
                    z-index: 2;
                }
            }
            .rule {
                height: 0.69rem;
                margin-bottom: 2.37rem;
                position: relative;
                .ruletop {
                    width: 1.35rem;
                    height: 0.46rem;
                    position: absolute;
                    right: 0;
                    bottom: 3px;
                    .rulebg {
                        height: 100%;
                        width: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        background: @color-other-k;
                        opacity: 0.3;
                        border-top-left-radius: 0.23rem;
                        border-bottom-left-radius: 0.23rem;
                    }
                    .ruletitle {
                        text-align: center;
                        line-height: 0.46rem;
                        font-size: 0.24rem;
                        color: @color-default;
                        position: relative;
                        z-index: 3;
                        border-top-left-radius: 0.23rem;
                        border-bottom-left-radius: 0.23rem;
                        border-bottom: 3px solid @color-other-k;
                    }
                }
            }
            .title {
                height: 0.46rem;
                text-align: center;
                color: @color-other-l;
                font-size: 0.28rem;
                line-height: 0.46rem;
                font-weight: 700;
                margin-bottom: 0.24rem;
            }
            .box-bg{
                background: url("../../assets/img/img_dzpBg.png") center no-repeat;
            }
            .box {
                width: 7.387rem;
                height: 7.387rem;
                margin: auto;
                margin-top: 0.413rem;
                position: relative;
                overflow: hidden;
                background: linear-gradient(@color-k, @color-b);

                background-size: 100%;
                border-radius: 50%;
                .drawBg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url("../../assets/img/img_dzpFl.gif") no-repeat;
                    background-size: 100%;
                }
                .pointer {
                    width: 2rem;
                    height: 2.667rem;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    z-index: 20;
                    transform: translate(-50%, -60%);
                    background: url("../../assets/img/img_dzpZzsc.png") top center no-repeat;
                    background-size: 100%;
                }
                .boxbg {
                    width: 6.373rem;
                    height: 6.373rem;
                    padding: 0.507rem;
                    .turn {
                        width: 6.373rem;
                        height: 6.373rem;
                        border-radius: 50%;
                        overflow: hidden;
                        background-color: @color-u;
                        .slice {
                            box-sizing: border-box;
                            border: 1px solid @color-other-i;
                        }
                        .wheel-bg6 {
                            width: 100%;
                            height: 100%;
                            position: relative;
                            div {
                                text-align: center;
                            }
                            .prize-list {
                                width: 100%;
                                height: 100%;
                                position: absolute;
                                .redbg {
                                    background: linear-gradient(@color-b, @color-j);
                                }
                                ul {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 50%;
                                    overflow: hidden;
                                    margin: 0;
                                    padding: 0;
                                    li {
                                        position: absolute;
                                        top: 0;
                                        left: 50%;
                                        width: 50%;
                                        height: 50%;
                                        transform-origin: 0 100%;
                                        overflow: hidden;
                                        cursor: pointer;
                                        box-sizing: border-box;
                                        background: @color-u;
                                    }
                                }
                                .ulOne {
                                    clip: rect(0, 6.373rem, 6.373rem, 3.1865rem);
                                }
                                .ulTwo {
                                    clip: rect(0, 3.1865rem, 6.373rem, 0);
                                }
                                .prize-item {
                                    position: absolute;
                                    top: 0;
                                    z-index: 12;
                                    height: 3.1865rem;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    transform-origin: 0 100%;
                                    .prize-pic {
                                        padding-top: 0.3rem;
                                        text-align: center;
                                        img {
                                            width: 0.75rem;
                                        }
                                    }
                                    .prize-name {
                                        font-size: 0.42rem;
                                        color: @color-u;
                                        width: 0.42rem;
                                        margin: 0 auto;
                                    }
                                }
                                .yellow {
                                    .prize-name {
                                        color: @color-e;
                                    }
                                }
                            }
                        }
                    }
                }
                .money {
                    position: absolute;
                    width: 0.57rem;
                    height: 0.55rem;
                    top: 2.17rem;
                    right: -0.2rem;
                }
            }
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
                background: @color-default-black;
                opacity: 0.7;
            }
            .prositbg {
                background: url("../../assets/img/turntable_bg02.png") center top 3rem no-repeat;
                background-size: 100%;
            }
            .commonbg {
                background: url("../../assets/img/turntable_bg01.png") center no-repeat;
                background-size: 100%;
            }
            .popbox {
                width: 10rem;
                height: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                margin: auto;
                text-align: center;
                .popcontent-bg{
                    width:100%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    .faguang{
                        position: absolute;
                        width:100%;
                        height:7.12rem /* 534/75 */;
                        top:-6.5rem;
                        left:0;
                    }
                    .popcontent{
                        .jingbi{
                            position:absolute;
                            top:-.4rem /* 30/75 */;
                            left:-.4rem /* 30/75 */;
                            width:7.37333rem /* 553/75 */;
                            height:6.22667rem /* 467/75 */;
                        }
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width:6.84rem /* 513/75 */;
                        height:5.96rem /* 447/75 */;
                        background:url('../../assets/img/image_dzpPop.png') no-repeat center center;
                        background-size: 100%;
                        .title {
                            padding-top:.66667rem /* 50/75 */;
                            padding-bottom: 0.72rem;
                            font-size: 0.45333rem;
                            color: @color-C;
                        }
                        .text {
                            font-weight: bold;
                            font-size: .45333rem /* 34/75 */;
                            color: @color-J;
                        }
                        .content-top{
                            .lucking {
                                .title {
                                    padding-bottom: .4rem /* 30/75 */;
                                   
                                }
                                .text {
                                    padding-bottom: 0.42rem;
                                }
                                .money {
                                    margin: 0 auto;
                                    width: 4rem /* 300/75 */;
                                    height: 1.06667rem /* 80/75 */;
                                    line-height: 1.06667rem /* 80/75 */;
                                    font-size: .4rem /* 30/75 */;
                                    font-weight: bold;
                                    border-radius: .4rem /* 30/75 */;
                                    background-color: @color-u;
                                    color: @color-m;
                                }
                            }
                            .nochanges{
                                .title{
                                    padding-top:1.06667rem /* 80/75 */;
                                    p{
                                        line-height: 1;
                                        &:last-child{
                                            margin-top:.26667rem /* 20/75 */;
                                        }
                                    }
                                }
                            }
                            .nochange-2{
                                .title{
                                    padding-top:.66667rem /* 50/75 */;
                                    p{
                                        font-size:.37333rem /* 28/75 */;
                                        span{
                                            color: @color-l;
                                            font-size:.48rem /* 36/75 */;
                                            font-weight:bold;
                                        }
                                         &:last-child{
                                            margin-top:.21333rem /* 16/75 */;
                                        }
                                        &:first-child{
                                            margin-bottom:.21333rem /* 16/75 */;
                                        }
                                    }
                                }
                            }
                        }
                        
                        .content-bottom{
                            display:flex;
                            justify-content: space-between;
                            padding:0 1rem /* 75/75 */;
                            width:100%;
                            box-sizing: border-box;
                            position: absolute;
                            bottom:.93333rem /* 70/75 */;
                            .btns{
                                width:2.13333rem /* 160/75 */;
                                height:.93333rem /* 70/75 */;
                                line-height: .93333rem /* 70/75 */;
                                font-size:.37333rem /* 28/75 */;
                                border:1px solid @color-t;
                                border-radius: .13333rem /* 10/75 */;
                                text-align: center;
                                color:@color-t;
                                &.again{
                                    background: @color-t;
                                    color:@color-e;
                                    font-weight: bold;
                                }
                            }
                            
                        }
                    }
                }
            }
            .activityrule {
                width: 5.54rem;
                height: 6.32rem;
                position: absolute;
                top: 20%;
                left: 0;
                right: 0;
                margin: auto;
                background-size: 100%;
                .rulecnt {
                    padding: 1.3rem 0.77rem 0;
                    p {
                        font-size: 0.24rem;
                        line-height: 0.4rem;
                        text-align: justify;
                        color: #333333;
                    }
                    p:last-of-type {
                        color: @color-a;
                    }
                }
            }
        }
        .main {
            position: relative;
            margin-top: 0.987rem;
            padding-bottom: 1.6875rem;
            .content {
                font-size: .4rem /* 30/75 */;
                color: @color-default;
                text-align: center;
                .lottery_ticket {
                    font-size:.64rem /* 48/75 */;
                    color: @color-g;
                }
                .deposit-money{
                    margin-top:.4rem /* 30/75 */;
                    line-height:1;
                    font-size:.4rem /* 30/75 */;
                    span{
                        font-size:.64rem /* 48/75 */;
                        font-weight:bold;
                    }
                    a{
                        font-size:.4rem /* 30/75 */;
                        color: @color-a;
                        text-decoration: underline;
                    }
                }
            }
            .statistics {
                position: relative;
                margin: 0.587rem 0;
                .topbox {
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%, 0);
                    width: 9.2rem;
                    height: 0.267rem;
                    background-color: @color-o;
                    box-shadow: inset 0 0.067rem 0.133rem 0 @color-rgab-black3;
                    border-radius: 0.133rem;
                }
                .stat-box {
                    position: relative;
                    padding: .26667rem /* 20/75 */ 0 0.26rem;
                    margin: 0 auto;
                    width: 8.8rem;
                    overflow: hidden;
                    &:before {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0.08rem;
                        width: 110%;
                        height: .26667rem /* 20/75 */;
                        content: '';
                        background: linear-gradient(@color-other-j, @color-other-i);
                        background-size: 100%;
                    }
                    &:after {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        height: 0.267rem;
                        content: '';
                        background: url("../../assets/img/image_dpzJxBgbtm.png") no-repeat;
                        background-size: 100%;
                    }
                    .stat-cont {
                        background-color: @color-other-i;
                        .stat-cont-top {
                            ul {
                                padding: 0.267rem 0;
                                li {
                                    margin: 0 auto;
                                    width: 5.733rem;
                                    height: 1.533rem;
                                    text-align: center;
                                    color: @color-other-i;
                                    background: url("../../assets/img/img_jxBg.png") center center no-repeat;
                                    background-size: 100% 100%;
                                    .before {
                                        margin-top: 0.24rem;
                                        float: left;
                                        width: 4.2rem;
                                        line-height: 0.5rem;
                                        font-family: PingFangSC-Medium;
                                        font-size: 0.373rem;
                                        .money {
                                            font-size: 0.48rem;
                                        }
                                    }
                                    .after {
                                        float: left;
                                        width: 1.533rem;
                                        font-size: 0.32rem;
                                        span {
                                            display: block;
                                            padding-top: 0.1rem;
                                            margin: 0 auto;
                                            width: 0.32rem;
                                            line-height: 0.4rem;
                                        }
                                    }
                                }
                            }
                        }
                        .stat-cont-list {
                            margin: 0 auto;
                            padding-top: 0.1334rem;
                            padding-bottom: 0.6667rem;
                            width: 8.4rem;
                            border-top: 0.027rem dashed @color-e;
                            .stat-cont-scroll {
                                height: 2.4rem;
                                overflow: hidden;
                                ul {
                                    font-size: 0.187rem;
                                    color: @color-e;
                                    li {
                                        line-height: 0.627rem;
                                        font-size: 0.373rem;
                                        .left {
                                            float: left;
                                        }
                                        .right {
                                            float: right;
                                            text-align: right;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .toast {
            position: fixed;
            top: 50%;
            left: 50%;
            z-index: 999;
            transform: translate(-50%, -50%);
            width: 7.387rem;
            border-radius: 0.3125rem;
            padding: 0.3125rem;
            background-color: @color-S;
            .toast-container {
                position: relative;
                width: 100%;
                height: 100%;
                border: 1px dotted @color-s;
                .toast-picture {
                    position: absolute;
                    top: -6.5rem;
                    left: -1.5rem;
                    width: 7.387rem;
                    height: 7.387rem;
                }
                .close {
                    position: absolute;
                    top: -0.9375rem;
                    right: -0.9375rem;
                    width: 2rem;
                    height: 2rem;
                    background-size: 100%;
                }
                .toast-title {
                    padding: 2.8125rem 0;
                    font-size: 0.24rem;
                    color: @color-o;
                    text-align: center;
                }
                .toast-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.9375rem;
                    .toast-cancel {
                        background-image: -moz-linear-gradient( -18deg, rgb(242, 148, 85) 0%, rgb(252, 124, 88) 51%, rgb(252, 124, 88) 99%);
                        background-image: -ms-linear-gradient( -18deg, rgb(242, 148, 85) 0%, rgb(252, 124, 88) 51%, rgb(252, 124, 88) 99%);
                        background-image: -webkit-linear-gradient( -18deg, rgb(242, 148, 85) 0%, rgb(252, 124, 88) 51%, rgb(252, 124, 88) 99%);
                        box-shadow: 0 0.053rem 0 0 rgba(174, 34, 5, 0.7);
                        width: 4.6875rem;
                        height: 1.875rem;
                        border-radius: 1.875rem;
                        text-align: center;
                        line-height: 1.875rem;
                        color: @color-default;
                    }
                }
            }
        }
        .toast-mask {
            position: fixed;
            top: 0;
            left: 0;
            background: @color-rgab-black6;
            z-index: 998;
            width: 100%;
            height: 100%;
        }
    }
</style>
