<template>
    <v-layout>  
        <v-flex v-if='!$vuetify.breakpoint.mdAndDown' offset-lg2 lg8>
            <div v-if='users' >
              <div v-for='(item, index) in SlicedItems' :key='index'>
                  <v-flex row wrap >
                    <span class="group-item">{{item.group}}</span>
                    <div v-for='(user, index) in item.users' :key='index'>
                    <desctop-mode-component :user='user'></desctop-mode-component>

                    </div>
                    <!-- <desctop-mode-component :user='user'></desctop-mode-component> -->
                  </v-flex>
              </div>
            </div>
        </v-flex>
        <v-flex v-if='$vuetify.breakpoint.mdAndDown'>
          <div v-for='(user, index) in SlicedItems' :key='index'>
              <v-flex row wrap >
                <mobile-mode-component :user='user'></mobile-mode-component>
              </v-flex>
          </div>
        </v-flex>
    </v-layout>
</template>
<script>
import mobileModeComponent from './MobileMode'
import desctopModeComponent from './DesctopMode'
export default {
  name: 'skd-list',
  components: {
    'desctop-mode-component': desctopModeComponent,
    'mobile-mode-component': mobileModeComponent 
  },
  data: () => ({
    pagSync: {
      rowsPerPage: -1
    }
  }),
  computed: {
    users() {
      console.log('get')
      
      if (!this.$store.getters['skd/getGroupedUserList']) {
        return null
      }
      return this.$store.getters['skd/getGroupedUserList']
      // if (!this.$store.getters['skd/getUsers']) {
      //   return null
      // }
      // return this.$store.getters['skd/getUsers']
    },
    ItemsOffset () {
      return this.$store.getters['skd/getItemsOffset']
    },
    SlicedItems() {
      // this.loading = true
      let grouped
      let itemsenp = []
      let insideCounter = 0
      for (var i = 0; i < this.users.length; i++) {
        let listUsers = []
        for (var j = 0; j < this.users[i].users.length; j++) {
          listUsers.push(this.users[i].users[j])
          if (insideCounter == this.ItemsOffset ) {
            break
          }
          insideCounter++
        }
        console.log(this.users[i].group)
        grouped = { group: this.users[i].group, users: listUsers }
        itemsenp.push(grouped)
        if (insideCounter == this.ItemsOffset ) {
          break
        }
      }
      // this.loading = false
      // return itemsenp[0].users
      return itemsenp
    }
  },
  methods: {
    // getUsers() {
    //   this.$store.dispatch('skd/getUsers', {loader: ''})
    // },
    loadMore() {
      this.$store.dispatch('skd/setItemsOffset', 20)
    }
  },
  updated() {
    this.users
  },
  created: function() {
    this.$store.dispatch('skd/getUsers',{loader: ''})
  },
  mounted() {
    window.addEventListener('scroll', e => {
      if (
        window.scrollY + window.innerHeight >=
        window.document.body.scrollHeight - 180
      ) {
        this.loadMore()
      }
    })
  },
//   props: ['skdlist']
}
</script>
<style scoped>
.group-item{
  margin-left: 10px;
  font-weight: 600;
  font-size: 16px;
}
</style>
