<template>
    <div class="aboutbox">
        <nut-navbar class="pk-title" :rightShow="false" @on-click-back="$router.go(-1)">
            <a class="spans" slot="back-icon">
                <img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png" />
            </a>
            {{title}}
        </nut-navbar>
        <div v-show="list" class="skeleton">
            <div class="skeleton-bac-animation"></div>
            <skeleton-square width="100%" height="1rem"></skeleton-square>
            <skeleton-square width="9rem" height="1.4rem" margin="0.2rem 0.5rem"></skeleton-square>
            <skeleton-square width="2rem" height="0.4rem" margin="0.2rem 0.5rem"></skeleton-square>
            <column>
                <skeleton-square width="9rem" :count="16" margin="0.1rem 0.5rem"></skeleton-square>
            </column>
        </div>
        <div v-show="!list">
            <div v-show="content== false" class="noData">
                <img src="../../../assets/img/bet-record-no-data.png">
                <p>暂无数据</p>
            </div>
            <ul>
                <div v-for="(infoList,index) in content" :key="index">
                    <li v-if="infoList.itype===1" @click="goLink1(infoList.url)">
                        <div class="moretitle">{{infoList.title}}</div>
                        <nut-icon type="right" color="#666" size="0.4rem"></nut-icon>
                    </li>
                    <li v-if="infoList.itype===2" @click="goLink2(infoList)">
                        <div class="moretitle">{{infoList.title}}</div>
                        <nut-icon type="right" color="#666" size="0.4rem"></nut-icon>
                    </li>
                    <li v-if="infoList.itype===3" @click="goLink3(infoList)">
                        <div class="moretitle">{{infoList.title}}</div>
                        <nut-icon type="right" color="#666" size="0.4rem"></nut-icon>
                    </li>
                    <li v-if="infoList.itype===4" @click="goLink4(infoList.url)">
                        <div class="moretitle">{{infoList.title}}</div>
                        <nut-icon type="right" color="#666" size="0.4rem"></nut-icon>
                    </li>
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
    import {
        getMorepage
    } from "../../../services/center.js";
    import {
        getContactus
    } from "@/services/center.js";
    import {
        checkUrl
    } from "@/services/commonfn.js";
    export default {
        name: "morelist",
        data() {
            return {
                content: "",
                thisId: this.$route.query.id,
                position: this.$route.query.position,
                list: false,
                title: this.$route.query.title,
                contactusUrl: ""
            };
        },
        mounted() {
            this.info();
            this.getContactuFunc();
        },
        methods: {
            goLink1(urlStr) {
                if (!urlStr) {
                    this.$toast.fail("暂未开通此功能", {
                        cover: true,
                        duration: 2000
                    });
                    return;
                }
                let url = checkUrl(urlStr);
                if (url === "kefu") {
                    window.open(this.contactusUrl);
                } else {
                    this.$router.push({
                        name: url
                    });
                }
            },
            goLink2(item) {
                this.$router.push({
                    name: "morelist",
                    query: {
                        id: item.id,
                        position: item.position,
                        title: item.title
                    }
                });
            },
            goLink3(item) {
                this.$router.push({
                    name: "morepage",
                    query: {
                        id: item.id,
                        position: item.position
                    }
                });
            },
            goLink4(urlStr) {
                if (!urlStr) {
                    this.$toast.fail("暂未开通此功能", {
                        cover: true,
                        duration: 2000
                    });
                    return;
                }
                if (urlStr === "/member/discount") {
                    let url = checkUrl(urlStr);
                    this.$router.push({
                        name: url
                    });
                } else {
                    window.open(urlStr);
                }
            },
            info() {
                this.list = true;
                let data = {
                    id: parseInt(this.thisId),
                    position: parseInt(this.position)
                };
                getMorepage(data).then(res => {
                    if (res.success) {
                        this.content = res.data;
                        this.list = false;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            getContactuFunc() {
                getContactus().then(res => {
                    if (res.success) {
                        let list = res.data;
                        if (list.length >= 5) {
                            list.map(item => {
                                if (item.itype == 6) {
                                    this.contactusUrl = item.content;
                                }
                            });
                        }
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .aboutbox {
        .skeleton {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: $default-color;
        }
        margin-top: $tenrem * 2;
        background-color: $default-color;
        border-top: $onerem solid $border-color;
        border-bottom: $onerem solid $border-color;
        ul {
            padding-left: $fourtrem/2;
            li {
                position: relative;
                height: $fourtrem;
                line-height: $fourtrem;
                font-size: 0.373rem;
                color: $text-color;
                border-bottom: $onerem solid $border-color;
                a {
                    display: block;
                }
                /deep/ .nut-icon {
                    position: absolute;
                    top: 0;
                    right: 0.2rem;
                    margin: 0.08rem;
                }
            }
            div:last-child {
                li {
                    border: 0;
                }
            }
        }
        .noData {
            margin: 1rem auto;
            p {
                font-size: 0.4rem;
                text-align: center;
            }
        }
    }
</style>
