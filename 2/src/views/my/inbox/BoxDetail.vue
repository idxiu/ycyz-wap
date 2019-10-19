
<template>
    <div class="msgDetail" ref="msgDetail">
        <nut-navbar class="pk-title" @on-click-back="back('msgCenter')" @on-click-more="selfmore">
            {{ title }}
            <a class="spans" slot="back-icon">
                <img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png" />
            </a>
            <a class="backIdex" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
            </a>
        </nut-navbar>
        <div class="notice-info">
            <div class="notice-box">
                <h3>{{list.advisoryTitle}}</h3>
                <div class="notice-cent">
                    {{list.advisoryContent}}
                </div>
                <p class="notice-time">
                    {{list.advisoryTime | filterDate}}
                </p>
            </div>
            <div class="notice-btn" @click="remove">删除</div>
        </div>
    </div>
</template>

<script>
    import {
        getInboxInfo,
        getInboxMyInfo,
        getInboxMyDel,
        getInboxDel
    } from "../../../services/msgCenter.js";
    
    export default {
        data() {
            return {
                id: this.$route.query.id * 1,
                title: this.$route.query.status == 1 ? "系统消息" : "我的消息",
                list: {}
            };
        },
        mounted() {
            if (this.$route.query.status == 1) {
                getInboxInfo({
                    id: this.id
                }).then(res => {
                    if (res.success) {
                        this.list = res.data.data[0];
                        console.log(this.list, 'list')
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            } else {
                getInboxMyInfo({
                    id: this.id
                }).then(res => {
                    if (res.success) {
                        this.list = res.data.data[0];
                        console.log(this.list, 'list')
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            }
    
        },
        methods: {
            back() {
                var path =
                    this.$route.query.status == 1 ?
                    "systemBox" :
                    "myBox";
                this.$router.push({
                    name: path,
                    query: {
                        active: this.$route.query.status
                    }
                });
            },
            remove() {
                const _this = this;
                let data = {
                    ids: [this.id]
                }
                if (this.$route.query.status == 1) {
                    getInboxDel(data).then(res => {
                        if (res.success) {
                            this.$toast.success("删除成功！", {
                                cover: true,
                                duration: 1000
                            });
                            this.back();
                        } else {
                            this.$toast.fail(res.message, {
                                cover: true,
                                duration: 1000
                            });
                        }
                    });
                } else {
                    getInboxMyDel(data).then(res => {
                        if (res.success) {
                            this.$toast.success("删除成功！", {
                                cover: true,
                                duration: 1000
                            });
                            this.back();
                        } else {
                            this.$toast.fail(res.message, {
                                cover: true,
                                duration: 1000
                            });
                        }
                    });
                }
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
    @import "../../../components/scss/pk-pwd.scss";
</style>