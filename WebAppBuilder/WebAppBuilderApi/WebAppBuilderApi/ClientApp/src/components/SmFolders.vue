<template >
  <v-layout fill-height>
    <v-flex xs3>
      <v-list subheader class="sub">
        <v-subheader inset>
          <h2>Папки</h2>
        </v-subheader>
        <v-list-tile v-for="folder in folders" :key="folder.code" :to="{name:'SMARTMANAGERTASKS',     params:{foldercode:(folder.code ||'ALL')}}" active-class="sm_active-folder">
          <v-list-tile-action>
            <v-icon>folder</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <span>{{folder.name}}</span>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-flex>

    <v-flex xs9 ml-4>
      <router-view name="SmTaskFolder"/>
    </v-flex>
  </v-layout>
</template>


<script>
// var router= ({})
export default {
  name: "sm-folders",
  data: () => ({
    pagSync: {
      rowsPerPage: -1
    }
  }),
  props: ["folders"]
};
</script>
<style >
.sm_active-folder{
  background:#ededed;
}
</style>