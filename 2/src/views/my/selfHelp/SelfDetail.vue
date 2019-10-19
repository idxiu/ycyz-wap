<template>
    <div id="selfDetail">
        <nut-navbar class="pk-title" 
            @on-click-back="$router.go(-1)"
            @on-click-more="selfmore">
            <a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png"/>
			</a>
            自助优惠申请
            <a class="backIdex" slot="more-icon">
                <img class="imgsbank" src="@/assets/img/my-icon/backIndex.png">
            </a>
        </nut-navbar>
        <div v-show="loading" class="skeleton">
            <div class="skeleton-bac-animation"></div>
            <skeleton-square 
                width="9rem" 
                height="3rem"
                margin="0.2rem 0.5rem"
            ></skeleton-square>
            <column>
                <skeleton-square 
                    width="9rem"
                    :count="3" 
                    margin="0.2rem 0.5rem"
                ></skeleton-square>
            </column>
            <skeleton-square 
                width="2rem" 
                margin="0.4rem 0.5rem 0.2rem"
            ></skeleton-square>
            <skeleton-square 
                width="9rem" 
                height="0.8rem"
                margin="0.2rem 0.5rem"
            ></skeleton-square>
             <skeleton-square 
                width="2rem" 
                margin="0.4rem 0.5rem 0.2rem"
            ></skeleton-square>
            <skeleton-square 
                width="9rem" 
                height="1.8rem"
                margin="0.2rem 0.5rem"
            ></skeleton-square>
             <skeleton-square 
                width="2rem" 
                margin="0.4rem 0.5rem 0.2rem"
            ></skeleton-square>
            <row padding="0.4rem 0.5rem 0.2rem">
                <skeleton-square 
                    width="7rem"
                    height="0.5rem"
                    margin="0 0.5rem 0 0"
                ></skeleton-square>
                <skeleton-square 
                    width="1.5rem" 
                    height="0.5rem"
                ></skeleton-square>
            </row>
            <skeleton-square 
                width="8rem" 
                height="0.8rem"
                margin="0.4rem 1rem 0"
            ></skeleton-square>
            <skeleton-square 
                width="8rem" 
                height="0.8rem"
                margin="0.3rem 1rem"
            ></skeleton-square>
        </div>
        <div class="self-content" v-show="!loading">
            <div class="self-img">
                <img :src="info.wapImg">
            </div>
            <div class="self-info">
                <div class="self-title">
                    <h2 @click="showProContent = !showProContent">
                        <span>{{info.proTitle}}</span>
                        <i
                        class="iconfont icon-list-more"
                        :class="{'show':showProContent}"
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
                        onkeypress="if((event.keyCode&lt;48 || event.keyCode&gt;57) &amp;&amp; event.keyCode!=46 || /\.\d\d$/.test(value))event.returnValue=false" 
                        name="money"
                        autocomplete="off"
                        v-model="depositMoney"
                        type="tel"
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
                        v-model="reason"
                        ></textarea>
                        <div class="apply-counter">最多输入{{max}}字，还能输入<span class="num">{{current}}</span>字以内</div>
                    </div>
                </div>
                <div class="apply-input">
                    <div class="title">
                        <span>*</span>验证码
                    </div>
                    <div class="apply-code">
                        <div class="input-code">
                        <input
                            onkeyup="value=value.replace(/\D/g,'')"
                            name="captcha"
                            autocomplete="off"
                            v-model="code"
                            maxlength="4"
                            type="tel"
                            placeholder="请输入右侧验证码"
                        >
                        </div>
                        <div class="input-code-img">
                            <img :src="codeImg" @click="getCode">
                        </div>
                    </div>
                </div>
                <div class="divs"></div>
            </div>
            <div class="self-btn">
                <div class="input" @click="apply">
                    <span >提交申请</span>
                </div>
            </div>
            <div class="self-btn no-bg">
                <router-link class="input" tag="div" :to="{name:'selfmore'}">
                    <span>优惠申请记录</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getSelflist,
    getSelfCode,
    getSelfApply
} from "../../../services/center.js"
export default {
    name: "selfDetail",
    data() {
        return {
            loading: true,
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
            showProContent: false,
        };
    },
    mounted() {
        this.getInfo();
        this.getCode();
    },
    methods: {
        selfmore(){
            this.$router.push({
                name: "index"
            });
        },
        getInfo(){
            getSelflist().then(res => {
                if (res.success) {
                    this.loading = false;
                    res.data.map(v => {
                        if(this.id == v.id){
                            this.info = v
                        }
                    });
                } else {
                    this.$toast.fail(res.message, {
                        cover: true,
                        duration: 1000
                    });
                }
            });
        },
        getCode() {
            getSelfCode().then(res => {
                if (res.success) {
                    this.codeImg = "data:image/png;base64," + res.data.code;
                    this.codeId = res.data.id;
                } else {
                    this.$toast.fail(res.message, {
                        cover: true,
                        duration: 1000
                    });
                }
            });
        },
        apply() {
            let _this = this;
            let data = {
                activityId: parseInt(this.id),
                depositMoney: parseFloat(this.depositMoney),
                remark:this.reason,
                code:this.code,
                codeId:this.codeId
            }
            //验证空
            if(data.depositMoney == ''){
                this.$toast.fail("申请金额不能为空", {
                    cover: true,
                    duration: 1000
                });
                return false
            }
            if(data.remark == ''){
                this.$toast.fail("申请理由不能为空", {
                    cover: true,
                    duration: 1000
                });
                return false
            }
            if(data.code == ''){
                this.$toast.fail("验证码不能为空", {
                    cover: true,
                    duration: 1000
                });
                return false
            }
            //
            if(!/^\d{1,8}(\.\d{1,2})?$/.test(data.depositMoney)){
                this.$toast.fail("金额为0.00-99999999.99", {
                    cover: true,
                    duration: 1000
                });
                return false
            }else if(!/^\d+$/.test(data.code)){
                this.$toast.fail("验证码输入有误", {
                    cover: true,
                    duration: 1000
                });
                return false
            }
            getSelfApply(data).then(res => {
                if (res.success) {
                    if(res.data.apply === 2 && res.data.undone === 1){
                        let self = this;
                        this.$dialog({
                            id:'dialog_back',//如果希望同时弹出多个Dialog，请给不同的Dialog设置不同的id。
                            lockBgScroll:true,
                            closeOnClickModal:false,//点击蒙层是否关闭对话框 默认true
                            closeBtn:true,  //是否显示右上角关闭按钮 默认 false
                            textAlign:'left',//content 对齐方式，默认'center',这里根据新版设计稿需要给'left'
                            title: "申请失败",
                            content:"您已申请过该活动，是否查看您的申请记录？",
                            customClass:'pk-dialog',
                            onOkBtn() {
                                this.close(); //关闭对话框
                                _this.$router.push({
                                    name: "selfmore"
                                });
                            }
                        });
                        return false
                    }else if(res.data.apply === 2 && res.data.undone === 2){
                        let self = this;
                        this.$dialog({
                            id:'dialog_back',//如果希望同时弹出多个Dialog，请给不同的Dialog设置不同的id。
                            lockBgScroll:true,
                            closeOnClickModal:false,//点击蒙层是否关闭对话框 默认true
                            closeBtn:true,  //是否显示右上角关闭按钮 默认 false
                            textAlign:'left',//content 对齐方式，默认'center',这里根据新版设计稿需要给'left'
                            title: "申请失败",
                            content:"是否查看您的申请记录？",
                            customClass:'pk-dialog',
                            onOkBtn() {
                                this.close(); //关闭对话框
                                _this.$router.push({
                                    name: "selfmore"
                                });
                            }
                        });
                        return false
                    }
                    this.$toast.success("申请成功", {
                        cover: true,
                        duration: 1000
                    });
                    this.$router.push({
                        name: "selfmore"
                    });
                } else {
                    this.$toast.fail(res.message, {
                        cover: true,
                        duration: 1000
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

<style lang="scss" scoped>
#selfDetail{
    /deep/ .selfmore{
        font-size: 0.6rem;
    }
    .skeleton{
        background-color: $default-color;
    }
    .self-content {
        background-color: $light-color;
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
            background: $default-color;
            .self-title {
                h2 {
                    position: relative;
                    padding-left: 0.72rem;
                    font-size: 0.45rem;
                    color: $text-color !important;
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
                    &:before{
                        position: absolute;
                        top: 50%;
                        left: 0.4rem;
                        transform: translateY(-50%);
                        content: '';
                        width: 0.067rem;
                        height: 0.4rem;
                        background-color: #488bfe;
                        border-radius: 0.033rem;
                    }
                }
            }
            .selfdetail-content {
                padding: 0.2rem;
                margin: 0 0.4rem;
                font-size: 0.347rem;
                color: $tip-color;
                word-wrap:break-word
            }
        }
        .self-btn {
            padding: 0 0.4rem;
            background-color: $default-color;
            font-size: 0.48rem;
            text-align: center;
            line-height: 1.2rem;
            color: $default-color;
            .input{
                margin: 0 auto;
                width: 9.2rem;
                height: 1.2rem;
                background-color: $primary-color;
                border-radius: 0.133rem;
            }
        }
        .no-bg {
            padding: 0.4rem 0;
            .input{
                border-radius: 0.133rem;
                color: $primary-color;
                background-color: $default-color;
	            border: solid 0.027rem $primary-color;
            }
        }
    }
    //------
    .apply-from {
        padding-top: 0.2667rem;
        margin-top: 0.27rem;
        background: $default-color;
        .apply-input {
            padding-left: 0.4rem;
            padding-right: 0.4rem;
            font-size: 0.32rem;
            .title {
                width: 100%;
                span {
                    color: $must-color;
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
                    border: solid $onerem $state-border;
                    padding-left: 0.2rem;
                    box-sizing: border-box;
                }
                textarea {
                    border: solid $onerem $state-border;
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
                    border: solid $onerem $state-border;
                    margin-right: 0.2rem;
                }
            }
                .input-code-img {
                    margin-left: 0.3rem;
                    flex: 2;
                    border-radius: 0.133rem;
                    border: solid 0.013rem $border-color;
                    img {
                        width: 100%;
                        height: 0.7467rem;
                    }
                }
            }
            .apply-counter {
                color: $text-color;
                text-align: right;
                span.num {
                    color: $text-color;
                }
            }
        }
        .divs {
            text-align: center;
            min-height: auto;
            height: 0.4rem;
            p.errs {
                padding: 0;
                color: $text-color;
            }
        }
    }
}
</style>