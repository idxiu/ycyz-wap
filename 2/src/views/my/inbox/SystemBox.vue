
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
        <div class="generalizeLink-list table">
            <div v-show="list.length > 0 && !isLoading" class="page-loadmore">
                <div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px'}" ref="wrapper">
                    <pk-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :top-all-loaded="topAllLoaded" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange" ref="loadmore" :stop-translate="stopTranslate">
                        <div class="link-list">
                            <swipe-list ref="list" class="card" :disabled="!enabled" :items="list" item-key="id" @swipeout:click="itemClick()" @rightRevealed="slideRight($event)">
                                <template v-slot="{ item, index, close }">
                                    <div class="box-parent" :class="{'box-unRead':!item.read}" @click="goPath(item.id, 1)">
                                        <h4 class="box-title">
                                            <div><span class="red-dot" v-if="!item.read"></span> {{item.title}}</div>
                                            <div>{{item.publishTime | filterDate}}</div>
                                        </h4>
                                        <div class="box-cent" >
                                            {{ item.content }}
                                        </div>
                                    </div> 
                                </template>

                                <template v-slot:right="{ item,threshold ,index}">
                                    <div class="swipeout-action red" title="remove" @click="remove(item,index)">
                                        <img src="../../../assets/img/shanchu.png" alt="">
                                    </div>
                                </template>
                            </swipe-list>
                        </div>
                        <div class="noMoredata" v-show="hasData">我是有底线的</div>
                    </pk-loadmore>
                </div>
            </div>
            <no-data v-show="list.length <= 0  && !isLoading"></no-data>
        </div>
    </div>
</template>

<script>
    import noData from "@/components/NoData.vue";
    import pkLoadmore from '@/components/Loadmore';
    import {
        SwipeList,
        SwipeOut
    } from 'vue-swipe-actions';
    import {
        getInboxList,
        getInboxDel,
        getInboxStatus
    } from "@/services/msgCenter.js";
    export default {
        components: {
            noData,
            pkLoadmore,
            SwipeList,
            SwipeOut
        },
        data() {
            return {
                isLoading: true,
                list: [],
                wrapperHeight: 0,
                stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
                allLoaded: false,
                topAllLoaded: false,
                topStatus: '',
                bottomStatus: '',
                wrapperHeight: 0,
                page: 1, //当前页数
                pageSize: 5, //每页请求的条数
                pageTotal: 0, //总页数
                hasData: false,
                enabled: true,
                select: false
            };
        },
        mounted() {
            this.getList();
            this.$nextTick(() => {
                if (this.$refs.wrapper) {
                    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
                }
            })
        },
        methods: {
            getList() {
                this.isLoading = true;
                getInboxList({
                    page: this.page,
                    pageSize: this.pageSize
                }).then(res => {
                    this.isLoading = false;
                    if (res.success) {
                        if (res.data) {
                            let result = res.data.list || [];
                            this.pageTotal = res.data.pageTotal;
                            if (this.page === 1) {
                                this.list = result;
                                if (this.pageTotal < this.page * this.pageSize) {
                                    this.allLoaded = true;
                                    this.topAllLoaded = true;
                                } else {
                                    this.allLoaded = false;
                                    this.topAllLoaded = false;
                                }
                            } else {
                                this.list = this.list.concat(result);
                                this.topAllLoaded = false;
                            }
                            this.$nextTick(() => {
                                if (this.$refs.wrapper) {
                                    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
                                }
                            })
                        }
    
    
    
                        // this.list = res.data.list || [];
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            goPath(id, status) {
                this.$router.push({
                    name: "boxDetail",
                    query: {
                        id: id,
                        status: status
                    }
                });
            },
            handleTopChange(status) {
                this.topStatus = status;
            },
            loadTop() {
                this.page = 1;
                this.hasData = false;
                setTimeout(() => {
                    this.getList();
                    this.$refs.loadmore.onTopLoaded();
                    this.allLoaded = false;
                }, 1500);
            },
            //mint-ui 上拉加载
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottom() {
                this.page += 1;
                this.hasData = false;
                setTimeout(() => {
                    this.getList();
                    this.$refs.loadmore.onBottomLoaded();
                    if (this.page * this.pageSize >= this.pageTotal) {
                        this.allLoaded = true; //所有数据加载完成
                        this.hasData = true;
                        this.topAllLoaded = false;
                    }
                }, 1500);
            },
            slideRight(e) {
                let max = this.list.length;
                for (let i = 0; i < max; i++) {
                    if (i !== e.index) {
                        this.$refs.list.closeActions(i);
                    }
                }
            },
            //点击关闭
            itemClick() {
                this.$refs.list.closeActions();
            },
            remove(item, index) {
                let data = {
                    ids: [item.id]
                }
                getInboxDel(data).then(res => {
                    if (res.success) {
                        this.list.splice(index, 1);
                        this.$toast.success("删除成功！", {
                            cover: true,
                            duration: 1000
                        });
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            delAll() {
                if (!this.select) {
                    this.$toast.fail("请选择需要删除消息", {
                        cover: true,
                        duration: 1000
                    });
                    return;
                }
                let ids = [];
                this.list.map(item => {
                    ids.push(item.id)
                });
                let data = {
                    ids: ids
                }
                getInboxDel(data).then(res => {
                    if (res.success) {
                        this.$toast.success("删除成功！", {
                            cover: true,
                            duration: 1000,
                        });
                        this.list = [];
                        this.page = 1;
                        this.select = false;
                        this.getList();
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            readAll() {
                if (!this.select) {
                    this.$toast.fail("请选择消息记录", {
                        cover: true,
                        duration: 1000
                    });
                    return;
                }
                let ids = [];
                this.list.map(item => {
                    ids.push(item.id)
                });
                let data = {
                    ids: ids
                }
                getInboxStatus(data).then(res => {
                    if (res.success) {
                        this.$toast.success("修改成功！", {
                            cover: true,
                            duration: 1000,
                        });
                        this.list.map(item => {
                            item.read = true;
                        });
                        this.select = false;
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
    @import "../../../components/scss/pk-pwd.scss";
</style>