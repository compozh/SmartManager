<template>
    <v-card-text class="mes-installation-card">
        <span v-html="installation.description"></span>
        <v-btn icon outlined color="error" flat class="mes-delete-installation" @click="removeInstallation"><v-icon dark>delete_forever</v-icon></v-btn>
    </v-card-text>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    props: {
        installation: Object
    },
    name: "mes-installation-card",
    methods: {
        removeInstallation() {
            this.$emit('removeInstallation');
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
.mes-installation-card {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 300px;
}
</style>
