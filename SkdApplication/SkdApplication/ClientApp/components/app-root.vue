<template>
	<v-app id="app">
		<v-navigation-drawer v-if="authorized" app fixed v-model="drawer">
			<v-toolbar class="transparent" flat>
				<v-list class="pa-0">
					<v-list-tile avatar>
						<v-list-tile-avatar>
							<img :src="user.photo">
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title class="textname">{{user.P_FIO}}</v-list-tile-title>
						</v-list-tile-content>
						<v-btn flat icon v-on:click="logOut">
							<v-icon >exit_to_app</v-icon>
						</v-btn>
					</v-list-tile>
				</v-list>
			</v-toolbar>

			<v-list class="pt-0" dense>
				<v-divider></v-divider>

				<v-list-tile :key="item.key" @click="changeGrouping(item.key)" v-for="item in groupingItems">
					<v-list-tile-action>
						<v-icon v-if="item.selected">done</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ item.caption }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar app color="indigo" dark fixed>
			<v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="authorized"></v-toolbar-side-icon>
			<v-toolbar-title class="hidden-md-and-down">Посетители</v-toolbar-title>
			<v-tooltip bottom v-if="authorized">
				<v-btn color="white" flat icon slot="activator" v-on:click="changeSort">
					<v-icon v-if="(sort == 1)">av_timer</v-icon>
					<v-icon v-if="(sort == 0)">sort_by_alpha</v-icon>
				</v-btn>
				<span>Изменить сортировку</span>
			</v-tooltip>


			<v-text-field class="mx-3"
						  clearable
						  flat
						  hide-details
						  label="Поиск"
						  solo-inverted
						  v-if="authorized"
						  v-model="filter"
			></v-text-field>
			

		</v-toolbar>
		<v-content>
			<router-view></router-view>
		</v-content>
		<v-footer color="grey lighten-2" class="last-status" app inset>
			<template v-if="authorized">
				<span color="grey darken-3" class="status"><span class="on-state">По состоянию на</span> {{lastLoad}}</span>
				<span v-if="!onlineStatus" class="offline"> &nbsp; Нет соединения</span>
			</template>
    </v-footer>
	</v-app>
</template>


<script>

	const groups = ["Все", "В офисе", "В офисе с ключами", "Вне офиса", "По командам", "По комнатам"];
	export default {
		data: () => ({
			drawer: false
		}),
		methods: {
			logOut(){
				this.drawer = false;
				this.$store.commit("logOut")
				this.$router.push("login")
			},
			changeSort () {
				this.$store.commit("changeSort")
			},
			changeGrouping (value) {
				this.$store.commit("changeGrouping", value)
				if(this.$vuetify.breakpoint.mdAndDown){
					this.drawer=false;
				}
			}
		},
		computed: {
			sort () {
				return this.$store.state.sort
			},
			grouping () {
				return this.$store.state.grouping
			},
			groupingItems () {
				var that = this;
				return groups.map((el, ind) => ({key: ind, caption: el, selected: that.grouping == ind}))
			},
			authorized () {
				return this.$store.state.authorized
			},
			user () {
				return this.$store.getters.getUser
			}, //getters из vuex папка (store/index.js)
			filter: {
				get () {
					return this.$store.getters.filter
				},
				set (value) {
					this.$store.dispatch("setFilter", value)
				}
			},
			lastLoad(){
				return this.$store.getters.getTimeLastLoad;
			},
			onlineStatus(){
				return this.$store.getters.getOnlineStatus;
			}
		},
	}
</script>

<style>
	.unselected-grouping {
		visibility: hidden;
	}
	.status{
		color:#424242;
	}
	.on-state{
		color: #757575;
	}
	.last-status{
		background-color: gray !important;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
    	line-height: 1;
	}
	.online{
		color: green;
	}
	.offline{
		color: #F44336;
	}
</style>
