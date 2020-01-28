<template>
  <vue-pull-refresh :on-refresh="onRefresh">
    <div class="installations-block justify-center" ref="installationsBlock">
      <mes-dialog-component
          :title=dialogProperties.title
          :message=dialogProperties.message
          :agreeMessage=dialogProperties.agreeMessage
          :disagreeMessage=dialogProperties.disagreeMessage
          :visible=dialogProperties.visible
          @dialogInput=dialogInput
          @agreeClick=dialogAgreeClick
          @disagreeClick=dialogDisagreeClick />
      <v-col v-for="installation in sortedInstallations"
      :key="installation.id" :cols="$vuetify.breakpoint.xs ? '12' : ''" sm="6" md="4" lg="3" xl="2" class="pa-1" >
        <v-card
          class="installation-card" 
          :ref="installation.batchBarcode"
        >
          <mes-installation-card
            :installation=installation
            @removeInstallation=invokeDeleteInstallation
          />

        </v-card>
      </v-col>
    </div>
  </vue-pull-refresh>
</template>

<script>
import VuePullRefresh from 'vue-pull-refresh'
export default {
  name: 'mes-installations-component',
  components: {
    'vue-pull-refresh': VuePullRefresh
  },
  data() {
    return {
      dialogProperties: {
        title: '',
        message: this.$t('mes.dialogs.DeleteInstallation'),
        agreeMessage: this.$t('mes.dialogs.Yes'),
        disagreeMessage: this.$t('mes.dialogs.No'),
        visible: false,
        installation: null,
        callback: false,
      },
    }
  },
  computed: {
    installations() {
      return this.$store.getters['mes/installations']
    },
    sortedInstallations() {
      let installations = this.installations
      installations.sort((a,b) => {
        return a.id < b.id ? 1 : (a.id == b.id ? 0 : -1)
      })
      return installations
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
  },
  methods: {
    invokeDeleteInstallation({ installation, callback, dialogAgreeClick }) {
      this.dialogProperties.visible = true
      this.dialogProperties.installation = installation
      this.dialogProperties.callback = callback
      this.dialogProperties.dialogAgreeClick = dialogAgreeClick
    },
    async removeInstallation({ installation, callback }) {
      await this.$store.dispatch('mes/removeInstallation', installation)
      if (callback) {
        callback()
      }
    },
    dialogAgreeClick() {
      let installation = this.dialogProperties.installation
      let callback = this.dialogProperties.callback
      if (this.dialogProperties.dialogAgreeClick) {
        this.dialogProperties.dialogAgreeClick()
      }
      this.removeInstallation({ installation, callback })
      this.dialogProperties.visible = false
    },
    dialogDisagreeClick() {
      this.dialogProperties.visible = false
    },
    dialogInput() {
      this.dialogProperties.visible = false
    },
    onRefresh() {
      if(this.$vuetify.breakpoint.mdAndUp) {
        return
      }
      return new Promise( async (resolve, reject) => {
        let refreshIcon = document.querySelector('.pull-down-content--icon')
        refreshIcon.innerHTML = '<svg class="spinner" viewBox="0 0 64 64"><g stroke="black" stroke-width="6" stroke-linecap="round"><line y1="17" y2="29" transform="translate(32,32) rotate(180)"><animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(210)"><animate attributeName="stroke-opacity" dur="750ms" values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(240)"><animate attributeName="stroke-opacity" dur="750ms" values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(270)"><animate attributeName="stroke-opacity" dur="750ms" values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(300)"><animate attributeName="stroke-opacity" dur="750ms" values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(330)"><animate attributeName="stroke-opacity" dur="750ms" values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(0)"><animate attributeName="stroke-opacity" dur="750ms" values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(30)"><animate attributeName="stroke-opacity" dur="750ms" values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(60)"><animate attributeName="stroke-opacity" dur="750ms" values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(90)"><animate attributeName="stroke-opacity" dur="750ms" values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(120)"><animate attributeName="stroke-opacity" dur="750ms" values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(150)"><animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate></line></g></svg>'
        refreshIcon.style = "background: none; height : 40px; width : 40px; -webkit-animation: none; margin-top: 0"
        this.$store.dispatch('mes/initializeInstallations',
          { workCenterCode: this.workCenter.code })
        .then(()=>{
          resolve()
        })
      })
    },
  },
  mounted() {
    let refreshLabel = document.querySelector('.pull-down-content--label')
    let refreshHeader = document.querySelector('.pull-down-header')
    refreshHeader.style.display = this.$vuetify.breakpoint.smAndDown ? 'block' :  'none'
    refreshHeader.style.backgroundColor = "white"
    refreshLabel.innerText = ''
  }
}
</script>

<style type="text/css" scoped>
  .installations-block {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0 10px;
    position: absolute;
    height: calc(100% - 60px) !important;
    overflow-y: auto;
    width: 100%;
    align-content: start;
  }
  .installations-block::-webkit-scrollbar {
    background-color:#fff;
    width:16px
  }
  .installations-block::-webkit-scrollbar-track {
      background-color:#fff
  }
  .installations-block::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
 .installations-block::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  .installations-block::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  .mes-installations::-webkit-scrollbar-button {display:none}
  .installation-card {
    display: flex;
    align-items: center;
    /* width: 360px; */
    height: 100%;
    width: 100%;
    /* margin: 6px; */
    border-radius: 5px;
    background-color: white;
    transition: background-color .5s ease-in-out;
  }
  .activeInstallation {
    background-color: rgba(50, 109, 168, .3);
    transition: background-color .5s ease-in-out;
  }
</style>
