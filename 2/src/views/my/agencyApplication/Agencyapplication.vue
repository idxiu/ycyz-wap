<!--
 * @Description: 
 * @Author: xwl
 * @Date: 2019-05-18 13:27:04
 * @LastEditors: xwl
 * @LastEditTime: 2019-05-30 13:54:57
 -->
<template>
  <div id="agencyappli">
    <nut-navbar class="pk-title" :rightShow="false" @on-click-back="$router.go(-1)">
      <a class="spans" slot="back-icon">
        <img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png">
      </a>
      代理申请
    </nut-navbar>
    <div class="content">
      <div class="pk-input clearfix">
        <label class="title must">代理账号</label>
        <div class="input">
          <input
            name="agencyAccount"
            class="relative"
            autocomplete="off"
            v-model="addData.account"
            type="text"
            placeholder="请输入5-16位英文数字组合"
          >
        </div>
      </div>

      <div class="pk-input clearfix">
        <label class="title must">登录密码</label>
        <div class="input">
          <input
            type="password"
            class="relative"
            name="password"
            autocomplete="off"
            v-model="addData.password"
            placeholder="6-20位数字、英文(大小写)和特殊字符组合"
          >
        </div>
      </div>

      <div class="pk-input pk-inputpro">
        <label class="title must">确认密码</label>
        <div class="input">
          <input
            name="confirmPassword"
            type="password"
            class
            autocomplete="off"
            v-model="addData.rePassword"
            placeholder="请再次输入登录密码"
          >
        </div>
      </div>

      <div class="pk-input clearfix">
        <label class="title must">真实姓名</label>
        <div class="input">
          <input
            tit="realName"
            name="name"
            class="relative"
            autocomweChatplete="off"
            v-model="addData.realName"
            type="text"
            placeholder="请输入您的真实姓名"
          >
        </div>
      </div>
      <div class="pk-input pk-inputpro">
        <label class="title must">身份证</label>
        <div class="input">
          <input
            tit="idCard"
            name="idCard"
            class="relative"
            autocomplete="off"
            v-model="addData.idCard"
            type="text"
            placeholder="请输入您的身份证"
          >
        </div>
      </div>
      <div class="pk-input pk-inputpro" v-if="setting.isOpen == 1 && setting.email != 2">
        <label class="title" :class="{ must: setting.email == 3 }">邮箱</label>
        <div class="input">
          <!-- 1=启用 2=禁用 3=启用+必填 -->
          <input
            v-if="setting.email == 1"
            tit="email"
            type="text"
            class="relative"
            name="email"
            autocomplete="off"
            v-model="addData.email"
            placeholder="请输入您的邮箱地址"
          >
          <input
            v-if="setting.email == 3"
            tit="email"
            type="text"
            class="relative"
            name="email"
            autocomplete="off"
            v-model="addData.email"
            placeholder="请输入您的邮箱地址"
          >
        </div>
      </div>

      <div class="pk-input pk-inputpro" v-if="setting.isOpen == 1 && setting.qq != 2">
        <label class="title" :class="{ must: setting.qq == 3 }">qq</label>
        <div class="input">
          <input
            v-if="setting.qq == 1"
            tit="qq"
            name="qq"
            class="relative"
            autocomplete="off"
            v-model="addData.qq"
            type="number"
            placeholder="请输入您的QQ号"
          >
          <input
            v-if="setting.qq == 3"
            tit="qq"
            name="qq"
            class="relative"
            autocomplete="off"
            v-model="addData.qq"
            type="number"
            placeholder="请输入您的QQ号"
          >
        </div>
      </div>
      <div class="pk-input pk-inputpro" v-if="setting.isOpen == 1 && setting.wechat != 2">
        <label class="title" :class="{ must: setting.wechat == 3 }">微信</label>
        <div class="input">
          <input
            v-if="setting.wechat == 1"
            tit="wechat"
            name="wechat"
            class="relative"
            autocomplete="off"
            v-model="addData.wechat"
            type="text"
            placeholder="请输入您的微信号"
          >
          <input
            v-if="setting.wechat == 3"
            tit="wechat"
            name="wechat"
            class="relative"
            autocomplete="off"
            v-model="addData.wechat"
            type="text"
            placeholder="请输入您的微信号"
          >
        </div>
      </div>
      <div class="pk-input pk-inputpro" v-if="setting.isOpen == 1 && setting.telephone != 2">
        <label class="title" :class="{ must: setting.telephone == 3 }">手机号</label>
        <div class="input">
          <input
            v-if="setting.telephone == 1"
            tit="telephone"
            name="telephone"
            class="relative"
            autocomplete="off"
            v-model="addData.telephone"
            type="text"
            placeholder="请输入您的手机号"
          >
          <input
            v-if="setting.telephone == 3"
            tit="telephone"
            name="telephone"
            class="relative"
            autocomplete="off"
            v-model="addData.telephone"
            type="text"
            placeholder="请输入您的手机号"
          >
        </div>
      </div>
      <div class="pk-input pk-inputpro" v-if="setting.isOpen == 1 && setting.englishNickName != 2">
        <label class="title" :class="{ must: setting.englishNickName == 3 }">英文昵称</label>
        <div class="input">
          <input
            v-if="setting.englishNickName == 1"
            tit="englishNickName"
            name="englishNickName"
            class="relative"
            autocomplete="off"
            v-model="addData.englishNickName"
            type="text"
            placeholder="请输入英文昵称"
          >
          <input
            v-if="setting.englishNickName == 3"
            tit="englishNickName"
            name="englishNickName"
            class="relative"
            autocomplete="off"
            v-model="addData.englishNickName"
            type="text"
            placeholder="请输入英文昵称"
          >
        </div>
      </div>
      <div class="pk-input pk-inputpro" v-if="setting.isOpen == 1 && setting.chineseNickName != 2">
        <label class="title" :class="{ must: setting.chineseNickName == 3 }">中文昵称</label>
        <div class="input">
          <input
            v-if="setting.chineseNickName == 1"
            tit="chineseNickName"
            name="chineseNickName"
            class="relative"
            autocomplete="off"
            v-model="addData.chineseNickName"
            type="text"
            placeholder="请输入您的中文昵称"
          >
          <input
            v-if="setting.chineseNickName == 3"
            tit="chineseNickName"
            name="chineseNickName"
            class="relative"
            autocomplete="off"
            v-model="addData.chineseNickName"
            type="text"
            placeholder="请输入您的中文昵称"
          >
        </div>
      </div>

      <div class="pk-input pk-inputpro" v-if="setting.isOpen == 1 && setting.promoteSite != 2">
        <label class="title" :class="{ must: setting.promoteSite == 3 }">推广网址</label>
        <div class="input">
          <input
            v-if="setting.promoteSite == 1"
            tit="promoteSite"
            name="promoteSite"
            class="relative"
            autocomplete="off"
            v-model="addData.promoteSite"
            type="text"
            placeholder="请输入完整网址"
          >
          <input
            v-if="setting.promoteSite == 3"
            tit="promoteSite"
            name="promoteSite"
            class="relative"
            autocomplete="off"
            v-model="addData.promoteSite"
            type="text"
            placeholder="请输入完整网址"
          >
        </div>
      </div>
      <div class="pk-input pk-inputpro" v-if="setting.isOpen == 1 && setting.otherPromoteWay != 2">
        <label class="title" :class="{ must: setting.otherPromoteWay == 3 }">其它方式</label>
        <div class="input">
          <input
            v-if="setting.otherPromoteWay == 1"
            tit="otherPromoteWay"
            name="otherPromoteWay"
            class="relative"
            autocomplete="off"
            v-model="addData.otherPromoteWay"
            type="text"
            placeholder="其他推广方式,请用文字描述"
          >
          <input
            v-if="setting.otherPromoteWay == 3"
            tit="otherPromoteWay"
            name="otherPromoteWay"
            class="relative"
            autocomplete="off"
            v-model="addData.otherPromoteWay"
            type="text"
            placeholder="其他推广方式,请用文字描述"
          >
        </div>
      </div>
      <div class="pk-input pk-inputpro" v-if="setting.isOpen == 1 && setting.remark != 2">
        <label class="title" :class="{ must: setting.remark == 3 }">备注</label>
        <div class="input fs-12 input_pro">
          <input
            v-if="setting.remark == 1"
            tit="remark"
            name="remark"
            class="no-bod-bot"
            autocomplete="off"
            v-model="addData.remark"
            type="text"
            placeholder="请输入备注信息"
          >
          <input
            v-if="setting.remark == 3"
            tit="remark"
            name="remark"
            class="no-bod-bot"
            autocomplete="off"
            v-model="addData.remark"
            type="text"
            placeholder="请输入备注信息"
          >
        </div>
      </div>
      <div class="pk-input clearfix">
        <label class="title must">银行名称</label>
        <nut-cell
          class="pk-bankcard"
          :class="{ 'pk-bankcard-active': bankcardActive }"
          :showIcon="true"
          :isLink="true"
          @click.native="switchPicker('isVisible1')"
        >
          <div slot="desc" class="selected-option">
            <!-- <span class="btn" @click.stop.prevent="modifyYear">修改为指定的年份</span> -->
            <span class="show-value">
              {{
              bankName ? bankName : "请选择"
              }}
            </span>
          </div>
        </nut-cell>
        <nut-picker
          title="请选择银行卡"
          :is-visible="isVisible1"
          :default-value-data="defaultValueData1"
          :list-data="listData1"
          @close="switchPicker('isVisible1')"
          @confirm="setYearValue"
        ></nut-picker>
      </div>

      <div class="pk-input clearfix">
        <label class="title must">银行账号</label>
        <div class="input">
          <input
            type="text"
            class="relative"
            name="bankNames"
            autocomplete="off"
            v-model="addData.bankNum"
            placeholder="请输入您的银行账号"
          >
        </div>
      </div>

      <div class="pk-input clearfix">
        <label class="title must">支行地址</label>
        <div class="input fs-12 input_pro">
          <input
            type="text"
            name="bankAddress"
            autocomplete="off"
            v-model="addData.bankSubPlace"
            placeholder="请选择支行地址"
          >
          <i class="fs-15 iconfont icon-jt-y tj color-84"></i>
        </div>
      </div>

      <div class="pk-input clearfix makd">
        <label class="title must">验证码</label>

        <div class="input">
          <input
            name="captcha"
            class="no-bod-bot"
            autocomplete="off"
            v-model="addData.code"
            type="text"
            placeholder="请输入验证码"
          >
        </div>
        <div class="input-code-img">
          <img :src="codeImg" @click="getCode">
        </div>
      </div>
    </div>

    <div class="pk-submit-bottom">
      <img src="../../../assets/img/submit_bg.png" alt>
      <div class="submit">
        <button @click="submit" :disabled="hasLoading">提交申请</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCaptchaCode, getSetting, setProxySetting } from "@/services/auth";
import myaddress from "@/components/json/provincesCities.json";
import { memBankList } from "@/services/securityCenter.js";
export default {
  name: "agencyappli",
  data() {
    return {
      subTime: 0,
      hasLoading: false,
      title: "代理账号申请",
      addData: {
        account: "",
        password: "",
        rePassword: "",
        code: "",
        realName: "",
        email: "",
        qq: "",
        wechat: "",
        telephone: "",
        englishNickName: "",
        chineseNickName: "",
        idCard: "",
        promoteSite: "",
        remark: "",
        bankNum: "",
        bankName: "",
        province: "",
        otherPromoteWay: "",
        city: "",
        bankSubPlace: ""
      },
      codeImg: "",
      codeId: "",
      //
      setting: {}, //里面滴值 1=启用 2=禁用 3=启用且必填
      //
      listData1: [],
      bankId: null,
      defaultValueData1: null,
      bankcardActive: false,
      bankName: null,
      isVisible1: false
    };
  },
  mounted() {
    this.getCode();
    this.getSetting();
    this.getBankList();
  },

  methods: {
    switchPicker(param) {
      this[`${param}`] = !this[`${param}`];
    },
    setYearValue(chooseData) {
      this.bankName = chooseData[0];
      this.bankcardActive = true;
      console.log(chooseData[0], "chooseData[0]");
      var data = this.backList;
      if (data) {
        data.map(v => {
          if (this.bankName == v.title) {
            this.bankId = v.id;
          }
        });
        console.log(this.bankId, "this.bankId");
      }
    },
    //获取银行列表接口
    getBankList() {
      memBankList().then(res => {
        if (res.success) {
          let data = res.data;
          if (data) {
            var arr = [];
            data.map(v => {
              arr.push(v.title);
            });
            this.backList = data;
            this.listData1.push(arr);
          }
        } else {
          this.$toast.fail(res.message, {
            cover: true,
            duration: 1000
          });
        }
      });
    },
    //获取第二步需要填写的信息
    getSetting() {
      getSetting().then(res => {
        if (res.success) {
          this.setting = res.data.setting;
        } else {
          this.$toast.fail(res.message, {
            cover: true,
            duration: 4000
          });
        }
      });
    },
    //获取验证码
    getCode() {
      getCaptchaCode().then(res => {
        if (res.success) {
          this.codeImg = "data:image/png;base64," + res.data.code;
          this.codeId = res.data.ID;
        } else {
          this.$toast.fail(res.message, {
            cover: true,
            duration: 4000
          });
        }
      });
    },

    //第一步
    changeone() {
      //代理账号
      if (!this.addData.account) {
        this.$toast.text("代理账号不能为空!", { cover: true });
        return false;
      }

      if (!/^[A-Za-z0-9]{5,16}$/.test(this.addData.account)) {
        this.$toast.text("代理账号格式错误!", { cover: true });
        return false;
      }

      //登录密码
      if (!this.addData.password) {
        this.$toast.text("登录密码不能为空!", { cover: true });
        return false;
      }

      if (
        !/^(?=.*[~`!@#$%^&*+-/=/_()|<\{\}\[\],.;:'"//\?\\/>])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9~`!@#$%^&*+-/=/_()|<\{\}\[\],.;:'"//\?\\/>]{6,20}$/.test(
          this.addData.password
        )
      ) {
        this.$toast.text("登录密码格式错误!", { cover: true });
        return false;
      }

      //确认密码
      if (this.addData.password != this.addData.rePassword) {
        this.$toast.text("两次密码不一致!", { cover: true });
        return false;
      }

      //验证码
      if (!this.addData.code) {
        this.$toast.text("验证码不能为空!", { cover: true });
        return false;
      }
      return true;
    },

    //第二步
    changetwo() {
      let arr = [
        { field: "realName", value: 3 },
        { field: "idCard", value: 3 },
        { field: "email", value: 3 }
      ];
      //去掉 后台返回的id 和 isOpen 这两个字段不需要参与验证
      for (let key in this.setting) {
        if (key === "id" || key === "isOpen") {
          continue;
        }
        arr.push({ field: key, value: this.setting[key] });
      }
      let validateResult = arr.every((item, index) => {
        return this.validateField(
          item.field,
          item.value,
          this.addData[item.field]
        );
      });
      console.log(validateResult);
      return validateResult;
    },

    //第二步 根据后台配置 验证
    actions() {
      /**
       * filed 字段名
       * filedChinese 字段中文翻译
       * value 字段值
       */
      //不能为空 处理
      let noNull = (filed, filedChinese, value) => {
        if (!value) {
          this.$toast.text(`${filedChinese}不能为空!`, {
            cover: true
          });
          return false;
        } else {
          return true;
        }
      };
      //格式错误 处理
      let formatError = (filed, filedChinese, value, regexp) => {
        if (value) {
          if (!regexp.test(value)) {
            this.$toast.text(`${filedChinese}格式错误!`, {
              cover: true
            });
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      };
      //  1=启用 2=禁用 3=启用+必填
      return new Map([
        [
          { field: "realName", status: 3 },
          realName => {
            if (noNull("realName", "真实姓名", realName)) {
              return formatError("realName", "真实姓名", realName, /^.{1,20}$/);
            } else {
              return false;
            }
          }
        ],

        [
          { field: "idCard", status: 3 },
          idCard => {
            if (noNull("idCard", "身份证", idCard)) {
              return formatError(
                "idCard",
                "身份证",
                idCard,
                /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
              );
            } else {
              return false;
            }
          }
        ],

        [
          { field: "email", status: 3 },
          email => {
            if (noNull("email", "邮箱", email)) {
              return formatError(
                "email",
                "邮箱",
                email,
                /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
              );
            } else {
              return false;
            }
          }
        ],

        [
          { field: "qq", status: 1 },
          qq => {
            return formatError("qq", "qq", qq, /^[0-9]{5,20}$/);
          }
        ],
        [
          { field: "qq", status: 2 },
          qq => {
            return true;
          }
        ],
        [
          { field: "qq", status: 3 },
          qq => {
            if (noNull("qq", "qq", qq)) {
              return formatError("qq", "qq", qq, /^[0-9]{5,20}$/);
            } else {
              return false;
            }
          }
        ],
        [
          { field: "wechat", status: 1 },
          wechat => {
            return formatError(
              "wechat",
              "微信",
              wechat,
              /^[a-zA-Z0-9_-]{5,20}$/
            );
          }
        ],
        [
          { field: "wechat", status: 2 },
          wechat => {
            return true;
          }
        ],
        [
          { field: "wechat", status: 3 },
          wechat => {
            if (noNull("wechat", "微信", wechat)) {
              return formatError(
                "wechat",
                "微信",
                wechat,
                /^[a-zA-Z0-9_-]{5,20}$/
              );
            } else {
              return false;
            }
          }
        ],

        [
          { field: "telephone", status: 1 },
          telephone => {
            return formatError(
              "telephone",
              "手机号",
              telephone,
              /^[0-9]{10,20}$/
            );
          }
        ],
        [
          { field: "telephone", status: 2 },
          telephone => {
            return true;
          }
        ],
        [
          { field: "telephone", status: 3 },
          telephone => {
            if (noNull("telephone", "手机号", telephone)) {
              return formatError(
                "telephone",
                "手机号",
                telephone,
                /^[0-9]{10,20}$/
              );
            } else {
              return false;
            }
          }
        ],

        //英文昵称
        [
          { field: "englishNickName", status: 1 },
          englishNickName => {
            return formatError(
              "englishNickName",
              "英文昵称",
              englishNickName,
              /^[A-Za-z]{1,12}$/
            );
          }
        ],
        [
          { field: "englishNickName", status: 2 },
          englishNickName => {
            return true;
          }
        ],
        [
          { field: "englishNickName", status: 3 },
          englishNickName => {
            if (noNull("englishNickName", "英文昵称", englishNickName)) {
              return formatError(
                "englishNickName",
                "英文昵称",
                englishNickName,
                /^[A-Za-z]{1,12}$/
              );
            } else {
              return false;
            }
          }
        ],

        //中文昵称
        [
          { field: "chineseNickName", status: 1 },
          chineseNickName => {
            return formatError(
              "chineseNickName",
              "中文昵称",
              chineseNickName,
              /^[\u4e00-\u9fa5]{1,12}$/
            );
          }
        ],
        [
          { field: "chineseNickName", status: 2 },
          chineseNickName => {
            return true;
          }
        ],
        [
          { field: "chineseNickName", status: 3 },
          chineseNickName => {
            if (noNull("chineseNickName", "中文昵称", chineseNickName)) {
              return formatError(
                "chineseNickName",
                "中文昵称",
                chineseNickName,
                /^[\u4e00-\u9fa5]{1,12}$/
              );
            } else {
              return false;
            }
          }
        ],
        //推广网址
        [
          { field: "promoteSite", status: 1 },
          promoteSite => {
            let reg = /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/;
            return formatError("promoteSite", "推广网址", promoteSite, reg);
          }
        ],
        [
          { field: "promoteSite", status: 2 },
          promoteSite => {
            return true;
          }
        ],
        [
          { field: "promoteSite", status: 3 },
          promoteSite => {
            let reg = /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/;
            if (noNull("promoteSite", "推广网址", promoteSite)) {
              return formatError("promoteSite", "推广网址", promoteSite, reg);
            } else {
              return false;
            }
          }
        ],

        //其它方式
        [
          { field: "otherPromoteWay", status: 1 },
          otherPromoteWay => {
            return formatError(
              "otherPromoteWay",
              "其它方式",
              otherPromoteWay,
              /^./
            );
          }
        ],
        [
          { field: "otherPromoteWay", status: 2 },
          otherPromoteWay => {
            return true;
          }
        ],
        [
          { field: "otherPromoteWay", status: 3 },
          otherPromoteWay => {
            if (noNull("otherPromoteWay", "其它方式", otherPromoteWay)) {
              return formatError(
                "otherPromoteWay",
                "其它方式",
                otherPromoteWay,
                /^./
              );
            } else {
              return false;
            }
          }
        ],

        //备注
        [
          { field: "remark", status: 1 },
          remark => {
            return formatError("remark", "备注", remark, /^.{0,20}$/);
          }
        ],
        [
          { field: "remark", status: 2 },
          remark => {
            return true;
          }
        ],
        [
          { field: "remark", status: 3 },
          remark => {
            if (noNull("remark", "备注", remark)) {
              return formatError("remark", "备注", remark, /^.{0,20}$/);
            } else {
              return false;
            }
          }
        ]
      ]);
    },

    //第三步
    changeThree() {
      if (this.bankName == null || this.bankName == "") {
        this.$toast.text("银行名称必填!", { cover: true });
        return false;
      } else if (!/^([1-9]{1})(\d{15,18})$/.test(this.addData.bankNum)) {
        this.$toast.text("银行卡账号为16-19数字!", { cover: true });
        return false;
      } else if (
        this.addData.bankSubPlace == null ||
        this.addData.bankSubPlace == ""
      ) {
        this.$toast.text("支行地址必填!", { cover: true });
        return false;
      } else {
        return true;
      }
    },

    /**
     * 字段验证
     * field  字段名 eg:qq
     * status 验证状态 1=启用 2=停用 3=启用且必填
     * value  字段值
     */
    validateField(field, status, value) {
      let action = [...this.actions()].filter(([key, func]) => {
        return key.field === field && key.status === status;
      });
      let bool = false;
      action.forEach(([key, func]) => {
        bool = func.call(this, value);
      });
      return bool;
    },

    gomy() {
      this.$router.push({
        name: "my"
      });
    },
    //提交
    submit() {
      // var now = new Date().getTime();
      // if (now - this.subTime <= 2000) {
      // 	this.subTime = now;
      // 	this.$toast.text("操作太频繁, 请稍后再试！");
      // 	return;
      // }
      // this.subTime = now;

      if (!this.changeone()) return;
      if (!this.changetwo()) return;
      if (!this.changeThree()) return;

      setTimeout(() => {
        let addData = this.addData;
        this.hasLoading = true;
        var post = {
          chineseNickName: addData.chineseNickName,
          englishNickName: addData.englishNickName,
          telephone: addData.telephone,
          email: addData.email,
          qq: addData.qq,
          wechat: addData.wechat,
          remark: addData.remark,
          promoteSite: addData.promoteSite,
          account: addData.account,
          password: addData.password,
          rePassword: addData.rePassword,
          idCard: addData.idCard,
          realName: addData.realName,
          code: addData.code,
          bankName: this.bankName,
          bankNum: addData.bankNum,
          province: addData.province,
          city: addData.city,
          bankSubPlace: this.addData.bankSubPlace,
          codeId: this.codeId,
          otherPromoteWay: addData.otherPromoteWay
        };
        setProxySetting(post).then(res => {
          if (res.success) {
            // this.$toast.success({message: '恭喜你成功提交代理申请',
            //     duration: 2000
            // });
            this.$toast.success("恭喜你成功提交代理申请", {
              cover: true
            });
            setTimeout(() => {
              this.$router.go(-1);
            }, 2000);
          } else {
            this.$toast.fail(res.message, {
              cover: true,
              duration: 2000
            });
            console.log(1111111);
            this.hasLoading = false;
          }
        });
      }, 1);
    }
  }
};
</script>


<style lang="scss" scoped>
#agencyappli {
  .pk-bankcard {
    flex: 1;
    box-shadow: none;
    border-bottom: none;
    background: none;
  }
  .content {
    margin-top: $tenrem * 2;
    padding-left: 0.26667rem;
    max-width: 100%;
    font-size: 0.37333rem;
    overflow: hidden;
    background: $default-color;
    padding-bottom: 2.8rem /* 210/75 */;
    .pk-input {
      // position: relative;
      height: $fourtrem;
      line-height: $fourtrem;
      border-bottom: $onerem solid $border-color;
      display: flex;
      justify-content: space-between;
      .title {
        // position: absolute;
      }
      .input {
        flex: 1;
        input {
          padding: 0 $four;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          text-align: right;
          background: transparent;
          border: 0;
        }
      }
      .input-code-img {
        float: right;
        width: 20%;
        height: 100%;
        background: $color-W;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .else {
    .btn {
      display: -webkit-flex;
      display: flex;
      button.btn-green {
        -webkit-box-flex: 1;
        flex: 1;
        margin: 0 $four;
        height: $fourtrem;
        width: 30%;
        border: 0;
        background-color: $primary-color;
        -webkit-box-shadow: 0rem 0.02667rem 0.06667rem 0rem
          rgba($color: $nondefault-color, $alpha: 0.12);
        box-shadow: 0rem 0.02667rem 0.06667rem 0rem
          rgba($color: $nondefault-color, $alpha: 0.12);
        border-radius: 0.13333rem /* 10/75 */;
        margin-top: 0.4rem /* 30/75 */;
        font-size: 0.37333rem /* 28/75 */;
        color: $default-color;
      }
      button.btn-greens {
        border: $onerem solid $primary-color;
        background-color: $default-color;
        color: $primary-color;
      }
    }
  }
}
</style>
<style lang="scss">
.nut-button {
  height: 0.96rem /* 72/75 */;
  background: $index-banner-bg;
  font-size: 0.34667rem /* 26/75 */;
}
.nut-button.circle {
  border-radius: 0.13333rem /* 10/75 */;
}
.pk-bankcard-active {
  .show-value {
    color: $about-color !important;
  }
}
.pk-bankcard {
  .nut-cell-box {
    min-height: 1.06667rem /* 80/75 */;
    .nut-cell-right {
      .nut-cell-icon {
        img {
          margin-left: 0.08rem /* 6/75 */;
        }
      }
    }
  }
  .show-value {
    color: $color-W;
  }
}
</style>

