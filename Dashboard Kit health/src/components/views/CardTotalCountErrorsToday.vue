<template>
    <div class="card-info">
        <div class="description">
            Общее количество ошибок на сегодня
        </div>
        <div class="icon-info" :class="iconColor">
            <i class="material-icons">error</i>
        </div>
        <div class="info-value" :class="textColor">
            {{dataTotalCountErrorsToday}}
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return{
            dataTotalCountErrorsToday:"",
            textColor:'not-error',
            iconColor:'icon-color'
        }
    },
    computed:{
        totalCountOfErrorsForToday(){
            return this.$store.getters.getInfoList.TotalCountOfErrorsForToday
        },
        minErrorsCount(){
            return this.$store.getters.getInfoList.MinErrorsCount
        }

    },
    methods:{
        GetTotalCountErrorsToday(){
            if(this.totalCountOfErrorsForToday<=this.minErrorsCount){
                this.textColor='not-error'
                this.iconColor='icon-color'
            }
            else{
                this.textColor='errors'
                this.iconColor='icon-color-error'
            }
            this.dataTotalCountErrorsToday=String(this.totalCountOfErrorsForToday);
        },
    },
    watch:{
        totalCountOfErrorsForToday:function(){
          this.GetTotalCountErrorsToday();
      }
    }
}
</script>

<style scoped>
    .icon-info{
        position: relative;
        top:55%;
    }
    .icon-color{
        color:rgb(90, 175, 75);
    }
    .icon-color-error{
        color:#ef5350;
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
        top: 0%;
        width: 100%;
        text-align: center;
        font-size: 48px !important;
    }
    .not-error{
        color:rgb(90, 175, 75);
    }
    .errors{
        color:rgb(234, 64, 47) ;
    }
</style>
