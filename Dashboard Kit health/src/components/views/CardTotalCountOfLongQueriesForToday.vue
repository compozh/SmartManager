<template>
    <div class="card-info">
        <div class="description">
            Общее количество длинных запросов на сегодня
        </div>
        <div class="icon-info" :class="iconColor">
            <i class="material-icons">error</i>
        </div>
        <div class="info-value" :class="textColor" >
            {{dataTotalCountOfLongQueriesForToday}}
        </div>
        
    </div>
    <!-- <material-stats-card
          color="info"
          icon="mdi-twitter"
          title="Общее количество длинных запросов на сегодня"
          :value=dataTotalCountOfLongQueriesForToday
          sub-icon="mdi-update"
          sub-text="Just Updated"
          :class="textColor"
        /> -->
</template>

<script>
export default {
    data(){
        return{
            dataTotalCountOfLongQueriesForToday:"",
            textColor:'not-error',
            iconColor:'icon-color'
        }
    },
    computed:{
        totalCountOfLongQueriesForToday(){
            return this.$store.getters.getInfoList.TotalCountOfLongQueriesForToday
        },
        minCountofLogs(){
            return this.$store.getters.getInfoList.MinCountOfLogs
            
        }
    },
    methods:{
        GetTotalCountOfLongQueriesForToday(){
            if(this.totalCountOfLongQueriesForToday<=this.minCountofLogs)
            {
                this.textColor='not-error'
                this.iconColor='icon-color'
            }
            else{
                this.textColor='errors'
                this.iconColor='icon-color-error'
                this.$store.dispatch('ErrorToday',true);
            }
            this.dataTotalCountOfLongQueriesForToday=String(this.totalCountOfLongQueriesForToday);
        },
    },
    watch:{
        totalCountOfLongQueriesForToday:function(){
            this.GetTotalCountOfLongQueriesForToday();
        },
    }
}
</script>

<style scoped>
    .icon-info{
       position: absolute;
        bottom:0;
    }
    .icon-color{
        color:#008FFB;
    }
    .icon-color-error{
        color:#FF4560;
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
    color:#008FFB; ;
}
.errors{
    color:#FF4560 ;
}
</style>
