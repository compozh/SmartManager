<template>
    <div>
      <div class="v-offset header-diagram">
        <div class="v-card--material__header v-card v-sheet theme--dark elevation-10 name-diagram" :class="moreMinCount ? 'error' : 'none-error'"><h4> {{title}}</h4></div>
       </div>
     <apexchart ref="chart" type=bar height=500 :options="chartOptions" :series="series" />
     
    </div>
</template>

<script>
import converToDate from '../../../utils/ConverToDateToWeekMethod.js'
import FindMaxValue from "../../../utils/FindMaxValue.js"
import moment from 'moment'
import IfMoreMinCount from '../../../utils/IfMoreMinCount.js'

export default {
    data(){
        return{
        moreMinCount:false,
        detailWebEscalationsForDay:{
            criterion:"WebEscalations",
            date:"",
            parameters:"null",
        },
          // colors:['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'],
        chartOptions: {
            chart: {
              id: 'vuechart-example',
              locales: this.$store.getters.getLocalization,
              defaultLocale: "ru",
              events: {
                  dataPointSelection: function(event, chartContext, config){
                      this.detailWebEscalationsForDay.date=moment(this.webRequestEscalationsForWeek[config.dataPointIndex].key).format("DD.MM.YYYY")
                      this.$store.dispatch('GetDetailsInformationForTable',this.detailWebEscalationsForDay)
                  }.bind(this)
                }
            },
            dataLabels: {
                enabled: true,
                textAnchor: 'middle',
                offsetY: -15,
                style: {
                    colors: ['#333']
                },
            },
            colors:[],
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
            name: 'Эскалация веб-запросов',
            data: []
          }],
      }
    },
    computed:{
        webRequestEscalationsForWeek(){
        return Object.entries(this.$store.getters.getInfoList.WebRequestEscalationsForWeek || []).map(obj=> ({key:obj[0],value:obj[1]}))
        },
        title(){
          return this.$store.getters.getInfoList.TitleOfWebEscalationForWeek
        }
    },
    methods:{
        GetDataWebRequestEscalationsForWeek(){
          this.moreMinCount=false;
          this.series[0].data=[];
          this.chartOptions.colors=[];
          this.chartOptions.xaxis.categories.splice(0,this.chartOptions.xaxis.categories.length);
          for(var i=0; i<this.webRequestEscalationsForWeek.length; i++){
            this.series[0].data.push(this.webRequestEscalationsForWeek[i].value)
            this.chartOptions.xaxis.categories.push(converToDate(this.webRequestEscalationsForWeek[i].key) + " - "+ moment(this.webRequestEscalationsForWeek[i].key).format('DD.MM.YYYY'));
            this.chartOptions.colors.push(FindMaxValue(this.webRequestEscalationsForWeek[i].value,this.$store.getters.getInfoList.MinCountOfWebEscalations))
            this.SetColorHeader(this.webRequestEscalationsForWeek[i].value,this.$store.getters.getInfoList.MinCountOfWebEscalations)
          }
          this.$refs.chart.refresh()
        },
      SetColorHeader(count, minTrueCount){
        if(IfMoreMinCount(count,minTrueCount)){
          this.moreMinCount=true;
        }
        
      }
    },
    watch:{
        webRequestEscalationsForWeek:function(){
        this.GetDataWebRequestEscalationsForWeek();
      }
    },
}
</script>

<style >

</style>
