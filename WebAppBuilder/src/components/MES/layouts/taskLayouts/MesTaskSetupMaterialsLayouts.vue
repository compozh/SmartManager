<template>
    <v-layout>
      <v-card class="card" v-for="installation in installations" :key="installation.id">
         <mes-installation :installation=installation @removeInstallation="removeInstallation(installation)"/>
      </v-card>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    selectedTask: Object
  },
  data () {
    return {installations: []};
  },
  name: "mes-task-setup-materials-layout",
    methods: {
      removeInstallation(installation) {
        var result = this.$store.dispatch('mes/removeInstallation', installation);
        debugger;
        if(result == true) {
          var index = this.installations.indexOf(installations);
          this.installations.splice(index, 0);
        } else {
          
        }
      },
      updateInstallations() {
        debugger;
        this.installations = this.$store.dispatch('mes/getInstallationsByWorkCenter', this.selectedTask.workCenter);
      }
    }
}
</script>
<style type="text/css" scoped>
</style>
