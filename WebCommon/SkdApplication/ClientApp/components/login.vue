<template>
	<v-container class="containerlogin" grid-list-md text-xs-center>
		<v-layout row wrap>
			<v-flex offset-xs4 xs4>

					<v-text-field
						box
						color="deep-purple"
						label="Email address"
						type="email"
						v-model="datauser.login"
						v:rules="[rules.email]">
					</v-text-field>
			</v-flex>
			<v-flex offset-xs4 xs4>
					<v-text-field :type="show_password" box
								  color="deep-purple" counter="20" label="Password" style="max-height: 60px;"
								  v-model="datauser.password"
								  v:rules="[rules.password, rules.length(6)]">
					</v-text-field>
			</v-flex>
			<v-flex offset-xs4 xs4>
				<v-flex xs4></v-flex>
				<v-btn color="success" v-on:click="SigIn">login</v-btn>
				<v-btn color="primary">forgot</v-btn>
			</v-flex>
			<v-flex offset-xs4 xs4>
				<v-flex xs4></v-flex>
				<h1 class="inspection">{{inspection}}</h1>
			</v-flex>
		</v-layout>
	</v-container>
	<!-- <router-link to="/users"><v-btn :click="SigIn"> go to users</v-btn></router-link> -->
</template>

<script>

	import Axios from "axios"

	// import {mapGetters, mapActions} from 'vuex'
	export default {
		data () {
			return {
				datauser: {
					login: '',
					password: '',
				},
				inspection: "",
				show_password: "password",
				choice: false,
			}
		},
		computed: {
			user () {
				return this.$store.getters.getUser;//getters из vuex папка (store/index.js)
			},
			users_list () {
				return this.$store.getters.getUsersList;//getters из vuex папка (store/index.js)
			}
		},
		watch: {
			user: function () {
				if (this.user.success == true) {
					if (this.users_list == '') {//если список пользователей пуст то загружаем
						this.$store.dispatch('loginsList')//загружаем фейсы(пользователей) через Action(actionLoadUsersList)---> (store/index.js)
						this.$router.push('/')
					} else {//иначе просто переходим
						this.$router.push('/')
					}
					console.log('true')

				} else if (this.user == "wrong") {
					this.inspection = "не правильный логин или пароль"
					console.log('false')
				}
			},
			choice: function () {
				if (!this.choice)
					this.show_password = 'password'
				else
					this.show_password = ''
			}
		},
		methods: {
			// ...mapActions(['login']) , а это другйо способ как пользвоатсья экшинами
			SigIn: function () {
				this.$store.dispatch('login', this.datauser).then(() => {
					this.$router.push('/');
				})  //загружаем фейсы(пользователей) через Action(login)---> (store/index.js)
				// this.login(this.datauser);
			},
		}
	}
</script>

<style scoped>

</style>

