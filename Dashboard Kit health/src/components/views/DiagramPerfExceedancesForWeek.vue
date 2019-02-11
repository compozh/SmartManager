<template>
    <div>
     <apexchart type=bar height=350 :options="chartOptions" :series="series" />
     <h4>Превышения производительности за неделю</h4>
    </div>
</template>

<script>
import converToDate from '../../utils/ConverToDateToWeekMethod.js'
import FindMaxValue from "../../utils/FindMaxValue.js"
import moment from 'moment'
export default {
    data(){
        return{
          // colors:['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'],
          chartOptions: {
            chart: {
              id: 'vuechart-example'
            },
            // colors: this.colors,
            plotOptions: {
            bar: {
              columnWidth: '45%',
              // distributed: true //для радуги
            }
          },
            xaxis: {
              categories: [],
              labels: {
                style: {
                    fontSize: '14px'
                }
                }
            },
            yaxis: {
            title: {
              text: 'количество'
            }
          },
          },
          series: [{
            name: 'Производительность',
            data: []
          }],
        }
    },
    computed:{
        perfExceedancesForWeek(){
            return this.$store.getters.getInfoList.PerfExceedancesForWeek
         }
    },
    methods:{
        GetPerfExceedancesForWeek(){
            this.series[0].data=[];
            for(var key in this.perfExceedancesForWeek){
              this.chartOptions.xaxis.categories.push(converToDate(key)+ " - "+ moment(key.replace('T00:00:00','')).format('DD.MM.YYYY'))
              this.series[0].data.push(this.perfExceedancesForWeek[key])
            }
        },
    },
    watch:{
         perfExceedancesForWeek:function(){
        this.GetPerfExceedancesForWeek();
      }
    }
}
</script>

<style>

</style>
