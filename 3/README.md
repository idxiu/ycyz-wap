<!--
 * @Description: 
 * @Author: xwl
 * @Date: 2019-05-29 13:07:35
 * @LastEditors: xwl
 * @LastEditTime: 2019-05-30 10:27:17
 -->
### 打包注意事项
```
1,webpack打包js并为一个js文件所需依赖
    "webpack": "^3.6.0", 
    "vue-loader": "^12.1.0", 
2,安装node-sass包容易出错，记得报错用 `npm rebuild node-sass`
3,webpack打包js并为一个js文件
    >需要cd 到 build 目录, 运行 `npm install --unsafe-perm` 
    >遇到安装卡顿，再次运行以上命令即可
    >然后就可以回到父级目录 运行命令`sh alljs.sh`
4,安装 node_modules 先把本地 node_modules 和 package-lock.json 文件删除
5,配置文件位置在src/configs.js目录下配置
6,打包js多文件执行 `sh morejs.sh`
```
 
## Project setup
```
yarn/npm install
```

### Compiles and hot-reloads for development
```
yarn/npm run serve
```

### Compiles and minifies for production
```
yarn/npm run build
```
### 简单规范
```
    组件相关
        所有公共组件定义在components里面，
        页面组件定义在自己的页面下。命名方式以大写字母开头eg:Login.vue, Register.vue
        组件引用使用@ eg:import Header from '@/components/Header';
        js导入也使用@ eg:import { getGameList } from '@/services/index';

    1.css 相关
        a.calss命名 以pk-开头，id命名 以pk_开头。并且需要语义化。同时写好分割线及注释。
        b.所有公共的scss变量定义在skin.scss里面 公共样式在common.scss里面，并写好注释。
        c.新加的需要写在该文档中
        d.ui框架的样式覆盖不了的采用/deep/方式，不要使用jquery操作dom改变样式
        e.每个.vue 文件包含的样式直接写在该文件中，不必提出来单独写。特殊情况参考v2
        f.scss 样式最好层级嵌套不要超过4层，不然多了浏览器解析会比较慢。
        g.像素 转换采用 rem(36); 以便于后期修改调整 1px 问题下面有如何使用的。
        h.颜色值需要去skin.scss里面定义，取名语义化。定义之前先搜索一下是否已经有该颜色了。
        i.页面布局能用flex布局尽量使用。
        j.后面遇到的继续补充
    
    2.js 相关
        a.函数命名 小驼峰 个人建议：
            页面上有点击，滑动，触发的事件以handle开头 eg:handleInput
            获取数据的 使用 get开头 eg:getList()
            提交的 使用submit开头 eg:submitLogin,submitRegister
            验证的 使用validate开头 eg:validatePassword
            其他的自行考虑，主要是见名知意，注释很重要。
        b.每个函数命名上方注释该函数是干嘛用的，以及参数解析，return解析。关键代码也需注明为什么这样做。
        c.尽量使用es6+语法。不要使用var 使用箭头函数需要注意jd-ui框架里面的函数提供的this的作用域问题。
        d.v-for 循环需要指定key值
        e.过滤器写在 filter.js 使用方法雷同。
        f.有异步请求的最好 像下面这样写。
            async getList(){
                let res =  await getGameList();
                console.log(res);
            }
        g.路由跳转统一使用name方式 eg:this.$router.push({ name: 'login' });
            路由传参使用query eg:this.$router.push({ name: 'login',query:{ id: 1 } });
            页面获取参数 this.$route.query.id;
            push 是新开页面会留下历史记录 replace不会留下历史记录
            https://router.vuejs.org/zh/guide/essentials/navigation.html
            返回上一页使用 this.$router.go(-1); 上上页 使用this.$router.go(-2);以此类推。
        h.data里面定义的变量必须写注释是干什么用的
        i.全局常量 main.js
            Vue.prototype.HTML_FONT_SIZE = parseInt(document.documentElement.style.fontSize); //html字体大小
            Vue.prototype.PAGE = 1; //page
            Vue.prototype.PAGE_SIZE = 10; //pageSize
            import { getContactus } from '@/services/center';
            getContactus().then(res => {
                if (res.success) {
                    let list = res.data;
                    if (list.length >= 5) {
                        list.map(item => {
                            if (item.itype == 6) {
                                Vue.prototype.CONTACTUS_URL = item.content; //在线客服跳转地址
                            }
                        });
                    }
                }
            });

            //全局公共方法
            /**
            * @description: 内外链接跳转
            * @param {isIn} boolean ture内链 false 外链
            * @param {linkUrl} string 跳转地址
            */
            Vue.prototype.jumpLink = (isIn,linkUrl) => {
                if (isIn) { 
                    linkUrl && router.push({ name: 'linkUrl' });
                } else {
                    linkUrl && window.open(linkUrl);
                }
            }
            
            j.导入组件或公共方法 路径以 @开头  @ ==> /src
            eg:
                import func from "@/services/deposit";
                import Header from "@/components/Header";
        
        3, 引入图片不能用此格式`<img src="@/assets/img/chat-icon/icon_chat_add.png" alt />`
            打包暂时不支持~
        ***不到万不得已不要使用jquery***

```
### 目录下的文件夹分别干什么滴
```
    assets
        fonts 存放字体文件
        img 存放图片
        js 第三方js
    components -所有公用组件 -多编辑
    services -所有公共异步请求统一管理 
        api.js 定义接口请求地址 
        axios.js 请求拦截处理 
        其他 各自模块请求封装
    styles
        common.scss 公用样式
        skin.scss 主题样式定义，或其他scss函数定义
    views - 页面存放 -多编辑
    App.vue - 模板入口文件
    filter.js - 过滤器文件
    main.js - 入口js文件
    router.js - 路由配置文件 -多编辑
    vue.config.js - vue配置文件


```
### px 转 rem
```
    1.vscode 安装插件 Px to rem with scss

    2.在common.scss 中定义函数
        @function px2rem($px) {
            @return $px / 75+rem;
        }
    3.使用：
    
    font-size:px2rem(24); 24px会自动转换为rem
```

### Header 组件使用

```
    1.导入 import Header from '@/components/Header';
    2.注册 
    export default {
        components: {
            Header,
        },
        name: "index", //页面需要指定name与router.js里面的name相对应，组件可以不指定。
    }
    3.页面使用  需传入title 可以为变量
    <Header title="首页"></Header>
    <Header :title="title"></Header>
    有以下属性需要注意：
        1.showLeft 默认值 true 是否显示title左边 包括返回icon和标题（v3标题在左侧）
        2.showCenter 默认值 false 是否显示中间 （v3中间没内容）
        3.showRight 默认值 false 是否显示右边（若为true则默认显示 设置icon ）
        4.showLeftIcon 默认值 true 是否显示左边返回icon （v3，发现，我的，需要设置为false）游戏大厅的title建议不使用该组件
        5.showRightIcon 默认值 false 是否显示右边设置icon
        6.左侧事件 默认点击返回上一页（showLeftIcon=true才能返回上一页）
        7.右侧事件 - @on-right="自定义事件"
        8.headerClass 是整个title最外层class,默认'white' 可取值 'white'， 'black'，'transparent' （v3目前的title就这3种标题背景和字体颜色,后面若新增则再添加）若要自行修改title样式 则自定义headerClass即可。
        9.支持自定义左 中 右 部分
        eg: 
        如果要自定义左边内容 需要设置 showLeft=false
        如果要自定义中间内容 需要设置 showCenter=true
        如果要自定义右边内容 需要设置 showRight=false
        <Header title="优惠活动" :showLeft="false" :showCenter="true"  :showRight="false">
			<span slot="left" class="left-text">左边内容</span>
			<span slot="center" class="center-text">中间内容</span>
			<span slot="right" class="center-text">右边内容</span>
		</Header>
```

### Footer 组件使用

```
    1.导入 import Footer from '@/components/Footer';
    2.注册 
    export default {
        components: {
            Footer,
        },
        name: "index",
    }
    3.页面使用 
    <Footer"></Footer>
```
### 异步代码同步化
```
    async getList(){
        let res =  await getGameList();
        console.log(res);
    }
```

### css 公共部分
```
    1. 边框1px 
        pk-1px-t,  上
        pk-1px-b,  下
        pk-1px-tb, 上下
        pk-1px-l,  左
        pk-1px-r   右
    2. 清除浮动      clearfix
    3. 超出显示...   text-dots 需要指定宽度
    4. 必填项        must
    5.后面遇到的继续补充

```


