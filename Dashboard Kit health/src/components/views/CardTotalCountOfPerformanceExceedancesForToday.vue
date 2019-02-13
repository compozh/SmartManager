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
        position: absolute;
        bottom:0;
    }
    .icon-info > i{
       color:#008FFB;
       font-size: 50px;
    }
    .description{
        text-align: center;
        position: relative;
        top: 10%;
    }
    .card-info{
        position: relative;
        width: 100%;
        height: 100%;
        background: white;
        border-radius: 10px;
    }
    .info-value{
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        font-size: 48px !important;
    }
    .not-error{
    color:#008FFB; 
}
</style>
