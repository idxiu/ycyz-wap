# pk-skin 威尼斯人

### 新版弹框提示 -jdUI库  http://nutui.jd.com/#/Dialog
    
    未写注释的属性去http://nutui.jd.com/#/Dialog看。
    页面参考：http://localhost:8091/wap/#/transfer 一键回收
    样式写在：common.scss

```js
    let self = this;
    this.$dialog({
        id:'dialog_back',//如果希望同时弹出多个Dialog，请给不同的Dialog设置不同的id。
        lockBgScroll:true,
        closeOnClickModal:false,//点击蒙层是否关闭对话框 默认true
        closeBtn:true,  //是否显示右上角关闭按钮 默认 false
        textAlign:'left',//content 对齐方式，默认'center',这里根据新版设计稿需要给'left'
        title: "温馨提示",
        content:"您确定将所有视讯余额转出到系统吗？",
        /*这个是自定义class 默认给pk-dialog--->就会显示底部的两个按钮;
            如果只有一个按钮（不管是取消还是确定）显示就给pk-dialog-single;
            如果是显示“确定”就同时给noCancelBtn设置为true;
            如果是显示“取消”就同时给noOkBtn设置为true;
        */
        customClass:'pk-dialog',
        // noCancelBtn:false,//是否隐藏取消按钮 默认显示=true 
        // noOkBtn:false,//是否隐藏确定按钮     默认显示=true
        onOkBtn() {
            //这里作用域（this）不一样了，需要上面保存一下
            let loading = this.$toast.loading('提交中...');
            func.recoveryById().then((res) => {
                loading.hide();
                if(res.success){
                    self.$toast.success('转出成功',{cover:true});
                    self.getNoAutoTransferInfo();
                }else {
                    self.$toast.fail(res.message,{cover:true,duration:4000});
                }
                this.close(); //关闭对话框 这个this不是vue的实例
            })
        },
    });

```

### 过滤器 所有过滤器都挂载在vue的原型上

|  Author  |  Filter(Function)  | params 1:defaultValue   | params 2:defaultValue | params 3:defaultValue 
|-------------| -------------| ------------------------------ |
|  js114   | `filterDate`|number/new Date()| string:'YYYY-MM-DD HH:mm' | |
|  js114   | `filterAmount`| number | | |
|  js114   | `currency`| number | string:'$'|number:2|
|  js114   | `ModalHelper`|  | | | |

```js
/*
filterDate
1.可以直接采用过滤器方式过滤 eg:{{item.createTiem | filterDate }}
2.第一个参数 可以是10位unix时间戳,也可以是 new Date()类型时间。
3.第二个参数 string类型 默认:'YYYY-MM-DD HH:mm' 可自定义eg:''{{item.createTiem | filterDate('YYYY年-MM月-DD日 HH时-mm分') }}
4.也可当函数使用。直接调用 eg: this.filterDate(item.createTime,'YYYY年-MM月-DD日 HH时-mm分');
5.该方法(过滤器)已在filter.js里面转换过时区。

filterAmount
数字金额大写转换(可以处理整数,小数,负数)

currency 同vue.js1.x的货币过滤器

ModalHelper 解决遮罩层滚动穿透问题，分别在遮罩层弹出后和关闭前调用 具体用法参考  http://localhost:8091/wap/#/ transfer 多钱包-设置快速转入弹框
*/
```

### 时间选择器
```js
<input name="inTime" @click="showDateTimePicker" type="text" v-model="postData.depositTime"
            readonly placeholder="请选择时间">

import {LOCAL_TODAY} from '@/filter' // 引入调用方法
// 在method 中书写
showDateTimePicker() {
    if (!this.dateTimePicker) {
        this.dateTimePicker = this.$createDatePicker({
            title: '请选择存款时间', //头部提示文本
            min: LOCAL_TODAY(-1), //返回 1900-1-1 00:00:00 new Date()原生对象
            max: LOCAL_TODAY(), //返回 当天 new Date()原生对象
            value: new Date(), // 选择器的值
            columnCount: 6, // 列数	Number
            onSelect: this.selectHandle, // 确认时间回调
            onCancel: this.cancelHandle // 取消时间回调
        })
    }
    this.dateTimePicker.show() //展示弹出框
},
selectHandle(date, selectedVal, selectedText) {
    this.postData.depositTime = this.filterTimeStamp(date); // 处理获得的时间
},
cancelHandle() {
    console.log("cancel time")
},
// 更多功能见 https://didi.github.io/cube-ui/#/zh-CN/docs/date-picker
```