<template>
	<div class="detailsofplan">
        <Header title="计划详情" :showR="false"></Header>
        <div class="planHead pk-1px-b">
            <div class="portrait"><img :src="plannerPhoto ? plannerPhoto : headIcon" alt=""></div>
            <div class="hitrate">
                <div class="number">{{getRandomInt(60,100)}}%</div>
                <div class="text">近100注命中率</div>
            </div>
            <div class="hitrate green">
                <div class="number">{{getRandomInt(1,20)}}</div>
                <div class="text">最高连中</div>
            </div>
            <div class="hitrate green">
                <div class="number">{{getRandomInt(1,10)}}</div>
                <div class="text">最高连错</div>
            </div>
        </div>
        <Planned 
            v-if="planmessage.length > 0"
            :planmessage="planmessage" 
            :pid="this.$route.query.pid" 
            @show-plan-modal="showPlanModal"
            />
        <div class="planForm">
            <div class="tabs">
                <ul class="tabs-title">
                    <li class="pk-1px-r">彩票期号</li>
                    <li class="pk-1px-r">计划内容</li>
                    <li>结果</li>
                </ul>
                <ul class="tabs-table pk-1px-t" v-for="(item ,index) in planList" :key="index">
                    <li class="pk-1px-r">{{item.betNo}}</li>
                    <li class="pk-1px-r">{{item.betWay}}</li>
                    <li>{{item.betResult || '--'}}</li>
                </ul>
            </div>
        </div>
         <follow-plan
            v-if="isShowPlanModal"
            :planInfo="postInfo"
            @close-plan-modal="isShowPlanModal = false"
            @submit-plan="submitPlan"
            />
	</div>
</template>

<script>
import {
    getPlanned,
    getPlanneds,
    postPlanned
} from "@/services/im/chat";
import Header from "@/components/Header";
import Planned from "@/views/index/component/Planned";
import FollowPlan from "@/views/index/component/FollowPlan";
import MSG_TYPE from "@/services/im/constant";

export default {
    name: "detailsofplan",
    components: {
        Header,
        Planned,
        FollowPlan,
        MSG_TYPE
    },
    data () {
        return {
            headIcon: require("@/assets/img/chat-icon/avatar.png"),
            id: this.$route.query.room * 1,
            plannerPhoto: '',
            planList: [],
            planmessage: [],
            isShowPlanModal: false,
            postInfo: {},
            roomType: this.$route.query.roomType *1,
        }
    },
    mounted(){
        this.getPlanInfo();
    },
    methods:{
        async getPlanInfo(){
            if(this.roomType == MSG_TYPE.TYPE_CHAT){
                let planRes = await getPlanned({ roomId: this.id });
                if (planRes.success) {
                    if (planRes.data) {
                        this.planmessage.push(planRes.data);
                        var newList = this.planmessage[0].message;
                        this.planList = newList.betPlanSub
                    } 
                } else {
                    this.$toast.text(planRes.message);
                }
            }
            if(this.roomType == MSG_TYPE.TYPE_PUBLIC || this.roomType == MSG_TYPE.TYPE_PRIVATE){
                let res = await getPlanneds({ roomId: this.id });
                if (res.success) {
                    if (res.data) {
                        this.planmessage = res.data;
                        for(var i= 0; i < this.planmessage.length;i++){
                            var newList = this.planmessage[i].message;
                            for(var j=0;j < newList.length;j++){
                                if(newList[j].pid == this.$route.query.pid){
                                    this.postInfo = newList[j];
                                    this.planList = newList[j].betPlanSub
                                }
                            }
                        }
                    } 
                } else {
                    this.$toast.text(res.message);
                }
            }
            
        },
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        showPlanModal() {
            this.isShowPlanModal = true;
            this.planModalType = 1;
        },
        //跟投 跟单弹框中提交
        async submitPlan(type,info) {
            let postData = {
            roomId: this.id,
            handicap: 1,
            ...info
            // fcType:info.fcType,
            // bet:info.bet,
            // contentId:info.contentId,
            // fcId:info.fcId,
            // playDetails:info.betWay,
            // playId:info.playId,
            };
            let res = await postPlanned(postData);
            if (res.success) {
                this.$toast.text(res.data);
                this.isShowPlanModal = false; //关闭弹框
            } else {
                this.$toast.text(res.message);
            }
        },
    }
}
</script>

<style scoped lang="scss">
.detailsofplan{
    .planHead{
        display: -webkit-flex;
        display: flex;
        background-color: $default-color;
        .portrait{
            position: relative;
            width: px2rem(152);
            height: px2rem(160);
            border-radius: 50%;
            img{
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%,-50%);
                transform: translate(-50%,-50%);
                width: px2rem(96);
	            height: px2rem(96);
            }
        }
        .hitrate{
            display: -webkit-flex;
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: px2rem(266);
            text-align: center;
            .number{
                font-size: px2rem(46);
                font-weight: bold;
                color: $color-w;
            }
            .text{
                font-size: px2rem(28);
                color: $tip-color;
            }
        }
        .green{
            width: px2rem(150);
            .number{
                color: $primary-color;
            }
        }
    }
    .planForm{
        margin-top: px2rem(24);
        padding: px2rem(32);
        background-color: $default-color;
        .tabs{
            border: px2rem(1) solid $backwater-no-btn;
            border-radius: px2rem(10);
            ul{
                display: -webkit-flex;
                display: flex;
                li{
                    width: px2rem(180);
                    height: px2rem(88);
                    line-height: px2rem(88);
                    text-align: center;
                    font-size: px2rem(24);
                    color: $tip-color;
                    &:first-child{
                        width: px2rem(326);
                    }
                    .right{
                        color: $color-w;
                    }
                    .gray{
                        color: $label-color;
                    }
                }
            }
        }
    }
}
</style>