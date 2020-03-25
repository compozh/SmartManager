<template>
  <v-navigation-drawer id="navBar"
                       app permanent
                       max-width="300"
                       :expand-on-hover="!sideBarOpen"
                       style="padding-left: 3.4em">

      <v-navigation-drawer fixed
                           mini-variant
                           permanent>

        <v-list-item class="px-0 justify-center"
                     style="height: 48px">
          <v-list-item-avatar>
            <v-img src="@/assets/logo.png"/>
          </v-list-item-avatar>
        </v-list-item>

        <v-divider/>

        <v-list dense nav>
          <v-list-item-group v-model="activeZone"
                             active-class="item-active">
            <v-list-item v-for="item in zones"
                         :key="item.title">
              <v-list-item-action class="justify-center">
                <fa-icon :icon="['fal', item.icon]"/>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <template #append>
          <v-list>
            <v-list-item>
              <v-list-item-action class="justify-center">
                <fa-icon :icon="['fal', 'question-square']" size="lg"/>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-action class="justify-center">
                <fa-icon :icon="['fal', 'phone-square']" size="lg"/>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-action class="justify-center">
                <fa-icon :icon="['fal', 'rss-square']" size="lg"/>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </template>
      </v-navigation-drawer>

      <v-list dense nav subheader>
        <v-subheader>{{ zones[activeZone].title.toUpperCase() }}</v-subheader>
        <v-list-item-group v-model="activeFolder"
                           active-class="item-active">
          <v-list-item v-for="folder in zones[activeZone].folders"
                       :key="folder.Code"
                       :to="'/tasks/' + folder.Code"
                       :value="activeFolder">
            <v-list-item-icon class="mr-2 align-center">
              <fa-icon :icon="['fal', 'folder-open']"
                       v-if="folder.Code === folderId"/>
              <fa-icon v-else :icon="['fal', 'folder']"/>
            </v-list-item-icon>
          <v-list-item-title v-text="folder.Name"/>
        </v-list-item>
        </v-list-item-group>
      </v-list>
  </v-navigation-drawer>

</template>

<script>
import { sideBar } from '@/mixins/layout'
import { folders, tasks } from '@/mixins/units'

export default {
  name: 'TheSideBar',
  mixins: [sideBar, folders, tasks],
  data: () => ({
    drawer: false,
    activeZone: 0,
    activeFolder: 0
  }),
  computed: {
    zones () {
      return [
        {
          title: this.$t('sideBar.tasksBtn'),
          folders: [...this.taskFolders, ...this.filters],
          icon: 'tasks'
        },
        {
          title: this.$t('sideBar.casesBtn'),
          folders: this.caseFolders,
          icon: 'suitcase'
        },
        {
          title: this.$t('sideBar.forceBpm'),
          folders: [],
          icon: 'project-diagram'
        }
      ]
    }
  },
  watch: {
    $route (to) {
      if (to.name.includes('list')) {
        this.$store.commit('SET_CURRENT_FOLDER', to.params.folderId)
      }
    }
  }
}
</script>

<style scoped>
  #navBar >>> .v-navigation-drawer__content {
    position: relative;
  }

  .item-active {
    background: #5F81FF;
    color: white;
  }
</style>
