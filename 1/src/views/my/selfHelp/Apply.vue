<template>
    <div id="selfHelp">
        <Header :rooter="'-1'" :title="'自助优惠申请'" :hasNoBack="true" :iFontsize="'.58667rem'"></Header>
        <div class="person-info clearfix">
            <div class="left iconfont icon-sidebar_head"></div>
            <div class="center">
                <h2>{{name}}</h2>
            </div>
        </div>
        <div class="apply-content">
            <div class="apply-title">
                <span>{{info.proTitle}}</span>
            </div>
            <div class="apply-from">
                <div class="apply-input">
                    <div class="title"><span>*</span>申请金额</div>
                    <div class="input">
                        <input name="money" autocomplete="off" v-model="depositMoney"  v-validate="'required|depositMoney'"   :class="{ 'is-danger': errors.has('money') }" type="text" placeholder="请输入申请金额">
                    </div>
                </div>
                <div class="apply-input">
                    <div class="title"><span>*</span>申请理由</div>
                    <div class="input">
                        <textarea name="reason" rows="5" @input="inputReason" :maxlength="max" placeholder="请输入申请理由" v-validate="'required'" v-model="reason"></textarea>
                        <div class="apply-counter">最多输入{{max}}字，还能输入<span class="num">{{current}}</span>字以内</div>
                    </div>
                </div>
                <div class="apply-input">
                    <div class="title"><span>*</span>验证码</div>
                    <div class="apply-code">
                        <div class="input-code">
                            <input name="captcha" autocomplete="off" v-model="code" v-validate="'required|numeric'" :class="{'is-danger': errors.has('captcha') }" type="text" placeholder="请输入右侧验证码">
                        </div>
                        <div class="input-code-img">
                            <img :src="codeImg" @click="getCode">
                        </div>
                    </div>
                </div>
                <div class="divs">
                    <p v-show="errors.has('money')" class="errs help fds-12 is-danger">{{ errors.first('money') }}</p>
                    <p v-show="!errors.has('money') && errors.has('reason')" class="errs help fds-12 is-danger">{{ errors.first('reason') }}</p>
                    <p v-show="!errors.has('money') && !errors.has('reason') && errors.has('captcha')" class="errs help fds-12 is-danger">{{ errors.first('captcha') }}</p>
                </div>
    
            </div>
        </div>
        <div class="apply-btn" @click="apply">
            <span>提交申请</span>
        </div>
    
    </div>
</template>

<script>
    import Header from "../../../components/Header";
    import { 
        getInfo,
        apply
    } from '@/api/selfHelp'
    import{
        getCaptcha
    }from '@/api/login'
    export default {
        name: "apply",
        data() {
            return {
                name: sessionStorage.getItem("account"),
                id: this.$route.query.id,
                info: {},
                codeImg: "",
                codeId: "",
                depositMoney: "",
                code: "",
                reason: "",
                max: 255,
                current: 0,
            };
        },
        components: {
            Header
        },
        mounted() {
            this.getInfo();
            this.getCode();
        },
        methods: {
            getInfo() {
                getInfo(this.id).then(res => {
                    this.info = res;
                    setTimeout(() => {
                        this.$('.selfdetail-content img').css({
                            'max-width': "100%"
                        })
                    }, 1);
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
            apply() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        
                        apply(
                            this.id,
                            this.depositMoney,
                            this.reason,    
                            this.code,
                            this.codeId
                        ).then(res => {
                            this.$toast({
                                message: '申请成功',
                                duration: 1000
                            });
                            setTimeout(() => {
                                this.$router.go("-1");
                            }, 1001);
                        }).catch(err=>{
                            this.$toast({
                                message: err,
                                duration: 1000
                            });
                        })
                    }
                });
            },
            inputReason() {
                this.current = this.max - this.reason.length
            }
        }
    };
</script>

<style lang="less" scoped>
    @import url("../../../components/less/common.less");
    #selfHelp {
        box-sizing: border-box;
        line-height: 1;
        .person-info {
            padding-top: 1.22667rem;
            /* 92/75 */
            background: @color-B url("../../../assets/img/headbg.png") center 30px no-repeat;
            overflow: hidden;
            .left {
                margin: 0.4rem/* 30/75 */
                ;
                float: left;
                font-size: 1.70667rem;
                color: @color-primary;
            }
            .center {
                float: left;
                color: @color-primary;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                height: 2.50667rem/* 188/75 */
                ;
                h2 {
                    margin-bottom: 0.26667rem/* 20/75 */
                    ;
                    font-size: 0.48rem/* 36/75 */
                    ;
                }
                p {
                    font-size: 0.4rem/* 30/75 */
                    ;
                }
            }
            .right {
                float: right;
                height: 2.50667rem/* 188/75 */
                ;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-right: 0.4rem/* 30/75 */
                ;
                a {
                    color: @color-primary;
                    border: 1px solid @color-primary;
                    border-radius: 0.08rem/* 6/75 */
                    ;
                    height: 0.58667rem/* 44/75 */
                    ;
                    line-height: 0.58667rem/* 44/75 */
                    ;
                    padding: 0 0.13333rem/* 10/75 */
                    ;
                    box-sizing: border-box;
                    text-decoration: none;
                    span {
                        color: @color-primary;
                    }
                    .iconfont {
                        font-size: 0.32rem/* 24/75 */
                        ;
                    }
                }
            }
        }
        .apply-content {
            margin-top: 0.27rem;
            background: @color-default;
            .apply-title {
                padding-top: 0.4rem;
                margin-left: 0.4rem;
                margin-right: 0.4rem;
                color: @color-primary;
                font-size: 0.427rem;
            }
            .apply-from {
                margin-top: 0.27rem;
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
                        input {
                            height: 0.8rem;
                            width: 100%;
                            border-radius: 0.133rem;
                            border: solid 0.013rem @color-P;
                            padding-left: 0.2rem;
                        }
                        textarea {
                            border: solid 0.013rem @color-P;
                            width: 100%;
                            padding-left: 0.2rem;
                            padding-top: 0.2rem;
                            border-radius: 0.133rem;
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
                        }
                    }
                    .apply-counter{
                        color: @color-X;
                        text-align: right;
                        span.num{
                            color: @color-a;
                        }
                    }
                }
            }
        }
        .apply-btn {
            margin-top: 0.52rem;
            margin-left: 0.4rem;
            margin-right: 0.4rem;
            width: 9.2rem;
            height: 1.067rem;
            background-color: @color-primary;
            border-radius: 0.133rem;
            text-align: center;
            line-height: 1.067rem;
            span {
                color: @color-default;
                font-size: 0.373rem;
            }
        }
    }
    
    img {
        width: 100%;
        height: 0.7467rem;
    }
    
    .divs {
        text-align: center;
        padding: 0.2667rem 0;
        min-height: auto;
        p.errs {
            padding: 0;
            color: @color-i;
        }
    }
</style>
