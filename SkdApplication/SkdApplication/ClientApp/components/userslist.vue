<template>
	<v-layout >
		<v-flex offset-lg2 lg8 >
			<v-layout  column :key="user_group.group" v-for="user_group in users_list">

				<v-flex  >
					<h3>{{user_group.group}}</h3>
					<v-layout :key="userCom.USERID+userCom.EMAIL+userCom.P_FIO" v-for="userCom in user_group.users">
						<list-component :userCopmonent='userCom'> <!-- передаю "привязываю" пользовательскому компоненту  данные  -->
						</list-component>
					</v-layout>
				</v-flex>
			</v-layout>
		</v-flex>
	</v-layout>

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
				return this.$store.getters.getGroupedUserList;//getters из vuex папка (store/index.js)
			},
			user () {
				return this.$store.getters.getUser;//getters из vuex папка (store/index.js)
			}
		},
		created: function () {
		},
		beforeMount: function () {
			this.$store.dispatch('loadUsersList')
		},
		methods: {}
	}
</script>

<style>
	.search {
		background: #A5D6A7;
	}

</style>
