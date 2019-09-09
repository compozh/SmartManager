<template>
    <div class="installations-block" ref="installationsBlock">
      <mes-dialog-component
          :title=dialogProperties.title
          :message=dialogProperties.message
          :agreeMessage=dialogProperties.agreeMessage
          :disagreeMessage=dialogProperties.disagreeMessage
          :visible=dialogProperties.visible
          @dialogInput=dialogInput
          @agreeClick=dialogAgreeClick
          @disagreeClick=dialogDisagreeClick />
      <v-card
        class="installation-card"
        v-for="installation in sortedInstallations"
        :key="installation.id"
        :ref="installation.batchBarcode"
      >
        <mes-installation-card
          :installation=installation
          @openDialog=openDialog
        />

      </v-card>
    </div>
</template>

<script>

export default {
  name: 'mes-installations-component',
  data() {
    return {
      dialogProperties: {
        title: '',
        message: 'Вы действительно хотите удалить выработку?',
        agreeMessage: 'Да',
        disagreeMessage: 'Нет',
        visible: false,
        installation: null,
        callback: false
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
    }
  },
  methods: {
    async removeInstallation({ installation, callback }) {
      await this.$store.dispatch('mes/removeInstallation', installation)
      if (callback) {
        callback()
      }
    },
    openDialog({ installation, callback }) {
      this.dialogProperties.visible = true
      this.dialogProperties.installation = installation
      this.dialogProperties.callback = callback
    },
    dialogAgreeClick() {
      let installation = this.dialogProperties.installation
      let callback = this.dialogProperties.callback
      this.removeInstallation({ installation, callback })
      this.dialogProperties.visible = false
    },
    dialogDisagreeClick() {
      this.dialogProperties.visible = false
    },
    dialogInput() {
      this.dialogProperties.visible = false
    },
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
    width: 360px;
    margin: 10px;
    border-radius: 5px;
    background-color: white;
    transition: background-color .5s ease-in-out;
  }
  .activeInstallation {
    background-color: rgba(50, 109, 168, .3);
    transition: background-color .5s ease-in-out;
  }
</style>
