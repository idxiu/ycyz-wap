<template>
	<div id="about" ref="about">
		<F-header
				:rooter="rooter"
				:title="title"
				:hasNoBack="true"
				:isShowHome="false"
				@editInfoReturn="editInfoReturn"
		>
			<div v-show="isShowSave" slot="head_right">
                <span class="header-record">
                    <span class="f28" @click="validateBeforeSubmit">保存</span>
                </span>
			</div>
		</F-header>
		<date-picker
				ref="picker"
				type="date"
				year-format="{value} 年"
				month-format="{value} 月"
				date-format="{value} 日"
				v-model="dataVal"
				@confirm="handleConfirm">
		</date-picker>
		<mt-popup :closeOnClickModal="true" :position="'bottom'" v-model="popupVisibles"
				  style="width: 100%;z-index: 2003;">
			<div class="popup-title pk-1px-b">
				<span @click="cancels()">取消</span>
				<span></span>
				<span @click="sures()">确定</span>
			</div>
			<picker :slots="myAddressSlotspro" :itemHeight="itemHeight" @change="onMyAddressChanges"></picker>
		</mt-popup>
		<div class="hasbox"></div>
		<div class="gray"></div>
		<div class="overflow" v-show="!isEdit">
			<div class="content">
				<div class="pk-input pk-inputpro">
					<label class="title fs-14">{{member.account}}</label>
					<div class="input input_pro inputs">
						<i class="imgs icon iconfont icon-sidebar_head"></i>
					</div>
				</div>
				<div class="pk-input pk-inputpro">
					<label class="title fs-14">姓名</label>
					<div class="input fs-12 input_pro inputs">
						<input name="name" disabled autocomplete="off" v-model="memberinfos.realName">
					</div>
				</div>

				<div @click="onEditInfo('nickname')" class="pk-input pk-inputpro">
					<label class="title fs-14">昵称</label>
					<div class="input fs-12 input_pro inputs">
						<input type="text" readOnly name="nickName" autocomplete="off" v-model="member.nickname" placeholder="请完善信息">
					</div>
				</div>

				<div @click="onEditInfo('idCard')" class="pk-input pk-inputpro">
					<label class="title fs-14">身份证</label>
					<div class="input fs-12 input_pro inputs">
						<input name="idCard" autocomplete="off" v-model="memberinfos.idCard" placeholder="请完善信息">
					</div>
				</div>
				<div @click="onEditInfo('mobile')" class="pk-input pk-inputpro">
					<label class="title fs-14">手机</label>
					<div class="input fs-12 input_pro inputs">
						<input name="mobilePhone" autocomplete="off" v-model="memberinfos.mobile" placeholder="请完善信息">
					</div>
				</div>

				<div @click="onEditInfo('email')" class="pk-input pk-inputpro">
					<label class="title fs-14">邮箱</label>
					<div class="input fs-12 input_pro inputs">
						<input type="text" name="email" autocomplete="off" v-model="memberinfos.email" placeholder="请完善信息">
					</div>
				</div>

				<div @click="onEditInfo('qq')" class="pk-input pk-inputpro">
					<label class="title fs-14">QQ</label>
					<div class="input fs-12 input_pro inputs">
						<input name="qq" autocomplete="off" v-model="memberinfos.qq" placeholder="请完善信息">
					</div>
				</div>
				<div @click="onEditInfo('wechat')" class="pk-input pk-inputpro">
					<label class="title fs-14">微信号</label>
					<div class="input fs-12 input_pro inputs">
						<input name="weChat" autocomplete="off" v-model="memberinfos.wechat" placeholder="请完善信息">
					</div>
				</div>

				<div class="pk-input pk-inputpro">
					<label class="title fs-14">所在地</label>
					<div class="input fs-12 input_pro inputs">
						<input type="text" @click="popupVisibles = true" name="localhost" autocomplete="off" readonly
							   v-model="borthplaces" v-validate="'max:20|min:1'"
							   :class="{'input': true, 'is-danger': errors.has('localhost') }" placeholder="请完善信息">
						<i type="clear" v-show="errors.has('localhost')" class="fs-15 iconfont icon-login-error tj"></i>
					</div>
				</div>

				<div class="pk-input pk-inputpro">
					<label class="title fs-14">出生日期</label>
					<div class="input fs-12 input_pro inputs">
						<input @click="openPicker()" type="text" v-model="birthday" name="birthday" autocomplete="off"
							   readonly placeholder="请完善信息"
							   :class="{'input': true, 'is-danger': errors.has('birthday') }">
						<i type="clear" v-show="errors.has('birthday')" class="fs-15 iconfont icon-login-error tj"></i>
					</div>
				</div>
				<div class="pk-input pk-inputpro">
					<label class="title titles fs-14">最近登陆</label>
					<div class="input fs-12 input_pro">
						<input name="最近登陆" class="no-bod-bot" autocomplete="off" readonly v-model="loginlasttime">
					</div>
				</div>
			</div>
		</div>

		<!-- 单个编辑信息显示的内容 -->
		<div class="overflow" v-show="isEdit">
			<div class="content">

				<div v-show="editWho==='nickname'" class="pk-input pk-inputpro">
					<label class="title fs-14">昵称</label>
					<div class="input fs-12 input_pro inputs no">
						<input type="text" name="nickName" autocomplete="off" v-model="member.nickname"
							   v-validate="'max:10|min:1'"
							   :class="{'input': true, 'is-danger': errors.has('nickName') }" placeholder="请完善信息">
						<i type="clear" v-show="errors.has('nickName')" class="fs-15 iconfont icon-login-error tj"></i>
					</div>
				</div>

				<div v-show="editWho==='idCard'" class="pk-input pk-inputpro">
					<label class="title fs-14">身份证</label>
					<div class="input fs-12 input_pro inputs no">
						<input name="idCard" autocomplete="off" v-model="memberinfos.idCard"
							   v-validate="'max:18|min:15|idCard'"
							   :class="{'input': true, 'is-danger': errors.has('idCard') }" type="text"
							   placeholder="请完善信息">
						<i type="clear" v-show="errors.has('idCard')" class="fs-15 iconfont icon-login-error tj"></i>
					</div>
				</div>
				<div v-show="editWho==='mobile'" class="pk-input pk-inputpro">
					<label class="title fs-14">手机</label>
					<div class="input fs-12 input_pro inputs no">
						<input name="mobilePhone" autocomplete="off" v-model="memberinfos.mobile"
							   v-validate="'max:20|min:11'"
							   :class="{'input': true, 'is-danger': errors.has('mobilePhone') }" type="number"
							   placeholder="请完善信息">
						<i type="clear" v-show="errors.has('mobilePhone')"
						   class="fs-15 iconfont icon-login-error tj"></i>
					</div>
				</div>

				<div v-show="editWho==='email'" class="pk-input pk-inputpro">
					<label class="title fs-14">邮箱</label>
					<div class="input fs-12 input_pro inputs no">
						<input type="text" name="email" autocomplete="off" v-model="memberinfos.email"
							   v-validate="'email'" :class="{'input': true, 'is-danger': errors.has('email') }"
							   placeholder="请完善信息">
						<i type="clear" v-show="errors.has('email')" class="fs-15 iconfont icon-login-error tj"></i>
					</div>
				</div>

				<div v-show="editWho==='qq'" class="pk-input pk-inputpro">
					<label class="title fs-14">QQ</label>
					<div class="input fs-12 input_pro inputs no">
						<input name="qq" autocomplete="off" v-model="memberinfos.qq" v-validate="'numeric|max:20|min:5'"
							   :class="{'input': true, 'is-danger': errors.has('qq') }" type="text"
							   placeholder="请完善信息">
						<i type="clear" v-show="errors.has('qq')" class="fs-15 iconfont icon-login-error tj"></i>
					</div>
				</div>
				<div v-show="editWho==='wechat'" class="pk-input pk-inputpro">
					<label class="title fs-14">微信号</label>
					<div class="input fs-12 input_pro inputs no">
						<input name="weChat" autocomplete="off" v-model="memberinfos.wechat" v-validate="'max:20|min:5'"
							   :class="{'input': true, 'is-danger': errors.has('weChat') }" type="text"
							   placeholder="请完善信息">
						<i type="clear" v-show="errors.has('weChat')" class="fs-15 iconfont icon-login-error tj"></i>
					</div>
				</div>
			</div>
		</div>


		<div class="else pdl30">
			<div class="divs">
				<!-- <p v-show="errors.has('姓名')" class="errs help fds-12 is-danger">{{ errors.first('姓名') }}</p> -->
				<p v-show="errors.has('nickName')&&!errors.has('name')" class="errs help fds-12 is-danger">{{
					errors.first('nickName') }}</p>
				<p v-show="errors.has('idCard')&&!errors.has('nickName')&&!errors.has('name')"
				   class="errs help fds-12 is-danger">{{ errors.first('idCard') }}</p>
				<p v-show="errors.has('mobilePhone')&&!errors.has('idCard')&&!errors.has('nickName')&&!errors.has('name')"
				   class="errs help fds-12 is-danger">{{ errors.first('mobilePhone') }}</p>
				<p v-show="errors.has('email')&&!errors.has('mobilePhone')&&!errors.has('idCard')&&!errors.has('nickName')&&!errors.has('name')"
				   class="errs help fds-12 is-danger">{{ errors.first('email') }}</p>
				<p v-show="errors.has('qq')&&!errors.has('email')&&!errors.has('mobilePhone')&&!errors.has('idCard')&&!errors.has('nickName')&&!errors.has('name')"
				   class="errs help fds-12 is-danger">{{ errors.first('qq') }}</p>
				<p v-show="errors.has('weChat')&&!errors.has('qq')&&!errors.has('email')&&!errors.has('mobilePhone')&&!errors.has('idCard')&&!errors.has('nickName')&&!errors.has('name')"
				   class="errs help fds-12 is-danger">{{ errors.first('weChat') }}</p>
				<p v-show="errors.has('localhost')&&!errors.has('weChat')&&!errors.has('qq')&&!errors.has('email')&&!errors.has('mobilePhone')&&!errors.has('idCard')&&!errors.has('nickName')&&!errors.has('name')"
				   class="errs help fds-12 is-danger">{{ errors.first('localhost') }}</p>
				<p v-show="errors.has('birthday')&&!errors.has('localhost')&&!errors.has('weChat')&&!errors.has('qq')&&!errors.has('email')&&!errors.has('mobilePhone')&&!errors.has('idCard')&&!errors.has('nickName')&&!errors.has('name')"
				   class="errs help fds-12 is-danger">{{ errors.first('birthday') }}</p>
			</div>
		</div>
	</div>
</template>


<script>
    import {Picker} from "mint-ui";
    import myaddress from "../../../components/json/provincesCities.json";
    import worldaddress from "../../../components/json/world.json";
    import FHeader from "../../../components/Header";
    import datePicker from "../../../components/DatePicker";
    import cList from "../../../components/json/worldjson.js";
    import {memberInfo, updateMember} from "@/api/about";
    import {addCss} from "@/assets/js/common"
    addCss(`${process.env.VUE_APP_API_PREFIX}`)
    export default {
        components: {
            FHeader,
            datePicker,
            Picker
        },
        data () {
            return {
                isShowSave: false,//是否显示头部保存按钮
                popupVisible: false,
                popupVisibles: false,
                borrhtime: "",
                dataVal: new Date(),
                title: "个人信息",
                rooter: '-1',

                birthday: "",
                itemHeight: 36,
                loginlasttime: "",
                country: "",
                province: "",
                city: "",
                member: {
                    country: "",
                    province: "",
                    city: ""
                },
                memberinfos: {},
                submitObj: {},
                //country provience city
                jsonList: [],
                myAddressSlotspro: [
                    {
                        flex: 1,
                        defaultIndex: 1,
                        values: [], //省份数组
                        className: "slot1",
                        textAlign: "center"
                    },
                    {
                        divider: true,
                        content: "-",
                        className: "slot2"
                    },
                    {
                        flex: 1,
                        values: [],
                        className: "slot3",
                        textAlign: "center"
                    },
                    {
                        divider: true,
                        content: "-",
                        className: "slot4"
                    },
                    {
                        flex: 1,
                        values: [],
                        className: "slot5",
                        textAlign: "center"
                    }
                ],
                jsonListcounty: "",
                jsonListProvince: "",
                jsonListCity: "",
                proxMsg: "",
                borthplaces: "",
                isEdit: false,//是否处于编辑状态
                editWho: '',
            };
        },
        created () {
            this.myAddressSlotspro[0].values = Object.keys(cList);
            this.itemHeight = parseInt(this.HTML_FONT_SIZE * 1.06667);
        },
        mounted () {
            this.hasHeight();
            this.hasPersonMsg();
        },
        methods: {
            hasPersonMsg () {
                const _this = this;
                memberInfo()
                .then(res => {
                    //   console.log(res,'resres')
                    this.member = res.member;
                    this.memberinfos = res.memberInfo;
                    console.log(this.memberinfos);
                    this.birthday = res.memberInfo.birthday;
                    this.loginlasttime = this.filterDate(res.member.loginLastTime);
                    if (this.member.country == "") {
                        this.$nextTick(() => {
                            this.myAddressSlotspro[0].defaultIndex = 0;
                        });
                    } else {
                        if (this.member.province == "" && this.member.city == "") {
                            this.borthplaces = this.member.country;
                            return;
                        }
                        if (this.member.city == "") {
                            this.borthplaces =
                                this.member.country + "-" + this.member.province;
                            return;
                        }
                        this.borthplaces =
                            this.member.country +
                            "-" +
                            this.member.province +
                            "-" +
                            this.member.city;
                    }
                    var c = {};
                    var indexs = 0;
                    var provinceIndex = 0;
                    var cityIndex = 0;
                    Object.keys(worldaddress.Earth.Country).map((v, i) => {
                        var country = worldaddress.Earth.Country[v * 1].CountryName;
                        if (country == this.member.country) {
                            indexs = i;
                            var Station = worldaddress.Earth.Country[indexs].Station;
                            if (!Station) {
                                return;
                            }
                            Station.map((v2, i2) => {
                                if (v2.StationName == this.member.province) {
                                    provinceIndex = i2;
                                    // console.log(Station,v2.StationName,i2,'e')
                                    var City =
                                        worldaddress.Earth.Country[indexs].Station[provinceIndex]
                                            .City;
                                    // console.log(City,'city')
                                    if (!City) {
                                        return;
                                    }
                                    if (City.constructor === Object) {
                                        cityIndex = 0;
                                    }
                                    if (City.constructor === Array) {
                                        City.map((v3, i3) => {
                                            if (v3.CityName == this.member.city) {
                                                cityIndex = i3;
                                            }
                                        });
                                    }
                                }
                            });
                            // console.log(Station,worldaddress.Earth.Country[v * 1],i)
                        }
                        // console.log(worldaddress.Earth.Country[v * 1],'country',i)
                    });
                    this.myAddressSlotspro[0].defaultIndex = indexs;
                    this.myAddressSlotspro[2].defaultIndex = provinceIndex;
                    this.myAddressSlotspro[4].defaultIndex = cityIndex;
                })
                .catch(res => {
                    _this.$toast({
                        message: res,
                        duration: 2000
                    });
                });
            },
            hasHeight () {
                this.$refs.about.style.height = window.innerHeight + "px";
            },
            goNick (state) {
                if (state === 1) {
                    //正
                    this.$router.push({
                        name: "nickName"
                    });
                } else if (state === 2) {
                    //未开始
                    this.$router.push({
                        name: "place"
                    });
                }
            },
            validateBeforeSubmit () {
                var _this = this;
                this.$validator.validateAll().then(result => {
                    if (result) {
                        updateMember(
                            this.member.nickname,
                            this.memberinfos.idCard + "",
                            this.memberinfos.mobile,
                            this.memberinfos.email,
                            this.memberinfos.qq + "",
                            this.memberinfos.wechat,
                            this.birthday,
                            this.country,
                            this.province,
                            this.city
                        )
                        .then(res => {
                            this.editInfoReturn();
                            _this.$toast("保存成功");
                            // console.log(res,'res')
                        })
                        .catch(err => {
                            this.$toast({
                                message: err,
                                duration: 2000
                            });
                        });
                    }
                });
            },
            openPicker () {
                this.$refs.picker.open();
            },
            handleConfirm (value) {
                this.birthday = this.filterDate(value, "YYYY-MM-DD");
                console.log(this.birthday, "this.birthday");
                let _this = this;
                let arr = this.birthday.split("-");
                let arr2 = this.filterDate(
                    Math.round(parseInt(new Date().valueOf()) / 1000),
                    "YYYY-MM-DD"
                ).split("-");
                console.log(arr, arr2);

                function common () {
                    _this.$toast({
                        message: "出生日期不能大于当天",
                        duration: 2000
                    });
                }

                if (arr[0] > arr2[0]) {
                    this.birthday = "";
                    common();
                }
                if (arr[0] == arr2[0] && arr[1] > arr2[1]) {
                    this.birthday = "";
                    common();
                }
                if (arr[0] == arr2[0] && arr[1] == arr2[1] && arr[2] > arr2[2]) {
                    this.birthday = "";
                    common();
                }
                this.validateBeforeSubmit();//点击选择生日下拉框就直接保存
            },

            //所在地
            onMyAddressChanges (picker, values) {
                if (cList[values[0]]) {
                    picker.setSlotValues(1, Object.keys(cList[values[0]])); //  Object.keys()会返回一个数组，当前省的数组
                    picker.setSlotValues(2, cList[values[0]][values[1]]); //  区/县数据就是一个数组
                    this.jsonListcounty = values[0];
                    this.jsonListProvince = values[1];
                    this.jsonListCity = values[2];

                    this.proxMsg =
                        this.jsonListcounty +
                        "-" +
                        this.jsonListProvince +
                        "-" +
                        this.jsonListCity;
                    if (this.proxMsg.length > 20) {
                        this.proxMsg = this.proxMsg.slice(0, 20);
                        let arr = this.proxMsg.split("-");
                        this.country = arr[0];
                        this.province = arr[1];
                        this.city = arr[2];
                    } else {
                        this.proxMsg;
                    }
                    if (typeof values[2] == "undefined" || values[2] == "") {
                        this.jsonListCity = "";
                        this.proxMsg = this.jsonListcounty + "-" + this.jsonListProvince;
                    }
                    if (typeof values[1] == "undefined" || values[1] == "") {
                        this.jsonListProvince = "";
                        this.jsonListCity = "";
                        this.proxMsg = this.jsonListcounty;
                    }
                    this.country = this.jsonListcounty;
                    this.province = this.jsonListProvince;
                    this.city = this.jsonListCity;
                }
            },
            cancels () {
                this.popupVisibles = false;
                //   this.borthplaces = "";
            },
            sures () {
                this.popupVisibles = false;
                this.borthplaces = this.proxMsg;
                this.validateBeforeSubmit();//点击选择地区下拉框就直接保存
                //   console.log(this.country,this.province,this.city)
            },
            onEditInfo (key) {
                this.isEdit = true;
                this.rooter = null;
                this.editWho = key;
                this.isShowSave = true;
                switch (key) {
                    case 'nickname':
                        this.title = "编辑昵称";
                        break;
                    case 'idCard':
                        this.title = "编辑身份证";
                        break;
                    case 'mobile':
                        this.title = "编辑手机";
                        break;
                    case 'email':
                        this.title = "编辑邮箱";
                        break;
                    case 'qq':
                        this.title = "编辑QQ";
                        break;
                    case 'wechat':
                        this.title = "编辑微信号";
                        break;
                }
            },
            //在编辑状态下 点击返回
            editInfoReturn () {
                this.isEdit = false;
                this.rooter = '-1';
                this.title = "个人信息";
                this.isShowSave = false;
            }
        },

    };
</script>
<style scoped lang="less">
	@import "./index.less";

	.icon-sidebar_head:before {
		font-size: 0.6667rem;
		color: @color-primary;
	}

	.overflow {
		width: 100%;
		overflow: hidden;
	}

	//input
	.content {
		padding-left: 0.26667rem;
	}

	.pk-inputpro {
		background: @color-default;
		margin-bottom: 0;
		.title {
			padding-left: 0 /* 20/75 */;
			color: @color-C;
		}
		.titles {
			color: @color-N;
		}
		.input {
			input {
				padding-left: 48%;
				margin-left: 3%;
				padding-right: 5%;
				text-align: right !important;
				font-size: 0.37333rem /* 28/75 */;
				color: @color-J;
			}
		}
		.pk-inputpro:after {
			content: " ";
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1px;
			border-bottom: 1px solid @color-O;
			color: @color-O;
			-webkit-transform-origin: 0 100%;
			transform-origin: 0 100%;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}
		.muster::before {
			content: "*";
			position: absolute;
			left: 0.17333rem /* 13/75 */;
			top: 50%;
			-webkit-transform: translate(0, -50%);
			transform: translate(0, -50%);
			color: @color-a;
		}
	}

	.input_pro inputs {
		background: @color-default !important;
		.imgs {
			width: 100%;
			height: 100%;
			font-size: 0.64rem /* 48/75 */;
			margin-right: 0.32rem /* 24/75 */;
			margin-top: 0.21333rem /* 16/75 */;
			border-radius: 0.32rem /* 24/75 */;
			display: inline-block;
			float: right;
		}
	}

	.no-bod-bot {
		border-bottom: none !important;
	}

	.tj {
		right: 0.13333rem /* 10/75 */;
	}

	.errs {
		color: @color-a !important;
		text-align: center;
	}

	.content {
		width: 100%;
		overflow: hidden;
	}

	.pk-inputpro .input input {
		padding-right: 9%;
		padding-left: 20%;
	}

	.pk-input .inputs:after {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid @color-O;
		color: @color-O;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.pk-input .inputs.no:after {
		display: none;
	}

	.imgs {
		position: absolute;
		right: 8%;
		top: 20%;
		width: 0.64rem /* 48/75 */;
		height: 0.64rem;
		border-radius: 0.32rem;
	}

	.pk-inputpro .input input {
		padding-right: 10%;
	}

	.tj {
		top: 0.33333rem /* 25/75 */;
		right: 0.28rem /* 21/75 */;
	}
</style>