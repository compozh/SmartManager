<template>
    <v-card-text class="mes-installation-card">
        <span v-html="installation.description"></span>
         <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="error" class="mes-delete-installation" @click="removeInstallation" :loading="deleteInProgress" v-on="on">
              <v-icon dark>delete_forever</v-icon>
            </v-btn>
          </template>
          <span>{{this.$t('mes.buttons.DeleteInstallation')}}</span>
        </v-tooltip>
    </v-card-text>
</template>

<script>

export default {
  data() {
    return {
      deleteInProgress: false,
    }
  },
  props: {
    installation: Object,
  },
  name: 'mes-installation-card',
  methods: {
    removeInstallation() {
      var me = this
      me.$emit('removeInstallation', { installation: me.installation, callback: () => {
        me.deleteInProgress = false
      }, dialogAgreeClick: () => {
        me.deleteInProgress = true
      }})
    },
  }
}
</script>
<style type="text/css" scoped>.
.mes-installation-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 25px;
}
.mes-delete-installation {
  min-width: auto;
  position: absolute;
  right: 0;
  top: 0;
  width: 25px;
  height: 25px;
  margin: 5px;
}
.mes-delete-installation.error--text {
  color: rgba(179, 2, 2, 0.81) !important;
}
</style>
