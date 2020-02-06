<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="date"
    lazy
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        :clearable="clearable"
        v-on="on"
        :rules="rules"
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" no-title scrollable :readonly="readonly" :locale="locale" :first-day-of-week="1">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="menu = false">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
      <v-btn text color="primary" @click="save(date)">{{ $t('bpmn.buttons.OK') }}</v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
import { currentLang } from '../../../plugins/i18n';

export default {
  name: 'properties-panel-date-picker-field',
  props: {
    label: String,
    readonly: {
      type: Boolean,
      default() { return false; }
    },
    clearable: {
      type: Boolean,
      default() { return false; }
    },
    value: {},
    rules: Array
  },
  data() {
    return {
      menu: false,
      date: null,
      locale: currentLang()
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(value) { this.date = value; }
    },
    date(value) {
      // Обработка нажатия на кнопку "Очистить"
      if (!value && this.value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
      if (date != this.value) {
        this.$emit('input', date);
      }
    }
  }
};
</script>