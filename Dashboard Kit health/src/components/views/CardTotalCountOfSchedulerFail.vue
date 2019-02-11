<template>
    <div class="card-info">
        <div class="description">
            Общее количество ошибок планировщика
        </div>
        <div class="icon-info">
            <i class="material-icons " >error</i>
        </div>
        <div class="info-value not-error" >
            {{dataTotalCountOfSchedulerFail}}
        </div>
        
    </div>
   <!-- <material-stats-card
          color="red"
          icon="mdi-information-outline"
          title="Общее количество ошибок планировщика"
          :value=dataTotalCountOfSchedulerFail
          sub-icon="mdi-tag"
          sub-text="Tracked from Github"
    /> -->
</template>

<script>
export default {
    data(){
        return{
            dataTotalCountOfSchedulerFail:"",
        }
    },
    computed:{
        totalCountOfSchedulerFail(){
            return this.$store.getters.getInfoList.TotalCountOfSchedulerFail
        },
    },
    methods:{
        GetTotalCountOfSchedulerFail(){
            this.dataTotalCountOfSchedulerFail=String(this.totalCountOfSchedulerFail)
        },
    },
    watch:{
        totalCountOfSchedulerFail:function(){
            this.GetTotalCountOfSchedulerFail();
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
        top: -15%;
        width: 100%;
        text-align: center;
        font-size: 48px !important;
    }
    .not-error{
    color:rgb(90, 175, 75); ;
}
</style>
