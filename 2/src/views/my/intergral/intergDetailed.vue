<template>
  <div class="intergDetailed" v-cloak>
    <nut-navbar class="pk-title" @on-click-back="$router.go(-1)">
      <a class="spans" slot="back-icon">
        <img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png" />
      </a>
      积分明细
      <a class="backIdex" @click="$router.push('/')" slot="more-icon">
        <img class="imgsbank" src="../../../assets/img/my-icon/backIndex.png" />
      </a>
    </nut-navbar>
    <div class="intergDeta">
      <div class="intergDetaTit">
        <p>总积分：{{scoreNum.totalIntegral}}</p>
        <span>当日积分：{{scoreNum.todayIntegral}}</span>
      </div>
      <div class="getIntergList">
        <div v-show="list.length > 0" class="page-loadmore">
          <div class="page-loadmore-wrapper" :style="{ height: wrapperHeight + 'px'}" ref="wrapper">
            <pk-loadmore
              :top-method="loadTop"
              :bottom-method="loadBottom"
              :bottom-all-loaded="allLoaded"
              :top-all-loaded="topAllLoaded"
              @top-status-change="handleTopChange"
              @bottom-status-change="handleBottomChange"
              ref="loadmore"
              :stop-translate="stopTranslate"
            >
              <div class="getInterg" v-for="item in list" :key="item.id">
                <p class="getType">{{item.remark}}</p>
                <span class="time">{{item.createTime | filterDate('YYYY-MM-DD HH:mm:ss')}}</span>
                <span class="number">+{{item.score}}分</span>
              </div>
              <div class="noMoredata" v-show="hasData">我是有底线的</div>
            </pk-loadmore>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIntergChange } from "@/services/intergral.js";
import noData from "@/components/NoData.vue";
import pkLoadmore from "@/components/Loadmore";
export default {
  name: "intergDetailed",
  components: {
    pkLoadmore,
    noData
  },
  data() {
    return {
      intergInfoDate: [],
      scoreNum: [],

      //分页
      list: [],
      stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
      allLoaded: false,
      topAllLoaded: false,
      topStatus: "",
      bottomStatus: "",
      wrapperHeight: 0,
      page: 1, //当前页数
      pageSize: 10, //每页请求的条数
      totalNum: 0, //总页数
      hasData: false
    };
  },
  mounted() {
    this.intergInfo();
  },
  methods: {
    intergInfo() {
      var data = {
        asc: false,
        page: this.page,
        pageSize: this.pageSize
      };
      getIntergChange(data).then(res => {
        if (res.success) {
          let result = [];
          this.intergInfoDate = res.data.data;
          result = res.data.data;
          this.scoreNum = res.data;
          console.log(this.intergInfoDate, "this.memberInfoDate");
          this.totalNum = res.data.data.totalSize;
          if (this.page === 1) {
            this.list = result;
            if (this.totalNum < this.page * this.pageSize) {
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
            this.wrapperHeight =
              document.documentElement.clientHeight -
              this.$refs.wrapper.getBoundingClientRect().top;
          });
        } else {
          this.$toast.fail(res.message, {
            cover: true,
            duration: 1000
          });
        }
      });
    },
    //下拉刷新
    handleTopChange(status) {
      this.topStatus = status;
    },
    loadTop() {
      this.page = 1;
      this.hasData = false;
      setTimeout(() => {
        this.intergInfo();
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
        this.intergInfo();
        this.$refs.loadmore.onBottomLoaded();
        if (this.page * this.pageSize >= this.totalNum) {
          this.allLoaded = true; //所有数据加载完成
          this.hasData = true;
          this.topAllLoaded = false;
        }
      }, 1500);
    }
  }
}
</script>

<style lang="scss" scoped>
.intergDetailed {
  background-color: #f3f3f3;
}
.intergDeta {
  background-color: #ffffff;
  .intergDetaTit {
    background-color: #f3f3f3;
    height: 1.04rem;
    line-height: 1.04rem;
    color: #999999;
    font-size: 0.346667rem;
    p {
      float: left;
      margin-left: 0.426667rem;
    }
    span {
      float: right;
      margin-right: 0.266667rem;
    }
  }
  .getIntergList {
    .getInterg {
      height: 1.76rem;
      margin: 0 0.413333rem;
      border-bottom: 0.026667rem solid #d9d9d9;
      position: relative;
      p {
        position: absolute;
        top: 0.426667rem;
        font-size: 0.426667rem;
        color: #1a1a1a;
      }
      .time {
        position: absolute;
        top: 1.16rem;
        color: #999999;
      }
      .number {
        position: absolute;
        top: 0.653333rem;
        right: 0;
        float: right;
        font-size: 0.426667rem;
        color: #ff5500;
      }
    }
    .getInterg:last-child {
      border-bottom: none;
    }
  }
}
</style>