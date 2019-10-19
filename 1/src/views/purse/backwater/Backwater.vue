<template>
  <div>
    <!-- <Header rooter="-1" title="自助返水" :hasNoBack="true" iFontsize=".58667rem"></Header> -->
    <Header
      rooter="-1"
      :showBack="true"
      :title="'自助返水'"
      :iFontsize="'.58667rem'"
      :isShowHome="false"
    >
      <div slot="head_right">
        <router-link
          class="header-record"
          tag="span"
          :to="{name:'contactus'}"
        >
          <i
            class="iconfont icon-fanshui-kefu"
            style="font-size: 0.58667rem;"
          ></i>
        </router-link>
      </div>
    </Header>
    <!--  -->
    <!-- 查看返水详情弹框 -->
    <div
      v-show="isShowBackwaterMask"
      class="copy-writer-details-mask"
      @touchmove.self.prevent
    ></div>
    <div
      v-show="isShowBackwaterMask"
      class="copy-writer-details-box"
    >
      <div class="details-title pk-1px-b">
        <span>返水详情</span>
        <span @click="isShowBackwaterMask = false;"><i class="iconfont icon-sykszz-close"></i> </span>
      </div>
      <div class="details-content">
        <dl>
          <dt class="pk-1px-b">
            <span>游戏名称</span>
            <span>有效打码</span>
            <span>返水金额</span>
          </dt>
          <div class="scorll-list">
            <dd
              v-for="(item,index) in infoData.list"
              :key="index"
              class="pk-1px-b"
            >
              <span>{{item.platformName}}</span>
              <span>{{item.betall}}</span>
              <span>{{item.money}}</span>
            </dd>
          </div>

        </dl>
      </div>
    </div>

    <div class="content">
      <div class="content-fixed">
        <div class="backwater-top">
          <ul>
            <li>
              <h2>有效打码</h2>
              <p>{{infoData.betall}}</p>
            </li>
            <li>
              <h2>返水金额
                <!-- <i class="iconfont icon-fanshui-yiwen" style="font-size: 0.4rem"></i> -->
              </h2>
              <p>{{infoData.allMoney}}</p>
            </li>
          </ul>
          <div class="backwater-top-btn">
            <!-- <div v-show="isShowBackWaterMoney" class="look" @click="isShowBackwaterMask = true">点击查看返水详情</div> -->
            <div class="btn">
              <button
                :disabled="infoData.betall <= 0"
                @click="getBackWaterInfo()"
              >查看返水额</button>
              <button
                :disabled="infoData.status === 2"
                @click="handleBackWater"
              >领取返水</button>
            </div>

          </div>
        </div>
        <div class="backwater-list">
          <div class="title">自助返水历史</div>
          <div class="total pk-1px-b">
            <p>当日已返水：<span>{{today}}</span></p>
            <p>本周返水额：<span>{{week}}</span></p>
          </div>
          <dl v-show="list.length>0">
            <dt class="pk-1px-b">
              <span>有效打码</span>
              <span>返水金额</span>
            </dt>
          </dl>
        </div>
      </div>

      <div
        v-show="list.length>0"
        class="page-loadmore"
      >
        <div
          class="page-loadmore-wrapper"
          ref="wrapper"
          :style="{ height: wrapperHeight + 'px' }"
        >
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
            <ul>
              <li
                v-for="(item,index) in list"
                :key="index"
                class="pk-1px-b"
              >
                <h2>
                  <span>{{item.betall}}</span>
                  <span>{{item.rebateWater}}</span>
                </h2>
                <p>
                  <span>订单号：{{item.orderId}}</span>
                  <span>{{item.createTime | filterDate}}</span>
                </p>
              </li>
            </ul>
            <div
              class="nodata"
              v-show="hasData"
            >我是有底线的</div>
          </pk-loadmore>
        </div>
      </div>

      <div
        v-show="list.length<=0"
        class="no-data"
      >
        <div class="no-data-box">
          <i class="iconfont icon-list-zanwusj"></i>
          <p>您暂时还未获得返水哦~~</p>
          <router-link
            tag="button"
            :to="{name:'index'}"
          >去投注，获得返水！</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pkLoadmore from "@/components/Loadmore";
import Header from "@/components/Header";
import func from "@/api/purse";
export default {
  name: "backwater",
  components: {
    Header,
    pkLoadmore
  },
  mounted() {
    this.getBackWaterInfo(1);
    this.getList();
  },
  watch: {
    isShowBackwaterMask(newVal, oldVal) {
      if (newVal) {
        this.ModalHelper.open();
      } else {
        this.ModalHelper.close();
      }
    }
  },
  data() {
    return {
      isShowBackwaterMask: false,

      allLoaded: false,
      topAllLoaded: false,
      topStatus: "",
      bottomStatus: "",
      wrapperHeight: 0,
      stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
      hasData: false,

      page: 1, //当前页数
      pageSize: 10, //每页请求的条数
      totalNum: 0, //总页数
      list: [],
      infoData: {},
      today: 0,
      week: 0
    };
  },
  methods: {
    //获取返水列表
    getList(t) {
      let postData = {
        pageParams: {
          page: this.page,
          pageSize: this.pageSize
        }
      };
      console.log(postData);
      func
        .getBackWaterList(postData)
        .then(res => {
          console.log(res, "--------");
          this.today = res.today;
          this.week = res.week;
          this.totalNum = res.totalNum;
          let result = res.list;
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
          if (t === 1) {
            this.$toast({
              message: "刷新成功",
              duration: 2000
            });
          }
          this.$nextTick(() => {
            this.wrapperHeight =
              document.documentElement.clientHeight -
              this.$refs.wrapper.getBoundingClientRect().top;
          });
        })
        .catch(err => {
          this.$toast({
            message: err,
            duration: 2000
          });
        });
    },
    //获取返水金额以及是否能返水
    getBackWaterInfo(t) {
      func
        .getBackWaterInfo()
        .then(res => {
          // console.log(res)
          this.infoData = res;
          if (!t) {
            this.isShowBackwaterMask = true;
          }
        })
        .catch(err => {
          this.$toast({
            message: err,
            duration: 2000
          });
        });
    },
    //领取返水
    handleBackWater() {
      func
        .getBackWater()
        .then(res => {
          this.$toast({
            message: "领取成功",
            duration: 2000
          });
          this.getBackWaterInfo();
        })
        .catch(err => {
          this.$toast({
            message: err,
            duration: 2000
          });
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
        this.getList(1);
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
        if (this.page * this.pageSize >= this.totalNum) {
          this.allLoaded = true; //所有数据加载完成
          this.hasData = true;
          this.topAllLoaded = false;
        }
      }, 1500);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../components/less/common.less");
.no-data {
  padding: 0 0.4rem /* 30/75 */;
  .no-data-box {
    margin-top: 8rem /* 160/75 */;
    text-align: center;
    i {
      font-size: 2.53333rem /* 190/75 */;
      color: @color-w;
      opacity: 0.6;
    }
    p {
      text-align: center;
      font-size: 0.42667rem /* 32/75 */;
      color: @color-w;
      margin-top: 0.26667rem /* 20/75 */;
    }
    button {
      width: 100%;
      height: 1.06667rem /* 80/75 */;
      line-height: 1.06667rem /* 80/75 */;
      color: @color-default;
      text-align: center;
      border: none;
      border-radius: 0.13333rem /* 10/75 */;
      font-size: 0.37333rem /* 28/75 */;
      background: @color-primary;
      box-shadow: 0px 2px 5px 0px @color-rgab-black;
      margin-top: 0.53333rem /* 40/75 */;
      &:active {
        background: @color-primary-active;
      }
    }
    button.look {
      margin-top: 0.4rem /* 30/75 */;
      background: @color-default;
      border: 1px solid @color-primary;
      color: @color-primary;
    }
  }
}

.content {
  padding-top: 1.22667rem /* 92/75 */;
  .content-fixed {
    position: fixed;
    width: 100%;
    top: 1.22667rem /* 92/75 */;
    left: 0;
    right: 0;
  }
  .backwater-top {
    position: relative;
    ul {
      background: @color-B;
      display: flex;
      justify-content: space-around;
      text-align: center;
      height: 2.6667rem;
      padding-top: 0.74667rem /* 56/75 */;
      li {
        flex: 1;
        display: flex;
        flex-direction: column;
        h2 {
          font-size: 0.4rem /* 30/75 */;
          color: @color-default;
          font-weight: normal;
        }
        p {
          margin-top: 0.44rem /* 33/75 */;
          font-size: 0.48rem /* 36/75 */;
          color: @color-primary;
        }
      }
    }
    .backwater-top-btn {
      position: absolute;
      bottom: -0.53333rem /* 40/75 */;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .look {
        font-size: 0.37333rem /* 28/75 */;
        color: @color-w;
        text-align: center;
        margin-bottom: 0.4rem /* 30/75 */;
      }
      .btn {
        padding: 0;
        display: flex;
        justify-content: space-around;
        button {
          width: 3.2rem /* 240/75 */;
          height: 1.06667rem /* 80/75 */;
          line-height: 1.06667rem /* 80/75 */;
          font-size: 0.37333rem /* 28/75 */;
          border-radius: 0.13333rem /* 10/75 */;
          border: none;
          background: @color-primary;
          color: @color-B;
          box-shadow: 0px 2px 5px 0px @color-rgab-black;
          &:first-child {
            background-color: @color-default;
            box-shadow: 0rem 0.0267rem 0.0667rem 0rem @color-rgab-black;
            border-radius: 0.1333rem;
            border: solid 0.0267rem @color-primary;
            color: @color-primary;
          }
          &:last-child {
            color: @color-default;
            background-color: @color-primary;
            box-shadow: 0rem 0.0267rem 0.0667rem 0rem @color-rgab-black;
            border-radius: 0.1333rem;
          }
          &:first-child:disabled {
            color: #00d89782;
          }
          &:last-child:disabled {
            background: @color-y;
            box-shadow: none;
            color: @color-default;
          }
        }
      }
    }
  }
  .backwater-list {
    margin-top: 0.53333rem /* 40/75 */;
    .title {
      line-height: 1.06667rem /* 80/75 */;
      padding-left: 0.4rem /* 30/75 */;
      font-size: 0.42667rem /* 32/75 */;
      color: @color-C;
    }
    .total {
      background: @color-default;
      padding: 0 0.4rem /* 30/75 */;
      height: 1.06667rem /* 80/75 */;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 0.37333rem /* 28/75 */;
        color: @color-J;
        span {
          color: @color-primary;
          font-weight: bold;
        }
      }
    }
    dl {
      background: @color-default;
      padding: 0 0.4rem /* 30/75 */;
      dt {
        padding: 0.33333rem /* 25/75 */ 0;
        display: flex;
        justify-content: space-between;
        font-size: 0.42667rem /* 32/75 */;
        color: @color-C;
        font-weight: bold;
      }
    }
  }
  .page-loadmore {
    position: fixed;
    top: 8.4rem /* 686/75 */;
    left: 0;
    right: 0;
    ul {
      background: @color-default;
      padding: 0 0.4rem /* 30/75 */;
      li {
        padding: 0.33333rem /* 25/75 */ 0;
        h2 {
          display: flex;
          justify-content: space-between;
          color: @color-C;
          font-size: 0.37333rem /* 28/75 */;
          font-weight: bold;
        }
        p {
          display: flex;
          justify-content: space-between;
          color: @color-M;
          margin-top: 0.26667rem /* 20/75 */;
          font-size: 0.32rem /* 24/75 */;
        }
      }
    }
  }
}
</style>