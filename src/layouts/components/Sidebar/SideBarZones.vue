<template>
  <v-navigation-drawer fixed permanent
                       :right="rtl"
                       mini-variant>

    <v-list-item class="px-0 justify-center"
                 style="min-height: 47px; height: 47px;">
      <v-list-item-avatar>
        <v-tooltip right>
          <template #activator="{ on }">

              <!-- Master icon -->
              <v-img v-if="iconset === 'Master'"
                     src="@/assets/icons/master-icon.svg"
                     max-height="35px"
                     max-width="35px"
                     style="cursor: pointer;"
                     @click="$router.push({ name: 'home' })"
                     v-on="on"/>

              <!-- It-enterprise icon -->
              <v-img v-else
                     src="@/assets/images/logo.png"
                     max-height="32px"
                     max-width="32px"
                     style="cursor: pointer;"
                     @click="$router.push({ name: 'home' })"
                     v-on="on"/>
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
                   v-for="zone in zones"
                   :key="zone.title">
          <template #activator="{ on }">
            <v-list-item v-on="on"
                         @click="zoneSelect(zone)"
                         class="pa-0 d-flex justify-center"
                         style="min-height: 36px; min-width: 36px">
              <v-list-item-action class="ma-0 pa-0 justify-center">
                <fa-icon :icon="zone.icon"/>
              </v-list-item-action>
            </v-list-item>
          </template>
          {{ zone.title }}
        </v-tooltip>
      </v-list-item-group>
    </v-list>
    <template #append>
      <div class="d-flex flex-column align-center mb-4">
        <v-tooltip right
                   v-for="(item, idx) in customLinks"
                   :key="idx">
          <template #activator="{ on }">
            <v-btn v-on="on" icon
                   :href="item.HyperLink"
                   target="_blank">
              <span v-if="item.Icon"
                    v-html="item.Icon"
                    class="link-icon"
                    :style="`margin-${isRight}: 1px;`"/>
              <fa-icon v-else
                       icon="question-circle"
                       size="lg"
                       color="#343434"/>
            </v-btn>
          </template>
          {{ item.Name }}
        </v-tooltip>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { sideBar } from '@/mixins/layout'
import { zones, folders } from '@/mixins/units'

export default {
  name: 'SideBarZones',
  mixins: [sideBar, zones, folders],

  data: () => ({
    initValues: {
      miniVariant: false,
      expandOnHover: false
    }
  }),

  computed: {
    iconset () {
      return window.appConfig.iconset
    }
  },

  created () {
    this.activeZoneId = this.routeZone.id || 0
  },

  watch: {
    activeZone (activeZone) {
      if (activeZone.group === 'processes') {
        this.sideBarLocked || this.lockSideBar()
      } else {
        !this.sideBarLocked || this.unlockSideBar()
      }
    },
    $route () {
      const zone = this.routeZone.group
      if (zone !== this.activeZone.group) {
        this.activeZoneId = this.routeZone.id
      }
    }
  },

  methods: {
    zoneSelect (zone) {
      if (zone.id !== this.activeZoneId) {
        this.$router.push(zone.link)
      }
    },
    setInitValues () {
      this.initValues.miniVariant = this.miniVariant
      this.initValues.expandOnHover = this.expandOnHover
    },
    lockSideBar () {
      this.setInitValues()
      if (!this.miniVariant) {
        this.miniVariant = true
      }
      this.expandOnHover = false
      // Locking must be last
      this.sideBarLocked = true
    },
    unlockSideBar () {
      // unlocking must be first
      this.sideBarLocked = false
      this.expandOnHover = this.initValues.expandOnHover
      this.miniVariant = this.initValues.miniVariant
    }
  }
}
</script>

<style scoped>

  .item-active {
    background: #42A5F6;
    color: white;
  }

  .link-icon {
    height: 19px;
    width: 19px;
    color: #343434;
    margin-top: 1px;
  }

</style>
