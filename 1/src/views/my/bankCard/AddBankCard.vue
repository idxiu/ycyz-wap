<template>
    <div id="addBankcard">
        <F-header title="添加银行卡" rooter="-1" :hasNoBack="true" :isShowHome="false"></F-header>
        <mt-popup :closeOnClickModal="true" :position="'bottom'" v-model="popupVisible" style="width: 100%;z-index: 2003;">
            <div class="popup-title pk-1px-b">
                <span @click="cancel()">取消</span>
                <span></span>
                <span @click="sure()">确定</span>
            </div>
            <mt-picker ref="picker" value-key="title" :itemHeight="itemHeight" :slots="mainType" @change="onValuesChange"></mt-picker>
        </mt-popup>
        <div class="hasbox"></div>
        <div class="gray"></div>
    
        <div class="content">
            <div class="pk-input pk-inputpro ">
                <label class="title muster fs-14">开户人</label>
                <div class="input fs-12 input_pro">
                    <input name="bankUser" class="relative" autocomplete="off" v-model="bankAdd.username" v-validate="'required|min:1|max:20'" :class="{'input': true, 'is-danger': errors.has('bankUser') }" type="text" placeholder="请输入银行卡开户姓名" :readonly="hasUserName">
    
                    <i type="clear" v-show="errors.has('bankUser')" class="fs-15 iconfont icon-czsb tj"></i>
                </div>
            </div>
            <div class="pk-input pk-inputpro ">
                <label class="title muster fs-14">开户银行</label>
                <div class="input fs-12 input_pro">
                    <input @click="popupVisible = true" v-model="chooseMain" readonly type="text" placeholder="请选择银行" v-validate="'required'">
                    <i class="fs-15 iconfont icon-jt-y tj color-84"></i>
                </div>
            </div>
    
            <div class="pk-input pk-inputpro ">
                <label class="title fs-14 muster">开户行地址</label>
                <div class="input fs-12 input_pro inputs">
                    <input type="text" @click="popupVisibles = true" name="localhost" autocomplete="off" readonly v-model="bankAdd.borthplaces" v-validate="'required|max:50|min:1'" :class="{'input': true, 'is-danger': errors.has('localhost') }" placeholder="请完善信息">
                    <i type="clear" v-show="errors.has('localhost')" class="fs-15 iconfont icon-login-error tj"></i>
                </div>
            </div>
    
            <div class="pk-input pk-inputpro">
                <label class="title muster fs-14">银行卡号</label>
                <div class="input fs-12 input_pro ">
                    <input name="bankId" class="relative" autocomplete="off" v-model="bankAdd.card" v-validate="'required|bankcard|max:19|min:16'" :class="{'input': true, 'is-danger': errors.has('bankId') }" type="text" placeholder="请输入银行卡卡号">
                    <i type="clear" v-show="errors.has('bankId')" class="fs-15 iconfont icon-czsb tj"></i>
                </div>
            </div>
            <div class="pk-input pk-inputpro ">
                <label class="title muster fs-14">开户行网点</label>
                <div class="input fs-12 input_pro no-bod-bot">
                    <input type="text" class="relative" name="bankLocal" autocomplete="off" v-model="bankAdd.subbranch" v-validate="'required|max:20|min:1'" :class="{'input': true, 'is-danger': errors.has('密码') }" placeholder="请输入银行卡开户网点">
                    <i type="clear" v-show="errors.has('bankLocal')" class="fs-15 iconfont icon-czsb tj"></i>
                </div>
            </div>
    
    
    
    
        </div>
        <div class="else pdl30">
            <div class="divs">
                <p v-show="errors.has('bankUser')&&!vali" class="errs help fds-12 is-danger">{{ errors.first('bankUser') }}</p>
                <p v-show="errors.has('bankLocal')&&!vali&&!errors.has('bankUser')" class="errs help fds-12 is-danger">{{ errors.first('bankLocal') }}</p>
                <p v-show="errors.has('bankId')&&!vali&&!errors.has('bankUser')&&!errors.has('bankLocal')" class="errs help fds-12 is-danger">{{ errors.first('bankId') }}</p>
                <p v-show="errors.has('localhost') && !errors.has('bankId')&&!vali&&!errors.has('bankUser')&&!errors.has('bankLocal')" class="errs help fds-12 is-danger">{{ errors.first('localhost') }}</p>
    
            </div>
            <div class="btn">
                <mt-button class="btn-green" type="default" @click="validateBeforeSubmit">确认</mt-button>
            </div>
        </div>
        <mt-popup :closeOnClickModal="true" :position="'bottom'" v-model="popupVisibles" style="width: 100%;z-index: 2003;">
            <div class="popup-title pk-1px-b">
                <span @click="cancels()">取消</span>
                <span></span>
                <span @click="sures()">确定</span>
            </div>
            <picker :slots="myAddressSlotspro" :itemHeight="itemHeight" @change="onMyAddressChanges"></picker>
        </mt-popup>
    </div>
</template>


<script>
    import FHeader from "../../../components/Header";
    import worldaddress from "../../../components/json/world.json";
    import cList from "../../../components/json/worldjson.js";
    import {
        Button,
        Picker
    } from "mint-ui";
    import {
        getUserName,
        hasBankMsg,
        addMemberBank
    } from "@/api/bankCard";
    
    export default {
        data() {
            return {
                popupVisible: false,
                popupVisibles: false,
                itemHeight: 36,
                chooseMain: "",
                rooter: "/bankCard",
                name: "",
                password: "",
                repassword: "",
                email: "",
                code: "",
                bankList: [],
                bankObj: {},
                vali: false,
                bankAdd: {
                    bankId: "",
                    card: "",
                    subbranch: "",
                    username: "",
                    borthplaces: ""
                },
                hasUserName: "",
                borthplaces: "",
                jsonList: [],
                myAddressSlotspro: [{
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
                country: "",
                province: "",
                city: "",
                member: {
                    country: "",
                    province: "",
                    city: ""
                }
            };
        },
        computed: {
            mainType() {
                let dateSlots = [{
                    flex: 1,
                    values: this.bankList,
                    defaultIndex: 0,
                    className: "mainType",
                    textAlign: "center"
                }];
                return dateSlots;
            }
        },
        created() {
            this.myAddressSlotspro[0].values = Object.keys(cList);
            this.itemHeight = parseInt(this.HTML_FONT_SIZE * 1.06667);
            this.hasBankMsg();
            this.getUserName();
            this.setPro();
        },
        mounted() {},
        methods: {
            setPro() {
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
                                    worldaddress.Earth.Country[indexs].Station[provinceIndex].City;
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
            },
            getUserName() {
                getUserName()
                    .then(res => {
                        if (res.username) {
                            this.hasUserName = true;
                            this.bankAdd.username = res.username;
                        } else {
                            this.hasUserName = false;
                        }
                    })
                    .catch(err => {
                        this.$toast({
                            message: err,
                            duration: 2000
                        });
                    });
            },
            hasBankMsg() {
                var _this_ = this;
                hasBankMsg().then(res => {
                    // console.log(res);
                    _this_.bankList = res.bankCardDrop;
                    _this_.chooseMain = _this_.bankList[0].title;
                    _this_.bankAdd.bankId = _this_.bankList[0].id;
                });
            },
            //选择器
            onValuesChange(picker, values) {
                this.chooseMainVal = values[0];
            },
            cancel() {
                this.popupVisible = false;
                this.chooseMain = "";
            },
            sure() {
                this.chooseMain = this.chooseMainVal.title;
                this.bankObj = this.chooseMainVal;
                this.bankAdd.bankId = this.bankObj.id;
                this.popupVisible = false;
            },
    
            validateBeforeSubmit() {
                var _this = this;
                this.$validator.validateAll().then(result => {
                    if (result) {
                        let bankAdd = this.bankAdd;
                        var address = this.bankAdd.borthplaces.split("-");
                        var pro = "",
                            city = "";
                        if (address.length > 2) {
                            pro = address[0] +'-'+ address[1];
                            city = address[2];
                        } else if (address.length > 1) {
                            pro = address[0]+'-'+ address[1];
                            city = "";
                        } else {
                            pro = address[0];
                            city = "";
                        }
                        addMemberBank(
                                bankAdd.bankId,
                                bankAdd.card,
                                bankAdd.username,
                                bankAdd.subbranch,
                                pro,
                                city
                            )
                            .then(res => {
                                _this.$toast("添加银行卡成功");
                                _this.$router.push({
                                    name: "bankCard"
                                });
                            })
                            .catch(err => {
                                this.$toast({
                                    message: err,
                                    duration: 2000
                                });
                            });
                    }
                    // _this.$toast("添加银行卡失败");
                });
            },
            //所在地
            onMyAddressChanges(picker, values) {
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
            cancels() {
                this.popupVisibles = false;
                //   this.borthplaces = "";
            },
            sures() {
                this.popupVisibles = false;
                this.bankAdd.borthplaces = this.proxMsg;
                console.log(this.bankAdd.borthplaces, "---------");
                //   console.log(this.country,this.province,this.city)
            }
        },
    
        components: {
            FHeader,
            Button,
            Picker
        }
    };
</script>



<style lang="less" scoped>
    @import url("../../../components/less/common.less");
    @import url("../about/index.less");
    .errs {
        color: @color-a !important;
        text-align: center;
    }
    
    .else {
        background: @color-Q !important;
    }
    
    .content {
        padding-left: 0.37333rem/* 28/75 */
        !important;
        max-width: 100%;
        overflow: hidden;
    }
    
    .gray {
        width: 100%;
        height: 0.26667rem/* 20/75 */
        ;
        background-color: @color-Q;
    }
    
    .hasbox {
        width: 100%;
        height: 1.22667rem !important/* 92/75 */
        ;
    }
    
    #addBankcard {
        background: #fff;
    }
    
    .contentf {
        padding-left: 0.37333rem/* 28/75 */
        ;
    }
    
    .haserror {
        width: 100%;
        height: 0.30667rem/* 23/75 */
        ;
        font-size: 0.32rem/* 24/75 */
        ;
        color: @color-a;
        padding-left: 0.4rem/* 30/75 */
        ;
        margin-top: 0.4rem/* 30/75 */
        ;
    }
    
    //input
    .pk-inputpro {
        margin-bottom: 0;
        border-bottom: 0.01333rem solid @color-O !important;
        .title {
            padding-left: 0.37333rem/* 28/75 */
            ;
            color: @color-C;
            margin-left: -0.13333rem/* 10/75 */
            ;
        }
        .input {
            input {
                font-size: 0.37333rem/* 28/75 */
                ;
                color: @color-J;
                padding-left: 52%;
            }
        }
        .muster::before {
            content: "*";
            position: absolute;
            left: 0.17333rem/* 13/75 */
            ;
            top: 50%;
            -webkit-transform: translate(0, -50%);
            transform: translate(0, -50%);
            color: @color-a;
        }
    }
    
    .input_pro {
        background: @color-default !important;
        border-bottom: 0.01333rem solid @color-O !important;
    }
    
    .no-bod-bot {
        border-bottom: none !important;
    }
    
    .pk-inputpro .input input {
        padding-left: 40%;
        margin-left: 3%;
        text-align: right !important;
        font-size: 0.37333rem/* 28/75 */
        ;
        color: @color-J;
    }
    
    .tj {
        right: 0.13333rem/* 10/75 */
        ;
    }
</style>
