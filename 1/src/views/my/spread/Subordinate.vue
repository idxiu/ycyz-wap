<template>
    <div class="subordinate">
        <Header :title="'下级报表'" :showRight="true" :rooter="'-1'"></Header>
        <div class="hasbox"></div>
        <div class="content">
            <div class="tab-list">
                <ul>
                    <li :class="{'active':active == 2}" @click="changeDate(2)">今日</li>
                    <li :class="{'active':active == 1}" @click="changeDate(1)">昨日</li>
                    <li :class="{'active':active == 5}" @click="changeDate(5)">本月</li>
                    <li :class="{'active':active == 6}" @click="changeDate(6)">上月</li>
                </ul>
            </div>
            <div class="subordinate-box">
                <ul v-if="list.length > 0 ">
                    <li class="subordinate-box-item" v-for="(item,index)  in list" :key="index">
                        <div class="subordinate-box-item-info"><span class="info-label">会员账号：</span><span class="orange">{{item.account}}</span></div>
                        <div class="subordinate-box-item-info"><span class="info-label">推广人数：</span><span class="orange">{{item.num}}人</span></div>
                        <div class="subordinate-box-item-info"><span class="info-label">报表盈收：</span><span :class="item.win>=0?'red':'green'">{{item.win>0 ? '+'+item.win :item.win}}</span></div>
                        <div class="subordinate-box-item-info"><span class="info-label">投注总额：</span><span class="bold">{{item.bet}}</span></div>
                        <div class="subordinate-box-item-info"><span class="info-label">自身返佣：</span><span class="bold">{{item.self}}</span></div>
                        <div class="subordinate-box-item-info"><span class="info-label">返佣总额：</span><span class="bold">{{item.rebate}}</span></div>
                        <div class="subordinate-box-item-time">最后登录时间：<span>{{item.last | filterDate}}</span></div>
                    </li>
                </ul>
                <div v-if=" list.length <= 0 " class="no-data">
                    <i class="no-data-img iconfont icon-list-zanwusj"></i>
                    <p class="no-data-text">暂无数据~</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from "@/components/Header";
import { subordinateList } from "@/api/spread";
export default {
  name: "generalizeLink",
  components: {
    Header
  },
  data() {
    return {
      active: 2,
      list: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    changeDate(date) {
      if (this.active == date) {
        return;
      }
      this.active = date;
      this.getList();
    },
    getList() {
      subordinateList(this.active * 1)
        .then(res => {
          console.log(res);
          this.list = res.list;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="less">
@import url("../../../components/less/common.less");
@import url("./Statis.less");
</style>