<template>
 <div class="v-offset header-diagram" :class="isFullScreen ? '.full-screen' : ''" style="height:100%; ">
        <div class="v-card--material__header v-card v-sheet theme--dark elevation-10 name-diagram none-error marginIframe" ><h4>{{detailscheduler.Title}}</h4> 
            <!-- <div class="btn-full-screen">
                <i class="material-icons " @click="SetFullScree()">
                    fullscreen
                </i>
            </div> -->
        </div>
    <iframe  class="frame" width="100%" height="576px"  frameborder="0" allowfullscreen></iframe>
 </div>
</template>

<script>
export default {
    data(){
        return{
            isFullScreen:false,
        }
    },
    computed:{
        detailscheduler(){
            return this.$store.getters.getDetailSchedulerFails
        }
    },
    mounted(){
        this.SetDetailInfo()
    },
    methods:{
        SetDetailInfo(){
            if(this.detailscheduler.DetailInfoAboutTest){
                var  ifrm = this.$el.getElementsByTagName('iframe')[0].contentWindow || this.$el.getElementsByTagName('iframe')[0].contentDocument.document || this.$el.getElementsByTagName('iframe')[0].contentDocument;
                ifrm.document.open();
                ifrm.document.write("<style>body{ margin-top: 40px}</style>")
                ifrm.document.write('<pre>');
                ifrm.document.write(this.detailscheduler.DetailInfoAboutTest.CallChain);
                ifrm.document.write('</pre>');
                ifrm.document.close();
            }else{
                var  ifrm = this.$el.getElementsByTagName('iframe')[0].contentWindow || this.$el.getElementsByTagName('iframe')[0].contentDocument.document || this.$el.getElementsByTagName('iframe')[0].contentDocument;
                ifrm.document.open();
                ifrm.document.write("<style>body{ margin-top: 40px} .empty-data-in-iframe{text-align: center;font-size: 24px;}</style>")
                ifrm.document.write('<p class="empty-data-in-iframe">Данные отсутствуют</p>');
                ifrm.document.close();
            }
        },
        SetFullScree(){
            this.isFullScreen=!this.isFullScreen;
        }
    },
    watch:{
        detailscheduler:function(){
            this.SetDetailInfo();
        }
    }
}

</script>

<style scoped>

.frame{
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
    height: 100%;
    margin-top: -36px;
    height: calc(100% - 0px);
}

.header-diagram{
  top: -24px !important; 
  margin-bottom: -24px;
  border-radius: 4px;
}
.btn-full-screen{
    position: absolute;
    right: 0;
    height: 100%;
    top: 0;
    margin: auto !important;
}
.full-screen{
    width: 100%;
    height: 100%;
}
.material-icons {
    font-size: 40px !important;
}
.marginIframe{
    margin-left: 16px !important;
    margin-right: 16px !important;
}
</style>
