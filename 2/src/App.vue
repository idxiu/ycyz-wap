<template>
	<div id="app" class="defalut">
		<router-view v-if="isRouterAlive"/>
	</div>
</template>
<script>
export default {
  name: "app",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>
<style lang='scss'>
@import url("./assets/fonts/iconfont.css");
@import url("./components/scss/common.scss");

</style>
