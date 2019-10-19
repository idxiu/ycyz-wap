<template>
    <div class="msg-box">
        <div class="skeleton vue-skeleton-loading" v-show="isLoading">
            <div class="skeleton-bac-animation"></div>
            <div class="skeleton-bac-content">
                <column padding="0.2rem  0 0.2rem 0 ">
                    <skeleton-square width="9.4667rem" style="height:2.9777rem" margin="0 0  0.2667rem 0"></skeleton-square>
                    <skeleton-square width="9.4667rem" style="height:2.9777rem" margin="0 0  0.2667rem 0"></skeleton-square>
                    <skeleton-square width="9.4667rem" style="height:2.9777rem" margin="0 0  0.2667rem 0"></skeleton-square>
                </column>
            </div>
        </div>
        <ul v-show="!isLoading && list.length > 0">
            <li @click="goPath(item.id, 2)" v-for="(item, i) in list" :key="i" class="swipeout-list-item">
                <div class="swipeout-content">
                    <div class="box-parent"  @click="goPath(item.id, 2)">
                        <h4 class="box-title">
                            <div><span class="red-dot" v-if="item.read"></span> {{item.title}}</div>
                            <div>{{item.publishTime | filterDate}}</div>
                        </h4>
                        <div class="box-cent">
                            {{ item.content }}
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <no-data v-show="list.length <= 0 && !isLoading"></no-data>
    </div>
</template>

<script>
    import noData from "@/components/NoData.vue"
    import {
        getSysNotice
    } from "@/services/msgCenter.js";
    export default {
        components: {
            noData
        },
        data() {
            return {
                list: [],
                isLoading: true
            };
        },
        mounted() {
            getSysNotice({
                page: 1,
                pageSize: 100
            }).then(res => {
                this.isLoading = false;
                if (res.success) {
                    this.list = res.data.list || [];
                } else {
                    this.$toast.fail(res.message, {
                        cover: true,
                        duration: 1000
                    });
                }
            });
        },
        methods: {
            goPath(id, status) {
                this.$router.push({
                    name: "msgDetail",
                    query: {
                        id: id,
                        status: status
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../../../components/scss/pk-pwd.scss";
    .box-parent{
        box-shadow: 0 0.1333rem 0.1333rem $inbox-shadow;
    }
</style>