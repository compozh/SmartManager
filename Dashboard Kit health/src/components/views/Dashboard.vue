<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
    class="all-page"
  >
<v-layout wrap>
        <v-layout align-center justify-center row fill-height v-if="!loginStatus">
            <login></login>
        </v-layout>

    <v-layout wrap v-if="loginStatus">
        <v-flex sm6 xs12 md6 lg3 class="card">
        <card-total-count-queries-for-today></card-total-count-queries-for-today>
        </v-flex>
          <v-flex sm6  xs12 md6  lg2 class="card">
            <card-total-count-errors-today></card-total-count-errors-today>
          </v-flex>
        <v-flex sm6 xs12 md6 lg2 class="card">
          <card-total-count-of-web-request-escalations-for-today></card-total-count-of-web-request-escalations-for-today>
        </v-flex>
        <v-flex sm6 xs6 md6 lg2 class="card">
            <card-total-count-of-scheduler-fail></card-total-count-of-scheduler-fail>
        </v-flex>
        <v-flex sm6 xs6 md6 lg3 class="card">
            <card-total-count-of-perfomance-exceedances-for-today></card-total-count-of-perfomance-exceedances-for-today>
        </v-flex>

    <v-flex md12 sm12 lg6 >
      <div class="wrapDiagram">
        <diagram-perf-exceedances-for-week></diagram-perf-exceedances-for-week>
      </div>
    </v-flex>
      
      <v-flex  md12 sm12 lg6 >
        <div class="wrapDiagram">
          <diagram-web-request-escalations-for-week></diagram-web-request-escalations-for-week>
        </div>
      </v-flex>
      <v-flex md12 sm12 lg6 >
        <div class="wrapDiagram">
          <diagram-errors-for-week></diagram-errors-for-week>
        </div>
      </v-flex>
      
      <v-flex md12 sm12 lg6 >
        <div class="wrapDiagram">
          <diagram-long-sql-queries-for-week></diagram-long-sql-queries-for-week>
        </div>
      </v-flex>
      <v-flex md12 sm12 lg6 >
          <table-long-sql-queries-for-today></table-long-sql-queries-for-today>
      </v-flex>
      
      <v-flex md12 lg6 >
      <table-errors-for-today></table-errors-for-today>
      </v-flex>
      <v-flex md12 lg12 >
        <table-scheduler-fails></table-scheduler-fails>
      </v-flex>
     <v-flex md12 lg12 >
      <table-servers></table-servers>
      </v-flex>
    </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import _ from 'lodash'
import TErrorsForToday from './TableErrorsForToday'
import DErrorsForWeek from './DiagramErrorsForWeek'
import TLongSqlQueriesForToday from './TableLongSqlQueriesForToday'
import DLongSqlQueriesForWeek from './DiagramLongSqlQueriesForWeek'
import DWebRequestEscalationsForWeek from './DiagramWebRequestEscalationsForWeek'
import DPerfExceedancesForWeek from './DiagramPerfExceedancesForWeek'
import TSchedulerFails from './TableSchedulerFails'
import CTotalCountOfLongQueriesForToday from './CardTotalCountOfLongQueriesForToday'
import CTotalCountErrorsToday from './CardTotalCountErrorsToday'
import CTotalCountOfWebRequestEscalationsForToday from './CardTotalCountOfWebRequestEscalationsForToday'
import CTotalCountOfPerformanceExceedancesForToday from './CardTotalCountOfPerformanceExceedancesForToday'
import CTotalCountOfSchedulerFail from './CardTotalCountOfSchedulerFail'
import ApexCharts from 'apexcharts'
import TServersParameters from './TableServersParameters'
import Login from './Login'


export default {
  components: {
        'table-errors-for-today': TErrorsForToday, 
        'table-scheduler-fails': TSchedulerFails, 
        'diagram-errors-for-week': DErrorsForWeek, 
        'table-long-sql-queries-for-today': TLongSqlQueriesForToday, 
        'diagram-long-sql-queries-for-week': DLongSqlQueriesForWeek, 
        'diagram-web-request-escalations-for-week': DWebRequestEscalationsForWeek, 
        'diagram-perf-exceedances-for-week': DPerfExceedancesForWeek, 
        'card-total-count-queries-for-today': CTotalCountOfLongQueriesForToday, 
        'card-total-count-errors-today': CTotalCountErrorsToday, 
        'card-total-count-of-web-request-escalations-for-today': CTotalCountOfWebRequestEscalationsForToday, 
        'card-total-count-of-perfomance-exceedances-for-today': CTotalCountOfPerformanceExceedancesForToday, 
        'card-total-count-of-scheduler-fail': CTotalCountOfSchedulerFail, 
        'table-servers': TServersParameters, 
        'login': Login, // объявляю  компонент логина
    },
  data () {
    return {
      stateSwitch:false,
      typeDiagram:'Bar',
    }
  },
  computed: {
    loginStatus(){
      return this.$store.getters.getLoginStatus
    }
  },
  created: function () {
    if(sessionStorage.getItem('ticket')){
        this.$store.dispatch('IsLogin',true);
        this.$store.dispatch('getInfoFromServer');
      }else{
        this.$store.dispatch('IsLogin',false);
      }
  }
}
</script>
<style scoped>
  .card{
    margin-bottom: 10px;
    margin-top: 25px;
    height: 170px;
  } 
  .wrapDiagram{
    background: white;
    border-radius: 10px;
    text-align: center;
    color: #999;
  }
 .all-page{
   margin-top: 60px;
 }
 .login-div{
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 10px;
 }
</style>

