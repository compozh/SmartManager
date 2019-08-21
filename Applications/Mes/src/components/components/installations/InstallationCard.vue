<template>
    <v-card-text class="mes-installation-card">
        <span v-html="installation.description"></span>
        <v-btn icon outlined color="error" flat class="mes-delete-installation" @click="removeInstallation" :loading="delateInProgress"><v-icon dark>delete_forever</v-icon></v-btn>
    </v-card-text>
</template>

<script>

export default {
  data() {
    return {delateInProgress: false}
  },
  props: {
    installation: Object
  },
  name: 'mes-installation-card',
  methods: {
    removeInstallation() {
      this.delateInProgress = true
      this.$emit('removeInstallation', {installation: this.installation, callback: () => {
        this.delateInProgress = false
      }})
    }
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
  height: max-content;
}
</style>
