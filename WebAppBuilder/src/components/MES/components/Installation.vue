<template>
    <v-card-text>
        {{installation.description}} <v-btn outlined @click="removeInstallation">X</v-btn>
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
            this.$emit('removeInstallation', installation);
        }
    }
}
</script>
<style type="text/css" scoped>
</style>
