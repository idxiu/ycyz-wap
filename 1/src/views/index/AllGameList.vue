<template>
	<div class="allgames">
		<div class="nav-wrap">
			<mt-navbar class="navList" v-model="tabFirstId">
				<mt-tab-item @click.native="tabFirst(item.id,gameList)" v-for="(item, index) in gameTitle"
							 :id="item.id" :key="index">{{item.title}}
				</mt-tab-item>
			</mt-navbar>
		</div>
		<div v-show="swiperSlides.length>0" class="ad-img">
			<swiper :options="swiperOption" ref="mySwiper">
				<swiper-slide  v-for="(item, index) in swiperSlides" :key="index">
					<img :src="item.advImg"/>
				</swiper-slide>
			</swiper>
		</div>

		<mt-tab-container class="gameBox" v-model="tabFirstId">

			<!--side tabFirstId 1=彩票-->
			<mt-tab-container-item class="haveside" v-if="tabFirstId == 1" v-for="(item, index) in gameList"
								   :id="item.id" :key="index">
				<div class="sideScroll">
					<ul class="page-part">
						<li @click="tabSecond(index2,item.platformNameList)"
							:class='{"active":tabSecondIndex == index2}'
							v-for="(sideList, index2) in item.platformNameList" :id="index2" :key="index2">
							<span v-for="(gameName, index) in sideList.productList" :key="index">{{gameName.productName}}</span>
						</li>
					</ul>
				</div>
				<!-- tab-container -->
				<div v-show="tabSecondIndex == index" class="right" v-for="(sideGame, index) in item.platformNameList"
					 :id="index" :key="index">
					<div class="search-fast">
						<!-- 彩票添加搜索 -->
						<input type="text" v-model="keyWord" @keyup="filterCaipiao(sideGame.fcGame)"
							   placeholder="输入彩票名称"/>
						<div class="serarch" @click="filterCaipiao(sideGame.fcGame)">
							<button>搜索</button>
						</div>
					</div>
					<ul class="clearfix">
						<li v-show="sideGame.typeId == 1" class="layout" v-for="(minGame,index) in searchListCaipiao"
							:key="index">
							<div v-for="(gameName, index) in sideGame.productList" :key="index"
								 @click="gamepop(sideGame,null)" class="gameRegion">
								<div class="gamePic">
									<div class="maintain" v-show="sideGame.isWh ==1">
										<span>正在<br>维护</span>
									</div>
                                    <div class="tryplay" v-if="sideGame.swHref && !isLogin && sideGame.isWh !=1">
										<img src="../../assets/img/image-tryW.png">
									</div>
									<img v-lazy="cdnUrl+minGame.iconUrl"/>
								</div>
								<span v-if="sideGame.typeId == 1" class="text-dots">{{minGame.fcName}}</span>
								<span v-else-if="sideGame.typeId == 4" class="text-dots">{{minGame.productName}}</span>
							</div>
						</li>
						<div v-show="sideGame.typeId == 1 && searchListCaipiao.length <1" class="no-data">
							<div class="no-data-img iconfont icon-huodong-gamenone"></div>
							<p class="no-data-text">你要的游戏正在赶来的路上...</p>
						</div>
					</ul>
				</div>
			</mt-tab-container-item>

			<!-- tabFirstId = 2电子-->
			<mt-tab-container-item class="haveside" v-if="tabFirstId == 2" v-for="(item, index) in gameList"
								   :id="item.id" :key="index">
				<div class="sideScroll">
					<ul class="page-part">
                        <!-- v-show="side.eGame.length>0" -->
						<li v-show="side.eGame.length>0" @click="tabSecond(index,item.platformNameList)"
							:class='{"active":tabSecondIndex == index}' v-for="(side, index) in item.platformNameList"
							:id="index" :key="index">
							<span v-for="(gameName, index) in side.productList"
								  :key="index">{{gameName.productName}}</span>
						</li>
					</ul>
				</div>
				<!-- tab-container -->
				<div v-show="tabSecondIndex == index" class="right" v-for="(sideGame, index) in item.platformNameList"
					 :id="index" :key="index">
					<div class="search-fast">
						<input type="text" v-model="keyWord" @keyup="filter(sideGame.eGame)" placeholder="输入游戏名称"/>
						<div class="serarch" @click="filter(sideGame.eGame)">
							<button>搜索</button>
						</div>
					</div>
					<ul class="clearfix">
						<li class="layout" v-for="(minGame,index) in searchList" :key="index">
							<div v-for="(gameName, index) in sideGame.productList" :key="index"
								 @click="gamepop(sideGame,minGame)" class="gameRegion">
								<div class="gamePic">
									<div class="maintain" v-show="sideGame.isWh ==1">
										<span>正在<br>维护</span>
									</div>
                                    <div class="tryplay" v-if="minGame.isSw ==1 && sideGame.swHref && !isLogin && sideGame.isWh !=1">
										<img src="../../assets/img/image-tryW.png">
									</div>
									<img v-if="sideGame.platformName == 'hb'" v-lazy="minGame.image"/>
									<img v-else-if="sideGame.platformName != 'hb'" v-lazy="cdnUrl+minGame.image"/>
								</div>
								<span class="text-dots">{{minGame.name}}</span>
							</div>
						</li>
						<div v-if="searchList.length <1" class="no-data">
							<div class="no-data-img iconfont icon-huodong-gamenone"></div>
							<p class="no-data-text">你要的游戏正在赶来的路上...</p>
						</div>
					</ul>
				</div>
			</mt-tab-container-item>

			<!--no side tabFirstId = 3视讯 -->
			<mt-tab-container-item class="noside" v-if="tabFirstId == 3" v-for="(item, index) in gameList"
								   :id="item.id" :key="index">
				<ul class="clearfix">
					<li class="layout" v-for="(item,index) in item.platformNameList" :key="index">
						<div v-for="(gameName, index) in item.productList" :key="index" @click="gamepop(item,null)"
							 class="gameRegion">
							<div class="gamePic">
								<div class="maintain" v-show="item.isWh == 1">
									<span>正在<br>维护</span>
								</div>
                                <div class="tryplay" v-if="item.swHref && !isLogin && item.isWh != 1">
                                    <img src="../../assets/img/image-tryW.png">
                                </div>
								<img v-lazy="cdnUrl+gameName.iconUrl"/>
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

			<!--side tabFirstId 4=棋牌-->
			<mt-tab-container-item class="haveside" v-if="tabFirstId == 4" v-for="(item, index) in gameList"
								   :id="item.id" :key="index">
				<div class="sideScroll">
					<ul class="page-part">
						<li @click="tabSecond(index2,item.platformNameList)"
							:class='{"active":tabSecondIndex == index2}'
							v-for="(sideList, index2) in item.platformNameList" :key="index2">
							<span v-for="(gameName, index) in sideList.productList" :key="index">{{gameName.productName}}</span>
						</li>
					</ul>
				</div>
				<!-- tab-container -->
				<div v-show="tabSecondIndex == index" class="right" v-for="(sideGame, index) in item.platformNameList"
					 :id="index" :key="index">
					<ul class="clearfix">
						<li class="layout" v-for="(minGame,index) in sideGame.eGame" :key="index">
							<div v-for="(gameName, index) in sideGame.productList" :key="index"
								 @click="gamepop(sideGame,minGame)" class="gameRegion">
								<div class="gamePic">
									<div class="maintain" v-show="sideGame.isWh==1">
										<span>正在<br>维护</span>
									</div>
                                    <div class="tryplay" v-if="sideGame.swHref && minGame.isSw ==1 && !isLogin && sideGame.isWh!=1">
                                        <img src="../../assets/img/image-tryW.png">
                                    </div>
									<img v-lazy="cdnUrl+minGame.image"/>
								</div>
								<span v-if="sideGame.typeId == 1" class="text-dots">{{minGame.fcName}}</span>
								<span v-else-if="sideGame.typeId == 4" class="text-dots">{{minGame.name}}</span>
							</div>
						</li>
						<div v-if="sideGame.fcGame.length == 0 && sideGame.eGame.length == 0" class="no-data">
							<div class="no-data-img iconfont icon-list-zanwusj"></div>
							<p class="no-data-text">暂无数据~</p>
						</div>
					</ul>
				</div>
			</mt-tab-container-item>

			<!--no side tabFirstId = 5体育-->
			<mt-tab-container-item class="noside" v-if="tabFirstId == 5" v-for="(item, index) in gameList"
								   :id="item.id" :key="index">
				<ul class="clearfix">
					<li class="layout" v-for="(item,index) in item.platformNameList" :key="index">
						<div v-for="(gameName, index) in item.productList" :key="index" @click="gamepop(item,null)"
							 class="gameRegion">
							<div class="gamePic">
								<div class="maintain" v-show="item.isWh==1">
									<span>正在<br>维护</span>
								</div>
                                <div class="tryplay" v-if="item.swHref && !isLogin && item.isWh!=1">
                                    <img src="../../assets/img/image-tryW.png">
                                </div>
								<img v-lazy="cdnUrl+gameName.iconUrl"/>
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

            <!--side tabFirstId 6=捕鱼-->
			<mt-tab-container-item class="haveside" v-if="tabFirstId == 6" v-for="(item, index) in gameList"
								   :id="item.id" :key="index">
				<div class="sideScroll">
					<ul class="page-part">
						<li @click="tabSecond(index2,item.platformNameList)"
							:class='{"active":tabSecondIndex == index2}'
							v-for="(sideList, index2) in item.platformNameList" :key="index2">
							<span v-for="(gameName, index) in sideList.productList" :key="index">{{gameName.productName}}</span>
						</li>
					</ul>
				</div>
				<!-- tab-container -->
				<div v-show="tabSecondIndex == index" class="right" v-for="(sideGame, index) in item.platformNameList"
					 :id="index" :key="index">
					<ul class="clearfix">
						<li class="layout" v-for="(minGame,index) in sideGame.eGame" :key="index">
							<div v-for="(gameName, index) in sideGame.productList" :key="index"
								 @click="gamepop(sideGame,minGame)" class="gameRegion">
								<div class="gamePic">
									<div class="maintain" v-show="sideGame.isWh==1">
										<span>正在<br>维护</span>
									</div>
                                    <div class="tryplay" v-if="sideGame.swHref && minGame.isSw ==1 && !isLogin && sideGame.isWh!=1">
                                        <img src="../../assets/img/image-tryW.png">
                                    </div>
									<img v-lazy="cdnUrl+minGame.image"/>
								</div>
								<span v-if="sideGame.typeId == 1" class="text-dots">{{minGame.fcName}}</span>
								<span v-else-if="sideGame.typeId == 4" class="text-dots">{{minGame.name}}</span>
							</div>
						</li>
						<div v-if="sideGame.fcGame.length == 0 && sideGame.eGame.length == 0" class="no-data">
							<div class="no-data-img iconfont icon-list-zanwusj"></div>
							<p class="no-data-text">暂无数据~</p>
						</div>
					</ul>
				</div>
			</mt-tab-container-item>

		</mt-tab-container>

        <Gamepop 
            :allmoney="allmoney" 
            :state="toast_control" 
            :platformId="platformId" 
            :platformName="platformName"
            :gameName="productName" 
            :gameType="gameType"
            :balances="balances" 
            @returnState="returnState">
        </Gamepop>


	</div>
</template>

<script>
    import {
        indexInfo,
        ratios,
        gameInto,
        getGamesAdv,
        getAdvStatis
    } from "@/api/index";
    import Gamepop from "./Gamepop";
    import func from "@/api/purse";
    import {
        swiper,
        swiperSlide
    } from "vue-awesome-swiper";

    export default {
        props: ["gameInfos"],
        components: {
            swiper,
            swiperSlide,
            Gamepop
        },
        computed: {
            Swiper () {
                return this.$refs.mySwiper.swiper;
            }
        },
        mounted () {
            this.getGame();
        },
        data () {
            return {
                gameTitle: [],
                cdnUrl: "",
                tabFirstId: "",
                tabSecondIndex: 0,
                gameList: [],
                keyWord: "",
                searchList: [],
                searchListCaipiao: [],

                //-----额度转换
                platformId: 0,
                platformName: "",
                productName: "",
                gameType:0,
                balances: 0,
                haveSide: false,
                allmoney: 0,
                isLogin: sessionStorage.getItem("session"),
                toast_control: false,
                swiperSlides: [], //轮播列表
                swiperOption: {
                    spaceBetween: "5%",
                    notNextTick: true,
                    initialSlide: 1,
                    autoplay: 3000,
                    loop: true,
                    autoplayDisableOnInteraction: false,
                    onClick:(s)=>{
                        console.log(s.realIndex)
                        let item = this.swiperSlides[s.realIndex];
                        console.log(item);
                        getAdvStatis(item.title, item.id, 1, item.advUrl).then(res => {
                            if (item.isLink == 1) {//外链
                                if (item.advUrl) {
                                    window.open(item.advUrl);
                                }
                            } else {//内链
                                if (item.advUrl) {
                                    this.$router.push({name: item.advUrl});
                                }
                            }
                        }).catch(err => {
                            this.$toast({
                                message: err,
                                duration: 2000
                            });
                        });
                    }
                }

            };
        },

        methods: {
            getGame () {
                this.cdnUrl = this.gameInfos.cdn + "/";
                this.gameList = this.gameInfos.gameInfo || [];
                console.log(this.gameList);
                this.showTitle();
                //电子-搜索功能 id 1-彩票 2-电子 3-视讯 4-棋牌 5-体育 secondIndex 0-BG电子 1-EG电子 ...
                if (this.$route.query.id) {
                    this.tabFirstId = this.$route.query.id * 1;
                    this.tabFirst(this.tabFirstId, this.gameList);
                    this.tabSecondIndex = this.$route.query.secondIndex * 1;
                    let platformNameList = [];
                    for(let i in this.gameList){
                        if(this.gameList[i].id == this.tabFirstId){
                            platformNameList = this.gameList[i].platformNameList;
                        }
                    }
                    this.tabSecond(
                        this.tabSecondIndex,
                        platformNameList
                    );
                } else {
                    this.tabFirstId = this.gameList[0].id;
                    this.tabSecondIndex = 0;
                    this.tabFirst(this.tabFirstId, this.gameList);
                    this.tabSecond(
                        this.tabSecondIndex,
                        this.gameList[0].platformNameList
                        // this.gameList[this.tabFirstId].platformNameList//这样写彩票第一个没得数据
                    );
                }
            },
            showTitle () {
                let title = "";
                this.gameTitle = [];
                for (let i in this.gameList) {
                    switch (this.gameList[i].id) {
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
                        id: this.gameList[i].id,
                        title: title
                    });
                }
            },
            tabFirst (id, gameList) {
                this.getGamesAdv(id);
                this.tabFirstId = id;
                //一级切换时将彩票和棋牌的二级切换设置为第一项
                this.tabSecondIndex = 0;
                let platformNameList = [];
                if (id == 2) {
                    gameList.map(v => {
                        if (v.id == 2) {
                            platformNameList = v.platformNameList;
                        }
                    });
                    //这里循环是因为电子游戏有很多 eGame为空的时候页面上是隐藏了的，左边菜单就默认显示第一个有数据的电子
                    for (let i = 0; i < platformNameList.length; i++) {
                        if (platformNameList[i].eGame.length > 0) {
                            this.searchList = platformNameList[i].eGame;
                            this.tabSecondIndex = i; //设置左边菜单第一个有数据的电子为选中状态
                            break;
                        }
                    }
                    // this.searchList = gameList[1].platformNameList[0].eGame;
                }
                let platformNameListCaipiao = [];
                if (id == 1) {
                    gameList.map(v => {
                        if (v.id == 1) {
                            platformNameListCaipiao = v.platformNameList;
                        }
                    });
                    this.searchListCaipiao = platformNameListCaipiao[0].fcGame;
                }
                this.keyWord = "";
            },
            tabSecond (index, platformNameList) {
                if (index >= platformNameList.length) {
                    return;
                }
                this.tabSecondIndex = index;
                this.keyWord = "";
                if (this.tabFirstId == 2) {
                    //电子
                    this.searchList = platformNameList[index].eGame;
                }
                if (this.tabFirstId == 1) {
                    //彩票
                    this.searchListCaipiao = platformNameList[index].fcGame;
                }
            },
            //电子搜索
            filter (item) {
                let newArr = [];
                if (this.keyWord) {
                    item.map(v => {
                        if (v.name.toUpperCase().indexOf(this.keyWord.toUpperCase()) > -1) {
                            return newArr.push(v);
                        }
                    });
                    this.searchList = newArr;
                } else {
                    this.searchList = item;
                }
            },
            //彩票搜索
            filterCaipiao (item) {
                let newArr = [];
                if (this.keyWord) {
                    item.map(v => {
                        if (v.fcName.toUpperCase().indexOf(this.keyWord.toUpperCase()) > -1) {
                            return newArr.push(v);
                        }
                    });
                    this.searchListCaipiao = newArr;
                } else {
                    this.searchListCaipiao = item;
                }
            },
            gamepop (item,game) {
                console.log(item,game,"ffffff")
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
            getSelectData () {
                func
                .getWalletInfo()
                .then(res => {
                    let list = res.walletCenterResp;
                    this.allmoney = list.balance;
                    for (var i in list.gameBalance) {
                        if (list.gameBalance[i].id == this.platformId) {
                            this.balances = list.gameBalance[i].balance;
                        }
                    }
                })
                .catch(err => {
                });
            },
            ratio (id, name) {
                ratios(id, name)
                .then(res => {
                    if (res.remark == "") {
                        this.getSelectData();
                        this.toast_control = true;
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
            returnState (state) {
                this.toast_control = state;
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
                        this.getSelectData();
                        this.toast_control = true;
                    }
                });
            },
            intoGame () {
                gameInto(this.platformName, this.platformId,this.gameType)
                .then(res => {
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
            getGamesAdv (typeId) {
                getGamesAdv({
                    typeId: typeId * 1,
                    itype: 1 //1 游戏广告 2 其他公告
                }).then(res => {
                    console.log(res.data,'===')
                    this.swiperSlides = res.data;
                    if (this.swiperSlides.length <= 1) {
                        this.swiperOption.loop = false;
                        this.Swiper.stopAutoplay();
                    } else {
                        this.Swiper.startAutoplay();
                    }
                });
            },

        }
    };
</script>

<style lang="less" scoped>
	@import url("../../components/less/common.less");
	@import url("./game.less");
</style>