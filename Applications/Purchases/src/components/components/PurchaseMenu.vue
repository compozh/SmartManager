<template>
    <v-layout column>
        <user-panel :mini="mini"></user-panel>
        <purchase-route-links></purchase-route-links>
    </v-layout>
</template>

<script>
export default {
  name: 'purchase-menu',
  props: ['mini']
}
</script>
