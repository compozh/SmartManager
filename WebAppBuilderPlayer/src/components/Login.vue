<template>
  <v-flex sm6 xs12 md6 lg4>
    <div class="login">
      <v-text-field
        v-model="userLoginPassword.login"
        label="Логин"
        required
        color="cyan"
        @keyup.enter="Login()"
      ></v-text-field>
      <v-text-field
        v-model="userLoginPassword.password"
        label="Пароль"
        required
        type="password"
        color="cyan"
        @keyup.enter="Login()"
      ></v-text-field>
      <div class="btn-and-checkbox">
        <v-checkbox
          v-model="userLoginPassword.rememberMe"
          :label="'Запомнить меня'"
          color="cyan"
        ></v-checkbox>
        <v-btn @click="Login()" color="cyan" dark>Войти</v-btn>
      </div>
      <div class="message">{{message}}</div>
    </div>
  </v-flex>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      userLoginPassword: {
        login: "",
        password: "",
        rememberMe: false
      },
      message: ""
    };
  },
  computed: {
    routeToBack() {
      return this.$route.params.routeToBack  ;
    }
  },
  methods: {
    Login() {
      if (this.userLoginPassword.login && this.userLoginPassword.password) {
        this.$store.dispatch("Login", this.userLoginPassword).then(result => {
          // Если авторизация прошла успешно, уходим со страницы логина
          if (result) {
            
            this.$router.replace({ path: this.routeToBack });
          }
        });
      } else if (!this.userLoginPassword.login) {
        this.message = "Вы не ввели логин";
      } else if (!this.userLoginPassword.password) {
        this.message = "Вы не ввели пароль";
      }
    }
  }
};
</script>
<style>
</style>
