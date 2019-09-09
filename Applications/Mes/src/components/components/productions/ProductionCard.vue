<template>
    <v-card-text class="mes-production-card" :style="this.borderColors[production.color]">

        <span v-html="production.description"></span>
        <v-btn icon color="#326da8" class="mes-print-production" @click="printProduction" :loading="printInProgress" :disabled=deleteInProgress>
          <v-icon dark>print</v-icon>
        </v-btn>
        <v-btn icon color="error" class="mes-delete-production" @click="deleteProduction" :loading="deleteInProgress">
          <v-icon dark>delete_forever</v-icon>
        </v-btn>

        <span v-if="production.mode != 'START'">Cписаниe: <b>{{production.savedProgress}}</b>%</span>

    </v-card-text>
</template>

<script>

export default {
  name: 'mes-production-card',
  props: {
    production: Object
  },
  data() {
    return {
      deleteInProgress: false,
      printInProgress: false,
      borderColors: {
        0: 'border-left: 18px solid transparent;',
        1: 'border-left: 18px solid rgba(7, 109, 0, 0.81);',
        2: 'border-left: 18px solid rgba(255, 192, 0, 0.81);',
        3: 'border-left: 18px solid rgba(179, 2, 2, 0.81);'
      },
    }
  },
  methods: {
    deleteProduction() {
      var me = this
      me.$emit('deleteProduction', { production: me.production, callback: () => {
        me.deleteInProgress = false
      }, dialogAgreeClick: () => {
        me.deleteInProgress = true
      }})
    },
    printProduction() {
      var me = this
      me.printInProgress = true
      me.$emit('printProduction', { production: me.production, callback: () => {
        me.printInProgress = false
      }})
    }
  }
}
</script>

<style type="text/css" scoped>
  .mes-delete-production {
    min-width: auto;
    position: absolute;
    right: 0;
    top: 0;
  }
  .mes-delete-production.error--text {
    color: rgba(179, 2, 2, 0.81) !important;
  }
  .mes-print-production {
    min-width: auto;
    position: absolute;
    right: 35px;
    top: 0;
  }
  .mes-production-card {
    height: 100%;
    display: flex;
    align-items: start;
    border-left: 18px solid rgba(179, 2, 2, 0.81);
    flex-direction: column;
    justify-content: center;
  }
  .mes-production-card span {
    text-align: start;
  }
</style>
