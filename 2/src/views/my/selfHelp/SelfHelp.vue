<template>
	<div id="selfhelp">
        <div v-show="loading" class="skeleton">
            <div class="skeleton-bac-animation"></div>
            <column>
                <skeleton-square 
                    width="9rem" 
                    height="1rem"
                    :count="9" 
                    margin="0.2rem 0.5rem"
                ></skeleton-square>
            </column>
        </div>
        <nut-navbar class="pk-title"
        @on-click-back="$router.go(-1)"
        @on-click-more="selfmore" >
        <a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png"/>
			</a>
            自助优惠申请
            <a class="backIdex" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
            </a>
        </nut-navbar>
        <div v-show="!loading" class="selfhelpBody">
            <ul>
                <li @click="toDetail(infoList)" v-for="(infoList,index) in actLists" :key="index" :class="{'active':infoList.status === 1}">
                    <div v-if="infoList.status === 3" @click="toDetail(infoList)" class="maxMask"></div>
                    <div class="activity-status" :class="{'over':infoList.status === 3,'unbegin':infoList.status === 2}">
                        <span v-if="infoList.status === 1">进行中</span>
                        <span v-else-if="infoList.status === 2">未开始</span>
                        <span v-else-if="infoList.status === 3">已结束</span>
                    </div>
                    <img :src="infoList.wapImg">
                    <div class="title" :class="{'unbeginTxt':infoList.status === 2 || infoList.status === 3}">
                        <span>{{infoList.proTitle}}</span>
                        <span class="right">查看详情</span>
                    </div>
                </li>
            </ul>
        </div>
	</div>
</template>

<script>
    import {
        getSelflist
    } from "../../../services/center.js"
    export default {
        name: "selfhelp",
        data () {
            return {
                loading: false,
                actLists: '',
			}
        },
        mounted () {
            this.getlist();
        },
        methods: {
            selfmore(){
                this.$router.push({
                    name: "index"
                });
            },
            getlist(){
                this.loading = true;
                getSelflist().then(res => {
                    if (res.success) {
                        this.loading = false;
                        this.actLists = res.data;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            toDetail(item){
                if (item.status == 1) {
                    this.$router.push({
                        name: "selfDetail",
                        query: {
                            id: item.id
                        }
                    });
                } else if (item.status == 2) {
                    this.$toast.text('活动未开始');
                } else if (item.status == 3) {
                    this.$toast.text('活动已结束');
                }
            }
        }
    }
</script>

<style scoped lang="scss">
#selfhelp{
    height: 100%;
    background-color: $default-color;
    /deep/ .selfmore{
        font-size: 0.6rem;
    }
    .nut-navbar.pk-title{
        z-index: 10;
    }
    .selfhelpBody{
        height: 100%;
        overflow-y: scroll;
        ul{
            padding: 0.4rem 0 $tenrem*2;
            background-color: $light-color;
            li{
                position: relative;
                margin: 0 auto 0.4rem;
                width: 9.4rem;
                border-radius: $tenrem;
                overflow: hidden;
                background-color: $default-color;
                .maxMask{
                    z-index: 9;
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background-color: rgba($color: $nondefault-color, $alpha: 0);
                }
                .activity-status{
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 0 0.2rem;
                    height: 0.58667rem;
                    line-height: 0.58667rem;
                    background-color: $state-ongoing;
                    border-radius: 0 0 0 0.133rem;
                    color: $default-color;
                    text-align: center;
                    span {
                        line-height: 0.48rem;
                    }
                }
                .over{
                    background-color: $state-end;
                }
                .unbegin{
                    background-color: $state-unbegun;
                }
                img{
                    display: block;
                    width: 100%;
                    min-height: 3.5rem;
                    max-height: 3.8rem;
                }
                .title{
                    padding-left: $four;
                    line-height: 0.933rem;
                    font-size: 0.373rem;
                    color: $text-color;
                    .right{
                        float: right;
                        padding: 0 $four;
                        color: $state-unbegun;
                    }
                }
                .unbeginTxt{
                    .right{
                        color: $label-color
                    }
                }
            }
            .active{
                box-shadow: 0 0.053rem 0.4rem 0 rgba($color: $state-unbegun, $alpha: 0.25);
            }
        }
    }
}
</style>