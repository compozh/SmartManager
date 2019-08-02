<template>
    <v-card-text>
        <span v-html="installation.description"></span><v-btn outlined @click="removeInstallation">X</v-btn>
    </v-card-text>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    props: {
        installation: Object
    },
    name: "mes-installation",
    methods: {
        removeInstallation(){
            this.$emit('removeInstallation', this.installation);
        }
    }
}
</script>
<style type="text/css" scoped>
</style>
