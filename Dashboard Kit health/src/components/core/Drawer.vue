<template>
 
</template>
 
<script>
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  data: () => ({
    perfExceedancesForWeek:[],
    totalCountOfErrorsForToday:0,
    totalCountOfLongQueriesForToday:0,
    totalCountOfPerformanceExceedancesForToday:0,
    totalCountOfSchedulerFail:0,
    totalCountOfWebRequestEscalationsForToday:0,
    webRequestEscalationsForWeek:null,

    logo: './img/vuetifylogo.png',
    links: [
      {
        to: '/dashboard',
        icon: 'mdi-view-dashboard',
        text: 'Dashboard'
      },
    ],
    responsive: false
  }),
  computed: {
    ...mapState('app', ['image', 'color']),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
      
    },
    errorsForToday(){
      return this.$store.getters.getInfoList.ErrorsForToday
    },
    items () {
      return this.$t('Layout.View.items')
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
  }
}
</script>

<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }
    .v-image__image--contain {
      top: 9px;
      height: 60%;
    }
    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
</style>
