<template>
    <v-container pa-0>
    <v-layout column align-center>
        <user-panel :mini="mini"></user-panel>
    </v-layout>
    <v-layout column>
            <purchase-route-links></purchase-route-links>
    </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'purchase-menu',
    props: ["mini"]
}
</script>
