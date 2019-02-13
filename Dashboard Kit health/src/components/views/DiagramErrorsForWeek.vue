<template>
     <div>
     <apexchart type=bar height=350 :options="chartOptions" :series="series" />
      <h4>Ошибки за неделю</h4>
   </div>
</template>

<script>
import converToDate from '../../utils/ConverToDateToWeekMethod.js'
import FindMaxValue from "../../utils/FindMaxValue.js"
import moment from 'moment'
export default {
data(){
    return{
      chartOptions: {
        chart: {
            id: 'vuechart-example'
          },
          dataLabels: {
          },
          colors: [],
          plotOptions: {
            bar: {
              columnWidth: '45%',
              distributed: true
            }
          },
          //  labels: [],
          xaxis: {
            categories: [],
            labels: {
              style: {
                fontSize: '14px',
                floating:true
              }
            }
          },
           yaxis: {
            title: {
              text: 'количество '
            }
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
      return this.$store.getters.getInfoList.ErrorsForWeek
    }
},

methods:{
    GetErrorWeek(){
        for(var key in this.errorsForWeek){
          this.series[0].data.push(this.errorsForWeek[key]);
          this.chartOptions.xaxis.categories.push(converToDate(key) + " - "+ moment(key.replace('T00:00:00','')).format('DD.MM.YYYY'));
          // this.chartOptions.labels.push(moment(key.replace('T00:00:00','')).format('YYYY-MM-DD'));
          this.chartOptions.colors.push(FindMaxValue(this.errorsForWeek[key],this.$store.getters.getInfoList.MinErrorsCount))
        }
        // this.chartOptions.xaxis.categories=this.arrName;
    }
},
watch:{
    errorsForWeek:function(){
        this.GetErrorWeek();
      },
},
}
</script>
<style>
/* .ct-target-line{
  stroke: rgb(255,0,0);
    stroke-width: 2;
} */
.apexcharts-toolbar{
  z-index: 0 !important;
}
</style>
