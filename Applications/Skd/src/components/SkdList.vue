<template>
	<v-layout>  
		<v-flex v-if='!$vuetify.breakpoint.mdAndDown && users_list' offset-lg2 lg8>
			<div v-for='(item, index) in SlicedItems' :key='index'>
				<v-flex row wrap >
					<span class="group-item">{{item.group}}</span>
					<div v-for='(user, index) in item.users' :key='index'>
						<desctop-mode-component :user='user'></desctop-mode-component>
					</div>
				</v-flex>
			</div>
		</v-flex>
		<v-flex v-if='$vuetify.breakpoint.mdAndDown && users_list'>
			<div v-for='(item, index) in SlicedItems' :key='index'>
				<v-flex row wrap >
           <pull-to-component :top-load-method="fetchUsers"
                              :top-config="pullToConfig">
            <div v-for='(user, index) in item.users' :key='index'>
              <mobile-mode-component :user='user'></mobile-mode-component>
            </div>
           </pull-to-component>
				</v-flex>
			</div>
		</v-flex>
	</v-layout>
</template>
<script>
import mobileModeComponent from './MobileMode'
import desctopModeComponent from './DesctopMode'
import PullTo from 'vue-pull-to'
export default {
  name: 'skd-list',
  components: {
    'desctop-mode-component': desctopModeComponent,
    'mobile-mode-component': mobileModeComponent,
    'pull-to-component': PullTo
  },
  data: () => ({
    pagSync: {
      rowsPerPage: -1
    },
    pullToConfig: {
      pullText: 'Обновить список', // The text is displayed when you pull down
      triggerText: 'Отпустите, что бы обновить список', // The text that appears when the trigger distance is pulled down
      loadingText: 'Обновление...', // The text in the load
      doneText: 'Готово', // Load the finished text
      failText: '', // Load failed text
      loadedStayTime: 400, // Time to stay after loading ms
      stayDistance: 50, // Trigger the distance after the refresh
      triggerDistance: 70 // Pull down the trigger to trigger the distance
    }
  }),
  computed: {
    users_list() {
      if (!this.$store.getters['skd/getGroupedUserList']) {
        return null
      }
      return this.$store.getters['skd/getGroupedUserList']
    },
    ItemsOffset () {
      return this.$store.getters['skd/getItemsOffset']
    },
    SlicedItems() {
      let grouped
      let itemsenp = []
      let insideCounter = 0
      if (!this.users_list) {
        return itemsenp
      }
      for (var i = 0; i < this.users_list.length; i++) {
        let listUsers = []
        for (var j = 0; j < this.users_list[i].users.length; j++) {
          listUsers.push(this.users_list[i].users[j])
          if (insideCounter == this.ItemsOffset ) {
            break
          }
          insideCounter++
        }
        grouped = { group: this.users_list[i].group, users: listUsers }
        itemsenp.push(grouped)
        if (insideCounter == this.ItemsOffset ) {
          break
        }
      }
      return itemsenp
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch('skd/setItemsOffset', 20)
    },
    fetchUsers(loaded) {      
      this.$store.dispatch('skd/getUsers')
        .then(() => {
          loaded('done')
        }) 
    }
  },
  created: function() {
    this.$store.dispatch('skd/getUsers')
  },
  mounted() {
    window.addEventListener('scroll', () => {
      if (
        window.scrollY + window.innerHeight >=
        window.document.body.scrollHeight - 180
      ) {
        this.loadMore()
      }
    })
  },
}
</script>
<style scoped>
.group-item{
  margin-left: 10px;
  font-weight: 600;
  font-size: 16px;
}
</style>
