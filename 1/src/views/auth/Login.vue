<template>
    <div class="register login" style="overflow-y: scroll;" ref="login">
        <Header :reHeadMid="false" :isShowHome="false">
            <div slot="head_mid" class="auth-logo">
                <img src="../../assets/img/icon_top_logo.png" alt="">
            </div>
        </Header>
        <div class="hasbox"></div>
        <!-- 验证码 start -->
        <Mpanel v-if="mpanelShow"
                @close="mpanelShow = false"
                @success="onMpanelSuccess" @codeId="getcodeId" :type="2"></Mpanel>
        <!-- 验证码 end -->
        <div class="register-cent">
            <h3 class="fs-24">用户登录</h3>
            <div class="register-from">
                <form>
                    <div class="pk-input">
                        <label class="title must fs-14">账号</label>
                        <div class="input fs-12">
                            <input name="account" autocomplete="off" v-model="name" v-validate="'required|alpha_num|max:12|min:5'" :class="{'input': true, 'is-danger': errors.has('account') }" type="text" placeholder="5-16位字母和数字组合">
                            <i v-show="errors.has('account')" class="fs-16 iconfont icon-czsb icon-style  error-icon"></i>
                            <span v-show="errors.has('account')" class="help fds-12 is-danger">{{errors.first('account')}}</span>
                        </div>
                    </div>
                    <div class="pk-input">
                        <label class="title must fs-14">密码</label>
                        <div class="input fs-12">
                            <input type="password" name="password" autocomplete="off" v-model="password" v-validate="'required|alpha_num|max:20|min:6'" :class="{'input': true, 'is-danger': errors.has('password') }" placeholder="6-20位字母和数字组合">
                            <i v-show="errors.has('password')" class="fs-16 iconfont icon-czsb icon-style  error-icon"></i>
                            <span v-show="errors.has('password')" class="help fds-12 is-danger">{{errors.first('password')}}</span>
                        </div>
                    </div>
                    <div v-if="loginCode ===1 && codeType===1" class="pk-input pk-input-code">
                        <label class="title must fs-14">验证码</label>
                        <div class="pk-input pk-input-code">
                            <label class="title must fs-14">验证码</label>
                            <div class="input fs-12 input-code">
                                <input name="captcha" autocomplete="off" v-model="code" v-validate="'required|numeric'" :class="{'input': true, 'is-danger': errors.has('captcha') }" type="text" placeholder="请输入验证码">
                                <i v-show="errors.has('captcha')" class="fs-16 iconfont icon-czsb icon-style  error-icon"></i>
                                <span v-show="errors.has('captcha')" class="help fds-12 is-danger">{{errors.first('captcha')}}</span>
                            </div>
                            <div class="input-code-img">
                                <img :src="codeImg" @click="getCode">
                            </div>
                        </div>
                    </div>
                    <div class="register-protocol">
                        <div class="mgl0">
                            <div @click="remember=!remember">
                                <div class="ps fl">
                                    <div class="ju">
                                        <img v-show="!remember" src="./icon_will.png" alt="" class="imgs">
                                        <img v-show="remember" src="./icon_ok.png" alt="" class="imgs">
                                    </div>
                                </div>
                                <div class="fs-14 fl j98">记住密码</div>
                            </div>
                            <div class="forget fs-14 j98">忘记密码请<router-link tag="span" :to="{name:'contactus'}" class="service">联系客服</router-link></div>
                        </div>
                    </div>
                    <div class="pk-btn fs-14" @click="myLogin">
                        立即登录
                    </div>
                </form>
                <p class="has-account fs-14" @click="toRegister">
                    没有账号？立即注册
                </p>
            </div>
            <div class="thdlogins">
                <a v-if="haveqqlogin" class="alink" :href="goUrl">
                    <i class="iconfont icon-sanfang-qq iconqq"></i>
                    <p>QQ登录</p>
                </a>

                <a v-if="havewechatlogin" class="alink">
                    <i class="iconfont icon-sanfang-wx iconqq"></i>
                    <p>微信登录</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from "../../components/Header";
    import Mpanel from "../../components/Mpanel";  //验证
    import {
        getSetup,
        getCaptcha,
        login,
        thdLoginQq
    } from '@/api/login';
    import { getThreeInfo } from "@/api/index";
import { timingSafeEqual } from 'crypto';
    export default {
        components: {
            Header,
            Mpanel
        },
        data() {
            return {
                remember: false,
                message: "11",
                name: localStorage.getItem("name") || "",
                password: localStorage.getItem("pwd") || "",
                code: "",
                codeImg: "",
                codeId: "",
                showPositionValue: false,
                remember: localStorage.getItem("pwd") && localStorage.getItem("name"),
                appId:'',
                callbackUrl:'',
                goUrl:'',
                gobackUrl:'',
                codes:'',
                haveqqlogin: false,
                havewechatlogin :false,
                mpanelShow: false,
                //登陆的设置
                loginCode: 0,
                codeType: 0,//登陆验证码类型 1数字验证 2图片验证
                
            };
        },
        mounted() {
            const session = sessionStorage.getItem('session');
            if (session) {
                sessionStorage.removeItem('session');
            }
            this.$refs.login.style.height = window.innerHeight + "px";

            this.getSet();
            this.thdLogin();
            this.havThree();
        },
        methods: {
            getcodeId: function (somedata){
                this.codeId = somedata
            },
            getSet(){
                getSetup().then((res) => {
                    this.loginCode = res.isLoginXode
                    this.codeType = res.loginCaptchaType
                    if(this.codeType ===1){
                        this.getCode()
                    }
                }).catch((res) => {
                    this.$toast({
                        message: res,
                        duration: 2000
                    });
                });
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
            havThree(){
                getThreeInfo().then(res => {
                    if(res.isQq === 1){
                        this.haveqqlogin = true
                    }
                    if(res.isWechat === 1){
                        this.havewechatlogin = true
                    }
                })
                .catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                });
            },
            thdLogin(){
                thdLoginQq().then(res => {
                 this.gobackUrl=window.location.href; 
                this.appId=res.appId;
                this.callbackUrl = res.callbackUrl;
                this.goUrl='https://graph.qq.com/oauth2.0/authorize?client_id='+this.appId+'&redirect_uri='+this.callbackUrl+'&response_type=code&state='+this.gobackUrl
                })
            },
            myLogin() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        if(this.loginCode === 1&& this.codeType ===2){
                            this.mpanelShow = true
                        }else{
                            this.loginAjax()
                        }
                    }
                });
            },
            toRegister() {
                this.$router.push("register");
            },
            loginAjax(){
                const _this = this;
                login(this.name, this.password, this.codeId, this.code).then((res) => {
                    sessionStorage.setItem("session", res.sessionId);
                    if (_this.remember) {
                        localStorage.setItem("name", _this.name);
                        localStorage.setItem("pwd", _this.password);
                    } else {
                        localStorage.removeItem("name");
                        localStorage.removeItem("pwd");
                    }
                    _this.$router.push("/");
                }).catch((err) => {
                    console.log(err);
                    if(this.codeType === 1){
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
                this.loginAjax();
            }
        }
    };
</script>

<style lang="less" scoped>
    @import url("../../components/less/common.less");
    @import url("./auth.less");
</style>
