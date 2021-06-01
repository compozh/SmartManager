<template>
  <v-navigation-drawer id="sideBar"
                       app permanent
                       :right="rtl"
                       :mini-variant.sync="miniVariant"
                       :expand-on-hover="expandOnHover"
                       width="300"
                       :style="`padding-${isLeft}: 3.4em;`">
    <side-bar-zones/>

    <v-list v-if="activeZoneId !== 2"
            dense nav subheader >
      <v-subheader class="subtitle-1 font-weight-bold">
        {{ activeZone.title }}
      </v-subheader>
      <v-list-item-group v-model="activeFolderId"
                         mandatory>
        <v-tooltip v-for="(folder, index) in zones[activeZoneId].folders"
                   :key="index" top>
          <template #activator="{ on }">
            <v-list-item v-on="on"
                         :to="'/' + activeZone.group + '/' + folder.Code"
                         :class="{ 'item-active': String(folder.Code) === String(activeFolderId),
                                   [`${ml}-4`]: folder.Parent }"
                         :value="folder.Code"
                         style="min-height: 32px;">
              <v-list-item-icon class="ma-0 align-self-center align-center"
                                :class="[`${mr}-1`, { 'white--text': String(folder.Code) === String(activeFolderId) }]">
                <fa-icon :icon="folderIcons(folder.Code)"/>
              </v-list-item-icon>
              <v-list-item-title class="body-1"
                                 :class="{ 'white--text': String(folder.Code) === String(activeFolderId) }">
                {{ folder.Name }}</v-list-item-title>
              <v-list-item-action v-if="folder.Count" class="ma-0 justify-end">
                <span class="body-1"
                      :class="String(folder.Code) === String(activeFolderId) ? 'white--text' : 'grey--text'">
                {{ folder.Count }}</span>
              </v-list-item-action>
            </v-list-item>
          </template>
          {{ folder.Name }}
        </v-tooltip>
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
        this.activeFolderId = to.params.folderId
      }
    }
  },

  created () {
    const activeZone = this.routeZone.group
    const folderId = this.$route.params.folderId
    if (activeZone === 'cases') {
      this.activeFolderId = +folderId || 'all'
    } else {
      this.activeFolderId = folderId || 'active'
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
    color: white !important;
  }

</style>
