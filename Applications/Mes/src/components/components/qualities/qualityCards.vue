<template>
  <v-flex class="qualities-list-block">
    <div v-for="quality in this.qualities" :key="quality.id">
      <v-card ripple
        class="quality-item"
        @click="changeCurrentQuality(quality)"
      >
        <v-card-text :class="selectedQuality && quality.id == selectedQuality.id ? 'active-quality-item' : 'inactive-quality-item'">
          <span v-html="quality.description"></span>
        </v-card-text>
      </v-card>
    </div>
  </v-flex>
</template>

<script>

export default {
  name: 'mes-quality-cards',
  computed: {
    qualities() {
      return this.$store.getters['mes/qualities']
    },
    selectedQuality: {
      get() {
        return this.$store.getters['mes/selectedQuality']
      }
    }
  },
  methods: {
    changeCurrentQuality(newQuality) {
      this.$emit('changeCurrentQuality', newQuality)
    },
    converDate(date) {
      date = new Date(date)
      let getDay = date.getDate().toString(),
        getMonth = (date.getMonth() + 1).toString(),
        getYear = date.getYear().toString(),
        getHours = date.getHours().toString(),
        getMinutes = date.getMinutes().toString(),
        day = getDay.length == 1 ? '0' + getDay : getDay,
        month = getMonth.length == 1 ? '0' + getMonth : getMonth,
        year = getYear.replace('1', '', 1),
        hours = getHours.length == 1 ? '0' + getHours : getHours,
        minutes = getMinutes.length == 1 ? '0' + getMinutes : getMinutes
      return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes
    }
  }
}
</script>

<style type="text/css" scoped>
.qualities-list-block {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.quality-item {
  margin: 10px;
  cursor: pointer;
  text-align: center;
}
.active-quality-item {
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: #d5e5ff;
}
.inactive-quality-item {
  display: flex;
  flex-direction: column;
  text-align: center;
}
</style>
