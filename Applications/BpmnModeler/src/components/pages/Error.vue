<template>
  <v-container class="align justify" >
    <error-404 v-if="this.routeParamCode == '404'"/>
    <error-500 v-else-if="this.routeParamCode == '500'"/>
    <error-402 v-else-if="this.routeParamCode == '402'"/>
    <error-403 v-else-if="this.routeParamCode == '403'"/>
  </v-container>
</template>

<script>
export default {
  name: 'page-error',
  data: () => ({
    route: {}
  }),
  computed: {      
    routeParamCode: {
      get: function() {
        return this.$route.params.status_code ? this.$route.params.status_code : ''
      }      
    }
  },
}
</script>