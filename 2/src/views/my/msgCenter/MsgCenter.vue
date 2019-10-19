<template>
    <div ref="msgCenter">
        <nut-navbar class="pk-title"  @on-click-back="back('my')" @on-click-more="selfmore">
            <a class="spans" slot="back-icon">
                <img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png">
            </a>
            消息中心
            <a class="backIdex" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
            </a>
        </nut-navbar>
    
        <div class="tab-title">
            <div class="tab" :class="{'active':active == 0}" @click="tabs(0)">游戏公告</div>
            <div class="tab" :class="{'active':active == 1}" @click="tabs(1)">系统公告</div>
            <div class="tab" :class="{'active':active == 2}" @click="tabs(2)">问卷调查</div>
        </div>
        <div class="tab-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                active: 0,
                routerName: {
                    0: 'gameAnnounce',
                    1: 'systemAnnounce',
                    2: 'questionnaireList',
                }
            };
        },
        mounted() {
            let active = this.$route.query.active || 0;
            this.tabs(active);
        },
        methods: {
            tabs(status) {
                this.active = status;
                this.tabSwitch(status);
            },
            tabSwitch(index, event) {
                this.$router.replace({
                    name: this.routerName[index]
                });
            },
            back(path) {
                this.$router.push({
                    name: path
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
    @import "../../../components/scss/pk-pwd.scss";
</style>
