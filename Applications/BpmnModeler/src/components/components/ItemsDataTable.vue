<template>
  <v-row class="px-3">
    <v-data-table
      calculate-widths
      :headers="headers"
      :items="items"
      :hide-default-footer="items.length < 11"
      :search="search"
      :no-data-text="$t('bpmn.labels.NoDataText')"
      :footer-props="{
          itemsPerPageText: $t('bpmn.labels.PerPage'),
          itemsPerPageAllText: $t('bpmn.labels.All'),
          pageText : $t('bpmn.labels.Of') +' '+ items.length,
          showCurrentPage : true
        }"
      class="projects-table elevation-1 mt-0"
      @click:row="openProject">
      <template v-slot:header.actions="{ header }" >
        <v-row class="justify-end" style="max-width: 80%;" ><span  >{{ header.text }}</span></v-row>
      </template>
      <template v-slot:item.name="{ item }">
        <div class="item-name">
          <bpmn-tree-icon :node="item"></bpmn-tree-icon>
          {{ item.name }}
        </div>
      </template>
      <template v-slot:item.creationTime="{ item }">
        {{item.creationTime | formatDate}}
      </template>
      <template v-slot:item.editTime="{ item }">
        {{item.editTime | formatDate}}
      </template>
      <template v-slot:item.editorName="{ item }">
        {{findUser(item.editorName)}}
      </template>
      <template v-slot:item.ownerName="{ item }">
        {{findUser(item.ownerName)}}
      </template>
       <template v-slot:item.usersWithAccess="{ item }">
          <v-row justify="end" style="max-width: 90%">
            <div v-for="(access, i) in item.usersWithAccess" :key="access + i" class="px-2">
              <v-avatar :color="getColor(access)" size="41" :title="access" v-if="access">
                <span class="white--text">{{access | formatAvatar}}</span>
              </v-avatar>
                <v-icon v-else color="grey" class="pl-2" :title=" $t('bpmn.errors.Er403')">mdi-close </v-icon>
            </div>
          </v-row>
      </template>
      <template v-slot:item.actions="{ item }" >
        <v-row class="justify-end" style="max-width: 100%">
          <bpmn-contex-menu :item="item" 
              @edit="editItem" :crumb="true"
              @remove="removeItem" 
              offset>
            <template #activator="{ open }">
              <v-btn icon class="options"  @click="ev => ev.stopPropagation()" v-on="open" v-if="canEdit(item) && canShare(item)">
                <v-icon size="20">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
          </bpmn-contex-menu>
        </v-row>
      </template> 
    </v-data-table>
  </v-row>
</template>

<script>
import { formMixin } from '../mixins';
import * as Models from '../../api/models';
import moment from 'moment';
export default {
  name: 'item-data-table',
  mixins: [ formMixin ],
  data() {
    return {
      users: [],
      colors: {},
    };
  },
  props: {
    items: Array,
    activeItem: String,
    search: String,
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(value).format('DD MMMM  YYYY HH:mm');
      }
    },
    formatAvatar(value) {
      return value.length > 4 ? value.split(' ').map( el => el.slice(0,1)).join('') : value;
    }
  },
  methods: {
    canShare(item) {
      if (!item) { return false; }
      return item.hasRight(Models.AccessRights.Share);
    },
    canEdit(item) {
      if (!item) { return false; }
      return item.hasRight(Models.AccessRights.Write);
    },
    openProject(el) {
      this.active = el;
    },
    findUser(name) {
      if (this.$store.state.auth.user && name == this.$store.state.auth.user.userName) { 
        return this.$t('bpmn.labels.You');
      } else {
        return name;
      }
    },
    getColor(item) {
      let result,
        color = () => {
          let r = Math.floor(Math.random() * (100 - 25) + 25);
          let g = Math.floor(Math.random() * (206 - 25) + 25);
          let b = Math.floor(Math.random() * (256 - 25) + 25);
          let rgb = `rgb(${r}, ${g},${b})`;
          return rgb ;
        };
      if (!Object.keys(this.colors).find(el => el == item)) {
        result = color();
        this.colors[item] = result;
      } else {
        result = this.colors[item];
      }
      return result;
    },
  },
  computed: {
    active: {
      get() {
        return this.activeItem;
      },
      set(value) {
        if (value === this.activeItem) {
          return;
        }
        this.$emit('update:activeItem', value);
      }
    },
    headers() {
      return [
        {text: this.$t('bpmn.labels.Name'), value: 'name'},
        {text: this.$t('bpmn.labels.CreationTime'), value: 'creationTime'},
        {text: this.$t('bpmn.labels.EditTime'), value: 'editTime'},
        {text: this.$t('bpmn.labels.Editor'), value: 'editorName'},
        {text: this.$t('bpmn.labels.Owner'), value: 'ownerName'},
        {text: '', value: 'usersWithAccess' , sortable: false},
        {text: this.$t('bpmn.labels.Actions'), value: 'actions', sortable: false}];
    },
  },
};
</script>
<style lang="scss" >
.projects-table {
  width: 100%;
  margin: 20px 10px;
  padding: 10px;
  tr {
   cursor: pointer;

    th.text-start {
      padding: 0 10px;
      font-size: 13px
    }
    td {
      font-size: 12px;
      padding: 0 10px;
      .item-name {
        min-width: 20vw; 
        max-width: 30vw;
        .v-icon {
          padding-right: 8px;
          padding-bottom: 8px;
          max-height: 12px;
        }
      }
    }
  }
}

</style>