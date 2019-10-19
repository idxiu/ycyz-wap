<template>
    <div class="register" ref="register">
        <Header :reHeadMid="false" :isShowHome="false">
            <div slot="head_mid" class="auth-logo">
                <img src="../../assets/img/icon_top_logo.png" alt="">
            </div>
        </Header>
        <div class="hasbox"></div>
        <!-- 验证码 start -->
        <Mpanel v-if="mpanelShow" @close="mpanelShow = false" @success="onMpanelSuccess" @codeId="getcodeId" :type="1"></Mpanel>
        <!-- 验证码 end -->
        <div class="announcement fs-12" v-if="announcement">
            <i class="iconfont icon-laba icon-style fs-12"></i>
            <div class="announcement-cent">
                <marquee direction="left" align="bottom" height="100%" width="100%" scrollamount="3" scrolldelay="1" v-html="announcement"></marquee>
            </div>
        </div>
        <div class="register-cent">
            <h3 class="fs-24">用户注册</h3>
            <h5>
                <p>一键注册，尊享好礼！</p>
                <p>体验精美游戏，赢取终极大奖！</p>
            </h5>
            <div class="register-from">
                <form>
                    <div class="pk-input">
                        <label class="title must fs-14">账号</label>
                        <div class="input fs-12">
                            <input name="account" autocomplete="off" v-model="name" v-validate="'required|alpha_num|max:16|min:5'" :class="{'input': true, 'is-danger': errors.has('account') }" type="text" placeholder="5-16位字母和数字组合">
                            <i v-show="errors.has('account')" class="fs-16 iconfont icon-czsb icon-style  error-icon"></i>
                            <span v-show="errors.has('account')" class="help fds-12 is-danger">{{ errors.first('account') }}</span>
                        </div>
                    </div>
                    <div class="pk-input">
                        <label class="title must fs-14">密码</label>
                        <div class="input fs-12">
                            <input type="password" name="password" autocomplete="off" v-model="password" v-validate="'required|paswed'" :class="{'input': true, 'is-danger': errors.has('password') }" placeholder="6-20位字母和数字组合">
                            <i v-show="errors.has('password')" class="fs-16 iconfont icon-czsb icon-style  error-icon"></i>
                            <span v-show="errors.has('password')" class="help fds-12 is-danger">{{ errors.first('password') }}</span>
                        </div>
                    </div>
                    <div class="pk-input">
                        <label class="title must fs-14">确认密码</label>
                        <div class="input fs-12">
                            <input name="confirmPassword" type="password" autocomplete="off" v-model="repassword" v-validate="{'required': 'true', 'is': password}" :class="{'input': true, 'is-danger': errors.has('confirmPassword') }" placeholder="请再次输入您的登录密码">
                            <i v-show="errors.has('confirmPassword')" class="fs-16 iconfont icon-czsb icon-style  error-icon"></i>
                            <span v-show="errors.has('confirmPassword')" class="help fds-12 is-danger">{{ errors.first('confirmPassword') }}</span>
                        </div>
                    </div>
                    <div class="pk-input">
                        <label class="title must fs-14">介绍人</label>
                        <div class="input fs-12">
                            <input name="introducer" disabled autocomplete="off" v-model="spreadId" v-validate="'required|alpha_num'" :class="{'input': true, 'is-danger': errors.has('introducer') }" type="text" placeholder="请输入您的介绍人">
                            <i v-show="errors.has('introducer')" class="fs-16 iconfont icon-czsb icon-style  error-icon"></i>
                            <span v-show="errors.has('introducer')" class="help fds-12 is-danger">{{ errors.first('introducer') }}</span>
                        </div>
                    </div>
                    <div v-if="registerCode ===1 && codeType===1" class="pk-input pk-input-code">
                        <label class="title must fs-14">验证码</label>
                        <div class="input fs-12 input-code">
                            <input name="captcha" autocomplete="off" v-model="code" v-validate="'required|numeric'" :class="{'input': true, 'is-danger': errors.has('captcha') }" type="text" placeholder="请输入验证码">
                            <i v-show="errors.has('captcha')" class="fs-16 iconfont icon-czsb icon-style  error-icon"></i>
                            <span v-show="errors.has('captcha')" class="help fds-12 is-danger">{{ errors.first('captcha') }}</span>
                        </div>
                        <div class="input-code-img">
                            <img :src="codeImg" @click="getCode">
                        </div>
                    </div>
                    <div class="register-protocol">
                        <div @click="readAgree=!readAgree">
                            <div class="fl">
                                <div class="ju">
                                    <img v-show="!readAgree" src="./icon_will.png" alt="" class="imgs">
                                    <img v-show="readAgree" src="./icon_ok.png" alt="" class="imgs">
                                </div>
                            </div>
                            <p>
                                <span class="fs-14">已阅读并同意</span>
                                <a @click="showReadAgree($event)" class="fs-14">《注册协议》</a>
                            </p>
                        </div>
                    </div>
                    <div class="pk-btn fs-14" @click="toSub">
                        立即注册
                    </div>
                </form>
                <p class="has-account fs-14" @click="toLogin">
                    已有账号，直接登录
                </p>
            </div>
        </div>
        <div class="read-agree-modal" v-if="readAgreeBox">
            <div class="modal-mask" @click="readAgreeBox=false"></div>
            <div class="modal-body">
                <div class="modal-cent">
                    <!-- <h5 class="fs-16">{{readAgreeData.title}}</h5>
                    <div v-html="readAgreeData.content" class="fs-14 modal-cent-box"></div> -->
                    <h5 class="fs-16">注册协议</h5>
                    <div class="fs-14 modal-cent-box">
                        <p>每个客户只能拥有一个帐号，如发现客户拥有多个帐号，本公司有权冻结客户的帐号以及保留取消、收回会员所有优惠红利，以及优惠红利所产生的盈利之权利。本公司有权保留取消任何因素导致帐号结余不正确的金额。每位玩家、每一住址、每一电子邮箱、每一电话号码、相同支付卡/信用卡号码，以及共用电脑环境 (例如:网吧、其他公共用电脑等)只能够拥有一个会员帐号，各项优惠只适用于每位元客户在澳门永利娱乐城唯一的帐户。</p>
                        <p>无论是个人或是团体，如有任何威胁、滥用澳门永利娱乐城优惠的行为，澳门永利娱乐城保留权利取消、收回由优惠产生的红利，并保留权利追讨最高50%手续费。</p>
                        <p>所有澳门永利娱乐城的优惠是特别为玩家而设，在玩家注册资讯有争议时，为确保双方利益、杜绝身份盗用行为，澳门永利娱乐城保留权利要求客户向我们提供充足有效的档， 并以各种方式辨别客户是否符合资格享有我们的任何优惠。</p>
                        <p>会员澳门永利娱乐城有责任时常检查本身的户口结余或者是交易记录，并且更新户口的资料。</p>
                        <p>澳门永利娱乐城标定的时间均为国际时区美东时间。</p>
                        <p>所有投注一经确认，将不可更改或取消。</p>
                        <p>所有在澳门永利娱乐城进行的投注，本公司将以电脑系统保留的电子交易记录为投注的有效凭证。</p>
                        <p>客户有责任确保自己的帐号及登入资料的保密性。以使用者帐号及密码进行的任何网上交易均被视为有效。</p>
                        <p>澳门永利娱乐城只接受合法博彩年龄的客户申请。同时我们保留要求客户提供其年龄证明的权利。</p>
                        <p>客户必须时刻遵守当地法律，如有疑问应就相关问题，寻求当地法律意见。本公司将不接受任何客户因违反当地博彩法律所引致之任何责任。</p>
                        <p>本公司保留所有规则的修改权，并且无须事先公布。 客户一经注册开户，将被视为接受所有颁布在澳门永利娱乐场的规则与条例。</p>
                    </div>
                </div>
                <div class="pk-btn fs-14" @click="readAgreeBox=false;readAgree=true">
                    确认
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from "../../components/Header";
    import Mpanel from "../../components/Mpanel"; //验证
    
    import {
        getSetup,
        getNotice,
        getCaptcha,
        getReadAgree,
        register,
        getDefaultAgentResp
    } from '@/api/login'
    
    export default {
        components: {
            Header,
            Mpanel
        },
        data() {
            return {
                announcement: "",
                name: "",
                password: "",
                repassword: "",
                spreadId: '', //介绍人(代理推广a+id,会员推广m+id)
                code: "",
                codeImg: "",
                codeId: "",
                showPositionValue: false,
                readAgree: false,
                readAgreeBox: false,
                readAgreeData: {},
                //注册的设置
                mpanelShow: false,
                registerCode: 0,
                codeType: 0, //验证码类型 1数字验证 2图片验证
            };
        },
        mounted() {
            this.$refs.register.style.minHeight = window.innerHeight + "px";
            this.getNotice();
            this.getSet();
            this.getReadAgree();
           let tid = this.getStorage('tid', 1000 * 60 * 60 * 24);
            console.log(tid);
            if (tid) {
                this.spreadId = tid;
            } else {
                this.getResp();
            }
        },
        methods: {
            getStorage(key, exp) {
                var data = localStorage.getItem(key);
                var dataObj = JSON.parse(data);
                if (dataObj) {
                    if (new Date().getTime() - dataObj.time > exp) {
                        localStorage.removeItem('tid');
                        return null;
                    } else {
                        return dataObj.data;
                    }
                } else {
                    return null;
                }
            },
            getcodeId: function(somedata) {
                this.codeId = somedata
            },
            getSet() {
                getSetup().then((res) => {
                    this.registerCode = res.isCode
                    this.codeType = res.captchaType
                    if (this.codeType === 1) {
                        this.getCode()
                    }
                }).catch((res) => {
                    this.$toast({
                        message: res,
                        duration: 2000
                    });
                });
            },
            getNotice() {
                getNotice(-2, -1, 0).then(res => {
                    res.noticeList.map(v => {
                        this.announcement += v.content + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                    });
                    this.announcement = this.announcement.substring(0, this.announcement.length - 1);
                }).catch(err => {});
            },
            getCode() {
                getCaptcha().then((res) => {
                    this.codeImg = "data:image/png;base64," + res.Code;
                    this.codeId = res.ID;
                }).catch((res) => {
                    this.$toast({
                        message: res,
                        duration: 2000
                    });
                });
            },
            getResp() {
                getDefaultAgentResp().then((res) => {
                    console.log(res, "返回默认代理数据");
                    this.spreadId = res.ID
                }).catch((res) => {
                    this.$toast({
                        message: res,
                        duration: 2000
                    });
                });
            },
            getReadAgree() {
                getReadAgree().then(res => {
                    this.readAgreeData = res;
                }).catch(err => {});
            },
            toLogin() {
                this.$router.push("login");
            },
            toSub() {
                this.$validator.validateAll().then(result => {
                    if (!this.readAgree) {
                        this.$toast({
                            message: '请阅读注册协议，并勾选已读',
                            duration: 1500
                        });
                        return false;
                    }
                    if (result) {
                        if (this.registerCode === 1 && this.codeType === 2) {
                            this.mpanelShow = true
                        } else {
                            this.registerAjax()
                        }
                    }
                    this.showPositionValue = true;
                });
            },
            registerAjax() {
                let _this = this;
                let spreadIdStrat = ['a', 'm']
                if (!spreadIdStrat.includes(this.spreadId.substr(0, 1))) {
                    this.$toast({
                        message: '介绍人必须以a或m开头',
                        duration: 3000
                    });
                    return;
                }
                register(this.name, this.password, this.repassword, this.spreadId, this.code, this.codeId, this.readAgree).then(res => {
                    this.$toast({
                        message: '注册成功!',
                        duration: 1500
                    });
                    setTimeout(() => {
                        sessionStorage.setItem("session", res.sessionId);
                        _this.$router.push('/');
                    }, 1500)
                }).catch(err => {
                    if (this.codeType === 1) {
                        _this.getCode();
                        _this.code = "";
                    }
                    setTimeout(() => {
                        _this.$validator.errors.clear();
                    }, 0);
                    _this.$toast({
                        message: err,
                        duration: 1000
                    });
                });
            },
            // 验证通过
            onMpanelSuccess() {
                this.mpanelShow = false;
                this.registerAjax();
            },
            showReadAgree(event) {
                event.stopPropagation();
                this.readAgreeBox = true;
            }
        }
    };
</script>

<style lang="less" scoped>
    @import url("../../components/less/common.less");
    @import url("./auth.less");
</style>
