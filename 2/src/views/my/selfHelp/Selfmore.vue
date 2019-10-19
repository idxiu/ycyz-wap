<template>
  <div id="selfmore">
    <div v-if="loading" class="skeleton">
      <div class="skeleton-bac-animation"></div>
      <column>
        <skeleton-square width="9rem" height="1rem" :count="9" margin="0.2rem 0.5rem"></skeleton-square>
      </column>
    </div>
    <nut-navbar class="pk-title" @on-click-back="$router.go(-1)" @on-click-more="selfmore">
      <a class="spans" slot="back-icon">
        <img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png" />
      </a>
      我的优惠记录
      <a class="backIdex" slot="more-icon">
        <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png" />
      </a>
    </nut-navbar>
    <div v-if="!loading" class="selfmoreContent">
      <div class="noticBar">近一月累计获得优惠:{{list.money}}</div>
      <nut-tab @tab-switch="selfSwitch">
        <nut-tab-panel v-for="(tab,index) in tabTit" :key="index" :tabTitle="tab.title">
          <no-data v-show="forList.length === 0" class="no-data-box"></no-data>
          <div v-if="forList.length > 0" class="threeBox">
            <nut-row class="threetit">
              <nut-col :span="8">
                <div class="flex-content">活动名称</div>
              </nut-col>
              <nut-col :span="8">
                <div class="flex-content">申请金额</div>
              </nut-col>
              <nut-col :span="8">
                <div class="flex-content">实得金额</div>
              </nut-col>
            </nut-row>
            <!--列表-->
            <div class="divs">
              <div v-show="forList.length > 0" class="page-loadmore">
                <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" >
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
                    <nut-row
                      v-for="(infoList,index) in forList"
                      :key="index"
                      type="flex"
                      align="center"
                      class="threeList"
                    >
                      <nut-col :span="8">
                        <div class="flex-content">
                          <div>{{infoList.activityTitle}}</div>
                          <span>{{infoList.createTime | filterDate}}</span>
                        </div>
                      </nut-col>
                      <nut-col :span="8">
                        <div class="flex-content">{{infoList.depositMoney}}</div>
                      </nut-col>
                      <nut-col :span="8">
                        <div
                          v-if="infoList.status != 3"
                          class="flex-content"
                          :class="{'blue':infoList.status === 1,'red':infoList.status === 2,'yellow':infoList.status === 3}"
                        >{{infoList.actualMoney}}</div>
                        <div v-if="infoList.status === 3" class="flex-content">未通过</div>
                      </nut-col>
                    </nut-row>

                    <div class="nodata" v-show="hasData">我是有底线的</div>
                  </pk-loadmore>
                </div>
              </div>
            </div>
          </div>
        </nut-tab-panel>
      </nut-tab>
    </div>
  </div>
</template>

<script>
import { getSelfInfo } from "../../../services/center.js";
import noData from "@/components/NoData.vue";
import pkLoadmore from "@/components/Loadmore";
export default {
  name: "selfmore",
  components: {
    noData,
    pkLoadmore
  },
  data() {
    return {
      loading: false,
      haveNewVersion: false,
      list: "",
      forList: [],
      awarded: [],
      notpass: [],
      audited: [],
      tabTit: [
        { value: 0, title: "全部优惠" },
        { value: 1, title: "已通过" },
        { value: 3, title: "未通过" },
        { value: 2, title: "待审核" }
      ],
      hasData: false,
      allLoaded: false,
      topAllLoaded: false,
      topStatus: "",
      bottomStatus: "",
      wrapperHeight: 0,
      stopTranslate: parseInt(this.HTML_FONT_SIZE * 1.6),
      page: 1, //当前页数
      pageSize: 20, //每页请求的条数
	  totalSize: 0, //总页数
	  status: 0
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
	  	checkbox(item){
			console.log(item)
		},
		selfmore() {
			this.$router.push({
				name: "index"
			});
		},
		getlist() {
			let data = {
				status: this.status,
				page: this.page,
				pageSize: this.pageSize
			};
			getSelfInfo(data).then(res => {
				if (res.success) {
          this.list = res.data;
          let forList = this.list.promotionRecord || [];
          let data = res.data.promotionRecord;
          this.totalSize = res.data.pageTotal;
          this.rendering(forList);
	
				} else {
          this.$toast.fail(res.message, {
            cover: true,
            duration: 1000
          });
				}
			});
		},
		rendering(result) {
			if (this.page === 1) {
				this.forList = result;
				if (this.totalSize < this.page * this.pageSize) {
				this.allLoaded = true;
				this.topAllLoaded = true;
				} else {
				this.allLoaded = false;
				this.topAllLoaded = false;
				}
			} else {
				this.forList = this.forList.concat(result);
				this.topAllLoaded = false;
			}
      var _this = this;
      if(this.forList.length != 0){
        setTimeout(function() {
          _this.wrapperHeight = document.documentElement.clientHeight - _this.$refs.wrapper[_this.status].getBoundingClientRect().top;
        }, 100);
      }
			
		this.loading = false;
		},
		selfSwitch: function(index, event) {
			this.page = 1;
			this.hasData = false;
			this.topAllLoaded = true;
			this.forList = [];
			if (index == 1) {
        this.forList = this.awarded;
			  var thisIndex = 2;        
			} else if (index == 2) {
        this.forList = this.notpass;
			  var thisIndex = 3;                
			} else if (index == 3) {
        this.forList = this.audited; //待审核
			  var thisIndex = 1;                
			} else {
				this.forList = this.list.promotionRecord || [];
      }
      console.log(thisIndex,"---")
      this.status = thisIndex;
      this.getlist();
		},
		//下拉刷新
		handleTopChange(status) {
			console.log("下拉刷新");
			this.topStatus = status;
		},

		//下拉刷新 状态改变
		loadTop() {
			this.page = 1;
			this.hasData = false;
			var _this = this;
			setTimeout(() => {
				_this.getlist();
				_this.allLoaded = false;
				_this.$refs.loadmore[this.status].onTopLoaded();		
			}, 1500);
		},

		//上拉加载 状态改变
		handleBottomChange(status) {
			this.bottomStatus = status;
			console.log("上拉加载");
		},

		// 上拉加载
		loadBottom() {
			this.page += 1;
			this.hasData = false;
			setTimeout(() => {
				this.getlist();
				if (this.page * this.pageSize >= this.totalSize) {
				this.allLoaded = true; //所有数据加载完成
				this.hasData = true;
				this.topAllLoaded = false;
				}
				this.$refs.loadmore[this.status].onBottomLoaded();		
			}, 1500);
		}
	}
};
</script>

<style scoped lang="scss">
#selfmore {
  .skeleton {
    background-color: $default-color;
  }
  /deep/ .selfmore {
    font-size: 0.6rem;
  }
  .selfmoreContent {
    .noticBar {
      padding: 0 0.4rem;
      height: 0.667rem;
      line-height: 0.667rem;
      font-size: 0.293rem;
      color: $tip-color;
      background-color: $default-color !important;
    }
    /deep/ .nut-tab {
      border: 0;
      padding: 0;
      font-size: 0.427rem;
      color: $text-color;
      .nut-tab-title {
        height: 1.2rem;
        line-height: 1.2rem;
        border: none;
        .nut-title-nav-list {
          .nut-tab-link {
            font-size: 0.42rem;
            &:hover {
              text-decoration: none;
            }
          }
        }
        .nut-tab-active {
          .nut-tab-link {
            color: $tabtit-color;
          }
        }
      }
      .nut-tab-item {
        padding: 0;
        height: auto;
        border: 0;
        .threeBox {
          .threetit {
            padding: 0 $four;
            font-size: 0.347rem;
            font-weight: normal;
            color: $tip-color;
            background-color: $state-background;
            border: none;
          }
          .threeList {
            position: relative;
            padding: $four;
            .nut-col:last-child {
              font-size: 0.427rem;
            }
            &:before {
              position: absolute;
              left: 50%;
              bottom: 0;
              content: "";
              transform: translateX(-50%);
              width: 9.2rem;
              height: 0.027rem;
              background-color: #f4f5f6;
            }
          }
        }
      }
    }
  }
}
.blue {
  color: $tabtit-color;
}
.red {
  color: $color-a;
}
.yellow {
  color: $yellow-color;
}
/deep/ .nav-bar {
  z-index: 9;
  bottom: 0;
  height: $onerem * 2;
  background: $tabtit-color;
}
/deep/ .no-data {
  height: 5.333rem;
  background: $center-newbg;
}
</style>