<template>
<div class='group-container'>
 <v-list class="pa-0">
  <v-list-tile avatar>
    <v-list-tile-avatar>
      <img :src="curentUser.UserPhoto">
    </v-list-tile-avatar>

    <v-list-tile-content>
      <v-list-tile-title class="textname">{{curentUser.UserName}}</v-list-tile-title>
    </v-list-tile-content>
    <v-btn flat icon v-on:click="logOut">
      <v-icon >exit_to_app</v-icon>
    </v-btn>
  </v-list-tile>
	</v-list>

 <v-list dense>
				<v-list-tile :key="item.key" v-on:click="changeGrouping(item.key)" v-for="item in groupingItems" >
					<v-list-tile-action >
						<v-icon v-if="item.selected">done</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>{{ item.caption }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
</div>
 
</template>

<script>
const groups = ['Все','В офисе','В офисе с ключами','Вне офиса','По командам','По комнатам','Кухня']
export default {
  name: 'route-menu',
  data: () => ({
    drawer: false
  }),
  computed: {
    grouping () {
      return this.$store.state.skd.grouping
    },
    groupingItems() {
      var group = this.grouping
      var that = groups.map((el, ind) => ({key: ind, caption: el, selected: group == ind}))
      return that
    },
    curentUser() {
      var user = {}
      console.log(22)
      if (localStorage.getItem('currentUser') != null || localStorage.getItem('currentUser') != undefined) {
        user = JSON.parse(localStorage.getItem('currentUser'))
        return user.UserData.CurrentUserData
      }
      return {UserName: '', UserPhoto: ''}
    }
  },
  methods: {
    changeGrouping (value) {
      this.$store.commit('skd/changeGrouping', value)
      this.$store.commit('skd/resetItemsOffset')
      if (this.$vuetify.breakpoint.mdAndDown) {
        this.drawer = false
      }
    },
    logOut() {
      this.drawer = false

    },
  }

}
</script>

<style scoped>
li{
   list-style-type: none;
}
.selected-group{
 color:black;
}
</style>
