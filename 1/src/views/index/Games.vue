<template>
    <div class="games">
        <Header :title="'全部游戏'" :rooter="'-1'" :hasNoBack="true" :iFontsize="'.58667rem'"></Header>
        <!--redbag-->
        <Redbag v-show="bagSwitch === 1"></Redbag>
        <div v-if="noticeData && noticeData.length>0" @click="isShowScrollNotice = true;"  class="notive">
            <div class="icon iconfont icon-sy-tzgg"></div>
            <marquee direction="left" align="bottom" height="25" width="100%" onmouseout="this.start()" onmouseover="this.stop()" scrollamount="4" scrolldelay="1">
                <div class="noticeText" v-for="(noticeDatas,index) in noticeData" :key="index">{{noticeDatas.content}}</div>
            </marquee>
        </div>

        <AllGameList v-if="gameInfo" :gameInfos="gameInfo"></AllGameList>

        <!-- 滚动公告 -->
        <ScrollNotice v-if="noticeData && isShowScrollNotice"  :scrollNotice="noticeData" @returnScrollNoticeStatus="returnScrollNoticeStatus"></ScrollNotice>
    </div>
</template>

<script>
    import Header from "../../components/Header";
    import Redbag from "../../components/RedBag";
    import AllGameList from "./AllGameList";
    import ScrollNotice from './ScrollNotice'
    import {indexInfo} from "@/api/index";

    export default {
        components: {
            Header,
            Redbag,
            AllGameList,
            ScrollNotice
        },
        name: "games",
        mounted(){
            this.getAllData()
        },
        data (){
            return{
                isShowScrollNotice: false,//是否显示滚动公告
                bagSwitch:sessionStorage.getItem('bag')*1,
                gamepic:require("../../assets/img/game.png"),
                selected: 0,
                tabNumb: 0,
                dianziGame: this.$route.query.id,
                noticeData: '', //公告列表
                noticePop:false,
                noticeIndex:0,
                gameInfo:'',//传递给AllGameList组件的数据
            }
        },
        methods:{
            tab(index){
                this.tabNumb = index;
            },
            navTabs(){
                this.tabNumb = 0
            },
            getAllData() {
                indexInfo().then(res => {
                    this.gameInfo = res;
                    this.noticeData = res.notice;
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                });
            },
            returnScrollNoticeStatus(status){
                this.isShowScrollNotice = status;
            },
        }
    }
</script>

<style lang="less" scoped>
    @import url("../../components/less/common.less");
    .games{
        padding-top: 1.22667rem /* 92/75 */;
        .notive{
            position: relative;
            padding: 0 0.4rem;
            height: 0.973rem;
            background-color: @color-B;
            border-bottom: 1px solid @color-rgab-a4;
            border-top: 1px solid @color-rgab-a4;
            .icon{
                z-index: 1;
                position: absolute;
                left: 0;
                top: 0;
                width: 0.973rem;
                height: 0.973rem;
                text-align: center;
                line-height: 0.973rem;
                font-size: 0.5rem;
                color: @color-w;
                background-color: @color-B;
            }
            marquee{
                height: 0.973rem;
                line-height: 0.973rem;
                font-size: 0.347rem;
                color: @color-w;
                .noticeText{
                    display: inline-block;
                    margin-right: 1rem;
                }
            }
        }

    }
</style>
