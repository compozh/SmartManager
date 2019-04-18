<template>
  <v-flex sm6 xs12 md6 lg4>
    <div class="login">
      <v-text-field
        v-model="userLoginPassword.login"
        :label="$t('login')"
        required
        color="cyan"
        @keyup.enter="Login()"
      ></v-text-field>
      <v-text-field
        v-model="userLoginPassword.password"
        :label="$t('password')"
        required
        type="password"
        color="cyan"
        @keyup.enter="Login()"
      ></v-text-field>
      <div class="btn-and-checkbox">
        <v-checkbox
          v-model="userLoginPassword.rememberMe"
          :label="$t('rememberMe')"
          color="cyan"
        ></v-checkbox>
        <v-btn @click="Login()" color="cyan" dark v-text="$t('signIn')"/>
      </div>
      <div class="message">
        <p v-if="message == '1'">{{$t('emptyLogin')}}</p>
        <p v-if="message == '2'">{{$t('emptyPassword')}}</p>
      </div>
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
      message: "0"
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
        this.message = "1";
      } else if (!this.userLoginPassword.password) {
        this.message = "2";
      }emptyPassword
    }
  }
};
</script>
<style>
</style>
