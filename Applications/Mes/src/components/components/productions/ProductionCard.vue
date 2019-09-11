<template>
  <v-card-text class="mes-production-card" :style="this.borderColors[production.color]">
    <div class="production-card-description">
      <span v-html="production.description"></span>      
      <br><span v-if="production.mode != 'START'">Cписаниe: <b>{{production.savedProgress}}</b>%</span>
    </div>
    <v-speed-dial 
      class="production-card-menu"
      absolute
      right
      top
      v-model="fab"
      direction="bottom"
      transition="fade-transition"
    >
      <template v-slot:activator>
        <v-btn
        class="production-card-menu-btn"
        icon
        width="30px"
        height="30px"
        v-model="fab"
        :loading="printInProgress || deleteInProgress"
        :color="printInProgress ? '#326da8' : deleteInProgress ? 'error' : '#999999'"
        >
          <v-icon>
            more_vert
          </v-icon>
        </v-btn>
      </template>
      <v-card class="btns-card" elevation=0>
      <v-btn icon color="#326da8" class="mes-print-production" @click="printProduction">
        <v-icon dark>print</v-icon>
      </v-btn>
      <v-btn icon color="error" class="mes-delete-production" @click="deleteProduction">
        <v-icon dark>delete_forever</v-icon>
      </v-btn>
      </v-card>  
      
    </v-speed-dial>
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
      fab: ''
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
.mes-production-card {
    height: 100%;
    display: flex;
    align-items: start;
    border-left: 18px solid rgba(179, 2, 2, 0.81);
    flex-direction: column;
    padding: 16px 35px 16px 20px;
  }
  .mes-production-card .production-card-description {
    justify-content: center;
  }
  .mes-production-card .production-card-description span {
    text-align: start;
  }
  .mes-print-production {
    margin: 0;
  }
  .mes-delete-production {
    margin: 0;
  }
  .production-card-menu  {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
  }
  .btns-card {
    width: 35px;
  }
  .mes-delete-production.error--text {
    color: rgba(179, 2, 2, 0.81) !important;
  }

</style>
