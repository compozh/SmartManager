<template>
    <v-card-text class="mes-production-card" :style="this.borderColors[production.color]">
        <span v-html="production.description"></span>
        <v-btn icon outlined color="error" flat class="mes-delete-production" @click="deleteProduction"><v-icon dark>delete_forever</v-icon></v-btn>
        <span v-if="production.mode != 'START'">Cписаниe: <b>{{production.savedProgress}}</b>%</span>
    </v-card-text>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    data() {
      return {
        borderColors : {
          0: "border-left: 18px solid transparent;",
          1: "border-left: 18px solid rgba(7, 109, 0, 0.81);",
          2: "border-left: 18px solid rgba(255, 192, 0, 0.81);",
          3: "border-left: 18px solid rgba(179, 2, 2, 0.81);"
        }
      }
    },
    props: {
        production: Object
    },
    name: "mes-production-card",
    methods: {
        deleteProduction() {
            this.$emit('deleteProduction');
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
