<template>
	<div class="about">
		<nut-navbar class="pk-title"  @on-click-back="back('my')" @on-click-more="back('index')">
			账号信息
			<a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png"/>
			</a>
            <a class="backIdex" slot="more-icon" >
                <img class="imgsbank" src="../../../assets/img/my-icon/backIndex.png"/>
            </a>
		</nut-navbar>
		<div class="cent" v-show="!showLoading">
            <div class="pk-form-content">
                <!-- <div class="pk-input">
                    <label>头像</label>
                    <img
                        class="icon-img"
                        src="../../../assets/img/my-icon/icon_visitor@3x.png"
                        alt
                    />
                </div> -->
                <div class="pk-input">
                    <label>姓名</label>
                    <nut-col :span="16" class="pk-foricon">
                        <div class="flex-content el-input">
                            <!-- :disabled="realNames!=''" -->
                            <input
                                disabled
                                class="inputs"
                                type="text"
                                v-model="user.realName"
                            />
                            <i class="iconfont icon-list-more"></i>
                        </div>
                    </nut-col>
                </div>
                <div class="pk-input">
                    <label>昵称</label>
                    <nut-col :span="16" class="pk-foricon">
                        <div class="flex-content el-input">
                            <input
                                class="inputs"
                                type="text"
                                placeholder="设置"
                                v-model="user.nickname"
                            />
                            <i class="iconfont icon-list-more"></i>
                        </div>
                    </nut-col>
                </div>
                <div class="pk-input pad0 pk-sex">
                    <nut-cell
                        class="pk-borth"
                        :class="{ 'pk-sex-active': sexActive }"
                        :isLink="true"
                        @click.native="switchPicker('isVisiblesex',2)"
                    >
                        <span slot="title">
                            <label class="noline">性别</label>
                        </span>
                        <div slot="desc" class="selected-option">
                            <span class="show-value">{{
                                sex ? sex : "请设置"
                            }}</span>
                        </div>
                    </nut-cell> 
                    <nut-picker
                        :is-visible="isVisiblesex"
                        title="请选择性别"
                        :list-data="sexList"
                        :default-value-data="defaultValueDatasex"
                        @close="switchPicker('isVisiblesex')"
                        @confirm="setChooseValuesex"
                    ></nut-picker>
                </div>
                <div class="pk-input">
                    <label>身份证</label>
                    <nut-col :span="16" class="pk-foricon">
                        <div class="flex-content el-input">
                            <input
                                :disabled="idCardf != ''"
                                class="inputs"
                                type="text"
                                placeholder="设置"
                                v-model="user.idCard"
                            />
                           <i class="iconfont icon-list-more"></i>
                        </div>
                    </nut-col>
                </div>
                <div class="pk-input">
                    <label>手机</label>
                    <nut-col :span="16" class="pk-foricon">
                        <div class="flex-content el-input">
                            <input
                                class="inputs"
                                type="text"
                                placeholder="设置"
                                v-model="user.mobile"
                            />
                           <i class="iconfont icon-list-more"></i>
                        </div>
                    </nut-col>
                </div>
                <div class="pk-input">
                    <label>邮箱</label>
                    <nut-col :span="16" class="pk-foricon">
                        <div class="flex-content el-input">
                            <input
                                class="inputs"
                                type="text"
                                placeholder="设置"
                                v-model="user.email"
                            />
                           <i class="iconfont icon-list-more"></i>
                        </div>
                    </nut-col>
                </div>
                <div class="pk-input">
                    <label>QQ</label>
                    <nut-col :span="16" class="pk-foricon">
                        <div class="flex-content el-input">
                            <input
                                class="inputs"
                                type="text"
                                placeholder="设置"
                                v-model="user.qq"
                            />
                           <i class="iconfont icon-list-more"></i>
                        </div>
                    </nut-col>
                </div>
                <div class="pk-input">
                    <label>微信号</label>
                    <nut-col :span="16" class="pk-foricon">
                        <div class="flex-content el-input">
                            <input
                                class="inputs"
                                type="text"
                                placeholder="设置"
                                v-model="user.wechat"
                            />
                            <i class="iconfont icon-list-more"></i>
                        </div>
                    </nut-col>
                </div>
                <div class="pk-input pad0">
                    <nut-cell
                        class="pk-borth"
                        :class="{ 'pk-place-active': placeActive }"
                        :isLink="true"
                        @click.native="switchPicker('isVisibles',1)"
                    >
                        <span slot="title">
                            <label class="noline">所在地</label>
                        </span>
                        <div slot="desc" class="selected-option">
                            <!-- <span class="btn" @click.stop.prevent="modifyCity">修改为指定的城市</span> -->
                            <span class="show-value">{{
                                city ? city : "选择"
                            }}</span>
                        </div>
                    </nut-cell> 
                    <nut-picker
                        :is-visible="isVisibles"
                        title="请选择城市"
                        :list-data="andCountry"
                        :default-value-data="defaultValueData"
                        @close="switchPicker('isVisibles')"
                        @confirm="setChooseValues"
                        @choose="updateChooseValue"
                        @close-update="closeUpdateChooseValue"
                    ></nut-picker>
                </div>
                <div class="pk-input pad0 pk-day">
                    <!-- <label>生日</label> -->
                    <!-- <nut-col :span="16" class="pk-foricon"> -->
                    <nut-cell
                        class="pk-borth"
                        :class="{ 'pk-borth-active': borthActive }"
                        :isLink="true"
                        @click.native="switchPicker('isVisible')"
                    >
                        <span slot="title">
                            <label class="noline">生日</label>
                        </span>
                        <div slot="desc" class="selected-option">
                            <span class="show-value">{{
                                dates ? dates : "请选择"
                            }}</span>
                        </div>
                    </nut-cell>
                    <nut-datepicker
                        :is-visible="isVisible"
                        type="date"
                        title="请选择日期"
                        :is-show-chinese="false"
                        startDate="1900-01-01"
                        @close="switchPicker('isVisible')"
                        @choose="setChooseValue"
                    ></nut-datepicker>
                    <!-- </nut-col> -->
                </div>
                <div class="pk-input pk-signs">
                    <label>个性签名</label>
                    <nut-col :span="16" class="pk-foricon">
                        <div class="flex-content el-input">
                            <input
                                class="inputs"
                                type="text"
                                placeholder="设置"
                                v-model="user.personalSign"
                            />
                            <i class="iconfont icon-list-more"></i>
                        </div>
                    </nut-col>
                </div>
            </div>
        </div>
        <div class="bot">
            <p>最近登录: {{ user.lastLoginTime | filterDate }}</p>
        </div>
        <div class="btns">
            <nut-button block shape="circle" @click="updateUser"
                >确定</nut-button
            >
        </div>
        <div class="skeleton vue-skeleton-loading" v-show="showLoading">
            <div class="skeleton-bac-animation"></div>
            <div class="skeleton-bac-content">
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 ">
                    <skeleton-square width="2.1667rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0 0 0.2667rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 " style="justify-content: center;">
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0.3rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 " style="justify-content: center;">
                    <skeleton-square width="7rem" style="height:1rem;" margin="0 0.3rem"></skeleton-square>
                </row>
                <row padding="0.2rem  0 0 0 " style="justify-content: center;">
                    <skeleton-square width="10rem" style="height:2rem;" margin="0 0.3rem"></skeleton-square>
                </row>
            </div>

        </div>
	</div>
</template>
<script>
import { getUserInfo, updateUser } from "@/services/about.js";
import worldaddress from "@/components/json/world.json";

export default {
	data() {
		return {
			endDate: "",
			user: {},
			realNames: "", //检验姓名是否为空
			idCardf: "", //检验身份证是否为空
            showLoading: true,
			borthActive: false,
			loginTime: "2018.4.23 23:23:11",
			isVisible: false,
			date: null,
			dates: null,

			city: null,
			isVisibles: false,
            placeActive: false,
            isVisiblesex: false,
            sexActive: false,
            defaultValueData: null,
            // 地区选择
            countryList: [],
            countryObj:{},
            countrySub:{},
            andCountry:[],
            defaultValueDatasex: null,
            sex:'',
            sexList:[
                ['男','女']
            ]
		};
	},
	created() {
        this.forEndDate();
        this.andCountry[0] = this.countryList
        this.hasPlace();
	},
	mounted() {
        this.getUser();
        this.createPlace();
	},
	methods: {
		createPlace() {
			//第一个数组 为 国家
			//第二个数组 为 省份
			//第三个数组 为 市县
            // 即 当第一个数组变的时候 第二个数组默认选中对应的第一项 第三个数组默认选中对应的第一项 watch
            console.log(...[this.countryList[0]],"...")
            this.andCountry = [
				...[this.countryList[0]],
				this.countryObj[this.countryObj[0][0]],
				this.countrySub[this.data[this.countryObj[0][0]]]
			];
		},
		hasPlace() {
			var indexs = 0;
			var provinceIndex = 0;
			var cityIndex = 0;
			Object.keys(worldaddress.Earth.Country).map((v, i) => {
				var country = worldaddress.Earth.Country[v * 1].CountryName;
				// console.log(country,'country',this.defaultValueDatas[0])
                this.countryList.push(country)
					var Station = worldaddress.Earth.Country[i].Station;
                    // console.log("Station",Station)
					if (!Station) {
						return;
                    }
                    var arrStation=[]
					Station.map((v2, i2) => {
							var StationName =
								worldaddress.Earth.Country[i].Station[
									i2
                                ].StationName;
                                
							if (!StationName) {
								return;
                            }
                            arrStation.push(StationName)
                            var City =
								worldaddress.Earth.Country[i].Station[
									i2
                                ].City;
                            if(!City) return
                            var cityArr = []
                            if (City.constructor === Object) {
								cityArr.push(City.CityName)
							}
							if (City.constructor === Array) {
								City.map((v3, i3) => {
                                    cityArr.push(v3.CityName)
								});
							}
                            this.countrySub[StationName] = cityArr;
                            this.countryObj[country] = arrStation;
					});
            });
            // console.log(this.countryObj,'this.countryObj',this.countrySub)
		},
		back(path) {
			this.$router.push({
				name: path
			});
		},
		getUser() {
			getUserInfo().then(res => {
				if (res.success) {
					this.user = res.data.user;
					this.realNames = this.user.realName;
					this.idCardf = this.user.idCard;
                    console.log(res.data.user, "res");
                    console.log(this.user.country, this.user.province,this.user.city,'aabbc')
                    this.user.country = this.user.country==0?"请选择":this.user.country; 
                    this.user.province = this.user.province==0?"请选择":this.user.province;
                    this.user.city = this.user.city=="内网IP"?"请选择":this.user.city;
                    this.sex = this.user.sex==2?"女":this.user.sex==1?"男":'';
                    if(this.user.country==0 ||
                        this.user.country=="" ||
                        this.user.country=="请选择" ||
                        this.user.province==0||
                        this.user.province=="" ||
                        this.user.province=="请选择" ||
                        this.user.city=="内网IP"||
                        this.user.city=="请选择"||
                        this.user.city==""){
                        this.placeActive = false;
                    }else{
                        this.placeActive = true;
                        this.updateLinkage(0, this.user.country, 1, this.user.province, 2,this.user.city);
                    }
                    this.dates = this.user.birthday;
                    
                    this.defaultValueData = [this.user.country, this.user.province,this.user.city];
					if (this.dates != "" && this.dates != null) {
						this.borthActive = true;
                    }
                    if(this.sex!="" && this.sex!=null){
                        this.sexActive = true;
                    }
				} else {
					this.$toast.fail(res.message, {
						cover: true,
						duration: 1000
					});
                }
                this.showLoading = false;
			});
		},
		forEndDate() {
			var date = new Date();
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			this.endDate = year + seperator1 + month + seperator1 + strDate;
			console.log(this.endDate, "this.endDate");
		},
		updateUser() {
            this.user.city = this.citys;
            this.user.country = this.country;
            this.user.province = this.province;
            this.user.sex = this.sex=="男"?1:this.sex=="女"?2:0;
			updateUser(this.user).then(res => {
				if (res.success) {
					this.$toast.success("修改成功", {
						cover: true,
						duration: 1000
                    });
                    this.back('my')
				} else {
					this.$toast.fail(res.message, {
						cover: true,
						duration: 1000
					});
				}
			});
        },
		switchPicker(param,status) {
            this[`${param}`] = !this[`${param}`];
            if(status==1){
                this.$(".pk-day").css({'z-index':'1'});
                this.$(".pk-signs,.pk-sex").css({'z-index':'0'});
            }else if(status==2){
                this.$(".pk-sex").css({'z-index':'100'});
                // this.$(".pk-signs").css({'z-index':'10'});
            }else{
                this.$(".pk-signs,.pk-sex").css({'z-index':'0'});
                setTimeout(()=>{this.$(".pk-day").css({'z-index':'10'});},500)
            }
		},
		setChooseValue(param) {
			this.dates = param[3];
			this.borthActive = true;
			this.user.birthday = this.dates;
			console.log(this.dates, "this.dates");
		},

		setChooseValues(chooseData) {
            this.city = `${chooseData[0]}-${chooseData[1]}${chooseData[2] ? '-' + chooseData[2] : ''}`;
            this.country = chooseData[0];
            this.province = chooseData[1];
            this.citys = chooseData[2];
		},
		updateLinkage(self, value, index, chooseValue, cacheValueData) {
            if (!value) {
                return false;
            }
            switch(index) {
                case 1: 
                    let i = this.andCountry[0].indexOf(value);
                    this.andCountry.splice(index, 1, [...this.countryObj[this.andCountry[0][i]]]);
                    chooseValue = chooseValue ? chooseValue : this.andCountry[index][0];
                    self && self.updateChooseValue(self, index, chooseValue);
                    this.updateLinkage(self, chooseValue, 2, (cacheValueData && cacheValueData[2] ? cacheValueData[2] : null));
                    break;
                case 2: 
                    let areaData = this.countrySub[value] ? this.countrySub[value] : []; 
                    this.andCountry.splice(index, 1, [...areaData]);
                    chooseValue = chooseValue ? chooseValue : this.andCountry[index][0];
                    self && self.updateChooseValue(self, index, chooseValue);
                    break;
            }
		},

		updateChooseValue(self, index, value, cacheValueData) {
            index < 2 && this.updateLinkage(self, value, index + 1, null);
            this.placeActive = true;
		},

		closeUpdateChooseValue(self, chooseData) {
			this.updateLinkage(
				self,
				chooseData[0],
				1,
				chooseData[1],
				chooseData
			);
        },
        setChooseValuesex(chooseData) {
            this.sex = `${chooseData[0]}`;
            this.sexActive = true;
        }
	}
};
</script>
<style lang="scss" scoped>
    @import "../../../components/scss/pk-pwd.scss";
    .nav-center{
        z-index: 100;
    }
	.height100b {
		height: 100%;
	}
	.width100b {
		width: 100%;
	}
    .cent{
        // position: fixed;
        width: 100%;
    }
	.pk-borth {
		height: 100%;
		width: 100%;
		font-size: 0.4rem /* 30/75 */;
		line-height: 1.466667rem /* 110/75 */;
		padding: 0!important;
		padding-right: 0.5rem;
        text-decoration: none;
        background: none;
		span,
		label {
			font-size: 0.4rem /* 30/75 */;
		}
        /deep/ .nut-cell-box{
            z-index: 8;
            .nut-cell-left{
                min-width: 1.86667rem /* 140/75 */;
            }
        }
    }
    .pk-sex-active,
	.pk-borth-active,
	.pk-place-active {
		.show-value {
			color: #141414 !important;
		}
	}
	.bot {
        height: 0.8rem;
        line-height: 0.8rem;
		text-align: center;
        font-size: .346667rem;
        color:$label-color;
        background: #f9f9f9;
	}

	.about {
		.pk-form-content {
			.pk-input {
				position: relative;
				display: flex;
				// padding: 0 0.26667rem /* 20/75 */;
				height: 1.466667rem /* 110/75 */;
				justify-content: space-between;
				font-size: 0.426667rem /* 32/75 */;
				color: $about-color;
                align-items: center;
                z-index: 10;
				.icon-img {
					width: 1rem;
					height: 1rem;
				}
				&::after {
					content: " ";
					position: absolute;
					left: 0;
					bottom: 0;
					right: 0;
					// height: 0.01333rem /* 1/75 */;
					border-bottom: 0.01333rem solid $border-color;
					-webkit-transform-origin: 0 100%;
					transform-origin: 0 100%;
					-webkit-transform: scaleY(0.5);
                    transform: scaleY(0.5);
                    z-index: 99;
				}
				.pk-foricon {
					height: 100%;
					padding-right: 0.53333rem /* 40/75 */;
				}
				.el-input {
					width: 100%;
					position: relative;
					input {
                        font-size: 0.426667rem; /*32px*/
						width: 100%;
						height: 1.44rem /* 110/75 */;
						border: none;
						text-align: right;
                    }
                    input::-webkit-input-placeholder { /* WebKit browsers */
                        font-size:.426667rem;
                    }
                    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                        font-size:.426667rem;
                    }
					i {
						position: absolute;
						right: -0.4rem /* 35/75 */;
						width: 0.24rem /* 18/75 */;
						height: 0.426667rem /* 32/75 */;
                        top: 35.4%;
                        color:$label-color;
						img {
							width: 0.24rem /* 18/75 */;
							margin-top: -10px;
						}
					}
                }
                
			}
		}
	}
	.nut-cell .nut-cell-title,
	.nut-cell .nut-cell-right {
		font-size: 0.4rem;
	}
    /deep/.nut-cell .nut-cell-title{
        position: absolute;
        top: 17px;
    }
	.nut-cell .nut-cell-icon img {
		display: none;
	}
	.nut-button {
		height: 0.96rem /* 72/75 */;
		background: $primary-color;
		font-size: 0.34667rem /* 26/75 */;
	}
	.nut-button.circle {
		border-radius: 0.13333rem /* 10/75 */;
	}
	/deep/ .nut-cell .nut-cell-box {
		min-height: 1.22667rem /* 92/75 */;
		.nut-cell-right {
			.nut-cell-desc {
				.selected-option {
					.show-value {
						color: $placeholder-color;
					}
				}
			}
		}
	}
	/deep/ .nut-cell .nut-cell-icon img {
		margin-left: 6px;
	}
</style>
