<template>
    <div class="statis">
        <Header :title="'推广统计'" :showRight="true" :rooter="'-1'"></Header>
        <div class="hasbox"></div>
        <div class="content">
            <div class="tab-list">
                <ul>
                    <li :class="{'active':active == 2}" @click="changeDate(2)">今日</li>
                    <li :class="{'active':active == 1}" @click="changeDate(1)">昨日</li>
                    <li :class="{'active':active == 5}" @click="changeDate(5)">本月</li>
                    <li :class="{'active':active == 6}" @click="changeDate(6)">上月</li>
                </ul>
            </div>
            <div class="gray"></div>
            <div class="statis-box orange-box">
                <ul>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">彩票投注</div>
                        <div class="statis-box-item-bottom">{{info.cpBet}}</div>
                    </li>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">棋牌投注</div>
                        <div class="statis-box-item-bottom">{{info.qpBet}}</div>
                    </li>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">电子投注</div>
                        <div class="statis-box-item-bottom">{{info.dzBet}}</div>
                    </li>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">捕鱼投注</div>
                        <div class="statis-box-item-bottom">{{info.byBet}}</div>
                    </li>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">体育投注</div>
                        <div class="statis-box-item-bottom">{{info.tyBet}}</div>
                    </li>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">视讯投注</div>
                        <div class="statis-box-item-bottom">{{info.sxBet}}</div>
                    </li>
    
                </ul>
            </div>
            <div class="gray"></div>
            <div class="statis-box blue-box">
                <ul>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">投注返佣</div>
                        <div class="statis-box-item-bottom">{{info.tzRebate}}</div>
                    </li>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">报表返佣</div>
                        <div class="statis-box-item-bottom">{{info.bbRebate}}</div>
                    </li>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">推广人数</div>
                        <div class="statis-box-item-bottom">{{info.spreadNum}}</div>
                    </li>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">投注人数</div>
                        <div class="statis-box-item-bottom">{{info.betNum}}</div>
                    </li>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">团队充值</div>
                        <div class="statis-box-item-bottom">{{info.recharge}}</div>
                    </li>
                    <li class="statis-box-item">
                        <div class="statis-box-item-top">团队提现</div>
                        <div class="statis-box-item-bottom">{{info.withdraw}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from "@/components/Header";
    import {
        statisList
    } from "@/api/spread";
    export default {
        name: "generalizeLink",
        components: {
            Header
        },
        data() {
            return {
                active: 2,
                info: {
                    cpBet: 0,
                    qpBet: 0,
                    dzBet: 0,
                    byBet: 0,
                    tyBet: 0,
                    sxBet: 0,
                    spreadNum: 0,
                    betNum: 0,
                    recharge: 0,
                    withdraw: 0,
                    bbRebate: 0,
                    tzRebate: 0
                }
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            changeDate(date) {
                if (this.active == date) {
                    return;
                }
                this.active = date;
                this.getList();
            },
            getList() {
                statisList(this.active * 1)
                    .then(res => {
                        console.log(res);
                        this.info.cpBet = res.cpBet || 0;
                        this.info.qpBet = res.qpBet || 0;
                        this.info.dzBet = res.dzBet || 0;
                        this.info.byBet = res.byBet || 0;
                        this.info.tyBet = res.tyBet || 0;
                        this.info.sxBet = res.sxBet || 0;
                        this.info.spreadNum = res.spreadNum || 0;
                        this.info.betNum = res.betNum || 0;
                        this.info.recharge = res.recharge || 0;
                        this.info.withdraw = res.withdraw || 0;
                        this.info.bbRebate = res.bbRebate || 0;
                        this.info.tzRebate = res.tzRebate || 0;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    };
</script>

<style scoped lang="less">
    @import url("../../../components/less/common.less");
    @import url("./Statis.less");
</style>