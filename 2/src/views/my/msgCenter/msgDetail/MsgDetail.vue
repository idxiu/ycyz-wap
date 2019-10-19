<template>
    <div class="msgDetail" ref="msgDetail">
        <nut-navbar class="pk-title" @on-click-back="back('msgCenter')" @on-click-more="selfmore">
            {{ title }}
            <a class="spans" slot="back-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/fanhui.png" />
            </a>
            <a class="backIdex" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
            </a>
        </nut-navbar>
        <div class="notice-info">
            <div class="notice-box">
                <h3>{{list.title}}</h3>
                <div class="notice-cent">
                    {{list.content}}
                </div>
                <p class="notice-time">
                    {{list.publishTime | filterDate}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getGameNoticeDetail
    } from "@/services/msgCenter.js";
    
    export default {
        data() {
            return {
                id: this.$route.query.id * 1,
                title: this.$route.query.status == 1 ? "游戏公告" : "系统公告",
                list: {}
            };
        },
        mounted() {
            getGameNoticeDetail({
                apiId: this.id
            }).then(res => {
                if (res.success) {
                    this.list = res.data;
                    console.log(this.list, 'list')
                } else {
                    this.$toast.fail(res.message, {
                        cover: true,
                        duration: 1000
                    });
                }
            });
        },
        methods: {
            back() {
                var path =
                    this.$route.query.status == 1 ?
                    "gameAnnounce" :
                    "systemAnnounce";
                this.$router.push({
                    name: path,
                    query: {
                        active: this.$route.query.status == 1 ? 0 : 1,
                        startTime: this.$route.query.startTime,
                        endTime: this.$route.query.endTime,
                        searchGameType: this.$route.query.searchGameType + ""
                    }
                });
            },
            selfmore() {
                this.$router.push({
                    name: "index"
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../../../components/scss/pk-pwd.scss";
</style>