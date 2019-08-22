<template>
    <v-layout wrap justify-end>
        <v-autocomplete 
            v-show="showSearch" 
            @blur="hideSearch"
            id="elastic_search_input" ref="elastic_search_input"
            v-model="model"
            :loading="loading"
            :items="items"
            item-value="id" 
            :search-input.sync="search"
            cache-items
            hide-no-data
            hide-details
            no-filter
            autofocus
        >
            <template slot = "item" slot-scope="data">
                <v-layout>
                    <!--<v-btn icon @click.stop="alert(data.item.caption)">-->
                    <v-btn icon @click.stop="addToCartCall(data.item)">
                        <v-icon>add_shopping_cart</v-icon> 
                    </v-btn>
                    <v-layout column justify-center align-start>
                        <span :class="`elastic-caption ${wrapFilter}`" v-html="data.item.caption"/>
                        <span class="elastic-subcaption hidden-sm-and-down text-truncate" v-html="data.item.additionalCaption" />
                    </v-layout>
                </v-layout>
                <!-- <span>{{ data.item.caption }}</span> -->
            </template>
        </v-autocomplete>
        <v-icon v-show="!showSearch" @click="toogleSearchPanel">
            search
        </v-icon>
    </v-layout>
</template>

<script>
import {PurchasesApi} from '../api/purchasesApi'
import _ from 'lodash'
const api = new PurchasesApi()

export default {
  name: 'elastic-search',
  data: () => ({
    showSearch: false,
    loading: false,
    items: [],
    search: null,
    model: null,
    select: null,
    timeout: 0
  }),
  watch: {
    search (val) {
      //console.log(val);
      val && val.length > 4 && val !== this.select && this.querySelections(val)
    }
  },
  computed: {
    wrapFilter() {
      return this.$vuetify.breakpoint.smAndDown ? 'elastic-caption-trim' : ''
    }
  },
  methods: {
    toogleSearchPanel() {
      this.showSearch = true
      this.$refs.elastic_search_input.$el.focus()
      this.items = []
      this.$store.dispatch('purchases/setTitleState', !this.showSearch)

    },
    hideSearch() {
      this.showSearch = false
      this.$store.dispatch('purchases/setTitleState', !this.showSearch)
    },
    querySelections (v) {
      this.loading = true
      // Simulated ajax query
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        api.elasticSearch(v).then(this.elasticCallback)
        this.loading = false
      }, 0)
    },
    elasticCallback(resp) {
      this.items = _.map(JSON.parse(resp.data.purchases.elasticResourceNameSearch), function (item) { 
        var ret = { id: item.Id }
        var h = item.Highlights
        ret.caption = h.n_res ? h.n_res.Highlights[0] : item.Source.FullName
        ret.additionalCaption = h.nmat ? h.nmat.Highlights[0] : h.naimkm_s ? h.naimkm_s.Highlights[0] : h.n_res ? h.naimkm_s.Highlights[0] : ''
                        
        return ret
      })
      console.log(this.items)
    },
    addToCartCall(item) {
      api.addToCartMutation(item.id)
    }
  }
}
</script> 


<style>
    .highlit-elastic {
        display: inline-flex;
        background-color: antiquewhite;
        font-weight: 500;
        padding: 0px 3px 0px 3px;
    }
</style>

<style lang="scss" scoped>
    >>>.highlit-elastic {
        display: inline-flex;
        background-color: antiquewhite;
        font-weight: 500;
        padding: 0px 3px 0px 3px;
    }
    .elastic-caption{
        text-align: -webkit-left;
    }
    .elastic-caption-trim{
        font-size: 12px;
        line-height: 12px;
        max-height: 36px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
    .elastic-subcaption {
        text-align: -webkit-left;
        font-size: small;
        color: darkgray;
    }
</style>