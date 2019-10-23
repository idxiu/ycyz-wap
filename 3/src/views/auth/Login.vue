<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-28 09:11:35
 * @LastEditTime: 2019-10-12 13:33:53
 * @LastEditors: Please set LastEditors
 -->
<template>
	<div class="pk-auth">
		<div class="pk-auth-box">
			<div class="pk-site-info">
				<img v-if="siteInfo.logo" :src="siteInfo.logo" alt class="pk-site-logo" />
				<img v-else src="../../assets/img/icon_logo.png" alt class="pk-site-logo" />
				<p class="pk-site-name">{{siteInfo.siteName}}</p>
			</div>
			<section class="pk-form-box">
				<ul>
					<li>
						<h3>登录</h3>
					</li>
					<li class="pk-form-item">
						<input type="text" id="account" placeholder="请输入账号" v-model="account" />
						<label for="account">
							<img src="../../assets/img/auth-icon/zh.png" alt />
						</label>
					</li>
					<li class="pk-form-item">
						<input :type="inpuType" id="password" placeholder="请输入密码" v-model="password" />
						<label for="password">
							<img src="../../assets/img/auth-icon/mm.png" alt />
						</label>
						<div class="passEye iconfont" 
						:class="showPass"
						@click="showPassWord()" 
						></div>
					</li>
					<li
						class="pk-form-item form-code"
						v-if="setting.isLoginCode == 1 && setting.loginCaptchaType == 1"
					>
						<input type="text" id="code" placeholder="请输入验证码" v-model="code" />
						<label for="password">
							<img src="../../assets/img/auth-icon/yzm.png" alt />
						</label>
						<img
							:src="'data:image/png;base64,'+codeInfo.code"
							alt
							class="login-code-img"
							@click="getCaptchaImg"
							v-if="codeInfo.code"
						/>
					</li>
					<li class="form-tool pk-login-tool">
						<div class="tool-item checkbox">
							<input type="checkbox" name id="rember" v-model="remember" />
							<label for="rember">记住密码</label>
						</div>
						<router-link tag="a" :to="{name:'contactus'}" class="tool-item kf">忘记密码?</router-link>
					</li>
					<!-- <li class="form-tool ">
						<router-link tag="a" :to="{name:'contactus'}" class="tool-item kf">忘记密码?</router-link>
					</li>-->
				</ul>
				<div class="btns">
					<div class="btn btn-try" @click="tryPlay">试玩</div>
					<div class="btn" @click="toLogin">登录</div>
				</div>
				<div class="thdlogins" v-if="haveqqlogin || havewechatlogin">
					<p class="thdlogins-title">社交账号登录</p>
					<a v-if="haveqqlogin" class="alink" :href="goUrl">
						<img src="../../assets/img/auth-icon/QQ.png" alt />
					</a>

					<a v-if="havewechatlogin" class="alink">
						<img src="../../assets/img/auth-icon/wechat.png" alt />
					</a>
				</div>
				<div class="pk-register-in">
					没有账号?
					<router-link tag="a" :to="{name:'register'}" class="tool-item kf">马上注册</router-link>
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
	getInfo,
	getCaptchaCode,
	login,
	getRegisterSet,
	thdLoginQq,
	tryPlayDemo
} from "../../services/auth.js";
import { getLogo } from "../../services/index.js";
import Mpanel from "../../components/Mpanel.vue"; //验证
import Bus from "@/services/im/bus";
import { js2oc } from "@/js_oc";

export default {
	components: {
		Mpanel
	},
	data() {
		return {
			siteInfo: {},
			account: localStorage.getItem("account") || "",
			password: localStorage.getItem("password")
				? decodeURIComponent(localStorage.getItem("password"))
				: "",
			code: "",
			codeInfo: {},
			setting: {},
			mpanelShow: false,
			haveqqlogin: false,
			havewechatlogin: false,
			goUrl: "",
			shwoCode: false,
			eyesBtn: false,
			showPass: 'icondl_eye_off',
			inpuType: 'password',
			remember:
				localStorage.getItem("account") &&
				localStorage.getItem("password")
		};
	},
	mounted() {
		this.getRegisterSetFunc();
		this.thdLogin();
		this.getLogoFunc();
	},
	methods: {
		getLogoFunc() {
			getLogo().then(res => {
				if (res.success) {
					this.siteInfo = res.data;
					// ws 权限认证需要传递 siteIndexId 和 siteId
					localStorage.setItem(
						"siteInfo",
						JSON.stringify(this.siteInfo)
					);
					// document.title = this.siteInfo.siteName;
				} else {
					this.$toast.fail(res.message, {
						cover: true,
						duration: 1500
					});
				}
			});
		},
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

		//试玩
		async tryPlay() {
			// TODO 请求试玩接口
			let res = await tryPlayDemo();
			console.log(res);
			if (res.success) {
				sessionStorage.setItem("token", res.data);
				Bus.$emit("toggle-try-play-modal", true, 1);
			} else {
				this.$toast.text(res.message);
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
					// 给 APP传递token
					window.JsBridge(bridge => {
						bridge.callHandler(js2oc.SET_TOKEN, {
							token: res.data
						});
					});

					sessionStorage.setItem("token", res.data);

					getInfo().then(result => {
						if (result.success) {
							localStorage.setItem("userId", result.data.user.id);
							localStorage.setItem(
								"user",
								JSON.stringify(result.data.user)
							);
						}
					});
					if (this.remember) {
						localStorage.setItem("account", this.account);
						localStorage.setItem(
							"password",
							encodeURIComponent(this.password)
						);
					} else {
						localStorage.removeItem("account");
						localStorage.removeItem("password");
					}
					// 登录时，不管是不是试玩会员 直接把 isDemo 删除
					localStorage.removeItem("isDemo");
					this.$router.push({
						name: "index"
					});

					this.IM();
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
		//显示密码
		showPassWord(){
			if(this.eyesBtn) {
				this.showPass = 'icondl_eye_off';
				this.inpuType = 'password';
			}else{
				this.showPass = 'icondl_eye_no';
				this.inpuType = 'text';
			}
			this.eyesBtn = !this.eyesBtn;
		}
	}
};
</script>
<style lang="scss" scoped>
@import "./auth.scss";
</style>

