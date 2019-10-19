<template>
    <transition name="fade">
        <div class="modal-box">
            <div class="modal-content">
                <div class="modal-header">
                    <span>滑块验证</span>
                    <span @click="onCancel" class="close-mask"><i data-v-1a504564="" class="iconfont icon-sykszz-close"></i></span>
                </div>
                <!--内容区域-->
                <div class="modal-body">
                    <div id="mpanel" ref="mpanel"></div>
                </div>
                <div class="modal-bottom">
                   <i class="red">*</i>请完成上方的验证<i class="red">*</i>
                </div>
            </div>
        </div>
    </transition>
 
</template>
 
<script>
import {
    getMpanel
} from '@/api/login';
export default {
    props: ["type"],
    name: 'mpanel',
    watch: {
        state(newVal, oldVal) {
            if (newVal) {
                this.ModalHelper.open();
            } else {
                this.ModalHelper.close();
            }
        },
    },
    data() {
        return {
            path: null,
            refresh:false,
        }
    },
    mounted() {
        this.slideVerify();
    },
    methods: {
        onCancel() {
            this.$emit('close');
        },
        // 提示框
        showToolTip(text, timeout = 2000) {
            this.$toast({
                message: text,
                duration: 2000
            })
        },
        // 验证
        slideVerify() {
            let _this = this
            getMpanel().then((res) => {
                console.log(res)
                console.log("this.type",this.type)
                _this.$emit('codeId',res.id);
                this.$('#mpanel').slideVerify({
                    type: 2,
                    mode: 'pop',
                    vOffset: this.type,
                    vSpace: 5,
                    codeId: res.id,
                    explain: '向右滑动完成验证',
                    imgUrl: "data:image/png;base64," +res.normal,
                    smallImg: "data:image/png;base64," +res.small,
                    imgSize : {
                        width: res.imgx*window.dpr+'px',
                        height: res.imgy*window.dpr+'px',
                    },
                    blockSize : {
                        width: res.sImgx*window.dpr + 'px',
                        height: res.sImgy*window.dpr + 'px',
                    },
                    barSize: {
                        width: res.imgx*window.dpr+'px',
                        height: res.sImgy*window.dpr + 'px',
                    },
                    rand2:res.y*window.dpr,
                    ready: function(v){
                        if(v){
                            _this.slideVerify()
                        }
                    },
                    success: function () {
                        _this.showToolTip("验证成功")
                        // 向父组件传值
                        _this.$emit('success');
                    },
                    error: function () {
                        _this.slideVerify();
                        _this.showToolTip("验证失败");
                    }
                });
            }).catch((res) => {
                this.$toast({
                    message: res,
                    duration: 2000
                });
            });
        }
    }
}
</script>
<style scoped>
    @import  url('./less/skin.less');
    @import url("./less/verify.less");
.modal-box {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.modal-content {
  position: relative;
  width: 90%;
  background: #fff;
  border-radius: 0.267rem;
  box-sizing: border-box;
  font-size: 0.32rem;
}
.modal-header {
    padding: 0 0.4rem;
    height: 1.067rem;
    line-height: 1.067rem;
    font-size: 0.427rem;
	color: #323233;
}
.modal-bottom{
    height: 1.413rem;
    line-height: 1.413rem;
    text-align: center;
    font-size: 0.373rem;
    color: #323233;
}
.modal-bottom .red{
    color: #e60012;
}
.close-mask{
    float: right;
    color: #646466;
}
.close-mask .iconfont{
  font-size: 0.42rem;
}
#mpanel{
    background-color: #4d5a96;
}
.fade-enter-active {
  animation: fade-in 0.5s;
}
.fade-leave-active {
  animation: fade-in 0.5s reverse;
}
@keyframes fade-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>