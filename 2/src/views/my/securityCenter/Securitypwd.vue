<template>
	<div class="bankcard" ref="bankcard">
		<nut-navbar class="pk-title"  @on-click-back="back('securityCenter')" @on-click-more="back('index')">
			设置取款密码
			<a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png"/>
			</a>
            <a class="backIdex" slot="more-icon" >
                <img class="imgsbank" src="../../../assets/img/my-icon/backIndex.png"/>
            </a>
		</nut-navbar>
		<div class="pk-form-content">
			<div class="pk-input">
				<label>
					{{isSet?'旧密码':'登录密码'}}:
				</label>
				<nut-col :span="16">
					<div class="flex-content el-input">
						<!-- <p class="names">p*d</p> -->
						<input
							type="password"
							class="inputs"
                            :placeholder="placeholder"
                            v-model="password"
						/>
					</div>
				</nut-col>
			</div>
		</div>
		<div class="pk-form-content">
			<div class="pk-input">
				<label>新密码：</label>
				<nut-col :span="16">
					<div class="flex-content el-input">
						<input
							type="password"
							class="inputs"
                            placeholder="请输入新取款密码"
                            v-model="newPassword"
                            
						/>
					</div>
				</nut-col>
			</div>
			<div class="pk-input no-botline">
				<label>
					确认新密码：
				</label>
				<nut-col :span="16">
					<div class="flex-content el-input">
						<input
							type="password"
							class="inputs"
                            placeholder="请再次输入取款密码"
                            v-model="confirmPassword"
						/>
					</div>
				</nut-col>
			</div>
		</div>
		<div class="has-btn">
            <div class="btns">
                <nut-button class="btnsf" block shape="circle" @click="submit()">保存设置</nut-button>
            </div>
        </div>
	</div>
</template>
<script>
import { memBankList,getIsSetPwd,modifyWithdrawlPwd } from "@/services/securityCenter.js";
export default {
	data() {
		return {
            password:'',
            newPassword:'',
            confirmPassword:'',
            isSet:false,//是否设置过取款密码
			placeholder:"请输入登录密码",
			regular:/^\d{6}$/,
		};
	},
	mounted() {
		this.$refs.bankcard.style.height = window.innerHeight + "px";
		this.getIsSetPwd();
	},
	methods: {
		back(path) {
			this.$router.push({
				name: path
			});
		},
        getIsSetPwd(){
            let loading = this.$toast.loading('加载中...');
            getIsSetPwd().then((res) => {
                loading.hide();
                if(res.success){
                    this.isSet = res.data.isSet;
                    this.placeholder = this.isSet?'请输入旧取款密码':'请输入登录密码'
                }else {
                    this.$toast.fail(res.message, {
						cover: true,
						duration: 4000
					});
                }
            })
        },
        submit(){
            let postData = {
                password:this.password,
                newPassword:this.newPassword
            }

            if(!this.password){
                this.$toast.fail(`请输入${this.isSet?'取款':'登录'}密码`, {
                    cover: true,
                });
                return;
            }
            if(!this.newPassword){
                this.$toast.fail('请输入新密码！', {
                    cover: true,
                });
                return;
            }
			if(!this.regular.test(this.newPassword)){
                this.$toast.fail('请输入6位纯数字新密码！', {
                    cover: true,
                });
                return;
            }
            if(this.newPassword!=this.confirmPassword){
                this.$toast.fail('两次密码不一致', {
                    cover: true,
                });
                return;
            }
            if(this.newPassword==this.password){
                this.$toast.fail('新密码不能和旧密码一致', {
                    cover: true,
                });
                return;
            }
            
            let loading = this.$toast.loading('提交中...');
            modifyWithdrawlPwd(postData).then((res) => {
                loading.hide();
                if(res.success){
                    this.$toast.success('修改成功!', {
						cover: true,
                    });
                    this.$router.push({name:'securityCenter'})
                }else {
                    this.$toast.fail(res.message, {
						cover: true,
						duration: 4000
					});
                }
            })
        }
	}
};
</script>
<style lang="scss" scoped>
	@import "../../../components/scss/pk-pwd.scss";
	.bankcard {
        position: relative;
		background: $center-newbg;
		.pk-form-content {
			padding-left: 0.4rem;
		}
		.pk-input {
			padding-left: 0;
			label {
				font-size: 0.29333rem /* 22/75 */;
			}
		}
		.names {
			color: $bank-card-color;
			text-align: right;
		}
		.pk-bankcard {
			height: 100%;
			width: 100%;
			// padding: 0 0.26667rem;
			// padding-right: 0.5rem;
			text-decoration: none;
			padding-left: 0;
			background-color: $default-color !important;
			span,
			label {
				font-size: 0.29333rem;
			}
		}

		/deep/.nut-actionsheet-menu {
			display: none;
        }
        .has-btn{
            position: absolute;
            width: 100%;
            bottom: 1.46667rem /* 110/75 */;
        }
        .btns{
            display: flex;
            justify-content: center;
            height: 1.46667rem /* 110/75 */;
            .btnsf{
				font-size: .48rem;
                display: block;
                width: 9.2rem /* 690/75 */;
                height: 1.46667rem /* 110/75 */;
                background-color: #488bfe;
                border-radius: .13333rem /* 10/75 */;
            }
        }
	}
	small {
		color: $label-color;
	}
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
    .pk-form-content {
        padding-right: 0.4rem;
        .pk-input{
            height: 1.46667rem /* 110/75 */;
            label{
                font-size: .42667rem /* 32/75 */;
                color: $tip-color;
            }
            .el-input input{
                font-size: .42667rem /* 32/75 */;
                color: $label-color;
            }
        }
        ::-webkit-input-placeholder {
            color: $placeholder-color;
            font-size: .42667rem /* 32/75 */;
        }

        /* Firefox版本4-18 */
        :-moz-placeholder {
            color: $placeholder-color;
            font-size: .42667rem /* 32/75 */;
        }

        /* Firefox版本19+ */
        ::-moz-placeholder {
            color: $placeholder-color;
            font-size: .42667rem /* 32/75 */;
        }

        /* IE浏览器 */
        :-ms-input-placeholder {
            color: $placeholder-color;
            font-size: .42667rem /* 32/75 */;
        }
        .no-botline{
            &::after{
                border-bottom: none;
            }
        }
    }
</style>