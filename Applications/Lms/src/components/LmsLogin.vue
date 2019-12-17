<template>
	<v-container fill-height fluid>
    <v-layout row justify-center>
      <v-flex xs12 sm8 md6>
        <v-card v-if="!message" class="elevation-12">
		       <v-toolbar dark color="primary">
		       	<v-toolbar-title>Вход в University</v-toolbar-title>
		       	<v-spacer></v-spacer>
		       </v-toolbar>
		       <v-card-text>
		       	<v-form
              ref="form"
              v-model="valid">
		       		<v-text-field
		       				prepend-icon="person"
		       				v-model="login"
                   :rules="loginRule"
		       				name="login"
		       				label="Логин"
		       				type="text"
		       				required>
		       		</v-text-field>
		       		<v-text-field
		       				prepend-icon="lock"
		       				v-model="password"
		       				name="password"
		       				label="Пароль"
                   :rules="passwordRule"
		       				id="password"
		       				type="password"
		       				required>
		       		</v-text-field>
              <v-layout row align-center ustify-space-between>
                <v-checkbox
                  v-model="checkbox_remember_me"
                  label="Запомнить меня"></v-checkbox>
                <div>
                  <a @click="goToRecoverPage">Забыли пароль?</a>
                  <v-btn
                     :disabled="!valid"
                     color="primary"
                    @click="signIn">Войти</v-btn>
                </div>
              </v-layout>
		       	</v-form>
		     	</v-card-text>
		     </v-card>

         <v-card v-if="message">
           <v-toolbar dark color="error">
		       	  <v-toolbar-title>Ошибка</v-toolbar-title>
           </v-toolbar>
		       <v-spacer></v-spacer>
           <v-card-text>
             <v-card-title>
               <h3>{{message}}</h3>
             </v-card-title>
           </v-card-text>
           <v-card-actions>
             <v-btn @click="clearError">Ok</v-btn>
           </v-card-actions>
         </v-card>
      </v-flex>
    </v-layout>

	</v-container>
</template>

<script>

export default {
  name: 'lms-login',
  data() {
    return {
      valid: true,
      login: '',
      password: '',
      checkbox_remember_me: false,
      loginRule: [ v => !!v || 'Введите логин!' ],
      passwordRule: [ v => !!v || 'Введите пароль!' ],
      message: '',

    }
  },
  methods: {
    signIn() {
      // Проверка полей
      debugger
      if (this.$refs.form.validate()) {
        var roteToBack = this.$route.params.routeToBack
        this.snackbar = true
        this.$authentication.logIn(this.login, this.password, this.checkbox_remember_me)
        .then(result => {
          if (result && result.tempPasword) {
            this.$router.replace({path: routeToBack})
          }
        })
        .catch((e) => {
          return (this.message = e || 'Ошибка авторизации')
        })
      }

    },
    goToRecoverPage() {
      debugger
      this.$authentication.GetRecoveryPasswordUrl()
      .then(res => {
        if (res.ALLOWED) {
          window.open(res.LINK, '_blank')
        }
      })
    },
    clearError() {
      this.message = null
    }
  }
}
</script>

<style>

</style>
