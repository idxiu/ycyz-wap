<template>
    <div class="pk-auth">
        <nut-navbar class="pk-title" @on-click-back="$router.go(-1)" @on-click-more="selfmore">
            <a class="spans" slot="back-icon">
                <img class="imgsbank" src="../../assets/img/my-icon/fanhui.png" />
            </a>
            用户登录
            <a class="backIdex" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
            </a>
        </nut-navbar>
        <div class="pk-auth-box">
            <section class="form-box">
                <ul>
                    <li class="form-item">
                        <input type="text" id="account" placeholder="请输入账号" v-model="account">
                        <label for="account">账号</label>
                    </li>
                    <li class="form-item">
                        <input type="password" id="password" placeholder="请输入密码" v-model="password">
                        <label for="password">密码</label>
                    </li>
                    <li class="form-item form-code" v-if="setting.isLoginCode == 1 && setting.loginCaptchaType == 1">
                        <input type="text" id="code" v-model="code">
                        <label for="password">验证码</label>
                        <img :src="'data:image/png;base64,'+codeInfo.code" alt="" class="login-code-img" @click="getCaptchaImg" v-if="codeInfo.code">
                    </li>
                    <li class="form-tool">
                        <div class="tool-item checkbox"><input type="checkbox" name="" id="rember" v-model="remember"><label for="rember">记住密码</label></div>
                        <router-link tag="div" :to="{name:'contactus'}" class="tool-item kf">忘记密码?</router-link>
                    </li>
                </ul>
                <div class="btns">
                    <div class="btn btn-disabled" @click="toLogin" :class="{'btn-active':(shwoCode && code && account && password) || (!shwoCode && account &&password)}">立即登录</div>
                    <div class="btn btn-default" @click="toTrial">点击试玩</div>
                    <div class="btn btn-default" @click="toRegister">免费开户</div>
                </div>
                <div class="thdlogins" v-if="haveqqlogin || havewechatlogin">
                    <p class="thdlogins-title">第三方登录</p>
                    <a v-if="haveqqlogin" class="alink" :href="goUrl">
                        <img src="../../assets/img/auth-icon/qie.png" alt="">
                    </a>
    
                    <a v-if="havewechatlogin" class="alink">
                        <img src="../../assets/img/auth-icon/weixin.png" alt="">
                    </a>
                </div>
                <!-- 验证码 start -->
                <Mpanel v-if="mpanelShow" @close="mpanelShow = false" @success="onMpanelSuccess" :type="2"></Mpanel>
                <!-- 验证码 end -->
            </section>
        </div>
    </div>
</template>

<script>
    import {
        getCaptchaCode,
        login,
        getRegisterSet,
        thdLoginQq,
        trialLoginInfo
    } from "../../services/auth.js";
    import Mpanel from "../../components/Mpanel.vue"; //验证
    export default {
        components: {
            Mpanel
        },
        data() {
            return {
                account: localStorage.getItem("account") || "",
                password: localStorage.getItem("password") ?
                    decodeURIComponent(localStorage.getItem("password")) :
                    "",
                code: "",
                codeInfo: {},
                setting: {},
                mpanelShow: false,
                haveqqlogin: false,
                havewechatlogin: false,
                goUrl: "",
                shwoCode: false,
                remember: localStorage.getItem("account") && localStorage.getItem("password")
            };
        },
        mounted() {
            this.getRegisterSetFunc();
            this.thdLogin();
        },
        methods: {
            thdLogin() {
                thdLoginQq().then(res => {
                    if (res.success) {
                        this.gobackUrl = window.location.href; //'https://zzya.pkcdns3.com/wap';//
                        this.appId = res.data.appId;
                        this.callbackUrl = res.data.callbackUrl;
                        this.goUrl =
                            "https://graph.qq.com/oauth2.0/authorize?client_id=" +
                            this.appId +
                            "&redirect_uri=" +
                            this.callbackUrl +
                            "&response_type=code&state=" +
                            this.gobackUrl;
                        console.log(this.goUrl);
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            getCaptchaImg() {
                this.code = "";
                getCaptchaCode().then(res => {
                    if (res.success) {
                        this.codeInfo = res.data;
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                    }
                });
            },
            getRegisterSetFunc() {
                getRegisterSet().then(res => {
                    if (res.success) {
                        console.log(res.data);
                        this.setting = res.data;
                        this.haveqqlogin = res.data.qqSWitch == 1;
                        this.havewechatlogin = res.data.wxSwitch == 1;
                        if (
                            this.setting.isLoginCode == 1 &&
                            this.setting.loginCaptchaType == 1
                        ) {
                            this.getCaptchaImg();
                            this.shwoCode = true;
                        }
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            goBack() {
                this.$router.push({
                    name: "index"
                });
            },
            toTrial(){
               const data = {
                };
                trialLoginInfo(data).then(res => {
                    if (res.success) {
                        console.log(res, '')
                        sessionStorage.setItem("token", res.data);
                        if (this.remember) {
                            localStorage.setItem("account", this.account);
                            localStorage.setItem("password", encodeURIComponent(this.password));
                        } else {
                            localStorage.removeItem("account");
                            localStorage.removeItem("password");
                        }
                        this.$router.push({
                            name: "index",
                            query:{ isTrial: true }
                        });
                    } else {
                        this.getCaptchaImg();
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            toLogin() {
                if (!this.account) {
                    this.$toast.fail("请输入账号！", {
                        cover: true,
                        duration: 1000
                    });
                    return;
                } else if (!this.password) {
                    this.$toast.fail("请输入密码！", {
                        cover: true,
                        duration: 1000
                    });
                    return;
                }
                if (
                    this.setting.isLoginCode == 1 &&
                    this.setting.loginCaptchaType == 1 &&
                    !this.code
                ) {
                    this.$toast.fail("请输入验证码！", {
                        cover: true,
                        duration: 1000
                    });
                    return;
                }
                if (
                    this.setting.isLoginCode === 1 &&
                    this.setting.loginCaptchaType === 2
                ) {
                    this.mpanelShow = true;
                } else {
                    this.loginAjax();
                }
            },
            loginAjax() {
                const data = {
                    account: this.account,
                    password: this.password,
                    code: this.code,
                    codeId: this.codeInfo.id
                };
                login(data).then(res => {
                    if (res.success) {
                        sessionStorage.setItem("token", res.data);
                        if (this.remember) {
                            localStorage.setItem("account", this.account);
                            localStorage.setItem("password", encodeURIComponent(this.password));
                        } else {
                            localStorage.removeItem("account");
                            localStorage.removeItem("password");
                        }
                        this.$router.push({
                            name: "index"
                        });
                    } else {
                        this.getCaptchaImg();
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            // 验证通过
            onMpanelSuccess(back, id) {
                this.code = back + "";
                this.codeInfo.id = id;
                this.mpanelShow = false;
                this.loginAjax();
            },
            toRegister() {
                this.$router.push({
                    name: "register"
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
    @import "./auth.scss";
</style>

