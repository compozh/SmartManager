<template>
    <v-card-text class="mes-installation-card">
        <span v-html="installation.description"></span>
        <v-btn icon color="error" class="mes-delete-installation" @click="removeInstallation" :loading="delateInProgress"><v-icon dark>delete_forever</v-icon></v-btn>
    </v-card-text>
</template>

<script>

export default {
  props: {
    installation: Object,
    delateInProgress: Boolean
  },
  name: 'mes-installation-card',
  methods: {
    removeInstallation() {
      this.$emit('openDialog', {installation: this.installation})
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
}
</style>
