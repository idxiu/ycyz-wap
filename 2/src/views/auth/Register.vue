<template>
    <div class="pk-auth">
        <nut-navbar class="pk-title" @on-click-back="$router.go(-1)" @on-click-more="selfmore">
            <a class="spans" slot="back-icon">
                <img class="imgsbank" src="../../assets/img/my-icon/fanhui.png" />
            </a>
            用户注册
            <a class="backIdex" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
            </a>
        </nut-navbar>
        <div class="pk-auth-box">
            <div class="noticebar" v-if="announcement.length > 0">
                <img src="../../assets/img/auth-icon/laba.png" alt="">
                <marquee class="marquee" direction="left" align="bottom" height="22" width="100%" scrollamount="4" scrolldelay="1">
                    <div class="noticeText" v-for="(noticeDatas,index) in announcement" :key="index">
                        {{noticeDatas.content}}
                    </div>
                </marquee>
            </div>
            <section class="form-box">
                <ul>
                    <li class="form-item">
                        <input type="text" readonly v-model="promoCode">
                        <label for="account">介绍人</label>
                    </li>
                    <li class="form-item">
                        <input type="text" id="account" placeholder="5-16位字母和数字组合" v-model="account" maxlength="16">
                        <label for="account">账号</label>
                    </li>
                    <li class="form-item">
                        <input type="password" id="password" placeholder="6-20位字母和数字组合" v-model="password">
                        <label for="password">密码</label>
                    </li>
                    <li class="form-item">
                        <input type="password" id="passwordComf" placeholder="再次输入您的登录密码" v-model="passwordComf">
                        <label for="passwordComf">确认密码</label>
                    </li>
                    <li class="form-item form-code" v-if="setting.isCode == 1 && setting.captchaType == 1">
                        <input type="text" id="code" v-model="code">
                        <label for="password">验证码</label>
                        <img :src="'data:image/png;base64,'+codeInfo.code" alt="" class="login-code-img" @click="getCaptchaImg" v-if="codeInfo.code">
                    </li>
                    <li class="form-tool">
                        <div class="tool-item checkbox"><input type="checkbox" name="" id="rember" v-model="agree"><label for="rember">已阅读并同意</label><span class="agreement" @click="toAgreement">《注册协议》</span></div>
                    </li>
                </ul>
                <div class="btns">
                    <div class="btn btn-disabled" @click="toRegister" :class="{'btn-active':(shwoCode && code && account && password && passwordComf) || (!shwoCode && account && password && passwordComf)}">立即注册</div>
                    <div class="btn btn-default" @click="toLogin">已有账号，直接登录</div>
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
        getRegisterSet,
        getAgent,
        register
    } from "../../services/auth.js";
    import {
        getAnnouncement
    } from "../../services/index.js";
    import Mpanel from "../../components/Mpanel.vue"; //验证
    export default {
        components: {
            Mpanel
        },
        data() {
            return {
                showAccountIcon: false,
                showCodeClearIcon: false,
                announcement: [],
                promoCode: "aaa",
                account: "",
                password: "",
                passwordComf: "",
                showPasswordComf: true,
                showPassword: true,
                code: "",
                codeInfo: {},
                agree: false,
                RegExp: {
                    account: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,16}$/,
                    pwd: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
                },
                setting: {},
                mpanelShow: false,
                shwoCode: false
            };
        },
        mounted() {
            this.getRegisterSetFunc();
            this.getAnnouncementFunc();
            let tid = this.getStorage('tid', 1000 * 60 * 60 * 24);
            console.log(tid);
            if (tid) {
                this.promoCode = tid;
            } else {
                this.getAgentFunc();
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
            getAnnouncementFunc() {
                getAnnouncement(-2).then(res => {
                    if (res.success) {
                        this.announcement = res.data.announcement || [];
                        console.log(213123123);
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            },
            getAgentFunc() {
                getAgent().then(res => {
                    if (res.success) {
                        this.promoCode = res.data;
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
                        if (this.setting.isCode == 1 && this.setting.captchaType == 1) {
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
    
            hideClear() {
                setTimeout(() => {
                    this.showAccountIcon = false;
                }, 1);
            },
            clearVal() {
                this.account = "";
            },
            hideClearCodeIcon() {
                setTimeout(() => {
                    this.showCodeClearIcon = false;
                }, 1);
            },
            clearCodeVal() {
                this.code = "";
            },
            toAgreement() {
                this.$router.push({
                    name: "registerAgreement"
                });
            },
            toLogin() {
                this.$router.push({
                    name: "login"
                });
            },
            toRegister() {
                if (!this.agree) {
                    this.$toast.fail("请阅读注册协议！", {
                        cover: true,
                        duration: 1000
                    });
                    return;
                }
                if (!this.account) {
                    this.$toast.fail("请输入账号！", {
                        cover: true,
                        duration: 1000
                    });
                    return;
                } else if (!this.RegExp.account.test(this.account)) {
                    this.$toast.fail("账号必须由5-16位字母和数字组合", {
                        cover: true,
                        duration: 1500
                    });
                    return;
                } else if (!this.password) {
                    this.$toast.fail("请输入密码！", {
                        cover: true,
                        duration: 1000
                    });
                    return;
                } else if (!this.RegExp.pwd.test(this.password)) {
                    this.$toast.fail("密码必须由6-20位字母和数字组合", {
                        cover: true,
                        duration: 1500
                    });
                    return;
                } else if (!this.passwordComf) {
                    this.$toast.fail("请再次输入密码！", {
                        cover: true,
                        duration: 1000
                    });
                    return;
                } else if (this.passwordComf != this.password) {
                    this.$toast.fail("两次密码输入不一致！", {
                        cover: true,
                        duration: 1000
                    });
                    return;
                }
                if (
                    this.setting.isCode == 1 &&
                    this.setting.captchaType == 1 &&
                    !this.code
                ) {
                    this.$toast.fail("请输入验证码！", {
                        cover: true,
                        duration: 1500
                    });
                    return;
                }
                if (this.setting.isCode === 1 && this.setting.captchaType === 2) {
                    this.mpanelShow = true;
                } else {
                    this.loginAjax();
                }
            },
            // 验证通过
            onMpanelSuccess(back, id) {
                this.code = back + "";
                this.codeInfo.id = id;
                this.mpanelShow = false;
                this.loginAjax();
            },
            loginAjax() {
                console.log(123123);
                let data = {
                    account: this.account,
                    password: this.password,
                    confirmPassword: this.passwordComf,
                    spreadId: this.promoCode,
                    code: this.code,
                    codeId: this.codeInfo.id,
                    readAgree: this.agree
                }
                register(data).then(res => {
                    if (res.success) {
                        sessionStorage.setItem('token', res.data);
                        this.$router.push({
                            name: "index"
                        });
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1000
                        });
                        this.code = '';
                        this.codeInfo.id = '';
                        if (this.setting.isCode == 1 && this.setting.captchaType == 1) {
                            this.getCaptchaImg();
                        }
                    }
                })
    
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

