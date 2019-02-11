<template>

	<v-flex lg8 offset-lg2>
		<v-flex md3 sm6 xl12>
			<!-- <icon :icon="['fa', 'search']"/> -->
			<v-text-field color="success" label="Поиск">
			</v-text-field>
		</v-flex>
		<v-layout :key="userCom.USERID" v-for="userCom in users_list">
			<list-component :userCopmonent='userCom'> <!-- передаю "привязываю" пользовательскому компоненту  данные  -->
			</list-component>
		</v-layout>
	</v-flex>
</template>

<script>

	import LicstComponent from "./listcomponent"
	// import lodash from "lodash"
	export default {
		components: {
			'list-component': LicstComponent // объявляю пользовательский компонент
		},
		data () {
			return {}
		},
		computed: {
			users_list () {
				return this.$store.getters.getUsersList;//getters из vuex папка (store/index.js)
			},
			user () {
				return this.$store.getters.getUser;//getters из vuex папка (store/index.js)
			}
		},
		created: function () {
		},
		beforeMount: function () {
			this.$store.dispatch('loadUsersList')
			// //подробно разобрать beforeMount !!!!!!!!!!!!!!!!!!!!!!!!
			// if(this.user=='wrong' || this.user==''){ // после рефреш появляется проблема с тем что, приходиться логинется, хотя состояние должно сохраниться
			//    this.$router.push('login')
			// }
		},
		methods: {}
	}
</script>

<style>
	.search {
		background: #A5D6A7;
	}

</style>
