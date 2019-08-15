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
    workCenters() {
        return this.$store.getters['mes/workCenters'];
    },
    links() {
      if (!this.$store.state.applicationDescription) {
        return [];
      }
      
      const app = this.$store.state.applicationDescription;
      const sections = app.Sections || [];
      var links = [];
      for (let index = 0; index < sections.length; index++) {
        const section = sections[index];
        links = links.concat(
          (section.Routes || []).map(r => (r.section = section) && r)
        );
      }
      let workCenter,
        workCenterCodes = Object.keys(this.workCenters);
      if(workCenterCodes.length) {
        workCenter = this.workCenters[workCenterCodes[0]];
      }
      
      var pages = [];
      for(let page of links[1].Children) {
        if(workCenter && (workCenter.accessPages == 'ALL_PAGES' || page.Id == "STUFF")) {
          pages.push(page);
        }
      }

      pages = pages.sort((a,b) => {
        return a.Sort > b.Sort ? 1 : (a.Sort == b.Sort ? 0 : -1);
      });
      links = links.concat(pages);
      return links.filter(l => l.Name && l.Path);
    }
  }
};
</script>

<style>
  .v-list.theme--light a.v-list__tile--active{
    color: #326DA8 !important;
    caret-color: #326DA8 !important;
  }
</style>
