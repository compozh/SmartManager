<template>
  <v-list>

    <!-- Пункт меню -->
    <v-list-item v-for="route in links" :key="route.Id" :to="{name:route.Id}">
      <v-list-item-action @click="reloadPage(route)">
          <v-icon large>{{route.Image}}</v-icon>
          <v-icon class="reload-icon" :color='obsoleteData.tasks ? "#009975" : "#326DA8"' v-if="$route.name == route.Id">refresh</v-icon>
      </v-list-item-action>

      <!-- Описание пункта меню -->
      <v-list-item-content  @click="reloadPage(route)">
        <v-list-item-title>{{ route.Name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>


  </v-list>
</template>
<script>
export default {
  name: 'mes-menu',
  computed: {
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    links() {
      if (!this.$store.state.WebApps.applicationDescription) {
        return []
      }

      const app = this.$store.state.WebApps.applicationDescription
      const sections = app.Sections || []
      var links = []
      for (let index = 0; index < sections.length; index++) {
        const section = sections[index]
        links = links.concat(
          (section.Routes || []).map(r => (r.section = section) && r)
        )
      }
      var pages = []
      for (let page of links[1].Children) {
        if (this.workCenter)  {
          switch (this.workCenter.accessPages) {
          case 'ALL_PAGES':
            pages.push(page)
            break
          case 'ONLY_INSTALLATION':
            if (page.Id == 'INSTALLATIONS') {
              pages.push(page)
            }
            break
          case 'ONLY_QUALITY':
            if (page.Id == 'QUALITY') {
              pages.push(page)
            }
            break
          }
        }
      }
      if (this.workCenter && this.$route.path.replace('/', '').toLowerCase() == 'mes') {
        var pagePath = ''
        switch (this.workCenter.accessPages) {
        case 'ALL_PAGES':
          pagePath = '/MES/tasks'
          break
        case 'ONLY_INSTALLATION':
          pagePath = '/MES/installations'
          break
        case 'ONLY_QUALITY':
          pagePath = '/MES/quality'
          break
        }
        this.$router.replace({path: pagePath})
      }
      pages = pages.sort((a,b) => {
        return a.Sort > b.Sort ? 1 : (a.Sort == b.Sort ? 0 : -1)
      })
      links = links.concat(pages)
      return links.filter(l => l.Name && l.Path)
    },
    obsoleteData() {
      return this.$store.getters['mes/obsoleteData']
    },
  },
  methods: {
    reloadPage(route) {
      if (this.$router.history.current.name != route.Id) {
        return
      }
      this.$store.commit('mes/changeMainContainerKey')
    }
  }
}
</script>

<style>
  .v-list.theme--light a.v-list-item--active{
    color: #326DA8 !important;
    caret-color: #326DA8 !important;
  }
  .v-navigation-drawer__content .v-list-item__content {
    padding: 0;
    height: 100%;
  }
  .v-navigation-drawer__content .v-list-item__title {
    font-size: 14px;
    height: 24px;
    line-height: 24px;
    font-weight: 500;
  }
  .v-navigation-drawer--mini-variant .v-list-item {
    justify-content: start;
  }
  .reload-icon {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 19px !important;
    font-weight: 800;
  }
  .v-navigation-drawer__content .v-list .v-list-item__action {
    margin-right: 0;
  }
  .v-navigation-drawer__content .v-list-item__title {
    margin-left: 10px;
    margin-top: 5px;
  }
</style>
