<template>
    <div>
        <div class="v-offset header-diagram">
        <div class="v-card--material__header v-card v-sheet theme--dark elevation-10 name-diagram" :class="moreMinCount ? 'error' : 'none-error'"><h4>{{title}}</h4></div>
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
        detailLongSQLQueriesForDay:{
            criterion:"LongSqlQueries",
            date:"",
            parameters:"null",
        },
        test:true,
        // colors:['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'],
        chartOptions: {
            chart: {
                id: 'vuechart-example',
                locales: this.$store.getters.getLocalization,
                defaultLocale: "ru",
                events: {
                    dataPointSelection: function(event, chartContext, config){
                        this.detailLongSQLQueriesForDay.date=moment(this.longSqlQueriesForWeek[config.dataPointIndex].key).format("DD.MM.YYYY")
                        this.$store.dispatch('GetDetailsInformationForTable',this.detailLongSQLQueriesForDay)
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
          name: 'Длительных SQL-запросов',
          data: []
        }],
    }
},
    computed:{
        longSqlQueriesForWeek(){
        return Object.entries(this.$store.getters.getInfoList.LongSqlQueriesForWeek || []).map(obj=> ({key:obj[0],value:obj[1]}))
        },
        title(){
            return this.$store.getters.getInfoList.TitleOfLongSqlQueriesForWeek
        },
        
    },
    methods:{
        GetLongSqlQueriesForWeek(){
            this.moreMinCount=false;
            this.series[0].data=[];
            this.chartOptions.colors=[];
            this.chartOptions.xaxis.categories.splice(0,this.chartOptions.xaxis.categories.length);
            for(var i=0; i<this.longSqlQueriesForWeek.length; i++){
                this.series[0].data.push(this.longSqlQueriesForWeek[i].value)
                this.chartOptions.xaxis.categories.push(converToDate(this.longSqlQueriesForWeek[i].key) + " - "+ moment(this.longSqlQueriesForWeek[i].key).format('DD.MM.YYYY'));
                this.chartOptions.colors.push(FindMaxValue(this.longSqlQueriesForWeek[i].value,this.$store.getters.getInfoList.MinCountOfLogs))
                this.SetColorHeader(this.longSqlQueriesForWeek[i].value,this.$store.getters.getInfoList.MinCountOfLogs)
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
        longSqlQueriesForWeek:function(){
            this.GetLongSqlQueriesForWeek();
        }
    }
}
</script>

<style>

</style>
