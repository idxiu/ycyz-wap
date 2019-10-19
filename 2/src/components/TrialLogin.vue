<template>
    <div class="trialLogin" v-if="isShow">
        <div class="black_bg"></div>
        <div class="content">
            <div class="info">
                <div class="left">
                    <p>系统分配账户</p>
                    <span>{{TrialAccount}}</span>
                </div>
                <div class="right">
                    <p>试玩金额</p>
                    <span>¥{{TrialBalance}}</span>
                </div>
            </div>
            <button @click="goRegister">升级账号</button>
            <p class="close" @click="closeBox">我知道了</p>
        </div>
    </div>
</template>

<script>
export default {
    name:'trialLogin',
    props: {
        isTrial: {
            default: false
        },
        TrialAccount:{
             default: ''
        },
        TrialBalance:{
             default: ''
        }
    },
    watch: {
        isTrial: function (val, oldVal) { //新值，旧值
        this.isShow = val
        },
    },
    data() {
        return {
            isShow: this.isTrial
           
        }
    },
    mounted() {
         console.log(this.isShow, 'isShow')
         console.log(this.isTrial, 'this.isTrial')
    },
     methods: {
        closeBox(){
            this.isShow = false;
        },
        goRegister(){
            this.$router.push({
                        name: 'register'
                    })
        }
    },
}
</script>

<style lang="scss" scoped>
    .trialLogin{
        .black_bg{
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: $color-rgab-black7;
            z-index: 149;
            overflow: scroll;
        }
        .content{
            width: 9.2rem;
            height: 4.04rem;
            position: fixed;
            top: 50%;
            margin-top: -3.64rem;
            z-index: 150;
            left: .32rem;
            background: url(../assets/img/auth-icon/trial_one.png) $default-color no-repeat top;
            background-size:100% auto; 
            border-radius: .133333rem;
            text-align: center;
            padding-top: 3.24rem;
            .info{
                width: 6.32rem;
                margin: 0 auto;
                height: 1.066667rem;
                position: relative;
                .left{
                    float: left;
                    span{
                        font-size: .346667rem;
                        color: $primary-color;
                    }
                }
                .right{
                    float: right;
                    span{
                        font-size: .346667rem;
                        color: $prompt-tongji-yellow;
                    }
                    
                }
                p{
                    font-size: .426667rem;
                    font-weight: bold;
                    color: $text-color;
                }
                &:before{
                    content: '';
                    width: .0625rem;
                    height: .933333rem;
                    background: $backwater-no-btn;
                    position: absolute;
                }
            }
            button{
                margin-top: .666667rem;
                width: 8.133333rem;
                height: 1.066667rem;
                background: $primary-color;
                color:$default-color;
                border-radius: .133333rem;
                font-size: .48rem;
            }
            .close{
                line-height: 1.066667rem;
                color: $label-color;
                font-size: .48rem;
            }
        }
    }
</style>