<template>
	<div>
		<div>
			<the-navbar class="the-navbar" v-if="user"></the-navbar>
			<!-- <div :class="user ? 'container': ''"> -->
			<div>
				<!-- ЗОНА КОНТЕНТА -->
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>
<script>
import TheNavbar from './components/TheNavbar'

export default {
  components: {
    TheNavbar
  },
  computed: {
    user() {
      if (this.$route.path === '/login') {
        return false
      }
      return true
    }
  },
}
</script>
<style scoped>
.container{
	width: 100%;
	height: 100%;
}
</style>