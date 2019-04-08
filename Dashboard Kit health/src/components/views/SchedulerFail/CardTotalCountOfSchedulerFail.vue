<template>
    <div class="card-info" :title="title">
        <div class="description">
            {{title}}
        </div>
        <div class="icon-info">
            <i class="material-icons " >error</i>
        </div>
        <div class="info-value not-error" >
            {{dataTotalCountOfSchedulerFail}}
        </div>
        
    </div>
   
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
        title(){
            return this.$store.getters.getInfoList.TitleForSchedulerTestName
        }
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
       position: absolute;
        bottom:0;
    }
    .icon-info > i{
       color:#48a420; 
       font-size: 50px;
       margin-left: 8px;
    }
    .description{
        text-align: center;
        position: relative;
        top: 10%;
        color: #363d3f;
        max-height: 71px;
        overflow: hidden;
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
    color:#48a420 ;
    }
</style>
