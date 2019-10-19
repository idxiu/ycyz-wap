<template>
	<div id="more">
		<div v-show="loading" class="skeleton vue-skeleton-loading">
			<div class="skeleton-bac-animation"></div>
			<column>
				<skeleton-square width="9rem" height="1rem" :count="9" margin="0.2rem 0.5rem"></skeleton-square>
			</column>
		</div>
		<nut-navbar class="pk-title" @on-click-back="$router.go(-1)" :rightShow="false">
			<a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../../assets/img/my-icon/fanhui.png" />
			</a>
			更多
		</nut-navbar>
		<div v-show="!loading" class="morebox">
			<img :src="list.logo" alt="">
		</div>
		<div v-show="!loading" class="moreBody">
			<ul>
				<div v-for="(infoList,index) in list.iword" :key="index">
					<li v-if="infoList.itype===1" @click="goLink1(infoList.url)">
						<div class="moretitle">{{infoList.title}}</div>
						<nut-icon type="right" color="#666" size="0.4rem"></nut-icon>
					</li>
					<li v-if="infoList.itype===2" @click="goLink2(infoList)">
						<div class="moretitle">{{infoList.title}}</div>
						<nut-icon type="right" color="#666" size="0.4rem"></nut-icon>
					</li>
					<li v-if="infoList.itype===3" @click="goLink3(infoList)">
						<div class="moretitle">{{infoList.title}}</div>
						<nut-icon type="right" color="#666" size="0.4rem"></nut-icon>
					</li>
					<li v-if="infoList.itype===4" @click="goLink4(infoList.url)">
						<div class="moretitle">{{infoList.title}}</div>
						<nut-icon type="right" color="#666" size="0.4rem"></nut-icon>
					</li>
				</div>
			</ul>
		</div>
	
	</div>
</template>

<script>
	import {
		getMorelists
	} from "../../../services/center.js";
	import {
		getContactus
	} from "@/services/center.js";
	import {
		checkUrl
	} from "@/services/commonfn.js";
	export default {
		name: "more",
		data() {
			return {
				loading: false,
				list: "",
				contactusUrl: ""
			};
		},
		mounted() {
			this.getlists();
			this.getContactuFunc();
		},
		methods: {
			goLink1(urlStr) {
				if (!urlStr) {
					this.$toast.fail("暂未开通此功能", {
						cover: true,
						duration: 2000
					});
					return;
				}
				let url = checkUrl(urlStr);
				if (url === "kefu") {
					window.open(this.contactusUrl);
				} else {
					this.$router.push({
						name: url
					});
				}
			},
			goLink2(item) {
				this.$router.push({
					name: "morelist",
					query: {
						id: item.id,
						position: item.position,
						title: item.title
					}
				});
			},
			goLink3(item) {
				this.$router.push({
					name: "morepage",
					query: {
						id: item.id,
						position: item.position
					}
				});
			},
			goLink4(urlStr) {
				if (!urlStr) {
					this.$toast.fail("暂未开通此功能", {
						cover: true,
						duration: 2000
					});
					return;
				}
				if (urlStr === "/member/discount") {
					let url = checkUrl(urlStr);
					this.$router.push({
						name: url
					});
				} else {
					window.open(urlStr);
				}
			},
			getlists() {
				this.loading = true;
				getMorelists().then(res => {
					if (res.success) {
						this.list = res.data;
						this.loading = false;
					} else {
						this.$toast.fail(res.message, {
							cover: true,
							duration: 1000
						});
					}
				});
			},
			getContactuFunc() {
				getContactus().then(res => {
					if (res.success) {
						let list = res.data;
						if (list.length >= 5) {
							list.map(item => {
								if (item.itype == 6) {
									this.contactusUrl = item.content;
								}
							});
						}
					} else {
						this.$toast.fail(res.message, {
							cover: true,
							duration: 1000
						});
					}
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	#more {
		.skeleton {
			background-color: $default-color;
		}
		.morebox {
			img {
				margin: 0.27rem 0 0;
				width: 100%;
				height: 4rem;
			}
		}
		.moreBody {
			margin-top: $tenrem * 2;
			background-color: $default-color;
			border-top: $onerem solid $border-color;
			border-bottom: $onerem solid $border-color;
			ul {
				padding-left: $fourtrem/2;
				li {
					position: relative;
					height: $fourtrem;
					line-height: $fourtrem;
					font-size: 0.373rem;
					color: $text-color;
					border-bottom: $onerem solid $border-color;
					a {
						display: block;
					}
					/deep/ .nut-icon {
						position: absolute;
						top: 0;
						right: 0.2rem;
						margin: 0.08rem;
					}
				}
				div:last-child {
					li {
						border: 0;
					}
				}
			}
		}
	}
</style>