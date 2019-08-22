<template>
  <v-treeview :open.sync="open"
              :items="models"
              :active.sync="activeModel"
              activatable
              style="text-align: left;">
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.isFolder">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else>mdi-file-tree</v-icon>
    </template>
    <template v-slot:append="{ item }">
      <v-menu close-on-click
              close-on-content-click
              offset-x
              offset-y>
        <template v-slot:activator="{ on }">
          <v-btn flat icon v-on="on">
            <v-icon>list</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-tile>
            <v-list-tile-avatar>
              <v-icon>edit</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>{{ $tc('Rename') }}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-avatar>
              <v-icon>delete</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>{{ $tc('Delete') }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </template>
  </v-treeview>
</template>
<script>
export default {
  name: 'bpmn-models',
  data() {
    return {
      open: [],
      active: [ this.$store.state.bpmn.activeModel.id ]
    };
  },
  methods: {
    setActiveItem(id) {
      if (id) {
        this.active.length = 0;
        this.active.push(id);
      }
    }
  },
  computed: {
    models() {
      return this.$store.state.bpmn.models;
    },
    activeModel: {
      get() {
        return this.active;
      },
      set(value) {
        if (value.length === 0) {
          this.setActiveItem(this.active[0])
          return;
        }

        if (value[0] === this.active[0]) {
          return;
        }
        this.active = value;
        this.$router.push({ path: `/bpmnmodeler/model/${value}` });
      }
    }
  },
  // watch: {
  //   active: {
  //     handler(value, oldValue) {
  //       if (!value.length) {
  //         if (!oldValue || !oldValue.length || value.push(oldValue[0])) {
  //           return;
  //         }
  //       }

  //       if (value === oldValue || value[0] === oldValue[0]) {
  //         return;
  //       }

  //       this.$router.push({ path: `/bpmnmodeler/model/${value}` });
  //     },
  //   }
  // },
  // beforeRouteEnter(to, from, next) {
  //   window.alert('beforeRouteEnter');
  //   next(vm => vm.setActiveItem(to.params.id));
  // },
  // beforeRouteUpdate(to, from, next) {
  //   window.alert('beforeRouteUpdate');
  //   this.setActiveItem(to.params.id);
  //   next();
  // },
};
</script>
<style>

</style>
