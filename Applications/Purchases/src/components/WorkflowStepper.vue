<template>
    <div>
        <v-stepper>
            <v-stepper-header>
                <template v-for="(stage, n) in stages">
                    <v-stepper-step :key="n" :step="stage.sortOrder" :complete="isCurrentStage(stage.id)">
                       {{stage.name}}
                    </v-stepper-step>
                    <v-divider
                        v-if="n !== stages.length - 1"
                        :key="`div-${n}`"
                    />
                </template>
                
            </v-stepper-header>

            <v-stepper-items>

            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>

import {PurchasesApi} from '../api/purchasesApi'
import { debuglog, debug } from 'util'
import docStatus from '../api/graphql/docStatus.gql'
import gql from 'graphql-tag'
import { async } from 'q'
import { Stream } from 'stream'

const api = new PurchasesApi()

export default {
  name: 'workflow-stepper',
  props: {
    // stageName: ,
    currentStage: {
      type: String,
      required: false
    }
  },
  computed: {
    stages: {
      get: function() {
        return this.$store.getters['purchases/getDocStatus']
      }
    },
            
    stageNameComp() {
      if (this.stageName) { return this.stageName }
      return this.$t('purchases.CartItems.Stage')
    }
  },
  methods: {
    respCallback (resp) {
      return resp.data.purchases.docStatus 
    },
        
    isCurrentStage(curr) { debugger; return curr == this._props.currentStage },
         
  },
  beforeCreate() {
    api.getDocStatus()
  }
}
</script>
<style scope>
    .v-stepper{
        box-shadow: none;
    }
</style>
