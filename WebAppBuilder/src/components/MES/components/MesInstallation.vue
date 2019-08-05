<template>
    <v-card-text class="mes-installation-card">
        <span v-html="installation.description"></span><v-btn outlined class="mes-delete-installation" @click="removeInstallation"><v-icon dark>delete_forever</v-icon></v-btn>
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
        removeInstallation() {
            this.$emit('removeInstallation');
        }
    }
}
</script>
<style type="text/css" scoped>
    .mes-delete-installation {
        min-width: auto;
    }
    .mes-installation-card {
        display: flex;
    }
</style>
