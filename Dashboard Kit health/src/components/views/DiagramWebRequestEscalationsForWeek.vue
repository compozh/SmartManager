<template>
    <div>
     <apexchart type=bar height=350 :options="chartOptions" :series="series" />
     <h4> Эскалации веб-запросов на неделю</h4>
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
            colors:[],
            plotOptions: {
            bar: {
              columnWidth: '45%',
              distributed: true
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
            name: 'Эскалация веб-запросов',
            data: []
          }],
      }
    },
    computed:{
        webRequestEscalationsForWeek(){
            return this.$store.getters.getInfoList.WebRequestEscalationsForWeek
        }
    },
    methods:{
        GetDataWebRequestEscalationsForWeek(){
            this.series[0].data=[];
            for(var key in this.webRequestEscalationsForWeek){
                this.series[0].data.push(this.webRequestEscalationsForWeek[key])
                this.chartOptions.xaxis.categories.push(converToDate(key)+ " - "+ moment(key.replace('T00:00:00','')).format('DD.MM.YYYY'))
                this.chartOptions.colors.push(FindMaxValue(this.webRequestEscalationsForWeek[key],this.$store.getters.getInfoList.MinCountOfWebEscalations))
            }
        }
    },
    watch:{
        webRequestEscalationsForWeek:function(){
        this.GetDataWebRequestEscalationsForWeek();
      }
    }
}
</script>

<style>

</style>
