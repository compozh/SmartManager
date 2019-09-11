<template>
  <v-flex class="downtimes-list-block">
    <div v-for="downtime in this.downtimes" :key="downtime.id">
      <v-card ripple
        class="downtime-item"
        @click="changeCurrentDowntime(downtime)"
      >
        <v-card-text :class="selectedDowntime && downtime.id == selectedDowntime.id ? 'active-downtime-item' : 'inactive-downtime-item'">
          <span><strong>Причина:</strong> {{downtime.description}}</span>
          <span><strong>Начало:</strong> {{downtime.eventStart}}</span>
          <span v-if="downtime.eventEnd"><strong>Окончание:</strong> {{downtime.eventEnd}}</span>
          <span><strong>Комментарий:</strong> {{downtime.comment}}</span>
        </v-card-text>
      </v-card>
    </div>
  </v-flex>
</template>

<script>

export default {
  name: 'mes-downtime-cards',
  computed: {
    downtimes() {
      return this.$store.getters['mes/downtimes']
    },
    selectedDowntime: {
      get() {
        return this.$store.getters['mes/selectedDowntime']
      }
    }
  },
  methods: {
    changeCurrentDowntime(newDowntime) {
      this.$emit('changeCurrentDowntime', newDowntime)
    }
  }
}
</script>

<style type="text/css" scoped>
.downtimes-list-block {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.downtime-item {
  margin: 10px;
  cursor: pointer;
  text-align: center;
}
.active-downtime-item {
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: #d5e5ff;
}
.inactive-downtime-item {
  display: flex;
  flex-direction: column;
  text-align: center;
}
</style>
