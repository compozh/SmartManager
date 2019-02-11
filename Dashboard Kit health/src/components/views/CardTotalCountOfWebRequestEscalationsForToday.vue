<template>
<div class="card-info">
        <div class="description">
            Общее количество эскалаций веб-запросов за сегодня
        </div>
        <div class="icon-info" :class="iconColor">
            <i class="material-icons">error</i>
        </div>
        <div class="info-value" :class="textColor">
            {{dataTotalCountOfWebRequestEscalationsForToday}}
        </div>
        
    </div>
    <!-- <material-stats-card
        color="info"
        icon="mdi-twitter"
        title="Общее количество эскалаций веб-запросов за сегодня"
        :value=dataTotalCountOfWebRequestEscalationsForToday
        sub-icon="mdi-update"
        sub-text="Just Updated"
        :class="textColor"
    /> -->
</template>

<script>
export default {
    data(){
        return{
            dataTotalCountOfWebRequestEscalationsForToday:"",
            textColor:'not-error',
            iconColor:'icon-color'
        }
    },
    computed:{
        totalCountOfWebRequestEscalationsForToday(){
            return this.$store.getters.getInfoList.TotalCountOfWebRequestEscalationsForToday
        },
        minCountOfWeb(){
            return this.$store.getters.getInfoList.MinCountOfWebEscalations
        }

    },
    methods:{
        GetTotalCountOfWebRequestEscalationsForToday(){
            if(this.totalCountOfWebRequestEscalationsForToday<=this.minCountOfWeb)
            {
                this.textColor='not-error'
                this.iconColor='icon-color'
            }
            else{
                this.textColor='errors'
                this.iconColor='icon-color-error'
            }
            this.dataTotalCountOfWebRequestEscalationsForToday=String(this.totalCountOfWebRequestEscalationsForToday)

            
        }
    },
    watch:{
        totalCountOfWebRequestEscalationsForToday:function(){
            this.GetTotalCountOfWebRequestEscalationsForToday();
      },
      
    }
}
</script>

<style scoped>
 .icon-info{
        color:#ef5350;
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
     .icon-color{
        color:rgb(90, 175, 75);
    }
    .icon-color-error{
        color:#ef5350;
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
.errors{
    color:rgb(234, 64, 47) ;
}
</style>
