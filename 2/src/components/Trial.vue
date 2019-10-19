<template>
    <div class="trial" v-if="isShow">
        <div class="black_bg"></div>
        <div class="content">
            <p class="title">当前为试玩账号</p>
            <p class="description">暂无相关权限</p>
            <button @click="goRegister">立即升级</button>
            <div class="iconfont icon-input-close close" @click="closeBox">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Trial',
    props: {
        isDemo: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        isDemo: function (val, oldVal) { //新值，旧值
        this.isShow = val
        },
    },
    data() {
        return {
            isShow:this.isDemo,
        }
    },
    methods: {
        closeBox(){
            this.isShow = false;
            this.$emit('trialClose',this.isShow);
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
    .trial{
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
            width: 8.933333rem;//670
            height: 9.12rem;//684
            position: fixed;
            top: 50%;
            margin-top: -4.56rem;
            z-index: 150;
            left: .533333rem;
            background: url(../assets/img/auth-icon/trial.png) no-repeat top;
            background-size:100% auto; 
            text-align: center;
            .title{
                padding-top: 4.133333rem;
                font-size: .426667rem;
            }
            .description{
                font-size: .32rem;
                color: $tip-color;
                padding-top: .413333rem;
                padding-bottom: .653333rem;
            }
            button{
                width: 8.133333rem;
                height: 1.066667rem;
                background: $primary-color;
                color:$default-color;
                border-radius: .133333rem;
                margin-bottom: 1.2rem;
            }
            .close{

                font-size: .933333rem;
                color: $default-color;
            }
        }
    }
</style>