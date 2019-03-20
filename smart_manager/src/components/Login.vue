<template>
  <v-flex sm6 xs12 md6 lg4>
    <div class="login">
      <v-text-field
        v-model="userLoginPassword.login"
        label="Логин"
        required
        color="#008FFB"
        @keyup.enter="Login()"
      ></v-text-field>
      <v-text-field
        v-model="userLoginPassword.password"
        label="Пароль"
        required
        type="password"
        color="#008FFB"
        @keyup.enter="Login()"
      ></v-text-field>
      <div class="btn-and-checkbox">
        <v-checkbox
          v-model="userLoginPassword.rememberMe"
          :label="'Запомнить меня'"
          color="#008FFB"
        ></v-checkbox>
        <v-btn @click="Login()" color="#008FFB">Войти</v-btn>
      </div>
      <div class="message">{{message}}</div>
    </div>
  </v-flex>
</template>
<script>
export default {
  data() {
    return {
      userLoginPassword: {
        login: "baharev@it-enterprise.com",
        password: "tacek3121412",
        rememberMe: false
      },
      message: ""
    };
  },
  methods: {
    Login() {
      if (this.userLoginPassword.login && this.userLoginPassword.password) {
        this.$store.dispatch("Login", this.userLoginPassword);
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
