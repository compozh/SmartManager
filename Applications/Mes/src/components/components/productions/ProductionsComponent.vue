<template>
    <v-flex class="mes-productions-content">
      <mes-dialog-component
          :title=dialogProperties.title
          :message=dialogProperties.message
          :agreeMessage=dialogProperties.agreeMessage
          :disagreeMessage=dialogProperties.disagreeMessage
          :visible=dialogProperties.visible
          @dialogInput=dialogInput
          @agreeClick=dialogAgreeClick
          @disagreeClick=dialogDisagreeClick />

        <vue-pull-refresh :on-refresh="onRefresh">
          <v-card class="productions-card" v-for="production in sortedProductions" :key="production.factId">
            <mes-production-card
                :production=production
                @deleteProduction=invokeDeleteProduction
                @printProduction=printProduction
                @setMaterialProduction=setMaterialProduction
            />
          </v-card>
        </vue-pull-refresh>
    </v-flex>
</template>

<script>
/* eslint-disable */
import VuePullRefresh from 'vue-pull-refresh'
export default {
  name: 'mes-productions-component',
  props: {
    productions: Array
  },
  components: {
    'vue-pull-refresh': VuePullRefresh
  },
  data() {
    return {
      dialogProperties: {
        title: '',
        message: this.$t('mes.dialogs.DeleteProduction'),
        agreeMessage: this.$t('mes.dialogs.Yes'),
        disagreeMessage: this.$t('mes.dialogs.No'),
        visible: false,
        production: null,
        properties : Object,
        callback: false
      },
    }
  },
  computed: {
    sortedProductions() {
      return this.productions.sort((a,b) => {
        return a.factId < b.factId ? 1 : (a.factId == b.factId ? 0 : -1)
      })
    },
    selectedProductionTab() {
      return this.$store.getters['mes/selectedProductionTab']
    },
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
  },
  methods: {
    invokeDeleteProduction({ production, callback, dialogAgreeClick }) {
      this.dialogProperties.visible = true
      this.dialogProperties.production = production
      this.dialogProperties.callback = callback
      this.dialogProperties.dialogAgreeClick = dialogAgreeClick
    },
    async deleteProduction({ production, callback }) {
      await this.$store.dispatch('mes/deleteProduction', production)
      if (callback) {
          callback()
      }
    },
    dialogAgreeClick() {
      let production = this.dialogProperties.production
      let callback = this.dialogProperties.callback
      if (this.dialogProperties.dialogAgreeClick) {
        this.dialogProperties.dialogAgreeClick()
      }
      this.deleteProduction({ production, callback })
      this.dialogProperties.visible = false
    },
    dialogDisagreeClick() {
      this.dialogProperties.visible = false
    },
    dialogInput() {
      this.dialogProperties.visible = false
    },
    async printProduction({ production, callback }) {
      await this.$store.dispatch('mes/printProduction', production)
      if (callback) {
        callback()
      }
    },
    async setMaterialProduction({ production, callback }) {
      await this.$store.dispatch('mes/setMaterialProduction', production)
      if (callback) {
        callback()
      }
    },
    onRefresh() {
      if(this.$vuetify.breakpoint.mdAndUp) {
        return
      }
      return new Promise( async (resolve, reject) => {
        let refreshIcon = document.querySelector('.pull-down-content--icon')
        refreshIcon.innerHTML = '<svg class="spinner" viewBox="0 0 64 64"><g stroke="black" stroke-width="6" stroke-linecap="round"><line y1="17" y2="29" transform="translate(32,32) rotate(180)"><animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(210)"><animate attributeName="stroke-opacity" dur="750ms" values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(240)"><animate attributeName="stroke-opacity" dur="750ms" values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(270)"><animate attributeName="stroke-opacity" dur="750ms" values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(300)"><animate attributeName="stroke-opacity" dur="750ms" values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(330)"><animate attributeName="stroke-opacity" dur="750ms" values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(0)"><animate attributeName="stroke-opacity" dur="750ms" values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(30)"><animate attributeName="stroke-opacity" dur="750ms" values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(60)"><animate attributeName="stroke-opacity" dur="750ms" values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(90)"><animate attributeName="stroke-opacity" dur="750ms" values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(120)"><animate attributeName="stroke-opacity" dur="750ms" values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(150)"><animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate></line></g></svg>'
        refreshIcon.style = "background: none; height : 40px; width : 40px; -webkit-animation: none; margin-top: 0"

        if (this.selectedProductionTab == 0) {
          this.$store.dispatch('mes/initializeUsersProductionEvents', 
            { workerCode: this.properties.workerCode, fetchPolicy: 'network-only' })
          .then(()=>{
            resolve()
          })
        } else {
          this.$store.dispatch('mes/initializeWorkCenterProductionEvents', 
            { workCenterCode: this.workCenter.code, fetchPolicy: 'network-only' })
          .then(()=>{
            resolve()
          })
        }
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
    .mes-productions-content {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: start;
    }
    .productions-card {
        display: flex;
        align-items: start;
        margin: 10px;
        max-width: 400px;
        width: 360px;
        border-radius: 5px;
    }
</style>
