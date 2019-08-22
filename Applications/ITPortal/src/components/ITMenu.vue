<template>
    <div>
        <v-list class="pa-0">
            <v-list-tile avatar>
                <user-panel mini="true" />
                <v-list-tile-content>
                    <v-list-tile-title class="textname">
                        {{curentUser.UserName}}
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <div v-if="menuItems">
            <ul>
                <li v-for="(item, index) in menuItems.items" :key="index">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
  name: 'it-menu',
  computed: {
    curentUser() {
      var user = {}
      if (localStorage.getItem('currentUser') != null || localStorage.getItem('currentUser') != undefined) {
        user = JSON.parse(localStorage.getItem('currentUser'))
        return user.UserData.CurrentUserData
      }
      return {UserName: '', UserPhoto: ''}
    },
    menuItems() {
      var menu = this.$store.getters['itportal/getITPortalMenu']
      if (!menu) {
        return undefined
      }
      if (!menu.itmenu) {
        return undefined
      }
      if (!menu.itmenu.menu) {
        return undefined
      }
      return menu.itmenu.menu
    }
  },
  created() {
    this.$store.dispatch('itportal/getITPortalMenu')
  }
}
</script>
<style scoped>

</style>