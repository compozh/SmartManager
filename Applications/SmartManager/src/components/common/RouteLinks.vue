<template>

    <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile @click="" v-for="route in links" :key="route.Id"  :to="{name:route.Id}" active-class="active">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>
                <!-- <router-link  class="nav-link" > -->
                    {{ route.Name }}
                <!-- </router-link> -->
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
</template>
<script>
export default {
  name: 'route-links',
  computed: {
    links(){
      if(!this.$store.state.applicationDescription){
        return []
      }
      var app = this.$store.state.applicationDescription
      var sections = app.Sections || []

      // Достаем роуты из разделов
      var links = []
      for (let index = 0; index < sections.length; index++) {
        const section = sections[index]
        links = links.concat((section.Routes || []).map(r=> (r.section = section) && r))
      }

      links = [...links, ...links[1].Children, ...links[0].Children]
      return links.filter(l => l.Name)

    }
  }
}
</script>

