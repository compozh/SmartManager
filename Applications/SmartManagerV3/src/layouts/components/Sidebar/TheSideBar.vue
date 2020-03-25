<template>
  <v-navigation-drawer id="sideBar"
                       app permanent
                       max-width="300"
                       :expand-on-hover="!sideBarOpen"
                       style="padding-left: 3.4em">

    <side-bar-zones/>

      <v-list dense nav subheader>
        <v-subheader>{{ zones[activeZoneId].title.toUpperCase() }}</v-subheader>
        <v-list-item-group v-model="activeFolderId"
                           active-class="item-active">
          <v-list-item v-for="folder in zones[activeZoneId].folders"
                       :key="folder.Code"
                       :to="'/tasks/' + folder.Code"
                       :value="folder.Code">
            <v-list-item-icon class="mr-2 align-center">
              <fa-icon :icon="['fal', 'folder-open']"
                       v-if="folder.Code === activeFolderId"/>
              <fa-icon v-else :icon="['fal', 'folder']"/>
            </v-list-item-icon>
          <v-list-item-title v-text="folder.Name"/>
        </v-list-item>
        </v-list-item-group>
      </v-list>
  </v-navigation-drawer>
</template>

<script>
import SideBarZones from './SideBarZones'
import { sideBar } from '@/mixins/layout'
import { zones, folders } from '@/mixins/units'

export default {
  name: 'TheSideBar',
  mixins: [sideBar, zones, folders],
  components: {
    SideBarZones
  },
  data: () => ({
    drawer: false
  }),
  watch: {
    $route (to) {
      if (to.name.includes('list')) {
        this.$store.commit('SET_ACTIVE_FOLDER', to.params.folderId)
      }
    }
  }
}
</script>

<style scoped>
  #sideBar >>> .v-navigation-drawer__content {
    position: relative;
  }

</style>
