<template>
    <div class="explain">
        <Header :title="'推广说明'" :showRight="true" :rooter="'-1'"></Header>
        <div class="hasbox"></div>
        <div class="content">
            <div class="banner-style">
                <img src="../../../assets/img/image-tgsm-banner.png" alt="">
            </div>
            <div class="explain-item">
                <h3>推广说明</h3>
                <div class="explain-item-text">通过分享推广，您可以获得下级会员投注和玩游戏之后的佣金返点，分享推广的会员越多，佣金越多！下级会员再次推广的下级会员，一样可以为您贡献佣金，无限级推广！可为下级会员设置彩票投注的返佣比例，合理分配，保证无限级模式的良性发展。
                </div>
            </div>
            <div class="explain-item">
                <h3>F&Q</h3>
                <div class="explain-item-text">
                    <ul>
                        <li>
                            <h5>·返佣比例怎么计算的?</h5>
                            <div class="explain-item-text-desc">
                                上级可以设置下级的彩票投注返佣比例，假设A推广了B，B推广了C，A的返佣比例是10%，A给B设置比例为6%，C投注后，B获得6%返佣，A获得（10% - 6%）即4%的返佣,其他五大类的返佣根据报表计算得出。
                            </div>
                        </li>
                        <li>
                            <h5>·彩票和其他五大类游戏返佣有区别吗?</h5>
                            <div class="explain-item-text-desc">彩票是根据下级会员的投注额进行返佣，不考虑实际胜负；其他五大类根据盈利情况进行一定比例的返佣。</div>
                        </li>
                        <li>
                            <h5>·返佣是实时到账吗？</h5>
                            <div class="explain-item-text-desc">彩票投注的返佣是实时到账的，报表盈利的返佣将等待一天。</div>
                        </li>
                        <li>
                            <h5>·返佣的金额能直接使用吗?</h5>
                            <div class="explain-item-text-desc">可以的，返佣的金额将保管在返佣钱包里，可以实时转换到系统余额里以供使用。
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="explain-item">
                <h3>温馨提示</h3>
                <div class="explain-item-text">建议为下级会员开设的返佣比例不要太低，发展空间才会更大哦~</div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: "generalizeLink",
  components: {
    Header
  },
  data() {
    return {};
  },

  methods: {}
};
</script>

<style scoped lang="less">
@import url("../../../components/less/common.less");
@import url("./Statis.less");
</style>