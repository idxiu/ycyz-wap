<template>
    <div class="pay-return-result">
        <div class="return-result-box">
            <!-- <img src="../assets/img/icon_wallet_qs.png" alt=""> -->
            <i class="iconfont icon-qb-wenhao"></i>
            <h2>请在新开页面完成存款</h2>
            <button @click="okPay()">我已完成存款</button>
            <button @click="continuePay()" class="continue">重新选择支付方式</button>
            <p>存款遇到问题请<router-link :to="{name:'contactus'}">联系客服</router-link></p>
        </div>
    </div>
</template>
<script>
export default {
    props:['fromType'],
    methods:{
        okPay(){
            this.$router.replace({name:'capitalrecord',query:{fromType:this.fromType}})
            console.log("去交易记录页面-路由要修改")
        },
        continuePay(){
            this.$router.go(-2);
        }
    }
}
</script>
<style lang="scss" scoped>
.pay-return-result{
    .return-result-box{
        margin-top: .53333rem /* 40/75 */;
        margin-bottom: 1rem;
        padding: 0 .4rem /* 30/75 */;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        i{
            font-size: 2.4rem /* 180/75 */;
            color: $primary-color;
        }
        h2{
            color:$text-color;
            font-size: .42667rem /* 32/75 */;
            margin-top: .26667rem /* 20/75 */;
            margin-bottom: .4rem /* 30/75 */;
            font-weight:400;
        }
        button{
            width: 100%;
            height: 1.06667rem /* 80/75 */;
            line-height: 1.06667rem /* 80/75 */;
            text-align: center;
            border-radius: .13333rem /* 10/75 */;
            border:none;
            color: $default-color;
            background: $primary-color;
            font-size: .48rem /* 36/75 */;
            margin-bottom: .4rem /* 30/75 */;
            letter-spacing: .08rem /* 6/75 */;
            &:active{
                background: $primary-color;
            }
        }
        button.continue{
            border:1px solid $primary-color;
            background: $default-color;
            color: $primary-color;
        }
        p{
            width: 100%;
            text-align: right;
            color: $color-M;
            font-size: .32rem /* 24/75 */;
            a{
                color:$primary-color;
                text-decoration: underline;
            }
        }

    }
}
</style>


