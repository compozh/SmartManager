<template>
    <div class="card-info"> 
        <div class="description">
            {{title}}
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
            return this.$store.getters.getInfoList.TotalCountOfErrorsForDate
        },
        minErrorsCount(){
            return this.$store.getters.getInfoList.MinErrorsCount
        },
        title(){
            return this.$store.getters.getInfoList.TitleForErrorsTestName
        }

    },
    methods:{
        GetTotalCountErrorsToday(){
            if(this.totalCountOfErrorsForToday < this.minErrorsCount){
                this.textColor='not-error'
                this.iconColor='icon-color'
            }
            else{
                this.textColor='errors'
                this.iconColor='icon-color-error'
                this.$store.dispatch('ErrorToday',true);
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
       position: absolute;
        bottom:0; 
    }
    .icon-color{
        color:#48a420;
    }
    .icon-color-error{
        color:#f55a4e;
    }
    .icon-info > i{
        width: 100%;
       font-size: 50px;
       margin-left: 8px;
    }
    .description{
        text-align: center;
        position: relative;
        top: 10%;
        color: #363d3f;
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
        color:#48a420;
    }
    .errors{
        color:#f55a4e ;
    }
</style>
