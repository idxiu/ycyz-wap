<template>
    <div class="maintain">
        <div class="pic">
            <img src="../assets/img/image_weihu.png" alt="">
        </div>
        <h1>网站维护中</h1>
        <p v-html="msg"></p>
        <!-- <div class="time">
                    <div class="title">维护时间</div>
                    <div class="numb">08:00 - 12:00</div>
                </div> -->
        <!-- <router-link :to="{name:'index'}" class="button">返回首页</router-link> -->
        <div class="service">如有疑问，请<router-link tag="span" :to="{name:'contactus'}">联系客服</router-link></div>
    </div>
</template>

<script>
    import {
        getMaintainMsg
    } from '@/api/maintain'
    export default {
        name: "maintainweb",
        data() {
            return {
                msg: ""
            }
        },
        mounted() {
            getMaintainMsg().then((res) => {
                if (res.msg) {
                    this.msg = res.msg;
                } else {
                    this.$router.push('/');
                }
            }).catch((res) => {
                this.msg = "";
            })
        }
    }
</script>

<style lang="less" scoped>
    @import url('../components/less/common.less');
    .maintain {
        position: fixed;
        left: 50%;
        top: 50%;
        text-align: center;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        .pic {
            margin: 0 auto;
            width: 4.267rem;
            height: 4.267rem;
            img {
                width: 100%;
            }
        }
        h1 {
            margin: 0.5333rem 0;
            font-weight: normal;
            font-size: 0.48rem;
            color: @color-primary;
        }
        p {
            line-height: 0.45rem;
            font-size: 0.32rem;
            color: @color-C;
        }
        .time {
            margin: 0.5333rem 0;
            line-height: 0.6rem;
            font-size: 0.4rem;
            font-weight: bold;
            color: @color-primary;
        }
        .button {
            display: block;
            margin: 0 auto;
            width: 2.933rem;
            height: 0.8rem;
            line-height: 0.8rem;
            font-size: 0.373rem;
            color: @color-default;
            background-color: @color-primary;
            border-radius: 0.133rem;
        }
        .service {
            margin-top: 0.267rem;
            font-size: 0.32rem;
            color: @color-C;
            span {
                color: @color-primary;
            }
        }
    }
</style>