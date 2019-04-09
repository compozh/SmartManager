<template>
    <div>
      <div class="v-offset header-diagram">
        <div class="v-card--material__header v-card v-sheet theme--dark elevation-10 name-diagram none-error"><h4>{{title}}</h4></div>
       </div>
     <apexchart  ref="chart" type=bar height=500 :options="chartOptions" :series="series" />
     
    </div>
</template>

<script>
import converToDate from '../../../utils/ConverToDateToWeekMethod.js'
import FindMaxValue from "../../../utils/FindMaxValue.js"
import moment from 'moment'
import MaxHeight from '../../../utils/MaxHeight.js'
export default {
    data(){
        return{
          detailPerfExcForDay:{
            criterion:"PerfExceedances",
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
                  this.detailPerfExcForDay.date=moment(this.perfExceedancesForWeek[config.dataPointIndex].key).format("DD.MM.YYYY")
                  this.$store.dispatch('GetDetailsInformationForTable',this.detailPerfExcForDay)
                }.bind(this)
              },
            },
            dataLabels: {
                enabled: true,
                textAnchor: 'middle',
                offsetY: -15,
                style: {
                    colors: ['#333']
                },
            },
            colors: [],
            plotOptions: {
            bar: {
              columnWidth: '45%',
              dataLabels: {
                  position: 'top',
                }
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
              text: 'Количество'
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
            return Object.entries(this.$store.getters.getInfoList.PerfExceedancesForWeek || []).map(obj=> ({key:obj[0],value:obj[1]}))

         },
         title(){
           return this.$store.getters.getInfoList.TitleOfPerfExcForWeek
         }
    },
    methods:{
        GetPerfExceedancesForWeek(){
            this.series[0].data=[];
            this.chartOptions.colors=[];
            this.chartOptions.xaxis.categories.splice(0,this.chartOptions.xaxis.categories.length);
            for(var i=0; i<this.perfExceedancesForWeek.length; i++){
                this.series[0].data.push(this.perfExceedancesForWeek[i].value)
                this.chartOptions.xaxis.categories.push(converToDate(this.perfExceedancesForWeek[i].key) + " - "+ moment(this.perfExceedancesForWeek[i].key).format('DD.MM.YYYY'));
                this.chartOptions.colors.push(FindMaxValue(this.perfExceedancesForWeek[i].value,this.$store.getters.getInfoList.MinCountOfPerfExceedances))
            }
            this.$refs.chart.refresh()
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
