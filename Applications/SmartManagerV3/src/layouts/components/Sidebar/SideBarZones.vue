<template>
  <v-navigation-drawer fixed
                       mini-variant
                       permanent>

    <v-list-item class="px-0 justify-center"
                 style="height: 48px">
      <v-list-item-avatar>
        <v-img src="@/assets/logo.svg"/>
      </v-list-item-avatar>
    </v-list-item>

    <v-divider/>

    <v-list dense nav>
      <v-list-item-group v-model="activeZoneId"
                         mandatory
                         active-class="item-active">
        <v-list-item v-for="item in zones" @click="changeZone(item)"
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
  </v-navigation-drawer>
</template>

<script>
import { sideBar } from '@/mixins/layout'
import { zones, folders } from '@/mixins/units'

export default {
  name: 'SideBarZones',
  mixins: [sideBar, zones, folders],
  created () {
    this.activeZoneId = 0
  },
  methods: {
    changeZone (zone) {
      switch (zone.id) {
        case 0:
          this.sideBarOpen = true
          this.expandOnHover = false
          this.miniVariant = false
          this.$router.push('/tasks/active')
          break
        case 1:
          this.sideBarOpen = true
          this.expandOnHover = false
          this.miniVariant = false
          this.$router.push('/tasks/cases')
          break
        case 2:
          this.sideBarOpen = false
          this.expandOnHover = false
          this.miniVariant = true
          this.$router.push('/processes')
          break
      }
    }
  }
}
</script>

<style scoped>

  .item-active {
    background: #5F81FF;
    color: white;
  }

</style>
