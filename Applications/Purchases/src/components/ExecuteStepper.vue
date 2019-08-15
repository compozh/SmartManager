<template>
    <v-layout row execute-breadcrumbs>
        <template v-for="(item, i) in stages">
            <v-layout :key="i" :class="`item ${i < curStage ? 'executed' : i === curStage ? 'current' : ''}`" >
                <v-flex  before grow>
                    <v-divider />
                </v-flex>
                <v-flex curr shrink>
                    <v-tooltip  bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on" v-text="item.sortOrder-1 !== curStage ? 'panorama_fish_eye' : 'local_shipping'" />
                        </template>
                        <span v-if="minimalistStyle">{{item.name}}</span>
                    </v-tooltip >
                    <div v-if="!minimalistStyle" > {{item.name}} </div>
                </v-flex>
                <v-flex   after grow>
                    <v-divider />
                </v-flex>
                
            </v-layout>
        </template>
    </v-layout>
</template>

<script>
import {PurchasesApi} from '../api/purchasesApi'

const api = new PurchasesApi()
export default {
  name: 'esecute-stepper',
  props: {
    minimalistStyle: {
      type: Boolean,
      required: false
    },
    currentStage: {
      type: Number,
      required: false
    }

  },
  computed: {
    stages: {
      get: function() {
        return this.$store.getters['purchases/getDocStatus']
      }
    },
    curStage: {
      get: function() {
        return this._props.currentStage - 1
      }
    },
    //  minimalistStyle:{
    //      get: function() {
    //     return this._props.minimalistStyle;
    //     }
    //  },

  },
  methods: {
    //isCurrentStage(curr){ return curr == this._props.currentStage;}
  },
  beforeCreate() {
    api.getDocStatus()
  },
        
}
</script>

<style lang="scss" scoped>
$color-neutral: #ccc !default;
$color-active: #4183D7 !default;
$color-complete: #87D37C !default;

.execute-breadcrumbs { 
    color: $color-neutral;
    margin: 0px;
    padding: 5px;

    .item{
        .curr{
            margin: 0 0 0 0;
        }
        i{
            margin: 0 0 0 0;
        }
        hr{
            width: 100% !important;
            margin-top: 12px;
        }
    }

    .executed{
        i{
            color: $color-complete;
        }
    }
    .current{
        i{
            color: $color-active;
        }
    }
}
</style>