<template>
  <v-flex class="downtimes-list-block">
    <div v-for="downtime in this.downtimes" :key="downtime.id">
      <v-card ripple
        class="downtime-item"
        @click="changeCurrentDowntime(downtime)"
      >
        <v-card-text :class="selectedDowntime && downtime.id == selectedDowntime.id ? 'active-downtime-item' : 'inactive-downtime-item'">
          <span><strong>{{$t('mes.cards.Cause')}}:</strong> {{downtime.description}}</span>
          <span><strong>{{$t('mes.cards.Start')}}:</strong> {{converDate(downtime.eventStart)}}</span>
          <span v-if="downtime.eventEnd != '0001-01-01T00:00:00Z'"><strong>{{$t('mes.cards.End')}}:</strong> {{converDate(downtime.eventEnd)}}</span>
          <span><strong>{{$t('mes.cards.Comment')}}:</strong> {{downtime.comment ? downtime.comment : '- - -'}}</span>
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
      this.$emit('changeDowtimesTableView', false)
      this.$emit('changeCurrentDowntime', newDowntime)
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
.downtimes-list-block {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.downtime-item {
  margin: 5px 10px;
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
