<template>
  <v-navigation-drawer id="navBar"
                       app permanent
                       width="300"
                       :expand-on-hover="!sideBarOpen"
                       style="padding-left: 3.4em">

      <v-navigation-drawer fixed dark
                           mini-variant
                           permanent>

        <v-list-item class="px-2"
                     style="height: 48px">
          <v-list-item-avatar>
            <v-img src="@/assets/logo.png"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-divider/>

        <v-list dense nav>
          <v-list-item v-for="item in items"
                       :key="item.title"
                       @click="mini = !mini">
            <v-list-item-action nav>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <template #append>
          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-icon>fas fa-question-circle</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-icon>fas fa-phone-square</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-icon>fas fa-rss-square</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </template>
      </v-navigation-drawer>

      <v-list dense rounded subheader>
        <v-subheader>TASKS</v-subheader>
          <v-list-item v-for="link in links"
                       :key="link" link>
            <v-list-item-icon class="mr-5">
              <v-icon>fas fa-folder</v-icon>
            </v-list-item-icon>
          <v-list-item-title v-text="link"/>
        </v-list-item>
      </v-list>
  </v-navigation-drawer>

</template>

<script>
import { sideBar } from '@/mixins/layout'

export default {
  name: 'TheSideBar',
  mixins: [sideBar],
  data: () => ({
    drawer: false,
    items: [
      { title: 'Home', icon: 'fas fa-tasks' },
      { title: 'About', icon: 'fas fa-suitcase' }
    ],
    links: ['Lorem ipsum dolor sit amet', 'Contacts', 'Settings']
  })
}
</script>

<style scoped>
  #navBar >>> .v-navigation-drawer__content {
    position: relative;
  }
</style>
