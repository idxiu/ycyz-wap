<template>
	<div class="noinfo">
		<div class="advBox">
			<div v-if="haveHot" class="adv-top">
				<div class="game-title">热门推荐</div>
				<div class="advScroll">
					<ul class="clearfix">
						<li @click="gameInto(item)" v-for="(item,index) in gamelist" :key="index">
							<div class="game-pic"><img v-lazy="cdnUrl+item.iconUrl"/></div>
							<div class="game-text">
								<div class="top">{{item.productName}}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="adv-bottom" v-show="isAdv">
				<swiper :options="swiperOption" ref="mySwiper">
					<swiper-slide v-for="(item, index) in swiperSlides" :key="index">
						<img :src="item.advImg" alt="">
					</swiper-slide>
				</swiper>
				<span class="close" @click="closeadv">关闭</span>
			</div>
		</div>
	</div>
</template>

<script>
    import {getAdvGames, gameInto, getAdvStatis, getHotGames} from '@/api/index'
    import 'swiper/dist/css/swiper.css'
    import {
        swiper,
        swiperSlide
    } from 'vue-awesome-swiper'

    export default {
        components: {
            swiper,
            swiperSlide
        },
        name: "Advertisement",
        props: ['advType', 'typeId'],
        data () {
            return {
                cdnUrl: '',
                haveHot: false,
                isAdv: true,
                gamelist: [],
                swiperOption: {
                    autoplay: 3000,
                    loop: true,
                    initialSlide: 1,
                    autoplayDisableOnInteraction: false,
                    notNextTick: true,
                    spaceBetween: '5%',
                },
                swiperSlides: [],
            }
        },
        computed: {
            Swiper () {
                return this.$refs.mySwiper.swiper
            }
        },
        mounted () {
            this.getHotGame();
            this.Swiper.on('click', (swiper) =>{
                let item = this.swiperSlides[swiper.realIndex];
                console.log(item);
                getAdvStatis(item.title, item.id, 1, item.advUrl).then(res => {
                    if (item.isLink == 1) {//外链
                        if (item.advUrl) {
                            if (item.advUrl.indexOf("://") != -1) {
                                window.open(item.advUrl);
                            } else {
                                window.open("http://" + item.advUrl);
                            }
                        }
                    } else {//内链
                        if (item.advUrl) {
                            this.$router.push({name: item.advUrl});
                        }
                    }
                });
			})
        },
        methods: {
            closeadv: function () {
                this.isAdv = !this.isAdv;
            },
            getHotGame () {
                // 广告类型 -1首页广告 -2存款成功 -3取款成功
                getAdvGames(this.advType, this.typeId).then((res) => {
                    this.swiperSlides = res.data;
                    this.isAdv = this.swiperSlides.length > 0;
                    if (this.swiperSlides.length <= 1) {
                        this.swiperOption.loop = false;
                        this.Swiper.stopAutoplay();
                    } else {
                        this.Swiper.startAutoplay();
                    }
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                })
                getHotGames(this.advType).then((res) => {
                    if(res.hotGame.length != 0){
                        this.haveHot = true;
                        this.cdnUrl = res.cdn + '/';
                        this.gamelist = res.hotGame;
                    }
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
                })
            },
            gameInto (item) {
                gameInto(item.platformName, item.platformId).then((res) => {
                    window.open(res.loginUrl, '_blank', 'toolbar=yes, width=1300, height=900')
                }).catch(err => {
                    this.$toast({
                        message: err,
                        duration: 2000
                    });
				})
            },

        }
    }
</script>

<style lang="less" scoped>
	@import url("../components/less/common.less");
    .noinfo {
        .advBox {
            width: 100%;
            .adv-top {
                .game-title {
                    padding-left: 0.4rem;
                    font-size: 0.43rem;
                    font-weight: bold;
                    text-align: left;
                    color: @color-w;
                }
                .advScroll{
                    width: 100%;
                    height: auto;
                    white-space: nowrap;
                    overflow: hidden;
                    overflow-x: scroll; /* 1 */
                    -webkit-backface-visibility: hidden;
                    -webkit-overflow-scrolling: touch; /* 2 */
                    text-align: justify; /* 3 */
                    &::-webkit-scrollbar {
                        display: none;
                    }
                    ul {
                        li {
                            display: inline-block;
                            margin: 0.27rem 0 0.4rem;
                            width: 1.89rem;
                            text-align: center;
                            font-size: 0.32rem;
                            .game-pic {
                                margin: 0 auto;
                                width: 1.63rem;
                                height: 1.63rem;
                                border-radius: 50%;
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .game-text {
                                margin-top: 0.25rem;
                                .top {
                                    color: @color-primary;
                                }
                                .bottom {
                                    margin-top: 0.13rem;
                                    color: @color-w;
                                }
                            }
                        }
                    }
                }
            }
            .adv-bottom {
                position: relative;
                height: 3.2rem;
                width: 100%;
                .swiper-container,img{
                    width: 100%;
                    height: 100%;
                }
                .close {
                    z-index: 999;
                    position: absolute;
                    top: 0.27rem;
                    right: 0.4rem;
                    display: block;
                    width: 1.07rem;
                    height: 0.64rem;
                    line-height: 0.64rem;
                    text-align: center;
                    font-size: 0.32rem;
                    color: @color-default;
                    background-color: @color-N;
                    border-radius: 0.13rem;
                    opacity: 0.6;
                }
            }
        }
    }
</style>
