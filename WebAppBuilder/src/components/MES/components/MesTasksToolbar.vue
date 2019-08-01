

<template>
  <v-card>
    <v-bottom-nav
      :active.sync="bottomNav"
      absolute
      color="transparent"
    >
      <v-btn
        color="teal"
        flat
        value="recent"
      >
        <span>Recent</span>
        <v-icon>history</v-icon>
      </v-btn>

      <v-btn
        color="teal"
        flat
        value="favorites"
      >
        <span>Favorites</span>
        <v-icon>favorite</v-icon>
      </v-btn>

      <v-btn
        color="teal"
        flat
        value="nearby"
      >
        <span>Nearby</span>
        <v-icon>place</v-icon>
      </v-btn>
    </v-bottom-nav>

  </v-card>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      bottomNav: 'recent'
    }
  },
  name: "mes-tasks-toolbar",
  created(){
    this.getProperties()
  },
  computed:{
    ...mapGetters({
        loading: 'mes/properties',
      }),
  },
    methods: {

    getProperties() {
      const loader = this.properties ? 'setLinearLoader' : 'setCircularLoader'
      this.$store.dispatch('mes/getProperties')
    }
  }
}
</script>