<template>
  <v-navigation-drawer fixed
                       mini-variant
                       permanent>

    <v-list-item class="px-0 justify-center"
                 style="min-height: 47px; height: 47px;">
      <v-list-item-avatar>
        <v-tooltip right>
          <template #activator="{ on }">
              <v-img v-on="on"
                     src="@/assets/logo.png"
                     max-height="32px"
                     max-width="32px"
                     style="cursor: pointer;"
                     @click="$router.push({ name: 'home' })"/>
          </template>
          {{ $t('sideBar.toHome') }}
        </v-tooltip>
      </v-list-item-avatar>
    </v-list-item>

    <v-divider/>

    <v-list dense nav>
      <v-list-item-group v-model="activeZoneId"
                         mandatory
                         active-class="item-active"
                         class="d-flex flex-column align-center">

        <v-tooltip right
                   v-for="item in zones"
                   :key="item.title">
          <template #activator="{ on }">
            <v-list-item v-on="on"
                         @click="changeZone(item)"
                         class="pa-0 d-flex justify-center"
                         style="min-height: 36px; min-width: 36px">
              <v-list-item-action class="ma-0 pa-0 justify-center">
                <fa-icon :icon="item.icon"/>
              </v-list-item-action>
            </v-list-item>
          </template>
          {{ item.title }}
        </v-tooltip>
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
      if (zone.group === 'processes') {
        this.sideBarOpen = false
        this.expandOnHover = false
        this.miniVariant = true
      } else {
        this.sideBarOpen = true
        this.expandOnHover = false
        this.miniVariant = false
      }
      this.$router.push(zone.link)
    }
  }
}
</script>

<style scoped>

  .item-active {
    background: #42A5F6;
    color: white;
  }

</style>
