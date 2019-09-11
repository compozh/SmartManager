<template>
    <v-card-text class="mes-installation-card">
        <span v-html="installation.description"></span>
        <v-btn icon color="error" class="mes-delete-installation" @click="removeInstallation" :loading="deleteInProgress"><v-icon dark>delete_forever</v-icon></v-btn>
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
<style type="text/css" scoped>
.mes-delete-installation {
  min-width: auto;
  position: absolute;
  right: 0;
  top: 0;
}
.mes-delete-installation.error--text {
    color: rgba(179, 2, 2, 0.81) !important;
  }
.mes-installation-card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 360px;
}
</style>
