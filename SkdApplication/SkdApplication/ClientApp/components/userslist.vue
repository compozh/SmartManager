<template>
	<v-layout >
		<v-flex offset-lg2 lg8 v-if="!loaded">
			<v-container align-center fill-height justify-center pt-5>
					<v-progress-circular
						:size="120"
						:width="3"
						color="indigo"
						indeterminate
					></v-progress-circular>
			</v-container>
		</v-flex>
		<v-flex offset-lg2 lg8  v-if="loaded">
			<template   v-for="user_group in users_list">

				<h3>{{user_group.group}}</h3>
				<v-layout :key="userCom.USERID+userCom.EMAIL+userCom.P_FIO" v-for="userCom in user_group.users">
					<list-component :userCopmonent='userCom'> <!-- передаю "привязываю" пользовательскому компоненту  данные  -->
					</list-component>
				</v-layout>

			</template>
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
			return {
				show   : false, // display content after API request
				offset : 5,     // items to display after scroll
				display: 5,     // initial items
				trigger: 300,   // how far from the bottom to trigger infinite scroll
				items  : [],    // server response data
				end    : false, // no more resources
			}
		},
		computed: {
			loaded(){
				return this.$store.getters.loaded;
			},
			sliced() {
				return this.users_list.slice(0, this.display);
			},
			users_list () {
				return this.$store.getters.getGroupedUserList;//getters из vuex папка (store/index.js)
			},
			user () {
				return this.$store.getters.getUser;//getters из vuex папка (store/index.js)
			}
		},
		// created: function () {
		// },
		created: function () {
			this.$store.dispatch('loadUsersList')
		},
		mounted() {
			// track scroll event
			this.scroll();
		},
		methods: {
			scroll() {
				window.onscroll = ev => {
					if (
						window.innerHeight + window.scrollY >=
						(document.body.offsetHeight - this.trigger)
					) {
						if (this.display < this.items.length) {
							this.display = this.display + this.offset;
						}
						else {
							this.end = true;
						}
					}
				};
			},
		}
	}
</script>

<style>
	.search {
		background: #A5D6A7;
	}

</style>
