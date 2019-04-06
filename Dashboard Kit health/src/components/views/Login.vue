<template>
<v-flex sm6  xs12 md6  lg4 >
           <div class="login" v-if="!blockedWindow">
                <v-text-field
                    v-model="userLoginPassword.login"
                    label="Логин"
                    required
                    color="#008FFB"
                ></v-text-field>

                <v-text-field
                    v-model="userLoginPassword.password"
                    label="Пароль"
                    required
                    type="password"
                    color="#008FFB"
                ></v-text-field>
                <div class="btn-and-checkbox">
                    <v-checkbox
                    v-model="userLoginPassword.rememberMe"
                    :label="'Запомнить меня'"
                    color="#008FFB"
                ></v-checkbox>
                <v-btn  @click="Login()"  color="#008FFB">Войти</v-btn>
            
                </div>
                <div class="message">
                    {{message}}
                </div>
            </div>
                <Spinner name="ball-spin-fade-loader" color="#008ffb" v-if="preLoading" class="preloader"/>
                <div v-if="blockedWindow" class="blocked-window"></div>
          </v-flex>
          
</template>

<script>
export default {
        data(){
            return{
                userLoginPassword:{
                    login:'',
                    password:'',
                    rememberMe:false
                },
                message:''
            }
        },
    methods: {
        Login(){
            if(this.userLoginPassword.login && this.userLoginPassword.password){
            }else if(!this.userLoginPassword.login){
                this.message='Вы не ввели логин'
                return;
            }else if(!this.userLoginPassword.password){
                this.message='Вы не ввели пароль'
                return;
            }
            this.$store.dispatch('Login',this.userLoginPassword);
        }
   },
   computed:{
        preLoading(){
            return this.$store.getters.getPreLoading;
        },
        blockedWindow(){
            return this.$store.getters.getBlockedwindow
        }
   }
}
</script>

<style>
 .blocked-window{
     position: fixed;
     left: 0;
     right: 0;
     bottom: 0;
     background: rgba(52,144,254,0.1);
     height: 100%;
   }
.login{
    margin-top: 20px; 
    background: white;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14); 
}
.btn-and-checkbox{
    display: flex;
}
.preloader{
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
  }
  .message{
      text-align: center;
      width: 200px;
      color: #f55a4e;
      position: absolute;
      left: calc(50% - 100px);
      top: 50%;
  }
</style>
