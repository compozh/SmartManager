<template>
    <v-layout  class="wrap" v-if="show" row wrap>
        <v-flex>
            <v-breadcrumbs :items="$vuetify.breakpoint.mdAndUp ? this.simpleRoute(breadCrumbs):this.mobileRoute(breadCrumbs)" divider=">">
                <template v-slot:item="props">
                    <router-link class="crumbs" :to="{ name:'CATALOGUE', params: {catalogueId: props.item.id != undefined ? props.item.id.trim():null }}">
                      {{ props.item.text }}
                    </router-link>
                </template>
            </v-breadcrumbs>       
        </v-flex>
    </v-layout>
</template>

<script>
import {PurchasesApi} from '../api/purchasesApi'
const api = new PurchasesApi()
export default {
  name: 'catalogue-route-breadcrumbs',
  props: {
  },
  data: () => ({
    currentId: new String(),
    mobileRoute: function(data) {
      let result = []
      if (this.currentId.length == 15) {
        result.push(data[data.length - 1])
      } else {
        result.push(data[data.length - 2])
      }

      if (result.length == 1 && result[0] == undefined) {
        result.splice(0,1,{id: null,text: '...'})
      }

      return result
    },
    simpleRoute: function(data) {
      let result = []
      for (let i = 0;i < data.length;i++) {
        result.push(data[i])
      }
      result.unshift({id: null, text: '...'})

      return result
    }
  }),
  created() {
    this.$store.state.purchases.breadcrumbs = []
    this.currentId = this.$route.params.catalogueId
    if (this.currentId != undefined) {
      api.getBreadcrumbsByGroup(this.currentId,false)
    }
  },
  computed: {
    show: {
      get: function() {
        if (this.$store.getters['purchases/getBreadCrumbs'].length === 0) {
          return false
        }
                
        return true
      },
    },
    breadCrumbs: {
      get: function() {
        return this.$store.getters['purchases/getBreadCrumbs']
      },
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.params.catalogueId != null) {
        this.currentId = to.params.catalogueId
        api.getBreadcrumbsByGroup(this.currentId,false)
      } else {
        this.currentId = undefined
        this.$store.state.purchases.breadcrumbs = []
      }
    }
  }
}
</script>

<style scoped>

    .crumbs{
        font-size: 1em;
        color: grey;
    }
    .wrap{
        position: absolute;
    }
</style>
