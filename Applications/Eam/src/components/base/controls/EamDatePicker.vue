<template>
  <v-flex class="date-picker">
    <v-btn flat icon @click="decDate">
      <v-icon>arrow_back_ios</v-icon>
    </v-btn>
    <v-menu
      :close-on-content-click="false"
      v-model="menu"
      :nudge-right="40"
      lazy
      transition="scale-transition"
      offset-y
    >
      <v-text-field
        slot="activator"
        :value="internalValue | formatDate"        
        readonly
        style="width:100px"
      ></v-text-field>
      <v-date-picker
        v-model="internalValue"
        locale="ru"
        @input="menu = false; $emit('input', internalValue)"
        :min="minDate"
        :max="maxDate"
      ></v-date-picker>
    </v-menu>
    <v-btn flat icon @click="incDate">
      <v-icon>arrow_forward_ios</v-icon>
    </v-btn>
  </v-flex>
</template>

<script>
import moment from 'moment'

export default {
  name: 'eam-date-picker',
  props: {
    value: String,
    label: {
      type: String,
      default: 'Дата'
    },
    icon: String,
    minDate: String,
    maxDate: String
  },
  data() {
    return {
      menu: false,
      internalValue: this.value
    }
  },
  computed: {},
  filters: {
    formatDate: value => {
      if (value) {
        return moment(value).format('DD.MM.YYYY')
      }
    }
  },
  methods: {
    decDate() {
      this.internalValue = moment(this.internalValue).add(-1, 'day').format('YYYY-MM-DD')
      this.$emit('input', this.internalValue)
    },
    incDate() {
      this.internalValue = moment(this.internalValue).add(1, 'day').format('YYYY-MM-DD')
      this.$emit('input', this.internalValue)
    }
  }
}
</script>

<style scoped>
.date-picker {
  max-width: fit-content;
}
</style>