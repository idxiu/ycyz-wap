<template>
    <div class="pay-result">
        <nut-navbar class="pk-title" @on-click-back="$router.go(-1)" :rightShow="false">
            <a class="spans" slot="back-icon">
				<img class="imgsbank" src="../../assets/img/my-icon/fanhui.png"/>
			</a>
            线上存款
        </nut-navbar>

        <div class="content">
            <pay-return-result :fromType="2"></pay-return-result>
        </div>
        <Advcommon :itype="1" :typeId="2"></Advcommon>
    </div>
</template>
<script>
import Advcommon from '@/components/Advcommon'
import PayReturnResult from '@/components/PayReturnResult'
export default {
    name:'payResult',
    components:{
        PayReturnResult,
        Advcommon
    }
}
</script>
<style lang="scss" scoped>
</style>


