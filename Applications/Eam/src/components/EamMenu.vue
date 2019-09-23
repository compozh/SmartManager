<template>
  <v-list>
    <v-list-tile v-for="route in links" :key="route.Id" :to="{name:route.Id}">
      <v-list-tile-action>
        <v-icon>{{route.Image}}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ route.Name }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>
<script>
export default {
  name: 'eam-menu',
  computed: {
    links() {
      const app = this.$store.state.WebApps.applicationDescription
      if (!app) {
        return []
      }
      
      const sections = app.Sections || []
      let links = []
      const isLoggedIn = this.isLoggedIn
      for (let index = 0; index < sections.length; index++) {
        const section = sections[index]
        links = links.concat(
          (section.Routes || [])
            .filter(
              r =>
                (!r.HideAfterLogin && isLoggedIn) ||
                (r.AllowAnonymous && !isLoggedIn)
            )
            .map(r => (r.section = section) && r)
        )
      }

      links = [...links, ...links[0].Children]
      return links.filter(l => l.Name && l.Path)
    },
    isLoggedIn() {
      return !!this.$authentication.currentUser
    }
  }
}
</script>

