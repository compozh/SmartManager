<template>
	<v-container class="containerlogin" >
		<v-layout row wrap >
			<v-flex xs12 md6 lg4 offset-md3 offset-lg4>
				<v-text-field @keyup.13="SigIn" box color="deep-purple" label="Логин" v-model="datauser.login"></v-text-field>
			</v-flex>
			<v-flex xs12 md6 lg4 offset-md3 offset-lg4>
				<v-text-field @keyup.13="SigIn" type="password" box color="deep-purple" label="Пароль" v-model="datauser.password"></v-text-field>
			</v-flex>
			<v-flex xs12 md6 lg4 offset-md3 offset-lg4 row>
				<v-layout align-center justify-space-between>
					<v-btn color="success" v-on:click="SigIn">войти</v-btn>
					<v-spacer style="flex:100 !important" ></v-spacer>
					<v-switch v-model="datauser.rememberMe"  label="Запомнить меня"></v-switch>
				</v-layout>
			</v-flex>
		</v-layout>
	</v-container>

</template>

<script>

	export default {
		data () {
			return {
				datauser: {
					login: '',
					password: '',
					rememberMe:false
				}
			}
		},

		methods: {
			SigIn: function () {
				this.$store.dispatch('login', this.datauser).then(() => {
					this.$router.push('/');
				})

			},
		}
	}
</script>

<style scoped>

</style>

