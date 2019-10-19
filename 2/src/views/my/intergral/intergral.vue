<template>
  <div class="intergral" v-cloak>
    <div class="interHead">
      <nut-navbar class="pk-title" @on-click-back="$router.go(-1)" @on-click-more="more('inbox')">
        <a class="spans" slot="back-icon">
          <img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png" />
        </a>
        我的
        <a class="spansright inbox-num" slot="more-icon" :class="{'inbox-num':boxNum > 0}">
          <img class="imgsbank" src="../../../assets/img/icon_mail@3x.png" />
        </a>
      </nut-navbar>
      <div class="userInfo">
        <div class="userImg">
          <img src="../../../assets/img/personInfo.png" alt />
        </div>
        <p class="userName">{{memberInfoDate.memberName}}</p>
        <span>会员积分：{{memberInfoDate.memberIntegar}}</span>
        <router-link tag="a" class="goDetail" :to="{name:'intergDeta'}"></router-link>
      </div>
    </div>
    <div class="userLevel">
      <h2>会员等级{{memberInfoDate.memberVipName}}</h2>
      <router-link tag="a" class="goRule" :to="{name:'intergRule'}">等级制度</router-link>
      <span>还差{{memberInfoDate.memberNextNeedIntegar}}积分升级为{{memberInfoDate.memberNextLevelName}}</span>
      <div class="levelLine">
        <div class="levelLineUp" ref="levelLineUp"></div>
      </div>
    </div>
    <div class="intergTask">
      <div class="taskList">
        <h2 class="taskTit">做任务 领积分</h2>
      </div>
      <div class="taskList clearfix">
        <p>每签到1天+{{memberInfoDateList.sign_in_score}}积分</p>
        <button v-if="!memberInfoDate.if_sign" v-on:click="singIn()">签到</button>
        <button v-if="memberInfoDate.if_sign" class="butClose">已签到</button>
      </div>
      <div class="taskList clearfix">
        <p>个人信息全部填写完成+{{memberInfoDateList.complete_information_score}}积分</p>
        <button v-if="!memberInfoDate.if_complete_information" @click="$router.push('/about')">去填写</button>
        <button v-if="memberInfoDate.if_complete_information" class="butClose">已获得</button>
      </div>
      <div class="taskList clearfix">
        <p>每充值1元+{{memberInfoDateList.recharge_score}}积分</p>
        <button @click="$router.push('/deposit')">去充值</button>
      </div>
      <div class="taskList clearfix">
        <p>每投注1元+{{memberInfoDateList.comsume_score}}积分，每日首次投注额外+{{memberInfoDateList.complete_information_score}}积分</p>
        <button @click="$router.push('/')">去投注</button>
      </div>
      <div class="taskList clearfix">
        <p>推广会员发生首次有效投注+{{memberInfoDateList.spread_score}}积分</p>
        <button @click="$router.push('/spread')">去推广</button>
      </div>
    </div>
  </div>
</template>

<script>
import { intergSignin, intergMerber } from "@/services/intergral.js";
import { getBoxnum } from "@/services/msgCenter.js";

export default {
  name: "intergral",
  data() {
    return {
      memberInfoDate: [],
      memberInfoDateList: [],
      levelWidth: 0,
      boxNum: 0
    };
  },
  mounted() {
    this.memberInfo();
    this.getBoxnumFunc();
  },
  methods: {
    //签到
    singIn() {
      console.log("12121");
      intergSignin().then(res => {
        if (res.success) {
          this.$toast.success("签到成功!", {
                            cover: true,
                            duration: 800
                        });
          this.memberInfo();
        } else {
          this.$toast.fail(res.message, {
            cover: true,
            duration: 1000
          });
        }
      });
    },

    //获取会员基本信息
    memberInfo() {
      intergMerber().then(res => {
        if (res.success) {
          this.memberInfoDate = res.data;
          this.memberInfoDateList = res.data.groupLevelRules;
          var a = res.data.memberIntegar * 1;
          var b = (res.data.memberIntegar + res.data.memberNextNeedIntegar) * 1;
          this.levelWidth = (a / b) * 8; //总宽度 8rem
          this.$refs.levelLineUp.style.width = this.levelWidth + "rem";
        } else {
          this.$toast.fail(res.message, {
            cover: true,
            duration: 1000
          });
        }
      });
    },

    //获取右上角信息条数
    getBoxnumFunc() {
      getBoxnum().then(res => {
        if (res.success) {
          console.log(res);
          if (res.data) {
            let num1 = res.data.advisoryUnReadCount || 0;
            let num2 = res.data.sysMessageUnReadCount || 0;
            this.boxNum = num1 + num2;
            console.log(this.boxNum);
          }
        } else {
          this.$toast.fail(res.message, {
            cover: true,
            duration: 1500
          });
        }
      });
    },
    more(path) {
      this.$router.push({
        name: path
      });
    }
  }
};
</script>

<style lang="scss" scoped>

//右上角消息红点
.imgsbank {
  width: 0.6rem /* 45/75 */;
}
.inbox-num {
  position: relative;
  z-index: 1;
  &::before {
    content: "";
    position: absolute;
    top: -0.1334rem;
    right: -0.1rem;
    width: 0.2667rem;
    height: 0.2667rem;
    border-radius: 0.2667rem;
    background: $color-a;
  }
}

.intergral {
  background: #f3f3f3;
  .nut-navbar.pk-title,
  .interHead {
    background-image: linear-gradient(270deg, #493e3e 0%, #1f1f1f 100%),
      linear-gradient(0deg, #3e364b 100%);
  }
  .interHead {
    height: 3.746667rem;
    color: #f7c279;
    .userInfo {
      position: relative;
      .userImg {
        position: absolute;
        top: 0.533333rem;
        left: 0.4rem;
        width: 1.28rem;
        height: 1.28rem;
        border-style: solid;
        border-width: 0.053333rem;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 1.28rem;
          height: 1.28rem;
        }
      }
      p {
        position: absolute;
        left: 1.96rem;
        top: 0.733333rem;
        font-size: 0.426667rem;
        font-weight: bold;
      }
      span {
        position: absolute;
        top: 1.346667rem;
        left: 1.96rem;
        font-size: 0.346667rem;
      }
      a {
        width: 50%;
        height: 1.333333rem;
        background: url(../../../assets/img/yy-more.png) right center no-repeat;
        background-size: 0.133333rem 0.266667rem;
        color: #f7c279;
        position: absolute;
        top: 0.9rem;
        right: 0.586667rem;
      }
    }
  }
  .userLevel {
    position: relative;
    width: 9.2rem;
    height: 2.8rem;
    background-image: linear-gradient(270deg, #e4d0ab 0%, #ecce8d 100%),
      linear-gradient(24deg, #fad5b9 1%, #fdd6b9 46%, #fecfa9 100%);
    margin: -1.4rem auto 0;
    box-shadow: 0px 2px 5px 0px rgba(62, 15, 68, 0.1);
    border-radius: 10px;
    h2 {
      position: absolute;
      left: 0.64rem;
      top: 0.52rem;
      font-size: 0.506667rem;
      color: #8d5519;
    }
    .goRule {
      position: absolute;
      right: 0.4rem;
      top: 0.493333rem;
      color: #8d5519;
      padding-right: 0.44rem;
      background: url(../../../assets/img/dengji-more.png) right center
        no-repeat;
      background-size: 0.12rem 0.226667rem;
    }
    span {
      background: url(../../../assets/img/renwu-upicon.png) left center
        no-repeat;
      background-size: 0.266667rem 0.293333rem;
      position: absolute;
      top: 1.48rem;
      left: 0.64rem;
      padding-left: 0.426667rem;
      color: #8d5519;
      font-size: 0.293333rem;
    }
    .levelLine {
      position: absolute;
      bottom: 0.533333rem;
      left: 0.6rem;
      width: 8rem;
      height: 0.066667rem;
      background: #e0bf8b;
      .levelLineUp {
        background: #fb8224;
        height: 0.066667rem;
      }
    }
  }
  .intergTask {
    margin: 0.4rem 0.4rem;
    background-color: #ffffff;
    font-size: 0.346667rem;
    border-radius: 0.133333rem;
    .taskList {
      h2 {
        height: 1.066667rem;
        line-height: 1.066667rem;
        padding-left: 0.746667rem;
        background: url(../../../assets/img/ico-renwu.png) left center no-repeat;
        background-size: 0.426667rem 0.426667rem;
      }
      margin: 0 0.4rem;
      line-height: 0.64rem;
      color: #3e364b;
      border-bottom: 0.026667rem solid #f4f5f6;
      p {
        padding: 0.2rem 0;
        float: left;
        width: 5.666667rem;
      }
      button {
        width: 1.346667rem;
        height: 0.533333rem;
        background-color: #fabc8a;
        border-radius: 0.266667rem;
        color: #ffffff;
        border: none;
        float: right;
        margin-top: 0.266667rem;
      }
      .butClose {
        background-color: #d9d9d9;
      }
    }
    .taskList:last-child {
      border: none;
    }
  }
}
</style>