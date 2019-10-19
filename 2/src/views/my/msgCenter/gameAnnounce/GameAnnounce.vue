<template>
    <div>
        <div class="mine-form">
            <div class="pk-datafilter">
                <div class="datafilter">
                    <nut-datepicker class="begin-time" :is-visible="beginVisible" type="date" title="开始时间" :is-show-chinese="false" :default-value="dataVal" @close="beginPicker('beginVisible')" @choose="beginChoose"></nut-datepicker>
                    <span class="input-date"><input @click="clickBegin()" type="datetime" class="date" v-model="startTime" readonly/></span> ~
                    <nut-datepicker class="begin-time" :is-visible="endVisible" type="date" title="结束时间" :is-show-chinese="false" :default-value="dataVal" @close="endPicker('endVisible')" @choose="endChoose"></nut-datepicker>
                    <span class="input-date"><input @click="clickEnd()" type="datetime" class="date" v-model="endTime" readonly/></span>
                </div>
                <div class="input-dates input-game">
                    <nut-cell :showIcon="true" :isLink="true" @click.native="switchPicker('isVisible1')">
                        <div slot="desc" class="selected-option">
                            <span class="show-value">{{year ? year : "请选择类别"}}</span>
                        </div>
                    </nut-cell>
                    <nut-picker title="请选择游戏" :is-visible="isVisible1" :default-value-data="defaultValueData1" :list-data="listData1" @close="switchPicker('isVisible1')" @confirm="setYearValue"></nut-picker>
                </div>
            </div>
        </div>
        <div class="msg-box">
            <div class="skeleton vue-skeleton-loading" v-show="isLoading">
                <div class="skeleton-bac-animation"></div>
                <div class="skeleton-bac-content">
                    <column padding="0.2rem  0 0.2rem 0 ">
                        <skeleton-square width="9.4667rem" style="height:2.9777rem" margin="0 0  0.2667rem 0"></skeleton-square>
                        <skeleton-square width="9.4667rem" style="height:2.9777rem" margin="0 0  0.2667rem 0"></skeleton-square>
                        <skeleton-square width="9.4667rem" style="height:2.9777rem" margin="0 0  0.2667rem 0"></skeleton-square>
                    </column>
                </div>
            </div>
            <ul v-show="!isLoading && gameNoticeList.length > 0">
                <li @click="goPath(item.id, 1)" v-for="(item, i) in gameNoticeList" :key="i" class="swipeout-list-item">
                    <div class="swipeout-content">
                        <div class="box-parent">
                            <h4 class="box-title">
                                <div><span class="red-dot" v-if="item.read"></span> {{item.title}}</div>
                                <div>{{item.publishTime | filterDate}}</div>
                            </h4>
                            <div class="box-cent">
                                {{ item.context }}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <no-data v-show="!gameNoticeList.length > 0 && !isLoading"></no-data>
        </div>
    </div>
</template>

<script>
    import {
        getGameNotice,
        getGameType
    } from "@/services/msgCenter.js";
    import noData from "@/components/NoData.vue";
    
    export default {
        components: {
            noData
        },
        data() {
            return {
                dataVal: this.filterDate(new Date()),
                isLoading: true,
                tryList: [], //保存的下拉框信息
                gameNoticeList: [], //列表信息
                first: false,
    
                firstName: null, //下拉框第一次值
                searchGameType: null, //下拉框值
    
                beginVisible: false,
                endVisible: false,
                startTime: "",
                endTime: "",
                // flag: 2,//1,为渲染返回页面，2，为不渲染
    
                year: null,
                isVisible1: false,
                defaultValueData1: null,
                listData1: [
                    [
                        // "请选择游戏123",
                        // "请选择游戏Avb",
                        // "Asdfsfd",
                        // "201334345435",
                        // "请选择游戏",
                        // "ASDSF",
                        // "游戏游戏游戏",
                        // "2017",
                        // "2018"
                    ]
                ]
            };
        },
        mounted() {
            var _this = this;
            this.timeFormate();
            this.searchGameType =
                this.$route.query.searchGameType * 1 || this.searchGameType;
            this.getGameNoticeList();
            if (this.$route.query.searchGameType && !this.first) {
                console.log(this.$route.query.searchGameType, "123456");
                var type = this.$route.query.searchGameType;
                getGameType().then(res => {
                    if (res.success) {
                        this.listData1[0] = [];
                        res.data.map(v => {
                            this.listData1[0].push(v.apiName);
                            if (v.apiId == type * 1) {
                                _this.year = v.apiName;
    
                            }
                            console.log(_this.year, type, "123456")
                            return;
                        });
                        _this.listData1[0].unshift("全部")
                        console.log(_this.year, "this.year", res.data);
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
                this.first = true;
    
            } else {
                this.getToSelect();
            }
            if (this.first) {
                this.getToSelect();
            }
        },
        watch: {
            searchGameType(newValue) {
                console.log(1231231);
                this.getGameNoticeList();
            },
            startTime(newValue) {
                this.getGameNoticeList();
            },
            endTime(newValue) {
                this.getGameNoticeList();
            }
        },
        methods: {
            getToSelect() {
                this.tryList = [];
                getGameType().then(res => {
                    if (res.success) {
                        this.listData1[0] = [];
                        res.data.map(v => {
                            this.listData1[0].push(v.apiName);
                        });
                        this.listData1[0].unshift("全部");
    
                        this.tryList = res.data;
                        this.firstName = this.listData1[0][0];
                        // this.year = this.listData1[0][0]
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            //时间插件默认值设置开始
            timeFormate() {
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                this.endTime = year + seperator1 + month + seperator1 + strDate;
                this.startTime = this.endTime;
    
                // this.flag = this.$route.query.flag || this.flag;
                this.startTime = this.$route.query.startTime || this.startTime;
                this.endTime = this.$route.query.endTime || this.endTime;
            },
            beginPicker(param) {
                this[`${param}`] = !this[`${param}`];
            },
            endPicker(param) {
                this[`${param}`] = !this[`${param}`];
            },
            beginChoose(param) {
                this.startTime = param[3];
            },
            endChoose(param) {
                this.endTime = param[3];
            },
            clickBegin() {
                this.beginVisible = !this.beginVisible;
            },
            clickEnd() {
                this.endVisible = !this.endVisible;
            },
            //时间插件默认值设置
            goPath(id, status) {
                this.$router.push({
                    name: "msgDetail",
                    query: {
                        id: id,
                        status: status,
                        startTime: this.startTime,
                        endTime: this.endTime,
                        searchGameType: this.searchGameType
                    }
                });
            },
            getGameNoticeList() {
                let data = {
                    startTime: this.startTime,
                    endTime: this.endTime,
                    apiId: this.searchGameType
                };
                getGameNotice(data).then(res => {
                    this.isLoading = false;
                    console.log(res);
                    if (res.success) {
                        this.gameNoticeList = res.data.list || [];
                        console.log(this.gameNoticeList);
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            switchPicker(param) {
                this[`${param}`] = !this[`${param}`];
            },
            setYearValue(chooseData) {
                this.year = chooseData[0] || this.firstName;
                if (this.year == "全部") {
                    this.searchGameType = null;
                } else {
                    this.tryList.map(v => {
                        if (v.apiName == this.year) {
                            this.searchGameType = v.apiId;
                        }
                    });
                }
    
                console.log(
                    this.tryList,
                    chooseData[0],
                    "chooseData[0]",
                    this.searchGameType
                );
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../../../components/scss/pk-pwd.scss";
    .box-title-qs {
        margin-bottom: 0.2667rem;
        font-size: 0.4267rem;
        color: $color-D;
    }
    
    .pk-datafilter {
        display: flex;
        .datafilter {
            flex: 7;
            position: relative;
            padding: $tenrem;
            background: none;
            &::after {
                background: none !important;
            }
            .begin-time {
                display: inline-block;
            }
            .input-date {
                position: relative;
                display: inline-block;
                width: 2.8rem;
                input {
                    position: relative;
                    width: 2.8rem;
                    border: $onerem solid $rec-border-color;
                    border-radius: $onerem * 2;
                    height: 0.6667rem;
                    line-height: 0.6667rem;
                    text-align: center;
                    background: none;
                }
                &::before{
                    position: absolute;
                    right: 0.12rem;
                    top: 50%;
                    -webkit-transform: translateY(-50%);
                    transform: translateY(-50%);
                    content: " ";
                    width: 0;
                    height: 0;
                    border-right:0.14rem solid transparent;
                    border-left:0.14rem solid transparent;
                    border-top:0.133rem solid $luck-duck;
                }
            }
            .btn {
                display: inline-block;
                padding: 0;
                width: 15%;
                height: $four * 1.7;
                line-height: $four * 1.7;
                font-size: 0.3733rem;
                text-align: center;
                white-space: nowrap;
                border-radius: $onerem * 3;
                color: $default-color;
                background: $recommend-bg;
                &:hover {
                    text-decoration: none;
                }
            }
            &::after {
                position: absolute;
                left: $twentyrem;
                right: $twentyrem;
                bottom: 0;
                content: "";
                height: 1px;
                background: $border-color;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
            }
            /deep/ .capitaltype {
                .nut-actionsheet-panel {
                    .nut-actionsheet-item {
                        height: $twentyrem !important;
                    }
                }
            }
        }
        .input-dates {
            flex: 3;
            .nut-cell {
                background: none;
                background-color: transparent !important;
            }
        }
    }
    
    /deep/.nut-cell:first-of-type .nut-cell-box {
        margin: 0.13334rem 0;
        background-image: none;
        padding-right: 20px;
        border: 1px solid $rec-border-color;
        width: 2.5333rem;
        height: 0.6667rem;
        min-height: auto;
        .nut-cell-icon{
            margin-left: 0.16rem;
            width:0;
            height:0;
            border-right:0.14rem solid transparent;
            border-left:0.14rem solid transparent;
            border-top:0.133rem solid $luck-duck;
            img{
                display: none
            }
        }
    }
    .box-parent{
        box-shadow: 0 0.1333rem 0.1333rem $inbox-shadow;
    }
</style>
