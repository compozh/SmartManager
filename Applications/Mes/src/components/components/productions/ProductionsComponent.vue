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
        <v-card class="productions-card" v-for="production in sortedProductions" :key="production.factId">

            <mes-production-card
                :production=production
                @deleteProduction=invokeDeleteProduction
                @printProduction=printProduction
                @setMaterialProduction=setMaterialProduction
            />

        </v-card>
    </v-flex>
</template>

<script>
/* eslint-disable */
export default {
  name: 'mes-productions-component',
  props: {
    productions: Array
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
        callback: false
      },
    }
  },
  computed: {
    sortedProductions() {
      return this.productions.sort((a,b) => {
        return a.factId < b.factId ? 1 : (a.factId == b.factId ? 0 : -1)
      })
    }
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
    }
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
