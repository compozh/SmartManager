<template>
	<v-app id="app">
		<v-navigation-drawer fixed v-model="drawer" app>
			<v-toolbar class="transparent" flat>
				<v-list class="pa-0">
					<v-list-tile avatar>
						<v-list-tile-avatar>
							<img :src="user.photo">
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title class="textname">{{user.userName}}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-toolbar>

			<v-list class="pt-3" dense>
				<v-divider></v-divider>

				<v-list-tile :key="item.display" @click="" class="list" v-for="item in routes">
					<v-list-tile-action>

					</v-list-tile-action>
					<v-list-tile-content>
						<router-link :to="item.path" exact-active-class="active" tag="h1">
							<v-btn block flat>
								<v-list-tile-title class="texticon"> {{ item.display }}</v-list-tile-title>
							</v-btn>
						</router-link>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar color="indigo" dark fixed app>
			<v-toolbar-side-icon  @click.stop="drawer = !drawer" ></v-toolbar-side-icon>
			<v-toolbar-title>СКД - ItEnterprise</v-toolbar-title>
		</v-toolbar>
		<v-content>
			<router-view></router-view>
		</v-content>
		<v-footer color="indigo" app inset>
			<span class="white--text">&copy; 2017</span>
		</v-footer>
	</v-app>
</template>


<script>
	import NavMenu from './nav-menu'
	import {routes} from '../router/routes'

	export default {
		components: {
			'nav-menu': NavMenu
		},
		data: () => ({
			routes,
			drawer: false
		}),
		computed: {
			user () {return this.$store.getters.getUser } //getters из vuex папка (store/index.js)
		},
	}
</script>

<style>
</style>
