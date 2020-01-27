<template>
	<v-container fill-height fluid>
    <v-layout row justify-center>
      <v-flex xs12 sm6 md4>
        <v-card v-if="!message" class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Вход</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                  prepend-icon="person"
                  v-model="login"
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
                  id="password"
                  type="password"
                  required>
              </v-text-field>

              <v-layout row align-center justify-space-between>
                <v-layout row align-center>
                  <v-checkbox style="margin-left:28px"
                    v-model="checkbox_remember_me"
                    label="Запомнить меня"></v-checkbox>
                </v-layout>
                <div>
                  <a @click="goToRecoverPage">Забыли пароль?</a>
                </div>
              </v-layout>

              <v-layout align-center justify-end fill-height>
                <v-btn
                     color="primary"
                    @click="signIn">Войти</v-btn>
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
           <v-layout align-center justify-end fill-height>
            <v-card-actions>
             <v-btn @click="clearError">Ok</v-btn>
           </v-card-actions>
           </v-layout>
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
      login: '',
      password: '',
      checkbox_remember_me: false,
      message: ''
    }
  },
  created() {

  },
  methods: {
    async signIn() {
      if (!this.login) {
        this.message = 'Введите логин!'
        return
      }
      if (!this.password) {
        this.message = 'Введите пароль!'
        return
      }
      const payload = {
        login: this.login,
        password: this.password,
        remember: this.checkbox_remember_me
      }
      await this.$store.dispatch('lms/login', payload)
    },
    goToRecoverPage() {
      console.log('Функционал не реализован')
    },
    clearError() {
      this.message = null
    }
  }
}
</script>

<style>

</style>
