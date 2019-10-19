<template>
  <div id="selfHelp">
    <Header
      :rooter="'-1'"
      :title="'自助优惠详情'"
      :hasNoBack="true"
      :iFontsize="'.58667rem'"
      :isShowHome="false"
    ></Header>
    <div class="self-content">
      <div class="self-img">
        <img :src="info.wapImg">
      </div>
      <div class="self-info">
        <div class="self-title">
          <h2>
            <span>{{info.proTitle}}</span>
            <i
              class="iconfont icon-list-more"
              :class="{'show':showProContent}"
              @click="showProContent = !showProContent"
              v-if="info.proContent"
            ></i>
          </h2>
        </div>
        <div class="selfdetail-content" v-html="info.proContent" v-show="showProContent"></div>
      </div>

      <div class="apply-from">
        <div class="apply-input">
          <div class="title">
            <span>*</span>申请金额
          </div>
          <div class="input">
            <input
              name="money"
              autocomplete="off"
              v-model="depositMoney"
              v-validate="'required|depositMoney'"
              :class="{ 'is-danger': errors.has('money') }"
              type="text"
              placeholder="请输入申请金额"
            >
          </div>
        </div>
        <div class="apply-input">
          <div class="title">
            <span>*</span>申请理由
          </div>
          <div class="input">
            <textarea
              name="reason"
              rows="5"
              @input="inputReason"
              :maxlength="max"
              placeholder="请输入申请理由"
              v-validate="'required'"
              v-model="reason"
            ></textarea>
            <!-- <div class="apply-counter">最多输入{{max}}字，还能输入<span class="num">{{current}}</span>字以内</div> -->
          </div>
        </div>
        <div class="apply-input">
          <div class="title">
            <span>*</span>验证码
          </div>
          <div class="apply-code">
            <div class="input-code">
              <input
                name="captcha"
                autocomplete="off"
                v-model="code"
                v-validate="'required|numeric'"
                :class="{'is-danger': errors.has('captcha') }"
                type="text"
                placeholder="请输入右侧验证码"
              >
            </div>
            <div class="input-code-img">
              <img :src="codeImg" @click="getCode">
            </div>
          </div>
        </div>
        <div class="divs">
          <p
            v-show="errors.has('money')"
            class="errs help fds-12 is-danger"
          >{{ errors.first('money') }}</p>
          <p
            v-show="!errors.has('money') && errors.has('reason')"
            class="errs help fds-12 is-danger"
          >{{ errors.first('reason') }}</p>
          <p
            v-show="!errors.has('money') && !errors.has('reason') && errors.has('captcha')"
            class="errs help fds-12 is-danger"
          >{{ errors.first('captcha') }}</p>
        </div>
      </div>
      <div class="self-btn" @click="apply">
        <span>立即申请</span>
      </div>
      <router-link class="self-btn no-bg" tag="div" :to="{name:'selfmore'}">
        <div>
          <span>查看优惠申请记录</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import Header from "../../../components/Header";
import { getInfo, apply, getList } from "@/api/selfHelp";
import { getCaptcha } from "@/api/login";
import {MessageBox } from "mint-ui";

export default {
  name: "selfHelpDetail",
  components: {
    Header,
    MessageBox
  },
  data() {
    return {
      id: this.$route.query.id,
      info: {},
      stusta: 1,
      actPop: false,
      resData: {},
      codeImg: "",
      codeId: "",
      depositMoney: "",
      code: "",
      reason: "",
      max: 255,
      current: 0,
      showProContent: false
    };
  },
  mounted() {
    this.getInfo();
    this.getCode();
  },
  methods: {
    getInfo() {
      getInfo(this.id)
        .then(res => {
          this.info = res;
          // console.log(res)
          setTimeout(() => {
            this.$(".selfdetail-content img").css({
              "max-width": "100%"
            });
          }, 1);
        })
        .catch(res => {
          this.$toast({
            message: res,
            duration: 2000
          });
        });
    },
    getCode() {
      getCaptcha()
        .then(res => {
          this.codeImg = "data:image/png;base64," + res.Code;
          this.codeId = res.ID;
        })
        .catch(res => {
          this.$toast({
            message: res,
            duration: 2000
          });
        });
    },
    apply() {
      this.$validator.validateAll().then(result => {
        if (result) {
          apply(this.id, this.depositMoney, this.reason, this.code, this.codeId)
            .then(res => {
              console.log(res);
              if (res.apply === 1) {
                this.$toast({
                  message: "申请成功",
                  duration: 1000
                });
                setTimeout(() => {
                  this.$router.go("-1");
                }, 1001);
              } else {
                if (res.undone === 1) {
                  this.$messagebox({
                    title: " ",
                    message: "您已申请过此活动,是否查看申请进度",
                    showCancelButton: true,
                    confirmButtonText: "进入",
                    cancelButtonText: "取消",
                    showConfirmButton: true
                  }).then(action => {
                      if (action == 'confirm') {     //确认的回调
                        this.$router.push("/selfmore");
                    }
                  });
                } else {
                  this.$toast({
                    message: "申请失败！",
                    duration: 1000
                  });
                }
              };
            })
            .catch(err => {
              this.$toast({
                message: err,
                duration: 1000
              });
            });
        }
      });
    },
    inputReason() {
      this.current = this.max - this.reason.length;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../components/less/common.less");
#selfHelp {
  background: @color-Q;
  box-sizing: border-box;
  line-height: 1;
  .self-content {
    padding-top: 1.22667rem;
    padding-bottom: 0.88rem;
    /* 92/75 */
    .self-img {
      width: 100%;
      height: 4rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .self-info {
      padding-top: 0.4rem;
      padding-bottom: 0.4rem;
      background: @color-default;
      .self-title {
        h2 {
          padding-left: 0.4rem;
          font-size: 0.45rem;
          color: @color-C !important;
          i {
            font-size: 0.32rem;
            float: right;
            margin-right: 0.4rem;
            transform: rotate(90deg);
            transition: all 0.2s;
            &.show {
              transform: rotate(270deg);
            }
          }
        }
      }
      .selfdetail-content {
        margin-top: 0.27rem;
        margin-left: 0.4rem;
        margin-right: 0.4rem;
        background: @color-default;
      }
    }
    .self-btn {
      margin-top: 0.4rem;
      margin-left: 0.4rem;
      margin-right: 0.4rem;
      width: 9.2rem;
      height: 1.067rem;
      background-color: @color-primary;
      border-radius: 0.133rem;
      text-align: center;
      line-height: 1.067rem;
      color: @color-default;
    }
    .no-bg {
      color: @color-primary;
      background-color: @color-default;
      box-shadow: 0rem 0.0267rem 0.0667rem 0rem rgba(0, 216, 151, 0.3);
      border-radius: 0.1333rem;
      border: solid 1px @color-primary;
    }
  }
  //------
  .apply-from {
    padding-top: 0.2667rem;
    padding-bottom: 0.2667rem;
    margin-top: 0.27rem;
    background: @color-default;
    .apply-input {
      padding-left: 0.4rem;
      padding-right: 0.4rem;
      font-size: 0.32rem;
      .title {
        width: 100%;
        span {
          color: @color-a;
        }
      }
      .input {
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
        box-sizing: border-box;
        input {
          height: 0.8rem;
          width: 100%;
          border-radius: 0.133rem;
          border: solid 0.013rem @color-P;
          padding-left: 0.2rem;
          box-sizing: border-box;
        }
        textarea {
          border: solid 0.013rem @color-P;
          width: 100%;
          padding-left: 0.2rem;
          padding-top: 0.2rem;
          border-radius: 0.133rem;
          box-sizing: border-box;
        }
      }
      .apply-code {
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
        display: -webkit-box;
        /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
        display: -moz-box;
        /* 老版本语法: Firefox (buggy) */
        display: -ms-flexbox;
        /* 混合版本语法: IE 10 */
        display: -webkit-flex;
        display: flex;
        .input-code {
          flex: 7;
          width: 100%;
          margin-right: 0.2rem;
          line-height: 0.8rem;
          input {
            height: 0.8rem;
            width: 100%;
            padding-left: 0.2rem;
            border-radius: 0.133rem;
            border: solid 0.013rem @color-P;
            margin-right: 0.2rem;
          }
        }
        .input-code-img {
          margin-left: 0.3rem;
          flex: 2;
          border-radius: 0.133rem;
          border: solid 0.013rem @color-P;
          img {
            width: 100%;
            height: 0.7467rem;
          }
        }
      }
      .apply-counter {
        color: @color-X;
        text-align: right;
        span.num {
          color: @color-a;
        }
      }
    }
    .divs {
      text-align: center;
      min-height: auto;
      height: 0.4rem;
      p.errs {
        padding: 0;
        color: @color-i;
      }
    }
  }
}
</style>