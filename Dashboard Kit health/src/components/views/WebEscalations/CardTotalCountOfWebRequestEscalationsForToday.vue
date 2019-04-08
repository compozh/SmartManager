<template>
<div class="card-info" :title="title">
        <div class="description">
            {{title}}
        </div>
        <div class="icon-info" :class="iconColor">
            <i class="material-icons">error</i>
        </div>
        <div class="info-value" :class="textColor">
            {{dataTotalCountOfWebRequestEscalationsForToday}}
        </div>
        
    </div>
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
            return this.$store.getters.getInfoList.TotalCountOfWebRequestEscalationsForDate
        },
        minCountOfWeb(){
            return this.$store.getters.getInfoList.MinCountOfWebEscalations
        },
        title(){
            return this.$store.getters.getInfoList.TitleForWebEscalationTestName
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
                this.$store.dispatch('ErrorToday',true);
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
       position: absolute;
        bottom:0;
    }
    .icon-info > i{
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
     .icon-color{
        color:#48a420;
    }
    .icon-color-error{
        color:#f55a4e;
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
