<template>
    <div class="footer">
        <ul>
            <!-- <router-link  tag="li" :to='{name:item.link}' v-for="(item,index) in menuList" :key="index">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{item.name}}</span>
            </router-link> -->
            
            <li v-for="(item,index) in menuList" :key="index" @click="clickItem(item,index)">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{item.name}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "IndexFooter",
        props: {
            url: {
                type: String,
                default: ""
            },
        },
        data(){
            return{
                menuList: [{
                    icon: "icon-tab_cunkuan",
                    name: "存款",
                    link: "deposit"
                },
                    {
                        icon: "icon-tab_qukuan",
                        name: "提现",
                        link: "withdraw"
                    },
                    {
                        icon: "icon-tab_eduzh",
                        name: "额度转换",
                        link: "transfer"
                    },
                    {
                        icon: "icon-tab_huodong",
                        name: "活动",
                        link: "activity"
                    },
                    {
                        icon: "icon-tab_kefu",
                        name: "客服",
                        link: this.url
                    }],
            }
        },
        methods: {
            clickItem(item,index){
                if(index === 4){
                    window.open(this.url)
                }else {
                    this.$router.push(item.link);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import url("../components/less/common.less");
    .footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 9;
        ul {
            display: flex;
            justify-content: space-around;
            height: 1.30667rem/* 98/75 */;
            background-color: @color-other-d;
            box-shadow: 0px 0px 8px 0px @color-rgab-black4;
            li {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                .iconfont{
                    font-size: .58667rem /* 44/75 */;
                    background-color: @color-other-d;
                    color: @color-other-e;
                }
                span {
                    font-family: PingFangSC-Regular;
                    font-size: .26667rem /* 20/75 */;
                    color: @color-other-f;
                }
                &.active{
                    .iconfont{
                        color: @color-primary;
                    }
                    span{
                        color: @color-primary;
                    }
                }
            }
        }
    }
</style>
