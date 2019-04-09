<template>
     <div>
       <div class="v-offset header-diagram">
        <div class="v-card--material__header v-card v-sheet theme--dark elevation-10 name-diagram none-error"><h4>{{title}}</h4></div>
       </div>
     <apexchart ref="chart" type=bar height=500 :options="chartOptions" :series="series" />
      
   </div>
</template>

<script>
import converToDate from '../../../utils/ConverToDateToWeekMethod.js'
import FindMaxValue from "../../../utils/FindMaxValue.js"
import moment from 'moment'
import MaxHeight from '../../../utils/MaxHeight.js'
import _ from 'lodash'

export default {
data(){
    return{
      detailErrorsForDay:{
        criterion:"TopErrorsForDate",
        date:"",
        parameters:"null",
      },
      chartOptions: {
        chart: {
            id: 'vuechart-example',
            locales: this.$store.getters.getLocalization,
            defaultLocale: "ru",
            events: {
              dataPointSelection: function(event, chartContext, config){
                this.detailErrorsForDay.date=moment(this.errorsForWeek[config.dataPointIndex].key).format("DD.MM.YYYY")
                this.$store.dispatch('GetDetailsInformationForTable',this.detailErrorsForDay)
              }.bind(this)
            }
          },
          dataLabels: {
            enabled: true,
            textAnchor: 'middle',
            offsetY: -15,
            style: {
              colors: ['#333'],
            },
          },
          colors: [],
          plotOptions: {
              bar: {
                columnWidth: '45%',
                distributed: true,
                dataLabels: {
                  position: 'top',
                } 
            }
          },
          xaxis: {
            categories: [],
            labels: {
              style: {
                fontSize: '13px',
                floating:true
              }
            }
          },
           yaxis: {
            title: {
              text: 'Количество '
            },
          },
        },
        series: [{
          name: 'Кол-во ошибок',
          data: []
        }],
        
    }
},
computed: {
    errorsForWeek(){
      return Object.entries(this.$store.getters.getInfoList.ErrorsForWeek || []).map(obj=> ({key:obj[0],value:obj[1]}))
    },
    title(){
      return this.$store.getters.getInfoList.TitleOfErrorsForWeek
    }
},

methods:{
    GetErrorWeek(){
        this.series[0].data=[]
        this.chartOptions.colors=[]
        this.chartOptions.xaxis.categories.splice(0,this.chartOptions.xaxis.categories.length);
        for(var i=0; i<this.errorsForWeek.length; i++){
          this.series[0].data.push(this.errorsForWeek[i].value)
          this.chartOptions.xaxis.categories.push(converToDate(this.errorsForWeek[i].key) + " - "+ moment(this.errorsForWeek[i].key).format('DD.MM.YYYY'));
          this.chartOptions.colors.push(FindMaxValue(this.errorsForWeek[i].value, this.$store.getters.getInfoList.MinErrorsCount))
        }
        this.$refs.chart.refresh()
    },
    
},
watch:{
    errorsForWeek:function(){
        this.GetErrorWeek();
      },
     
      
},
}
</script>
<style>

.apexcharts-toolbar{
  z-index: 0 !important;
}
.header-diagram{
  top: -24px !important; 
  margin-bottom: -24px;
  border-radius: 4px;
}
.v-card--material__header{
  height: 62px;
}
.error{
  background-color: #f55a4e;
}
.none-error{
  background-color: #48a420 !important;
}
.name-diagram{
  padding: 15px;
  text-align: left
}
.name-diagram > h4{
  margin: 0px !important;
}
.apexcharts-bar-area{
  cursor: pointer;
}
</style>
