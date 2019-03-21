<template>
  <v-content>
    <v-toolbar scroll-off-screen fixed dark :color="errorStatus ? 'none-error' :'none-error'">
      <v-toolbar-title class="white--text">
        <!-- <v-btn icon @click="Back" v-if="back !=0" title="Назад">
          <v-icon >keyboard_backspace</v-icon>
        </v-btn> -->
       <div @click="ShowDatePicker()" class="title"> {{header}} {{$store.getters.getCurentDate}} <i v-if="loginStatus" class="material-icons calendar" @click="Callcalendar" title="Сменить дату">
        date_range
      </i></div>
        <!-- <i class="material-icons" >exit_to_app</i> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- class="exit" -->
      <!-- <div>{{userName}}</div> -->
        <div  title="Выход">
        <v-btn icon @click="Exit" v-if="loginStatus">
          <v-icon >exit_to_app</v-icon>
        </v-btn>
        </div>

    </v-toolbar>
    <div id="core-view">
      <v-fade-transition mode="out-in">
        <Dashboard/>
      </v-fade-transition>
    </div>
    <div  >
      <datetime ref="datepicker" v-model="curentdate" format="dd-MM-yyyy" class="theme-blue">
        <template slot="button-cancel">
          Отмена
        </template>
        <template slot="button-confirm">
          Ок
        </template>
      </datetime>
    </div>

  </v-content>
</template>

<script>
import { Settings } from 'luxon'
Settings.defaultLocale = 'ru'
import {Datetime} from 'vue-datetime'
import Dashboard from "../views/Dashboard.vue";
import moment from "moment";
export default {
  components: {
    Dashboard: Dashboard,
    datetime: Datetime
  },
  data(){
    return{
      userLoginPassword:{
                    login:'baharev@it-enterprise.com',
                    password:'tacek3121412',
                    rememberMe:false
                },
    }
  },
  methods: {
    Exit() {
      this.$store.dispatch("IsLogin", false);
      this.$store.dispatch("ErrorToday", false);
      this.$store.dispatch("SetUserName", "");
      this.$store.dispatch("ClearAllState");
      
      
      localStorage.clear();
    },
    // Back(){
    //   this.$store.dispatch('WhoCardShowNow',0);
    // },
    ShowDatePicker(){
      this.$store.dispatch('ShowDatePicker',!this.showDateP)
    },
    Callcalendar(){
      this.$refs.datepicker._data.isOpen=true
    }
  },
  computed: {
    userName(){
      return this.$store.getters.getUserName;
    },
    errorStatus() {
      return this.$store.getters.getErrorToday;
    },
    loginStatus(){
      return this.$store.getters.getLoginStatus
    },
    header(){
      return this.$store.getters.getInfoList.TitleOfReport;
    },
    back(){
      return this.$store.getters.getCardIsShow
    },
    showDateP(){
      return this.$store.getters.getShowDateP;
    },
    loginStatus(){
      return this.$store.getters.getLoginStatus
    },
    curentdate:{
      get(){return moment().toISOString()},
      set(value){
          this.$store.dispatch('getInfoFromServer',value)
      }
    },
  },

};
</script>

<style>
.none-error {
  background-color: #008ffb !important;
}
.title{
  display: flex;
  align-items: center;
}
.v-icon{
  font-size: 24px !important;
  cursor: pointer;
}
.exit:hover::before{
  position: relative;
  content: "Выход";
}
.vdatetime-input{
  display:none !important;
}
.calendar{
  cursor: pointer !important;
}
input{
  cursor: pointer !important;
  width: 90px;
}
.v-date-picker-table .v-btn{
  color:black!important;
}
.vdatetime-popup{
  font-family: Roboto !important;
}
.theme-blue .vdatetime-popup__header,
.theme-blue .vdatetime-calendar__month__day--selected > span > span,
.theme-blue .vdatetime-calendar__month__day--selected:hover > span > span {
  background: #008ffb;
}

</style>
