import Vue from 'vue'

const rtl = window.appConfig.rtl

// Global mixin
Vue.mixin({
  computed: {
    // Rtl mode
    rtl: () => Boolean(rtl),

    // Margin left
    ml: () => rtl ? 'mr' : 'ml',

    // Margin right
    mr: () => rtl ? 'ml' : 'mr',

    // Padding left
    pl: () => rtl ? 'pr' : 'pl',

    // Padding right
    pr: () => rtl ? 'pl' : 'pr',

    // Left
    isLeft: () => rtl ? 'right' : 'left',

    // Right
    isRight: () => rtl ? 'left' : 'right'
  }
})
