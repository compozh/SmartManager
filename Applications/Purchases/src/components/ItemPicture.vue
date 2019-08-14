<template>
    <v-layout justify-center :style="`width: ${width}; height: ${height};`" >
    <div v-if="items.length == 0" class="icon-frame justify-center">
        <v-icon v-text="'photo_camera'" :size="height"/>
    </div>
    <div v-else class="icon-frame justify-center" @mouseover="mouceMove(true)" @mouseleave="mouceMove(false)">
       <v-carousel hide-controls hide-delimiters  interval="2000" :cycle="hover" :height="height" :width="width">
            <v-carousel-item
                v-for="(item, i) in items"
                :key="i"
                :src="item" 
                :height="height" 
                :width="width"
                transition="fade-transition"
                reverse-transition="fade-transition"
            />
        </v-carousel>
    </div>
    </v-layout>
</template>

<script>
import {PurchasesApi} from '../api/purchasesApi'
    
const api = new PurchasesApi()

export default {
  name: 'item-picture',
  props: {
    entityName: {
      type: String,
      required: true
    },
    id: {
      type: undefined,
      required: true
    },
    width: {
      type: String
    },
    height: {
      type: String
    }
  },        
  data: () => ({
    items: [],
    hover: false
  }),
  methods: {
    respCallback(resp) {
      if (resp.data.purchases.resourcesGroup.content.length > 0) {
        if (resp.data.purchases.resourcesGroup.content) {
          this.items = this.items.concat(resp.data.purchases.resourcesGroup.content)
        }
      }
    },
    mouceMove(val) {
      this.hover = val
    }
  },
  created: function () {
    var promise = 
                this.id.trim().length == 15 
                  ? api.getImagesForCatalogueItem(this.id)
                  : api.getImagesForCatalogueGroup(this.id)
            
    promise.then(this.respCallback)
  },
        

}
</script>

<style lang="scss" scoped>
.icon-frame {
    border: 0px none;
    display: flex;
    justify-self: center;
}
.v-carousel{
    box-shadow: none;
}
</style>


