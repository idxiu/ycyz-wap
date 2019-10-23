<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-08 17:35:03
 * @LastEditTime: 2019-10-12 12:49:41
 * @LastEditors: Please set LastEditors
 -->

<template>
	<!-- 聊天界面 -->
	<div>
		<Header class="chat-header" :title="title" :showCenter="true" :dofunc="true" :callback="outRoom">
			<span
				v-show="$route.query.roomType != MSG_TYPE.TYPE_MEMBER"
				slot="center"
				class="number"
			>({{roomNum}}人)</span>
			<i
				v-show="$route.query.roomType != MSG_TYPE.TYPE_MEMBER"
				slot="right"
				class="iconfont iconicon_nav_more"
				@click="toChatInfo()"
			></i>
		</Header>
		<div id="msg_list" class="msg-list" :style="{'bottom':height}">
			<ul v-show="list.length > 0">
				<li v-for="(item,index) in list" :key="index">
					<MsgItem :item="item" @handle-click="handleClick" />
				</li>
			</ul>
		</div>
		<SendMsg
			@send="sendTextMsg"
			@choose-file="chooseFile"
			:sendType="sendType"
			:isForbid="isForbid"
			@set-height="setHeight"
		/>
		<Red
			v-if="isShowRedMOdal"
			:redInfo="redInfo"
			@get-red-bag="drawRedbag"
			@close-red-modal="isShowRedMOdal = false"
		/>

		<Planned
			v-if="planmessage.length > 0"
			:planmessage="planmessage"
			@insert-plan="insertPlan"
			@show-plan-modal="showPlanModal"
		/>

		<follow-plan
			v-if="isShowPlanModal"
			:type="planModalType"
			:planInfo="planModalInfo"
			@close-plan-modal="isShowPlanModal = false"
			@submit-plan="submitPlan"
		/>
		<div
			class="pk-toGame"
			v-if="roomType != MSG_TYPE.TYPE_MEMBER && gameInfo.isWh != 1 && gameInfo.platform"
			@click="toGame"
		>
			<img src="../../assets/img/chat-icon/play.png" alt />
		</div>
	</div>
</template>
<script>
import Header from "@/components/Header";
import MsgItem from "@/views/index/component/MsgItem";
import SendMsg from "@/views/index/component/SendMsg";
import Red from "@/views/index/component/Red";
import Planned from "@/views/index/component/Planned";
import FollowPlan from "@/views/index/component/FollowPlan";

import {
	getImMemberHisMsgList,
	postSendMessage,
	getRedbagDetails,
	getRedbag,
	userIn,
	userOut,
	uploadFile,
	getPlanned,
	getPlanneds,
	postPlanned
} from "@/services/im/chat";
import { openGame } from "@/services/index";
import MSG_TYPE from "@/services/im/constant";
import Bus from "@/services/im/bus";
import IM from "@/services/im/connect";

export default {
	components: {
		Header,
		MsgItem,
		SendMsg,
		Red,
		Planned,
		FollowPlan
	},
	name: "chat",
	data() {
		return {
			MSG_TYPE,
			id: this.$route.query.id * 1, // 群和聊天室代表 roomId 管理员代表 managerId
			title: "",
			roomNum: 0, //人数 私聊不显示
			list: [],
			isShowRedMOdal: false, //显示领取红包弹框
			redInfo: {}, //红包详情
			sendType: "", //可以发送消息的类型
			isForbid: false, // 是否禁止聊天
			memberSendLimit: 0, // 会员是否被禁言 1=被禁言 其他=未被禁言
			isShowPlan: true, //是否显示投注计划-轮播
			isShowPlanModal: false, //是否显示 跟投和跟单的弹框
			planModalType: 1, //1=跟投 2=跟单
			planModalInfo: {}, //跟投，跟单 弹框需要传递的信息
			planmessage: [],
			height: "1.44rem", //id="msg_list" 距离底部高度，这个是根据【选择表情，选择文件】，动态改变的
			roomType: this.$route.query.roomType, //当前窗口类型
			gameInfo: {}
		};
	},
	mounted() {
		this.gameInfo = sessionStorage.getItem("gameInfo")
			? JSON.parse(decodeURIComponent(sessionStorage.getItem("gameInfo")))
			: {};
		console.log(this.gameInfo);
		this.getList();
		this.getChatPlan();
		if (this.$route.query.roomType == MSG_TYPE.TYPE_CHAT) {
			this.inRoom();
		}
		let self = this;
		IM();
		Bus.$on("IM", data => {
			console.log("chat-接受消息", data);
			//通知类型
			if (data.msgType === MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION) {
				this.dealWithNoticeMsg(data);
			} else {
				this.dealWithMsg(data);
			}
		});
	},
	watch: {
		list(newVal, oldVal) {
			if (newVal) {
				this.scrollWay();
			}
		}
	},
	methods: {
		toGame() {
			if (this.gameInfo.platform === "pkplus") {
				let url =
					window.location.origin +
					"/pkpl/?fc_id=" +
					this.gameInfo.gameId;
				window.location.href = url;
				return;
			} else {
				let data = {
					gameType: this.gameInfo.gameType,
					platform: this.gameInfo.platform,
					gameId: this.gameInfo.gameId + ""
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
		// 进入聊天室
		inRoom() {
			let data = {
				roomId: this.id
			};
			userIn(data).then(res => {
				if (res.success) {
				} else {
					this.$toast.text(res.message);
				}
			});
		},

		// 退出聊天室
		outRoom() {
			if (this.$route.query.roomType == MSG_TYPE.TYPE_CHAT) {
				let data = {
					roomId: this.id
				};
				userOut(data).then(res => {
					if (res.success) {
					} else {
						this.$toast.text(res.message);
					}
				});
			}
		},

		// 去 群聊详情
		toChatInfo() {
			if (this.$route.query.roomType == MSG_TYPE.TYPE_MEMBER) {
				this.$router.push({
					name: "focusInfo",
					query: { focusMemberId: this.id, focusType: 2 }
				});
			} else {
				this.$router.push({
					name: "chatInfo",
					query: { id: this.id, type: this.$route.query.roomType }
				});
			}
		},

		changeTab(index) {
			this.tabIndex = index;
		},

		// 聊天消息自动滑倒最底部
		scrollWay() {
			this.$nextTick(() => {
				let contaner = document.querySelector("#msg_list");
				contaner.scrollTop = contaner.scrollHeight;
			});
		},

		//获取消息列表
		async getList() {
			let postData = {
				page: 1,
				pageSize: 20
			};
			//如果是密聊 roomType = 4 给后台传managerId字段
			if (this.$route.query.roomType == MSG_TYPE.TYPE_MEMBER) {
				postData.managerId = this.id;
			} else {
				postData.roomId = this.id;
			}

			let loading = this.$toast.loading();
			let res = await getImMemberHisMsgList(postData);
			if (res.success) {
				loading.hide();
				let datas = res.data.data;
				this.title = datas.name || this.$route.query.name;
				this.roomNum = datas.roomNum;

				//默认1，2即文本和表情
				this.sendType = datas.sendType;

				//这里保存是为了在接到全体禁言的通知时，要改变禁言状态需要判断会员是否被禁言了，
				//若禁言了则不能操作,反之可以操作
				this.memberSendLimit = datas.memberSendLimit;

				this.dealWithFirstShutUp(datas);

				let result = datas.data || [];
				// concat 是为了把（投注计划 TODO ①）给放到列表最后面,因为投注计划那边会比请求列表先执行，所有这么做。
				this.list = result.reverse().concat(this.list);
				this.scrollWay();
			} else {
				loading.hide();
				this.$toast.text(res.message);
			}
		},
		//获取投注计划
		async getChatPlan() {
			if (this.$route.query.roomType == MSG_TYPE.TYPE_CHAT) {
				let planRes = await getPlanned({ roomId: this.id });
				if (planRes.success) {
					if (planRes.data) {
						this.planmessage.push(planRes.data);
					}
				} else {
					this.$toast.text(planRes.message);
				}
			}
			if (
				this.$route.query.roomType == MSG_TYPE.TYPE_PUBLIC ||
				this.$route.query.roomType == MSG_TYPE.TYPE_PRIVATE
			) {
				let res = await getPlanneds({ roomId: this.id });
				if (res.success) {
					if (res.data) {
						this.planmessage = res.data;
					}
				} else {
					this.$toast.text(res.message);
				}
			}
		},
		// 设置 id="msg_list" 距离底部高度
		setHeight(bottom) {
			this.height = bottom + "rem";
			this.scrollWay();
		},

		// 发送文本和表情信息
		async sendTextMsg(content) {
			/*{
				RoomId      int    `json:"roomId"`                                                 // 房间id
				Mid         int    `json:"mid"`                                                    // 接收人id
				ReceiveType int    `json:"receiveType" valid:"Must;Min(1);Max(2);ErrorCode(5263)"` // 接收类型 1私聊 2房间
				Keys        string `json:"keys"`                                                   // 接收人key
				IsAdmin     int    `json:"isAdmin" valid:"Must;Min(1);Max(2);ErrorCode(5262)"`     // 发送人是否是管理员（1不是；2是）
				MsgType     int    `json:"msgType" valid:"Must;Min(1);Max(4);ErrorCode(5264)"`     // 消息类型（1.文本；2.图片；3.视频；4.语音;）
				Msg         string `json:"msg" valid:"Html;ErrorCode(5265)"`                       // 消息内容(json)
				SendTime    int    `json:"sendTime"`                                               // 消息标示
			}
			*/
			let postData = {
				isAdmin: MSG_TYPE.NO_ADMIN,
				msgType: MSG_TYPE.IM_MSG_TYPE_TEXT,
				msg: JSON.stringify({ message: content })
			};
			//如果是密聊 roomType = 4 给后台传mid字段
			if (this.$route.query.roomType == MSG_TYPE.TYPE_MEMBER) {
				postData.mid = this.id;
				postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PRIVATE;
			} else {
				postData.roomId = this.id;
				postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PUBLIC;
			}
			let insertData = {
				...postData,
				isMine: MSG_TYPE.IS_MINE,
				mid: localStorage.getItem("userId") * 1,
				senderHead: JSON.parse(localStorage.getItem("user")).photo,
				status: MSG_TYPE.SEND_MSG_STATUS_LOADING //status 为loading
			};
			this.list.push(insertData);
			let res = await postSendMessage(postData);
			if (res.success) {
				//修改状态 为成功
				this.list.map(item => {
					//这里判断是因为
					//1.可以连续发送消息 需要把新发送的消息状态都给改变
					//2.消息列表返回的数据是没有status字段的，只有自己发送的消息上面添加了
					if (
						item.status &&
						item.status === MSG_TYPE.SEND_MSG_STATUS_LOADING
					) {
						item.status = MSG_TYPE.SEND_MSG_STATUS_SUCCESS;
						item.msgId = res.data.msg_id;
					}
					return item;
				});
			} else {
				//修改状态 为失败
				this.list.map(item => {
					if (
						item.status &&
						item.status === MSG_TYPE.SEND_MSG_STATUS_LOADING
					) {
						item.status = MSG_TYPE.SEND_MSG_STATUS_FAIL;
					}
					return item;
				});
				this.$toast.text(res.message);
			}
			this.scrollWay();
		},

		//选择文件（图片，视频）
		chooseFile(file, localPath) {
			//图片
			if (MSG_TYPE.REG_IMAGE.test(file.type)) {
				this.sendBeforeInsertImage(file, localPath);
			}
			//视频
			if (MSG_TYPE.REG_VIDEO.test(file.type)) {
				this.sendBeforeInsertVideo(file, localPath);
			}
		},

		//本地显示图片-还未上传
		sendBeforeInsertImage(file, localPath) {
			let msg = {
				littlePicSizeWidth: 150,
				littlePicSizeHeight: 200,
				littlePicUrl: localPath,
				picSizeWidth: 150,
				picSizeHeight: 200,
				picUrl: localPath
			};
			let postData = {
				isAdmin: MSG_TYPE.NO_ADMIN,
				msgType: MSG_TYPE.IM_MSG_TYPE_PICTURE,
				msg: JSON.stringify(msg)
			};
			//如果是密聊 roomType = 4 给后台传mid字段
			if (this.$route.query.roomType == MSG_TYPE.TYPE_MEMBER) {
				postData.mid = this.id;
				postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PRIVATE;
			} else {
				postData.roomId = this.id;
				postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PUBLIC;
			}
			let insertData = {
				...postData,
				isMine: MSG_TYPE.IS_MINE,
				mid: localStorage.getItem("userId") * 1,
				senderHead: JSON.parse(localStorage.getItem("user")).photo,
				status: MSG_TYPE.SEND_MSG_STATUS_LOADING, //status 为loading
				isLocal: true
			};
			this.list.push(insertData);
			this.uploadFiles(postData, file);
		},

		//本地显示视频缩略图-还未上传
		sendBeforeInsertVideo(file, localPath) {
			this.$("body").find("#videoarea2") &&
				this.$("body")
					.find("#videoarea2")
					.remove();
			let str = `<div id="videoarea2" style="display:none;">
                            <video src="${localPath}" controls="controls"></video>
                        </div>`;
			this.$("body").append(str);
			//视频截图
			var scale = 0.25;
			var video = this.$("#videoarea2").find("video")[0];
			let self = this;
			video.addEventListener("loadedmetadata", function loadedmetadata() {
				setTimeout(() => {
					const canvas = document.createElement("canvas");
					canvas.width = this.videoWidth * scale;
					canvas.height = this.videoHeight * scale;
					const ctx = canvas.getContext("2d");
					ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
					let src = canvas.toDataURL("image/png");
					let msg = {
						littlePicSizeWidth: 150,
						littlePicSizeHeight: 200,
						littlePicUrl: src,
						url: src,
						size: 0
					};
					let postData = {
						isAdmin: MSG_TYPE.NO_ADMIN,
						msgType: MSG_TYPE.IM_MSG_TYPE_VIDEO,
						msg: JSON.stringify(msg)
					};
					//如果是密聊 roomType = 4 给后台传mid字段
					if (self.$route.query.roomType == MSG_TYPE.TYPE_MEMBER) {
						postData.mid = self.id;
						postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PRIVATE;
					} else {
						postData.roomId = self.id;
						postData.receiveType = MSG_TYPE.RECEIVE_TYPE_PUBLIC;
					}
					let insertData = {
						...postData,
						isMine: MSG_TYPE.IS_MINE,
						mid: localStorage.getItem("userId") * 1,
						senderHead: JSON.parse(localStorage.getItem("user"))
							.photo,
						status: MSG_TYPE.SEND_MSG_STATUS_LOADING, //status 为loading
						isLocal: true
					};
					console.log("insertData", insertData);
					self.list.push(insertData);
					self.uploadFiles(postData, file);
				}, 300);
			});
		},

		//上传-图片、视频到服务器
		async uploadFiles(postData, file) {
			let form = new FormData();
			form.append("file", file);
			form.append("isOneToOne", false); //false=群聊 true=私聊
			form.append("from", "a");
			form.append("to", "b");
			let res = await uploadFile(form);
			console.log(res);
			if (res.success) {
				let data = res.data;
				console.log(data);
				let msg = {};
				//图片
				if (MSG_TYPE.REG_IMAGE.test(file.type)) {
					msg = {
						littlePicSizeWidth: data.width,
						littlePicSizeHeight: data.height,
						littlePicUrl: data.thumbUrl,
						picSizeWidth: data.thumbWidth,
						picSizeHeight: data.thumbHeight,
						picUrl: data.url
					};
				}
				//视频
				if (MSG_TYPE.REG_VIDEO.test(file.type)) {
					msg = {
						littlePicSizeWidth: data.width,
						littlePicSizeHeight: data.height,
						littlePicUrl: data.thumbUrl,
						picSizeWidth: data.thumbWidth,
						picSizeHeight: data.thumbHeight,
						url: data.url,
						duration: data.duration,
						size: (data.size / 1024 / 1024).toFixed(2)
					};
				}
				postData.msg = JSON.stringify(msg);
				let result = await postSendMessage(postData);
				if (result.success) {
					//修改状态 为成功
					this.list.map(item => {
						if (
							item.status &&
							item.status === MSG_TYPE.SEND_MSG_STATUS_LOADING
						) {
							item.status = MSG_TYPE.SEND_MSG_STATUS_SUCCESS;
							item.isLocal = false; //显示后端返回的链接
							item.msgId = result.data.msg_id;
							item.msg = JSON.stringify(msg);
						}
						return item;
					});
				} else {
					//修改状态 为失败
					this.list.map(item => {
						if (
							item.status &&
							item.status === MSG_TYPE.SEND_MSG_STATUS_LOADING
						) {
							item.status = MSG_TYPE.SEND_MSG_STATUS_FAIL;
							item.isLocal = false; //显示后端返回的链接
							item.msg = JSON.stringify(msg);
						}
						return item;
					});
					this.$toast.text(result.message);
				}
			} else {
				this.$toast.text(res.message);
			}
		},

		//点击item消息
		async handleClick(type, data) {
			switch (type) {
				case MSG_TYPE.IM_MSG_TYPE_RED:
					this.getRed(data);
					break;
				case MSG_TYPE.IM_MSG_TYPE_BET:
					this.isShowPlanModal = true;
					this.planModalType = 1;
					this.planModalInfo = data;
					break;
				case MSG_TYPE.IM_MSG_TYPE_FOLLOW:
					this.isShowPlanModal = true;
					this.planModalType = 2;
					this.planModalInfo = data;
					break;
			}
		},

		//获取红包信息--能否领取红包
		async getRed(data) {
			let postData = {
				id: data.msg.id,
				roomId: data.roomId.toString(),
				redType:
					data.receiveType === MSG_TYPE.RECEIVE_TYPE_PRIVATE
						? MSG_TYPE.RECEIVE_TYPE_PUBLIC
						: MSG_TYPE.RECEIVE_TYPE_PRIVATE,
				siteIndexId: data.siteIndexId || "a"
			};
			let res = await getRedbagDetails(postData);
			console.log(res);

			if (res.success) {
				this.isShowRedMOdal = true;
				this.redInfo = res.data;
			} else {
				this.$toast.text(res.message);
			}
		},

		//领取红包-提交
		async drawRedbag(redInfo) {
			let postData = {
				id: redInfo.id,
				roomId: redInfo.roomId,
				redType: redInfo.redType
			};
			let res = await getRedbag(postData);
			console.log("res", res);
			if (res.success) {
				this.$router.push({
					name: "redList",
					query: {
						...postData,
						siteIndexId: redInfo.siteIndexId
					}
				});
			} else {
				this.$toast.text(res.message);
			}
		},

		// 向消息列表插入跟投
		insertPlan(data) {
			if (data && data.length > 0) {
				data.map(item => {
					item.msgType = MSG_TYPE.IM_MSG_TYPE_BET;
					if (item.listIndex.start === 1) {
						//start 1=进行中 2=未开盘  3=已结束 TODO ①
						this.list.push(item);
					}
				});
			}
		},

		//显示跟投弹框
		showPlanModal(info) {
			this.isShowPlanModal = true;
			this.planModalType = 1;
			this.planModalInfo = info;
		},

		//跟投 跟单弹框中提交
		async submitPlan(type, info) {
			// 1=跟投 2=跟单
			if (type === 1) {
				let postData = {
					roomId: this.id,
					handicap: 1,
					...info
					// fcType:info.fcType,
					// bet:info.bet,
					// contentId:info.contentId,
					// fcId:info.fcId,
					// playDetails:info.betWay,
					// playId:info.playId,
				};
				let res = await postPlanned(postData);
				if (res.success) {
					this.$toast.text(res.data);
					this.isShowPlanModal = false; //关闭弹框
				} else {
					this.$toast.text(res.message);
				}
			}
			if (type === 2) {
				let postData = {
					roomId: this.id,
					handicap: 1,
					fcType: 2,
					bet: info.bet,
					contentId: info.msg.contentId,
					fcId: info.msg.fcId,
					playDetails: info.msg.playDetails,
					playId: info.msg.playId
				};
				let res = await postPlanned(postData);
				if (res.success) {
					this.$toast.text(res.data);
					this.isShowPlanModal = false; //关闭弹框
				} else {
					this.$toast.text(res.message);
				}
			}
		},

		// 消息类型
		dealWithMsg(data) {
			if (data.receiveType === MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
				//私聊 判断mid和路由里面的id是否相等 是则表示当前是和该人聊天
				if (this.id === data.mid) {
					this.list.push(data);
				}
			} else {
				//群聊 判断roomId和路由里面的id是否相等 是则表示当前是在该群聊天
				if (this.id === data.roomId) {
					let userId = localStorage.getItem("userId") * 1;
					if (data.mid === userId) {
						//自己发送的消息收到推送了就不处理
					} else {
						// 投注计划-往群，聊天室顶部插入
						if (data.msgType === MSG_TYPE.IM_MSG_TYPE_BET) {
							this.dealWithBetPlan(data);
						} else {
							//非投注计划-往消息列表插入
							this.list.push(data);
						}
					}
				}
			}
		},

		//通知类型
		dealWithNoticeMsg(data) {
			let msg = JSON.parse(data.msg);
			switch (msg.noticeType) {
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_ONLINE: // 上线通知
					this.roomNum += 1;
					this.list.push(data);
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_OFFLINE: // 下线通知
					this.roomNum -= 1;
					this.list.push(data);
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_FORBIDDEN: // 禁言通知
					this.dealWithShutUp(msg, true);
					this.list.push(data);
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_DEL: // 删除消息通知
					this.list = this.list.filter(
						item => item.msgId !== msg.msgId
					);
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_RELEASE: // 解除禁言
					this.dealWithShutUp(msg, false);
					this.list.push(data);
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_RED: // 红包领取通知
					this.list.push(data);
					break;
				case MSG_TYPE.IM_NOTICE_FOLLOW: // 跟投
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_KICK: // 踢人
					// [我爱学习，我高兴]被管理员移出了群聊
					this.list.push(data);
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_FORBIDDEN_GROUP: // 群体禁言
					this.dealWithAllShutUp(msg);
					this.list.push(data);
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_HAS_BEEN_KICK: // 被踢
					// 你已被管理员移出分分中赚一百万群
					this.list.push(data);
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_OUT_GROUP: // 退出群聊
					this.list.push(data);
					break;

				case MSG_TYPE.IM_NOTICE_MESS_TYPE_JOIN_CROUP_NOTICE: // 其他会员入群通知
					this.list.push(data);
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_JOIN_CROUP_DISBAND: // 解散
					//直接返回上一个页面
					if (this.id === data.roomId) {
						this.$toast.text(msg.remark, {
							duration: 3000
						});
						this.$router.go(-1);
					}
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_CROUP_UPDATE_INFO: // 群信息修改
					if (this.id === data.roomId) {
						this.title = msg.groupName;
						this.sendType = msg.permission;
					}
					break;
				case MSG_TYPE.IM_NOTICE_MESS_TYPE_JOIN_GROUP_DEL: // 删除聊天室
					//直接返回上一个页面
					if (this.id === data.roomId) {
						this.$toast.text(msg.remark, {
							duration: 3000
						});
						this.$router.go(-1);
					}
					break;
			}
		},

		//处理 一进页面从后台获取的禁言
		dealWithFirstShutUp(datas) {
			// 聊天室，群    memberSendLimit 1=被禁言 其他 正常
			// 群sendLimit 2全员禁言  其他 正常
			this.memberSendLimit === datas.memberSendLimit;
			//群
			if (
				this.$route.query.roomType == MSG_TYPE.TYPE_PUBLIC ||
				this.$route.query.roomType == MSG_TYPE.TYPE_PRIVATE
			) {
				//全员禁言
				if (datas.sendLimit === 2) {
					this.isForbid = true;
				} else {
					//会员禁言
					if (datas.memberSendLimit === 1) {
						this.isForbid = true;
					}
				}
			}

			//聊天室
			if (this.$route.query.roomType == MSG_TYPE.TYPE_CHAT) {
				this.isForbid = datas.memberSendLimit === 1;
			}
		},

		//处理 全体禁言，解除全体禁言
		dealWithAllShutUp(msg) {
			// 聊天室，群    memberSendLimit 1=被禁言 其他 正常
			// 群sendLimit 2全员禁言  其他 正常

			//群
			if (
				this.$route.query.roomType == MSG_TYPE.TYPE_PUBLIC ||
				this.$route.query.roomType == MSG_TYPE.TYPE_PRIVATE
			) {
				if (msg.isForbidden === 2) {
					//群体禁言
					this.isForbid = true;
				}
				if (msg.isForbidden === 1) {
					alert(this.memberSendLimit);
					//解除群体禁言
					this.isForbid = this.memberSendLimit === 1; //会员禁言
				}
			}
		},

		//处理 会员禁言
		dealWithShutUp(msg, isShutUp) {
			let userId = localStorage.getItem("userId") * 1;
			// isShutUp true=禁言 false=解除禁言
			// 聊天室，群    memberSendLimit 1=被禁言 其他 正常
			// 群sendLimit 2全员禁言  其他 正常

			//群，聊天室
			if (this.$route.query.roomType !== MSG_TYPE.TYPE_MEMBER) {
				if (isShutUp && msg.mid === userId) {
					//禁言的会员是自己
					this.isForbid = true;
					this.memberSendLimit = 1;
				}
				if (!isShutUp && msg.mid === userId) {
					//解除禁言的会员是自己
					this.isForbid = false;
					this.memberSendLimit = 0;
				}
			}
		},

		//处理 投注计划推送
		dealWithBetPlan(data) {
			console.log(data, "-------------////-========");
		}
	}
};
</script>
<style lang="scss" scoped>
.chat-header {
	/deep/ .nav-center {
		flex: 1;
	}
	.number {
		font-size: px2rem(24);
		color: $label-color;
		display: inline-block;
		margin-left: px2rem(18);
		margin-top: px2rem(10);
	}
}
.msg-list {
	height: auto;
	background: $default-bg-color;
	position: absolute;
	width: 100%;
	bottom: px2rem(108);
	overflow-y: auto;
	top: px2rem(88);
	// -webkit-overflow-scrolling: auto; 当手指从触摸屏上移开，滚动会立即停止
	-webkit-overflow-scrolling: touch; //当手指从触摸屏上移开，会保持一段时间的滚动
	ul {
		padding: 0 px2rem(32);
	}
}
.pk-toGame {
	position: fixed;
	bottom: px2rem(140);
	right: px2rem(26);
	z-index: 99;
	width: px2rem(100);
	height: px2rem(100);
	img {
		width: 100%;
		height: 100%;
	}
}
</style>