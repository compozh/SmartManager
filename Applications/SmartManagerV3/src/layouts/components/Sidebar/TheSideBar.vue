<template>
  <v-navigation-drawer id="sideBar"
                       app
                       permanent
                       :mini-variant="miniVariant"
                       :expand-on-hover="expandOnHover"
                       style="padding-left: 3.4em">
    <side-bar-zones/>
    <v-list dense nav subheader v-if="activeZoneId !== 2">
      <v-subheader>{{ zones[activeZoneId].title.toUpperCase() }}</v-subheader>
      <v-list-item-group v-model="activeFolderId"
                         mandatory>

        <v-list-item v-for="folder in zones[activeZoneId].folders"
                     :key="folder.Code"
                     :to="'/tasks/' + folder.Code"
                     :class="{ 'item-active': folder.Code === activeFolderId}"
                     :value="folder.Code">

          <v-list-item-icon class="mr-2 align-center">
            <fa-icon :icon="['fal', 'folder-open']" color="white"
                     v-if="folder.Code === activeFolderId"/>
            <fa-icon v-else :icon="['fal', 'folder']"/>
          </v-list-item-icon>
          <v-list-item-title v-text="folder.Name"
                             :class="{ 'white--text': folder.Code === activeFolderId}"/>
          <v-list-item-action v-if="folder.Count" class="justify-end">
            <v-badge inline color="red darken-4" :content="folder.Count"/>
          </v-list-item-action>
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
  watch: {
    $route (to) {
      if (to.name.includes('list')) {
        this.$store.commit('SET_ACTIVE_FOLDER',
          { folderId: to.params.folderId, source: 'watcher' })
      }
    }
  }
}
</script>

<style scoped>
  #sideBar >>> .v-navigation-drawer__content {
    position: relative;
  }

  .item-active {
    background: #5F81FF;
    color: white;
  }

</style>
