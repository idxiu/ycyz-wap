<template>
    <div class="pay-success">
        <div class="pay-success-box">
            <i class="iconfont icon-qb-zfok"></i>
            <p class="desc">{{dataObj.desc}}</p>
            <div v-show="dataObj.details && dataObj.details.length>0" class="order-details">
                <ul>
                    <li v-for="(item,index) in dataObj.details" :key="index">
                        <span>{{item.name}} ：</span>
                        <p>{{item.value}}</p>
                    </li>
                   
                </ul>
            </div>
            <button @click="ok()">确认</button>
        </div>
    </div>
</template>
<script>
export default {
    props:['dataObj'],
    methods:{
        ok(){
            this.$emit('ok');
        }
    }
}
</script>
<style lang="scss" scoped>
.pay-success{
    .pay-success-box{
        margin-top: .53333rem /* 40/75 */;
        margin-bottom: 1rem;
        padding: 0 .4rem /* 30/75 */;
        display: flex;
        flex-direction: column;
        i{
            font-size: 2.4rem /* 180/75 */;
            color: $primary-color;
            margin: 0 auto;
        }
        p.desc{
            font-size: .42667rem /* 32/75 */;
            color: $text-color;
            margin-top: .21333rem /* 16/75 */;
            margin-bottom: .26667rem /* 20/75 */;
            line-height: 1.5;
        }
        .order-details{
            background: $default-color;
            border-radius: .13333rem /* 10/75 */;
            padding: .26667rem /* 20/75 */;
            margin-bottom: .26667rem /* 20/75 */;
            ul{
                li{
                    display: flex;
                    justify-content: space-between;
                    font-size: .37333rem /* 28/75 */;
                    color: $color-C;
                    margin-bottom: .26667rem /* 20/75 */;
                    &:last-child{
                        margin-bottom: 0;
                    }
                    span{
                        flex: 2.5;
                        text-align: right;
                    }
                    p{
                        flex: 7.5;
                    }
                }
            }
        }
        button{
            width: 100%;
            height: 1.2rem /* 90/75 */;
            line-height: 1.2rem /* 90/75 */;
            text-align: center;
            color: $default-color;
            background: $primary-color;
            border:none;
            border-radius: .13333rem /* 10/75 */;
            font-size: .48rem /* 36/75 */;
            letter-spacing: .08rem /* 6/75 */;
            &:active{
                background: $primary-color;
            }
        }
    }
}
</style>


