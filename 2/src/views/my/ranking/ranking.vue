<template>
  <div class="ranking" ref="ranking">
    <nut-navbar class="pk-title" @on-click-back="back('my')" @on-click-more="back('index')">
      排行榜
      <a class="spans" slot="back-icon">
        <img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png" />
      </a>
      <a class="backIdex" slot="more-icon">
        <img class="imgsbank" src="../../../assets/img/my-icon/backIndex.png" />
      </a>
    </nut-navbar>

    <div class="rankingCont" v-cloak>
      <div class="rank_tab">
        <span :class="{active : cashType==1 }" @click="getRanking(1,1)">投注榜</span>
        <span :class="{active : cashType==2 }"  @click="getRanking(2,1)">中奖榜</span>
        <span  :class="{active : cashType==3 }" @click="getRanking(3,1)">返佣榜</span>
      </div>
      <div class="titImg">
        <img v-if="cashType==1" src="../../../assets/img/phb_tzphb.png" />
        <img v-if="cashType==2" src="../../../assets/img/phb_zjphb.png" alt="">
        <img v-if="cashType==3" src="../../../assets/img/phb_fyphb.png" alt="">
      </div>
      <div class="contTitle">
        <a class="titleOne" :class="{choice : dType==1 }" v-if="cashType != 3"  @click="getRanking(cashType,1)">日榜</a>
        <a class="titleTwo" :class="{choice : dType==2 }" v-if="cashType != 3" @click="getRanking(cashType,2)">月榜</a>
        <a class="titleThree" :class="{choice : dType==3 }" v-if="cashType != 3" @click="getRanking(cashType,3)">总榜</a>
        <span class="tetTitle" v-if="cashType ==3">推广返佣排行榜</span>
      </div>
      <div class="rankList" ref="rankRef">
        <table class="rankTable">
          <thead class="ranHead">
            <tr>
              <td class="tLeft">排名</td>
              <td class="tCent">玩家</td>
              <td v-if="cashType==1" class="tRight">投注金额</td>
              <td v-if="cashType==2" class="tRight">中奖金额</td>
              <td v-if="cashType==3" class="tRight">返佣金额</td>
            </tr>
          </thead>
          <tbody class="rankBody" v-if="success">
            <tr v-for="(item, index) in rankList" :key="index" >
              <td class="tLeft">{{item.sort}}</td>
              <td class="tCent" :class="{myCent:myInfo.sort==item.sort}">{{item.nickname}}</td>
              <td class="tRight">{{item.money}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="myRank" v-cloak v-if="myInfo.sort!=0">
        <table class="rankTable">
          <thead class="ranHead">
            <tr>
              <td class="tLeft">排名</td>
              <td class="tCent">玩家</td>
              <td v-if="cashType==1" class="tRight">投注金额</td>
              <td v-if="cashType==2" class="tRight">中奖金额</td>
              <td v-if="cashType==3" class="tRight">返佣金额</td>
            </tr>
          </thead>
          <tbody class="rankBody"  v-if="success">
            <tr>
              <td class="tLeft">{{myInfo.sort}}</td>
              <td class="tCent">{{myInfo.nickname}}</td>
              <td class="tRight">{{myInfo.money}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getRankingInfo } from "@/services/ranking.js";
export default {
  data() {
    return {
      cashType:1,
      dType:1,
      rankList:[],
      myInfo:[],
      success:false,
      myRankHeight:0,

      navH:0,
      clientHeight:'',  //获取页面高度
    }
  },
  
  mounted() {
    // this.hasHeight();
    this.getRanking(1,1);
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
      clientHeight: function () {
        this.changeFixed(this.clientHeight)
      },
  },
  updated(){
     this.getHeight();
      this.changeFixed(this.clientHeight);
  },
  methods: {
 getHeight(){
// 获取浏览器可视区域高度
      this.clientHeight =   `${document.documentElement.clientHeight}`          //document.body.clientWidth;
      //console.log(self.clientHeight);
      window.onresize = function temp() {
        this.clientHeight = `${document.documentElement.clientHeight}`;
      };
      let navH =document.getElementsByClassName('pk-title')[0].offsetHeight;
      let navT = document.getElementsByClassName('titImg')[0].offsetHeight;
      let contTitle = document.getElementsByClassName('contTitle')[0].offsetHeight;
      let rank_tab = document.getElementsByClassName('rank_tab')[0].offsetHeight;
     if(this.myInfo.sort!=0){
        this.myRankHeight = document.getElementsByClassName('myRank')[0].offsetHeight;
     }
      console.log(this.clientHeight,navH,navT,contTitle, 'height')
      this.clientHeight = this.clientHeight-navH-navT-contTitle-rank_tab-this.myRankHeight;
      console.log(this.clientHeight , 'this.clientHeight ')
      console.log(this.$refs.rankRef, 'rankRef')
    },

     changeFixed(clientHeight){                        //动态修改样式
        console.log(clientHeight);
        this.$refs.rankRef.style.height = clientHeight+'px';
        this.$refs.rankRef.style.paddingBottom = this.myRankHeight+'px';
      },
  

    // hasHeight() {
    //   this.$refs.ranking.style.height = window.innerHeight + "px";
    // },

    back(path) {
      this.$router.push({
        name: path
      });
    },

    getRanking(cashType,dType){
      this.cashType = cashType,
      this.dType = dType
      var data ={
        cashType:cashType,
        dType:dType
      }
       getRankingInfo(data).then(res => {
                    if (res.success) {
                      this.success = res.success;
                      this.rankList = res.data.data;
                      
                      this.myInfo = res.data.myInfo;
                      console.log(res, 'res')
                      console.log(this.rankList, 'this.rankList')
                      console.log(this.myInfo, 'this.myInfo')
                    } else {
                        this.$toast.fail(res.message, {
                            cover: true,
                            duration: 1500
                        });
                    }
                });

    }
  }
};
</script>

<style lang="scss" scoped>
.ranking {
  .rankingCont {
    background: url(../../../assets/img/phb_bj.png) #ff7060 no-repeat;
    background-position: 0 -1.7rem;
    background-size: 100%;
    .rank_tab {
      height: 1.173333rem;
      line-height: 1.173333rem;
      text-align: center;
      background: #151515;
      border: none;
      color: #ffffff;
      display: flex;
      span {
        display: block;
        flex: 1;
        width: 33%;
        font-size: 0.373333rem;
        position: relative;
      }
      .active {
        font-weight: bold;
      }
      .active:before {
        content: " ";
        position: absolute;
        width: 0.426667rem !important;
        height: 0.106667rem;
        background: #ffffff;
        border-radius: 0.053333rem;
        bottom: 0.2rem;
        left: 1.453333rem;
      }
    }
    .titImg {
      width:100%;
      height:5.466667rem;
      text-align: center;
      img {
         margin-top:4.266667rem;
        width:5.413333rem;
      }
    }
    .contTitle {
      position: relative;
      z-index: 10;
      margin: 0 auto;
      width: 9.146667rem;
      height: 1.173333rem;
      background: #ffffff;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.2);
      border-radius: 0.586667rem;
        text-align: center;
      a {
        position: absolute;
        display: block;
        line-height: 0.88rem;
        font-size: 0.373333rem;
        border-radius: 0.44rem;
        width: 1.6rem;
        height: 0.88rem;
        top: 0.146667rem;
      }
      .titleOne {
        left: 0.173333rem;
      }
      .titleTwo {
        left: 3.7rem;
      }
      .titleThree {
        right: 0.173333rem;
      }
      a.choice {
        background: #ff5500;
        color: #ffffff;
      }
      .tetTitle{
        line-height: 1.173333rem;
        font-size: .373333rem;
        color: #ff5500;
      }
    }
    .rankList {
      width: 8.213333rem;
      background: #ffffff;
      margin: 0 auto;
      // padding-bottom: 1.173333rem;
       overflow: scroll;
      position: relative;
      .rankTable {
        width: 7.373333rem;
        margin: 0 auto;
        td {
          line-height: 1.173333rem;
        }

        .ranHead {
          border-bottom: #d9d9d9 0.026667rem solid;
          .tLeft {
            width: 25%;
            text-align: left;
          }
          .tRight {
            width: 25%;
            text-align: right;
          }
          .tCent {
            width: 50%;
            text-align: center;
          }
          td {
            font-size: 0.32rem;
            font-weight: bold;
            line-height: 1.04rem;
          }
        }
        .rankBody {
          .tLeft {
            width: 25%;
            font-size: 0.4rem;
            color: #999999;
            text-align: left;
            position: relative;
          }
          .tCent {
            width: 50%;
            font-size: 0.32rem;
            color: #1a1a1a;
            text-align: center;
          }
          .myCent{
            color: #ff5500;
          }
          .tRight {
            width: 25%;
            text-align: right;
            font-size: 0.32rem;
            color: #ff7060;
          }
          tr:nth-child(1) .tLeft::before {
            content: " ";
            position: absolute;
            width: 0.48rem;
            height: 0.586667rem;
            background: url(../../../assets/img/phb_nb1.png) #ffffff 100% 100%
              no-repeat;
            background-size: 100%;
            top: 0.2rem;
            left: -0.13rem;
          }
          tr:nth-child(2) .tLeft::before {
            content: " ";
            position: absolute;
            width: 0.48rem;
            height: 0.586667rem;
            background: url(../../../assets/img/phb_nb2.png) #ffffff 100% 100%
              no-repeat;
            background-size: 100%;
            top: 0.2rem;
            left: -0.13rem;
          }
          tr:nth-child(3) .tLeft::before {
            content: " ";
            position: absolute;
            width: 0.48rem;
            height: 0.586667rem;
            background: url(../../../assets/img/phb_nb3.png) #ffffff 100% 100%
              no-repeat;
            background-size: 100%;
            top: 0.2rem;
            left: -0.13rem;
          }
        }
      }
    }
    .myRank {
      width: 8.2rem;
      border-top: #d9d9d9 0.026667rem solid;
      background: #ffffff;
      position: fixed;
      left: 50%;
      margin-left: -4.10666rem;
      bottom: 0;
      .rankTable {
        width: 7.373333rem;
        margin: 0 auto;
        td {
          line-height: 1.173333rem;
        }

        .ranHead {
          display: none;
          border-bottom: #d9d9d9 0.026667rem solid;
        }
        .rankBody {
          
          .tLeft {
            width: 25%;
            font-size: 0.4rem;
            color: #999999;
            text-align: left;
            position: relative;
          }
          .tCent {
            width: 50%;
            font-size: 0.32rem;
            color: #1a1a1a;
            text-align: center;
            color: #ff5500;
          }
          .tRight {
            width: 25%;
            text-align: right;
            font-size: 0.32rem;
            color: #ff7060;
          }
        }
      }
    }
  }
}
</style>