<template>
    <div class="card-info">
        <div class="description">
            кол-во снимков показателей производительности на сегодня по всем серверам
        </div>
        <div class="icon-info">
            <i class="material-icons ">error</i>
        </div>
        <div class="info-value not-error" >
            {{dataTotalCountOfPerformanceExceedancesForToday}}
        </div>
    </div>
    <!-- <material-stats-card
          color="orange"
          icon="mdi-content-copy"
          title="кол-во превышений производительности на сегодня"
          :value=dataTotalCountOfPerformanceExceedancesForToday
          sub-icon="mdi-alert"
          sub-icon-color="error"
          sub-text="Get More Space..."
          sub-text-color="text-primary"
    /> -->
</template>

<script>
export default {
    data(){
        return{
            dataTotalCountOfPerformanceExceedancesForToday:"",
        }
    },
    computed:{
        totalCountOfPerformanceExceedancesForToday(){
            return this.$store.getters.getInfoList.TotalCountOfPerformanceExceedancesForToday
        }
    },
    methods:{
        GetTotalCountOfPerformanceExceedancesForToday(){
            this.dataTotalCountOfPerformanceExceedancesForToday=String(this.totalCountOfPerformanceExceedancesForToday)
        },
    },
    watch:{
        totalCountOfPerformanceExceedancesForToday:function(){
            this.GetTotalCountOfPerformanceExceedancesForToday();
        },
    }
}
</script>

<style scoped>
    .icon-info{
        color:rgb(90, 175, 75);
        position: relative;
        top:40%;
    }
    .icon-info > i{
       font-size: 50px;
    }
    .description{
        text-align: center;
        position: relative;
        top: 10%;
    }
    .card-info{
        margin-top: 25px;
        width: 100%;
        height: 80%;
        background: white;
        border-radius: 10px;
    }
    .info-value{
        position: relative;
        top: -10%;
        width: 100%;
        text-align: center;
        font-size: 48px !important;
    }
    .not-error{
    color:rgb(90, 175, 75); 
}
</style>
