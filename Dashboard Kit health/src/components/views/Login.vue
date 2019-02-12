<template>
<v-flex sm6  xs12 md6  lg4 >
           
            <v-text-field
              v-model="userLoginPassword.login"
              label="Логин"
              required
            ></v-text-field>

            <v-text-field
              v-model="userLoginPassword.password"
              label="Пароль"
              required
              type="password"
            ></v-text-field>
            <v-btn @click="Login(userLoginPassword.login, userLoginPassword.password)" color="green">Войти</v-btn>
          </v-flex>
</template>

<script>
export default {
        data(){
            return{
                userLoginPassword:{
                    login:'baharev@it-enterprise.com',
                    password:'tacek3121412',
                },
            }
        },
    methods: {
        Login(login,password){
            this.$store.dispatch('Login',this.userLoginPassword);
        }
   }
}
</script>

<style>

</style>
