<template>
    <div class="contactus">
         <nut-navbar class="pk-title" :rightShow="false"
        @on-click-back="$router.go(-1)">
            <a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png"/>
			</a>
            联系我们
        </nut-navbar>
        <div v-show="list" class="skeleton">
            <div class="skeleton-bac-animation"></div>
            <skeleton-square width="100%" height="1rem"></skeleton-square>
            <skeleton-square width="9rem" height="1.4rem" margin="0.2rem 0.5rem"></skeleton-square>
            <skeleton-square width="2rem" height="0.4rem" margin="0.2rem 0.5rem"></skeleton-square>
            <column>
                <skeleton-square 
                    width="9rem" 
                    :count="16" 
                    margin="0.1rem 0.5rem"
                ></skeleton-square>
            </column>
        </div>
        <div v-show="!list">
            <div v-show="contactList === null" class="noData">
                <img src="../../../assets/img/bet-record-no-data.png">
                <p>暂无数据</p>
            </div>
            <ul v-show="contactList != null">
                <li class="clearfix" v-for="(infoList,index) in contactList" :key="index">
                    <div class="us-title">{{infoList.title}}</div>
                    <div class="us-cont">{{infoList.content}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {
        getMorepage,
        getContactus
    } from "@/services/center.js"
    export default {
        name: 'contactus',
        data(){
            return{
                contactList: [],
                list: false,
                arr: [{
                        itype: 1,
                        iname: '手机'
                    },
                    {
                        itype: 2,
                        iname: '座机'
                    },
                    {
                        itype: 3,
                        iname: '微信'
                    },
                    {
                        itype: 4,
                        iname: 'qq'
                    },
                    {
                        itype: 5,
                        iname: '邮箱'
                    },
                    {
                        itype: 6,
                        iname: '在线客服'
                    }
                ],
            }
        },
        mounted() {
            this.info();
        },
        methods:{
            info(){
                this.list = true;
                getContactus().then(res => {
                    if (res.success) {
                        this.list = true;
                        let list = res.data;
                        for (var i in list) {
                            if (this.arr[i].itype == list[i].itype) {
                                this.contactList.push({
                                    itype: list[i].itype,
                                    content: list[i].content,
                                    title: this.arr[i].iname
                                })
                            }
                        }
                        this.contactList.pop();  //过滤数组最后一个，在线客服，不做展示
                        this.list =false;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
.contactus {
    .skeleton{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: $default-color;
    }
    margin-top: $tenrem*2;
    background-color: $default-color;
    border-top: $onerem solid $border-color;
    border-bottom: $onerem solid $border-color;
    ul{
        padding-left: $fourtrem/2;
        li{
            position: relative;
            padding-right: $four;
            height: $fourtrem;
            line-height: $fourtrem;
            font-size: 0.373rem;
            color: $text-color;
            border-bottom: $onerem solid $border-color;
            .us-title{
                float: left;
            }
            .us-cont{
                float: right;
                color: $tip-color;
            }
        }
        div:last-child{
            li{
                border: 0;
            }
        }
    }
    .noData{
        margin: 1rem auto;
        p{
            font-size: 0.4rem;
            text-align: center;
        }
    }
}
</style>