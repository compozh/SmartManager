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
  name: "mes-menu",
  computed: {
    links() {
      if (!this.$store.state.applicationDescription) {
        return [];
      }
      const app = this.$store.state.applicationDescription;
      const sections = app.Sections || [];

      let links = [];
      for (let index = 0; index < sections.length; index++) {
        const section = sections[index];
        links = links.concat(
          (section.Routes || []).map(r => (r.section = section) && r)
        );
      }

      links = [...links, ...links[1].Children, ...links[0].Children];
      return links.filter(l => l.Name && l.Path);
    }
  }
};
</script>

