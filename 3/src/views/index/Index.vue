<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-01 08:20:27
 * @LastEditTime: 2019-10-11 17:39:53
 * @LastEditors: Please set LastEditors
 -->
<template>
	<div>
		<Header title="IM 即时通讯" :showLeftIcon="false">
			<img
				src="../../assets/img/chat-icon/icon_nav_search.png"
				alt
				class
				slot="right"
				@click="toSearchChat()"
			/>
		</Header>
		<Footer></Footer>
		<ul class="tab">
			<li
				v-for="(item,index) in menu"
				:key="item"
				:class="{'active':index === tabIndex}"
				@click="changeTab(index)"
			>
				<span>{{item}}</span>
			</li>
		</ul>
		<!-- 消息 -->
		<div v-show="tabIndex === 0" class="list">
			<ul v-show="list.length > 0" class="pk-1px-b">
				<li @click="goChat(item,1)" v-for="(item,index) in list" :key="index">
					<Item :item="item" />
				</li>
			</ul>
			<no-data v-show="list.length <= 0" :dataText="dataText" class="no-data-box"></no-data>
		</div>

		<!-- 群组 -->
		<div v-show="tabIndex === 1" class="list">
			<router-link tag="div" :to="{name:'addChat'}" class="pk-add-chat">
				<img src="../../assets/img/chat-icon/icon_chat_add.png" alt />
				<span>添加群聊</span>
				<i class="icons iconfont iconicon_mine_rmore"></i>
			</router-link>
			<div class="title">聊天室</div>
			<ul class="pk-1px-b">
				<li v-for="(item,index) in chatList" :key="index" @click="goChat(item,2)">
					<Item :item="item" />
				</li>
				<div class="more" @click="isShowMoreChat = !isShowMoreChat">{{isShowMoreChat?"收起":"更多聊天室"}}</div>
			</ul>

			<div class="title">群聊</div>
			<ul class="pk-1px-b">
				<li v-for="(item,index) in groupList" :key="index" @click="goChat(item,3)">
					<Item :item="item" />
				</li>
			</ul>
		</div>

		<!-- 热门推荐 -->
		<div v-show="tabIndex === 2" class="list">
			<ul class="pk-1px-b">
				<li v-for="(item,index) in hotList" :key="index" @click="toGame(item,1)">
					<Item :item="item" />
				</li>
			</ul>
			<money-conversion
				:date="new Date().getTime()"
				:productName="productName"
				:isShowTransInOrOut="isShowTransInOrOut"
				:apiTypeId="apiTypeId"
				:apiPlatform="apiPlatform"
				:apiId="apiId"
				@on-closeBox="isShowTransInOrOut=false"
			></money-conversion>
		</div>

		<!-- 最近玩过 -->
		<div v-show="tabIndex === 3" class="list">
			<ul class="pk-1px-b">
				<li v-for="(item,index) in playList" :key="index" @click="toGame(item,2)">
					<Item :item="item" />
				</li>
			</ul>
			<no-data v-show="playList.length <= 0" :dataText="dataText" class="no-data-box"></no-data>
		</div>
	</div>
</template>
<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Item from "@/views/index/component/Item";
import NoData from "@/components/NoData";
import Bus from "@/services/im/bus";
import IM from "@/services/im/connect";
import MoneyConversion from "@/components/MoneyConversion";

import {
	getChatList,
	getPlayRecent,
	getPopularGames,
	getGroupChatList,
	getImNotificationMessageList,
	getChatInfo,
	getNotices
} from "@/services/im/chat";
import { getImgUrl, openGame } from "@/services/index";
import { handleMessage } from "@/services/im/constant";
import MSG_TYPE from "@/services/im/constant";

export default {
	components: {
		Header,
		Footer,
		Item,
		NoData,
		MoneyConversion
	},
	name: "index",
	data() {
		return {
			tabIndex: 0,
			menu: ["消息", "群组", "热门推荐", "最近玩过"],
			list: [],
			hotList: [],
			playList: [],
			//聊天室
			chatList: [],
			oldChatList: [],
			isShowMoreChat: false,
			//群聊
			groupList: [],
			dataText: "暂无数据",
			gameImgUrl: "",
			//-------额度转换-----
			isShowTransInOrOut: false,
			productName: "",
			platformName: "",
			selectGame: {},
			apiTypeId: 0,
			apiPlatform: "",
			apiId: ""
		};
	},
	mounted() {
		this.getList();
		this.getNotice();
		this.getImgUrlFunc();
		IM();
		Bus.$on("IM", data => {
			console.log("index-接受消息", data);
			if (data.msgType === MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION) {
				this.dealWithNoticeMsg(data);
			} else {
				this.dealWithMsg(data);
			}
		});
	},
	watch: {
		isShowMoreChat(newVal) {
			this.chatList = newVal
				? this.oldChatList
				: this.oldChatList.slice(0, 3);
		}
	},
	methods: {
		changeTab(index) {
			if (index == this.tabIndex) {
				return;
			}
			this.tabIndex = index;
			switch (index) {
				case 0:
					this.getList();
					break;
				case 1:
					this.getChatListFunc();
					this.getGroupChatListFunc();
					break;
				case 2:
					this.getPopularGamesFunc();
					break;
				case 3:
					this.getPlayRecentFunc();
					break;
			}
		},
		/**
		 * @description:
		 * @param {obj} item: 当前选择的群聊、聊天室
		 * @param {init} type: 1 消息 2 聊天室 3 群聊
		 * @return:
		 */

		goChat(item, type) {
			if (type === 1) {
				if (item.msgType === MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION) {
					this.$router.push({
						name: "moremsg",
						query: {
							tab: item.tab
						}
					});
				} else {
                    let gameInfo = {
                        gameType:item.gameType,
                        platform:item.platformName,
                        gameId: item.gameId,
                        isWh: item.isWh
                    }
                    sessionStorage.setItem('gameInfo',encodeURIComponent(JSON.stringify(gameInfo)));    
					this.$router.push({
						name: "chat",
						query: {
							id: item.roomId,
							roomType: item.roomType,
							name: item.roomName
						}
					});
				}
			} else if (type === 2) {
                 let gameInfo = {
                    gameType:item.gameType,
                    platform:item.platFormName,
                    gameId: item.gameId,
                    isWh: item.isWh
                }
                sessionStorage.setItem('gameInfo',encodeURIComponent(JSON.stringify(gameInfo)));
				sessionStorage.setItem(
					"chatInfo",
					encodeURIComponent(JSON.stringify(item))
				);
				this.$router.push({
					name: "chat",
					query: {
						id: item.id,
						roomType: 1,
						name: item.name
					}
				});
			} else {
                let gameInfo = {
                    gameType:item.gameType,
                    platform:item.platformName,
                    gameId: item.gameId,
                    isWh: item.isWh
                }
                sessionStorage.setItem('gameInfo',encodeURIComponent(JSON.stringify(gameInfo)));
                 this.$router.push({
                        name: "chat",
                        query: {
                            id: item.id,
                            roomType: 2,
                            name: item.name
                        }
                    });
                // console.log(1243123);
                // if(item.isHasRoom == 1){
                //     this.$router.push({
                //         name: "chat",
                //         query: {
                //             id: item.id,
                //             roomType: 2,
                //             name: item.name
                //         }
                //     });
                // }else{

                // }
				
			}
		},

		// 获取 消息列表
		async getList() {
			let loading = this.$toast.loading();
			let res = await getImNotificationMessageList();
			if (res.success) {
				loading.hide();
				let result = res.data.data;
				result = result.map(item => {
					item.img = item.logo;
					item.top = item.roomName;
					item.right = this.filterDate(item.lastMessageTime);
					item.left = handleMessage(
						item.lastMessage,
						item.messageType
					);
					return item;
				});
				this.list = this.list.concat(result);
			} else {
				loading.hide();
				this.$toast.text(res.message);
			}
		},

		// 获取 公告通知 账变消息 系统消息
		async getNotice() {
			let res = await getNotices();
			if (res.success) {
				let result = res.data.data;

				if (result.postNotice && result.postNotice.length > 0) {
					let lastMsg =
						result.postNotice[result.postNotice.length - 1];
					let lastMsg_json = JSON.parse(lastMsg.message);
					let tzMsg = {
						tab: 2,
						top: "公告通知",
						right: this.filterDate(lastMsg.sendTime),
						left: lastMsg_json.title,
						msgType: lastMsg.messageType
					};
					this.list.unshift(tzMsg);
				}

				if (result.rechargeNotice && result.rechargeNotice.length > 0) {
					let lastMsg =
						result.rechargeNotice[result.rechargeNotice.length - 1];
					let lastMsg_json = JSON.parse(lastMsg.message);
					let zbMsg = {
						tab: 1,
						top: "账变消息",
						right: this.filterDate(lastMsg.sendTime),
						left: lastMsg_json.sourceTypeName,
						msgType: lastMsg.messageType
					};
					this.list.unshift(zbMsg);
				}

				if (result.systemNotices && result.systemNotices.length > 0) {
					let lastMsg =
						result.systemNotices[result.systemNotices.length - 1];
					let lastMsg_json = JSON.parse(lastMsg.message);
					let sysMsg = {
						...lastMsg,
						tab: 3,
						top: "系统消息",
						right: this.filterDate(lastMsg.sendTime),
						left: lastMsg_json.title,
						msgType: lastMsg.messageType
					};
					this.list.unshift(sysMsg);
				}
			} else {
				this.$toast.text(res.message);
			}
		},

		async getPopularGamesFunc() {
			let loading = this.$toast.loading();
			let res = await getPopularGames();
			if (res.success) {
				loading.hide();
				this.hotList = res.data || [];
				this.hotList.map(item => {
					item.img =
						item.iconUrl.indexOf("http") > -1
							? item.iconUrl
							: this.gameImgUrl + "/" + item.iconUrl;
					item.isChat = item.hasChat;
					if (item.gameName) {
						item.top = item.gameName;
						item.left = item.productName;
						item.isCp = true;
					} else {
						item.top = item.productName;
					}
				});
			} else {
				loading.hide();
				this.$toast.fail(res.message, {
					cover: true,
					duration: 1500
				});
			}
		},
		/**
		 * @description: 群聊列表
		 * @param {type}
		 * @return:
		 */
		async getChatListFunc() {
			let loading = this.$toast.loading();
			let res = await getChatList();
			if (res.success) {
				loading.hide();
				this.groupList = res.data;
				this.groupList.map(item => {
					item.img = item.logo;
					item.top = item.name;
				});
			} else {
				loading.hide();
				this.$toast.fail(res.message, {
					cover: true,
					duration: 1500
				});
			}
		},
		/**
		 * @description: 聊天室列表
		 * @param {type}
		 * @return:
		 */
		async getGroupChatListFunc() {
			let data = {
				gameType: 0,
				platformId: 0,
				gameId: ""
			};
			let res = await getGroupChatList(data);
			if (res.success) {
				this.oldChatList = res.data;
				this.oldChatList.map(item => {
					item.img = item.logo;
					item.top = item.name;
					item.left = item.productName;
					item.right = item.lowestLevelName + "级以上进入";
					item.bottom = item.onlineMember + "人在线";
					item.isCp = true;
				});
				this.chatList = this.oldChatList.slice(0, 3);
			} else {
				this.$toast.fail(res.message, {
					cover: true,
					duration: 1500
				});
			}
		},
		async getPlayRecentFunc() {
			let loading = this.$toast.loading();
			let res = await getPlayRecent();
			if (res.success) {
				loading.hide();
				this.playList = res.data;
				this.playList.map(item => {
					item.isChat = item.isHasRoom == 1;
					item.img = item.fcUrl;
					item.top = item.fcName;
				});
			} else {
				loading.hide();
				this.$toast.fail(res.message, {
					cover: true,
					duration: 1500
				});
			}
		},
		/**
		 * @description: 获取游戏图标域名
		 * @return: 游戏图标域名
		 */
		getImgUrlFunc() {
			getImgUrl().then(res => {
				if (res.success) {
					this.gameImgUrl = res.data || [];
				} else {
					this.$toast.fail(res.message, {
						cover: true,
						duration: 1500
					});
				}
			});
		},
		/**
		 * @description: 进入游戏、聊天室
		 * @param {obj} item:  当前选择的游戏
		 * @param {init} type: 1 热门推荐 2 最近玩过
		 * @return:
		 */
		async toGame(item, type) {
            //isChange :1 开启额度转换 2
			this.selectGame = {
				apiTypeId: item.typeId || item.gameType,
				apiPlatform: item.platformName,
				apiId: item.id || item.gameId
            };
              console.log(item,this.selectGame)
			this.apiTypeId = item.typeId || item.gameType;
			this.apiPlatform = item.platformName;
			this.apiId = item.id | item.gameId;
			this.productName = item.productName;

			if (item.hasChat || (type == 2 && item.isHasRoom == 1)) {
				this.$router.push({
					name: "chatList",
					query: {
						gameId: item.gameId,
						platformId: item.platformId,
						gameType: item.gameType || item.typeId
					}
				});
			} else if (item.isChange === 1) {
				this.isShowTransInOrOut = true;
			} else {
				this.intoGame(this.selectGame);
			}
		},
		// 进入游戏
		intoGame() {
            if(this.apiPlatform === "pkplus"){
                let url =
                    window.location.origin + "/pkpl/?fc_id=" + this.apiId;
                window.location.href = url;
                return;
            }else{
                let data = {
                    gameType: this.apiTypeId,
                    platform: this.apiPlatform,
                    gameId: this.apiId + ""
                };
                openGame(data).then(res => {
                    if (res.success) {
                        if (res.data) {
                            window.open(res.data, "_blank");
                        }
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });
            }
		},

		// 去搜索聊天室
		toSearchChat() {
			this.$router.push({
				name: "searchChat"
			});
		},

		// 消息类型
		dealWithMsg(data) {
			let msg = JSON.parse(data.msg);
			let roomIdArr = this.list.map(item => item.roomId);

			if (data.receiveType === MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
				if (roomIdArr.includes(data.mid)) {
					//私聊 存在该管理员
					this.setNewItem(data, msg, data.mid);
				} else {
					this.addNewManagerItem(data, data.mid);
				}
			} else {
				if (roomIdArr.includes(data.roomId)) {
					//群聊 存在该群
					this.setNewItem(data, msg, data.roomId);
				} else {
					this.addNewQunItem(data, data.roomId);
				}
			}
		},

		// 修改页面上管理员和群，聊天室的信息-最新一条数据
		setNewItem(data, msg, id) {
			this.list.map(item => {
				if (item.roomId === id) {
					item.right = this.filterDate(data.sendTime);
					item.hasMsg = true;
					item.left = handleMessage(data.msg, data.msgType);
					return item;
				}
			});
		},
		// 添加新的-管理员
		addNewManagerItem(data, id) {
			let newMsg = {
				roomType: data.roomType,
				roomName: data.senderName,
				roomId: id,
				managerId: id,
				img: data.senderHead,
				top: data.senderName,
				right: this.filterDate(data.sendTime),
				hasMsg: true,
				left: handleMessage(data.msg, data.msgType)
			};
			this.list.unshift(newMsg);
		},

		// 添加新的-群/聊天室-需要去查询群/聊天室的信息
		async addNewQunItem(data, id) {
			let qunInfo = await this.getInfo(id);
			if (qunInfo && qunInfo.id) {
				let newMsg = {
					roomType: qunInfo.groupType,
					roomName: qunInfo.name,
					roomId: id,
					managerId: id,
					img: qunInfo.logo,
					top: qunInfo.name,
					right: this.filterDate(data.sendTime),
					hasMsg: true,
					left: handleMessage(data.msg, data.msgType)
				};
				this.list.unshift(newMsg);
			}
		},

		//通知类型
		dealWithNoticeMsg(data) {
			let msg = JSON.parse(data.msg);
			switch (msg.noticeType) {
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_SYSTEM: // 系统通知 tab: 3
					let sysMsg = {
						hasMsg: true,
						tab: 3,
						top: "系统消息",
						right: this.filterDate(msg.publishTime),
						left: msg.title,
						...data
					};
					let isHavedSysMsg = false;
					this.list.map(item => {
						if (item.tab && item.tab === 3) {
							isHavedSysMsg = true;
							item = sysMsg;
						}
					});
					if (!isHavedSysMsg) {
						this.list.unshift(sysMsg);
					}

					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_CHANGE_BALANCE: // 账变消息 tab: 1
					let zbMsg = {
						hasMsg: true,
						tab: 1,
						top: "账变消息",
						right: this.filterDate(msg.publishTime),
						left: msg.title,
						...data
					};
					let isHavedZbMsg = false;
					this.list.map(item => {
						if (item.tab && item.tab === 1) {
							isHavedZbMsg = true;
							item = zbMsg;
						}
					});
					if (!isHavedZbMsg) {
						this.list.unshift(zbMsg);
					}

					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_POST: //公告通知 tab: 2
					let tzMsg = {
						hasMsg: true,
						tab: 2,
						top: "公告通知",
						right: this.filterDate(msg.publishTime),
						left: msg.title,
						...data
					};
					let isHavedTzMsg = false;
					this.list.map(item => {
						if (item.tab && item.tab === 2) {
							isHavedTzMsg = true;
							item = tzMsg;
						}
					});
					if (!isHavedTzMsg) {
						this.list.unshift(tzMsg);
					}
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_WJDC: // 问卷调查 -属于公告通知
					let wjdcMsg = {
						hasMsg: true,
						tab: 2,
						top: "公告通知",
						right: this.filterDate(msg.publishTime),
						left: msg.title,
						...data
					};
					let isHavedWjdcMsg = false;
					this.list.map(item => {
						if (item.tab && item.tab === 2) {
							isHavedWjdcMsg = true;
							item = wjdcMsg;
						}
					});
					if (!isHavedWjdcMsg) {
						this.list.unshift(wjdcMsg);
					}
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_JOIN_GROUP: // 申请加入群聊通过 -属于系统消息
					let joinMsg = {
						hasMsg: true,
						tab: 3,
						top: "系统消息",
						right: this.filterDate(msg.publishTime),
						left: msg.title,
						...data
					};
					let isHavedJoinMsg = false;
					this.list.map(item => {
						if (item.tab && item.tab === 3) {
							isHavedJoinMsg = true;
							item = joinMsg;
						}
					});
					if (!isHavedJoinMsg) {
						this.list.unshift(joinMsg);
					}

					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_JOIN_CROUP_DISBAND: // 解散 //刷新列表
					this.getList();
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_CROUP_UPDATE_INFO: // 群信息修改 //刷新列表
					this.getList();
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_JOIN_GROUP_DEL: // 删除聊天室 //刷新列表
					this.getList();
					break;
			}
		},

		// 收到消息时，不存在该群时，去后端查，查到就插入，反之，不插入
		async getInfo(roomId) {
			let res = await getChatInfo({ roomId });
			if (res.success) {
				this.info = res.data;
				return res.data;
			}
		}
	}
};
</script>
<style scoped lang="scss">
.tab {
	position: fixed;
	top: px2rem(88);
	width: 100%;
	z-index: 2;
	height: px2rem(80);
	background: $default-color;
	display: flex;
	align-items: center;
	li {
		margin-left: px2rem(40);
		span {
			font-size: px2rem(28);
			color: $tip-color;
		}
		&.active {
			span {
				font-size: px2rem(32);
				font-weight: bold;
				position: relative;
				&::before {
					content: "";
					display: block;
					width: px2rem(32);
					height: px2rem(8);
					border-radius: px2rem(4);
					background: $primary-color;
					position: absolute;
					bottom: px2rem(-8);
					left: 50%;
					transform: translateX(-50%);
				}
			}
		}
	}
}

.list {
	padding-top: px2rem(80);
	padding-bottom: px2rem(140);
	background: $default-bg-color;
	.title {
		line-height: px2rem(80);
		padding-left: px2rem(32);
		font-size: px2rem(24);
		color: $label-color;
	}
	.more {
		line-height: px2rem(88);
		text-align: center;
		color: $color-w;
		background: $default-color;
	}
	.pk-add-chat {
		background: $default-color;
		position: relative;
		padding: px2rem(22) px2rem(32);
		box-sizing: border-box;
		img {
			vertical-align: middle;
			width: px2rem(44);
			height: px2rem(44);
		}
		span {
			margin-left: px2rem(25);
			vertical-align: middle;
			font-size: px2rem(28);
			color: $tip-color;
		}
		i {
			position: absolute;
			right: px2rem(32);
			top: 50%;
			transform: translate(0, -50%);
			vertical-align: middle;
			font-size: px2rem(24);
			color: $label-color;
		}
	}
}
@import "../games/games.scss";
</style>