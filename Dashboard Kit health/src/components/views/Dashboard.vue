<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
    class="all-page"
  >
    <v-layout wrap>
        <v-flex sm6 xs12 md6 lg3 >
        <card-total-count-queries-for-today></card-total-count-queries-for-today>
        </v-flex>
          <v-flex sm6  xs12 md6  lg2 >
            <card-total-count-errors-today></card-total-count-errors-today>
          </v-flex>
        <v-flex sm6 xs12 md6 lg2 >
          <card-total-count-of-web-request-escalations-for-today></card-total-count-of-web-request-escalations-for-today>
        </v-flex>
        <v-flex sm6 xs6 md6 lg2>
            <card-total-count-of-scheduler-fail></card-total-count-of-scheduler-fail>
        </v-flex>
        <v-flex sm6 xs6 md6 lg3>
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
// import DExceedancesForYesterday from './DiagramPerfExceedancesForYesterday'
import ApexCharts from 'apexcharts'
import TServersParameters from './TableServersParameters'






export default {
  components: {
        'table-errors-for-today': TErrorsForToday, // объявляю пользовательский компонент
        'table-scheduler-fails': TSchedulerFails, // объявляю пользовательский компонент
        'diagram-errors-for-week': DErrorsForWeek, // объявляю пользовательский компонент
        'table-long-sql-queries-for-today': TLongSqlQueriesForToday, // объявляю пользовательский компонент
        'diagram-long-sql-queries-for-week': DLongSqlQueriesForWeek, // объявляю пользовательский компонент
        'diagram-web-request-escalations-for-week': DWebRequestEscalationsForWeek, // объявляю пользовательский компонент
        'diagram-perf-exceedances-for-week': DPerfExceedancesForWeek, // объявляю пользовательский компонент
        'card-total-count-queries-for-today': CTotalCountOfLongQueriesForToday, // объявляю пользовательский компонент
        'card-total-count-errors-today': CTotalCountErrorsToday, // объявляю пользовательский компонент
        'card-total-count-of-web-request-escalations-for-today': CTotalCountOfWebRequestEscalationsForToday, // объявляю пользовательский компонент
        'card-total-count-of-perfomance-exceedances-for-today': CTotalCountOfPerformanceExceedancesForToday, // объявляю пользовательский компонент
        'card-total-count-of-scheduler-fail': CTotalCountOfSchedulerFail, // объявляю пользовательский компонент
        // 'card-exceedances-for-yesterday': DExceedancesForYesterday, // объявляю пользовательский компонент
        'table-servers': TServersParameters, // объявляю пользовательский компонент
    },
  data () {
    return {
      stateSwitch:false,
      typeDiagram:'Bar',
     
      dataPerfExceedancesForToday:[
        {
        Name:"",
        Caption:"",
        MaxValue:"",
        Dates:""
      }
      ],
      headersExceedances: [
        {
          sortable: false,
          text: 'ID',
          value: 'id'
        },
        {
          sortable: false,
          text: 'Name',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Caption',
          value: 'caption',
          align: 'right'
        },
        {
          sortable: false,
          text: 'MaxValue',
          value: 'maxValue',
          align: 'right'
        }, 
        {
          sortable: false,
          text: 'Dates',
          value: 'dates',
          align: 'right'
        },
      ],
      tabs: 0,
      list: {
        0: false,
        1: false,
        2: false
      }
    }
  },
  computed: {
    perfExceedancesForToday(){
      return this.$store.getters.getInfoList.PerfExceedancesForToday
    },
  },
  methods: {
   
    ChangeTypeDiagram(stateSwitch){
        if(stateSwitch){
          this.typeDiagram='Line';
          }else{
          this.typeDiagram='Bar';
          }
    },
    complete (index) {
      this.list[index] = !this.list[index]
    },
    GetInfoFromServer(){
      this.$store.dispatch('getInfoFromServer');
    },
    GetPerfExceedancesForToday(){
        this.dataPerfExceedancesForToday=[];
        for(var key in this.perfExceedancesForToday){
          this.dataPerfExceedancesForToday.push(this.perfExceedancesForToday[key]);
        }
    },
  },
  created() {
    console.log('created')
    this.GetInfoFromServer();
  },
  watch:{
      perfExceedancesForToday:function(){
        this.GetPerfExceedancesForToday();
      },
  },
  
}
</script>
<style scoped>
  .wrapDiagram{
    background: white;
    border-radius: 10px;
    text-align: center;
    color: #999;

  }
 /* .header-title{
   position: relative;
    top: 30px;
 } */
 .all-page{
   margin-top: 60px;
 }
 
</style>

