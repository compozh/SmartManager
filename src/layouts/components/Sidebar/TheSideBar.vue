<template>
  <v-navigation-drawer id="sideBar"
                       app
                       permanent
                       :mini-variant="miniVariant"
                       :expand-on-hover="expandOnHover"
                       width="300"
                       style="padding-left: 3.4em">
    <side-bar-zones/>
    <v-list dense nav subheader v-if="activeZoneId !== 2">
      <v-subheader class="subtitle-1 font-weight-bold">
        {{ zones[activeZoneId].title }}
      </v-subheader>
      <v-list-item-group v-model="activeFolderId"
                         mandatory>

        <v-list-item v-for="folder in zones[activeZoneId].folders"
                     :key="folder.Code"
                     :to="'/tasks/' + folder.Code"
                     :class="{'item-active': folder.Code === activeFolderId,
                              'ml-5': folder.Parent}"
                     :value="folder.Code"
                      style="min-height: 32px;">

          <v-list-item-icon class="ma-0 mr-2 align-self-center align-center">
            <fa-icon :icon="folderIcons(folder.Code)"/>
          </v-list-item-icon>
          <v-list-item-title v-text="folder.Name"
                             class="body-1"
                             :class="{ 'white--text': folder.Code === activeFolderId}"/>
          <v-list-item-action v-if="folder.Count" class="ma-0 justify-end">
            <span class="body-1" :class="folder.Code === activeFolderId ? 'white--text' : 'grey--text'">
            {{ folder.Count }}</span>
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
  },
  computed: {
    folderIcons () {
      return code => {
        switch (code) {
          case 'active': return 'folder-open'
          case 'filter_done': return 'money-check-edit'
          case 'filter_from_me': return 'chalkboard-teacher'
          case 'filter_favorite': return 'star'
          case 'cases': return 'suitcase'
          default: return 'folder'
        }
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
    background: #42A5F6;
    color: white;
  }

</style>
