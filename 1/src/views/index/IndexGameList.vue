<template>
	<div class="indexGame">
		<div class="nav-wrap">
			<mt-navbar class="navList" v-model="selected">
				<mt-tab-item @click.native="tabFirst(index)" v-for="(gameLists, index) in gameTitle" :id="index"
							 :key="index">{{gameLists.title}}
				</mt-tab-item>
			</mt-navbar>
			<router-link :to="{name:'games'}" tag="div" class="gameRouter iconfont icon-sy_gamemore"></router-link>
		</div>

		<mt-tab-container class="gameBox" v-model="selected">

			<!--no side item.id = 3视讯 5体育-->
			<mt-tab-container-item class="noside" v-if="item.id == 3 || item.id == 5" v-for="(item, index) in gameList"
								   :id="index" :key="index">
				<ul v-if="selected == index" class="clearfix">
					<li class="layout" v-for="(items,index) in item.platformNameList" :key="index">
						<div v-for="(gameName, index) in items.productList" :key="index" @click="gamepop(items,null)"
							 class="gameRegion">
							<div class="gamePic">
								<div class="maintain" v-show="items.isWh==1">
									<span>正在<br>维护</span>
								</div>
                                <div class="tryplay" v-if="items.swHref && !isLogin && items.isWh!=1">
                                    <img src="../../assets/img/image-tryW.png">
                                </div>
								<img v-lazy="cdnUrlS+gameName.iconUrl"/>
							</div>
							<span class="text-dots">{{gameName.productName}}</span>
						</div>
					</li>
					<div v-if="item.platformNameList.length == 0" class="no-data">
						<div class="no-data-img iconfont icon-list-zanwusj"></div>
						<p class="no-data-text">暂无数据~</p>
					</div>
				</ul>
			</mt-tab-container-item>


			<!--电子-->
			<mt-tab-container-item class="noside" v-if="item.id == 2" v-for="(item, index) in gameList" :id="index"
								   :key="index">
				<ul v-if="selected == index" class="clearfix">
					<li @click="goDianzi(item.id,index2,item2)" class="layout"
						v-for="(item2,index2) in item.platformNameList" :key="index2">
						<div v-for="(gameName, index3) in item2.productList" :key="index3" class="gameRegion">
							<div class="gamePic">
								<div class="maintain" v-show="item2.isWh == 1">
									<span>正在<br>维护</span>
								</div>
                                <div class="tryplay" v-if="item2.swHref && !isLogin && item2.isWh != 1">
                                    <img src="../../assets/img/image-tryW.png">
                                </div>
								<img v-lazy="cdnUrlS+gameName.iconUrl"/>
							</div>
							<span class="text-dots">{{gameName.productName}}</span>
						</div>
					</li>
					<div v-if="item.platformNameList.length == 0" class="no-data">
						<div class="no-data-img iconfont icon-list-zanwusj"></div>
						<p class="no-data-text">暂无数据~</p>
					</div>
				</ul>
			</mt-tab-container-item>


			<!--side 1=彩票 4=棋牌-->
			<mt-tab-container-item class="haveside" v-if="item.id == 1 || item.id == 4 || item.id == 6"
								   v-for="(item, index) in gameList" :id="index" :key="index">
                <div v-if="selected == index">
                    <div class="sideScroll">
                        <ul class="page-part">
                            <li @click="tabSecond(index2,item.platformNameList)"
                                :class='{"active":tabSecondIndex == index2}'
                                v-for="(sideList, index2) in item.platformNameList" :id="index2" :key="index2"
                                v-if="sideList.productList && sideList.productList.length !=0"
                                >
                                <span v-for="(gameName, index) in sideList.productList" :key="index">{{gameName.productName}}</span>
                            </li>
                        </ul>
                    </div>
                    <!-- tab-container -->
                    <div v-show="tabSecondIndex == index" class="right" v-for="(sideGame, index) in item.platformNameList"
                        :id="index" :key="index">
                        <ul class="clearfix">
                            <li v-if="sideGame.typeId != 4 && sideGame.typeId != 6" class="layout" v-for="(minGame,index) in sideGame.fcGame"
                                :key="index">
                                <div v-for="(gameName, index) in sideGame.productList" :key="index"
                                    @click="gamepop(sideGame,null)" class="gameRegion">
                                    <div class="gamePic">
                                        <div class="maintain" v-show="sideGame.isWh == 1">
                                            <span>正在<br>维护</span>
                                        </div>
                                        <div class="tryplay" v-if="sideGame.swHref && !isLogin && sideGame.isWh != 1">
                                            <img src="../../assets/img/image-tryW.png">
                                        </div>
                                        <img v-lazy="cdnUrlS+minGame.iconUrl"/>
                                    </div>
                                    <span v-if="sideGame.typeId == 1" class="text-dots">{{minGame.fcName}}</span>
                                    <span v-else-if="sideGame.typeId == 4" class="text-dots">{{minGame.productName}}</span>
                                </div>
                            </li>
                            <li v-if="sideGame.typeId == 4 || sideGame.typeId == 6" class="layout" v-for="(minGame,index) in sideGame.eGame"
                                :key="index">
                                <div v-for="(gameName, index) in sideGame.productList" :key="index"
                                    @click="gamepop(sideGame,minGame)" class="gameRegion">
                                    <div class="gamePic">
                                        <div class="maintain" v-show="sideGame.isWh == 1">
                                            <span>正在<br>维护</span>
                                        </div>
                                        <div class="tryplay" v-if="sideGame.swHref && minGame.isSw ==1 && !isLogin && sideGame.isWh != 1">
                                            <img src="../../assets/img/image-tryW.png">
                                        </div>
                                        <img v-lazy="cdnUrlS+minGame.image"/>
                                    </div>
                                    <span v-if="sideGame.typeId == 1" class="text-dots">{{minGame.fcName}}</span>
                                    <span v-else-if="sideGame.typeId == 4" class="text-dots">{{minGame.name}}</span>
                                </div>
                            </li>
                            <div v-if="(!sideGame.fcGame || sideGame.fcGame.length == 0) && (!sideGame.eGame || sideGame.eGame.length == 0)" class="no-data">
                                <div class="no-data-img iconfont icon-list-zanwusj"></div>
                                <p class="no-data-text">暂无数据~</p>
                            </div>
                        </ul>
                    </div>
                </div>
			</mt-tab-container-item>
		</mt-tab-container>

	</div>
</template>

<script>
    import Gamepop from "./Gamepop";
    import func from "@/api/purse";
    import {indexInfo, ratios, gameInto} from "@/api/index";

    export default {
        props: ['gameinfo', 'cdnUrl'],
        components: {
            Gamepop
        },
        data () {
            return {
                gameTitle: [],
                gameList: [],
                selected: 0,
                tabSecondIndex: 0,

                //-----额度转换
                platformId: 0,
                platformName: "",
                productName: "",
                gameType:0,
                balances: 0,
                haveSide: false,
                allmoney: 0,
                isLogin: sessionStorage.getItem("session"),
            }
        },
        created () {
            this.cdnUrlS = this.cdnUrl;
            this.gameList = this.gameinfo;
            console.log(this.gameList);
            this.showTitle();
        },
        methods: {
            showTitle () {
                let title = "";
                this.gameTitle = [];
                console.log(this.gameList, '====list')
                for (let i in this.gameList) {
                    switch (this.gameList[i].id * 1) {
                        case 1:
                            title = "彩票";
                            break;
                        case 2:
                            title = "电子";
                            break;
                        case 3:
                            title = "视讯";
                            break;
                        case 4:
                            title = "棋牌";
                            break;
                        case 5:
                            title = "体育";
                            break;
                        case 6:
                            title = "捕鱼";
                            break;
                    }
                    this.gameTitle.push({
                        id: this.gameList[i].id * 1,
                        title: title
                    });
                }
            },
            tabFirst (index) {
                //一级切换时将彩票和棋牌的二级切换设置为第一项
                this.tabSecondIndex = 0;
            },
            tabSecond (index) {
                this.tabSecondIndex = index;
            },
            gamepop (item,game) {
                console.log("item===>",item)
                this.platformId = item.platformId * 1;
                this.platformName = item.platformName;
                this.productName = item.productName;
                this.gameType = item.typeId * 1;

                let isSw = false;
                if (this.isLogin) {//登錄
                    if (item.isWh == 1) {
                        this.$toast({
                            message: "维护中，请耐心等候",
                            duration: 2000
                        });
                    } else {
                        console.log('-=-=-=',item)
                        //isChange 视讯是否开启额度转换 1开启->弹框额度转换 !1 ->跳游戏
                        if (item.isChange == 1) {
                            //freeWalletSwitch 1=免转钱包 2=多钱包模式
                            if(localStorage.getItem('freeWalletSwitch') ==1){
                                this.intoGame();
                            }else {
                                this.ratio(item.platformId, item.platformName);
                            }
                        } else {
                            this.intoGame();
                        }
                    }

                } else {//未登錄
                    if(game == null){
                        isSw = item.swHref
                    }else if(game.isSw == 1 && item.isWh != 1){
                        isSw = item.swHref
                    }
                    if(isSw && item.isWh != 1){
                        if(item.swHref.indexOf('://') != -1){
                            window.open(
                                item.swHref,
                                "_blank",
                                "toolbar=yes, width=1300, height=900"
                            );
                        }else{
                            window.open(
                                'http://'+item.swHref,
                                "_blank",
                                "toolbar=yes, width=1300, height=900"
                            );
                        }
                        
                    }else{
                        this.$router.push({name: 'login'});
                    }
                }
            },
            getSelectData (cb) {
                func.getWalletInfo().then(res => {
                    console.log(res)
                    let list = res.walletCenterResp;
                    this.allmoney = list.balance;
                    for (var i in list.gameBalance) {
                        if (list.gameBalance[i].id == this.platformId) {
                            this.balances = list.gameBalance[i].balance;
                        }
                    }
                    cb ? cb() : "";
                })
                .catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                });
            },
            ratio (id, name) {
                ratios(id, name).then(res => {
                    console.log('res', res)
                    if (res.remark == "") {
                        this.getSelectData(() => {
                            this.$emit('gameReturnState', true, this.allmoney, this.platformId, this.platformName, this.productName, this.gameType, this.balances);
                        });

                    } else {
                        this.$toast({
                            message: res.remark,
                            duration: 5000
                        });
                        this.intoGame();
                    }
                })
                .catch(err => {
                    this.transErr();
                });
            },
            //快捷转入失败
            transErr () {
                this.$messagebox({
                    title: " ",
                    message: "快捷转入失败,是否继续进入游戏",
                    showCancelButton: true,
                    confirmButtonText: "继续",
                    cancelButtonText: "否"
                }).then(action => {
                    if (action == "confirm") {
                        this.intoGame();
                    } else {
                        this.getSelectData(()=>{
                            this.$emit('gameReturnState', true, this.allmoney, this.platformId, this.platformName, this.productName, this.balances);
                        });
                    }
                });
            },
            intoGame () {
                console.log(this.platformName,this.platformId,this.gameType);
                gameInto(this.platformName, this.platformId,this.gameType).then(res => {
                    window.open(
                        res.loginUrl,
                        "_blank",
                        "toolbar=yes, width=1300, height=900"
                    );
                })
                .catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                });
            },
            //电子下面没有eGame 就弹框额度转换 有就去全部游戏
            goDianzi (id, secondIndex, item) {
                if (item.eGame) {
                    this.$router.push({name: 'games', query: {id, secondIndex}})
                } else {
                    this.gamepop(item);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
	@import url("../../components/less/common.less");
    @import url('./game.less');
    li.layout{
        .gamePic {
            .tryplay{
                line-height: 1.8rem;
            }
        }
    }
</style>