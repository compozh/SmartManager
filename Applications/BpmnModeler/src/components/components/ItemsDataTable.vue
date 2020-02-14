<template>
  <v-row class="px-3">
    <v-data-table
      calculate-widths
      :headers="headers"
      :items="rows"
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
      @click:row="openProject"
    >
      <!-- <template v-slot:header.name="{ header }" >
        <span style="font-size: 16px;" >{{ header.text }}</span>
      </template> -->
      <template v-slot:header.actions="{ header }" >
        <v-row class="justify-end" style="max-width: 100%;" ><span  >{{ header.text }}</span></v-row>
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
       <template v-slot:item.access="{ item }">
        <v-avatar :color="item.color" size="41" :title="item.access" v-if="item.access">
          <span class="white--text">{{item.access | formatAvatar}}</span>
        </v-avatar>
          <v-icon v-else color="grey" class="pl-2" :title=" $t('bpmn.errors.Er403')">mdi-close </v-icon>
      </template>
      <template v-slot:item.actions="{ item }" >
        <v-row class="justify-end" style="max-width: 100%">
          <bpmn-contex-menu :item="item" 
              @edit="editItem" :crumb="true"
              @remove="removeItem" 
              offset>
            <template #activator="{ open }">
              <v-btn icon class="options"  @click="ev => ev.stopPropagation()" v-on="open">
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
      colors: []
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
        moment.locale('ru');
        return moment(value).format('DD MMMM  YYYY HH:mm');
      }
    },
    formatAvatar(value) {
      return value.length > 4 ? value.split(' ').map( el => el.slice(0,1)).join('') : value;
    }
  },
  methods: {
    openProject(el) {
      this.active = el;
    },
    async loadUsers() {
      this.users = await this.$store.dispatch('bpmn/queryUsers');
    },
    findUser(userId) {
      if (this.$store.state.auth.user && userId == this.$store.state.auth.user.id) { 
        return this.$t('bpmn.labels.You');
      }
    
      if (this.users.length == 0 || !this.users) { return userId; }
      let user = this.users.find( user => user.id == userId ),
        result = user ? user.name : userId;
      return result;
    },
    async getAccessRecords(item) {
      let res;
      if (!item.hasRight(Models.AccessRights.Share)) {
        res =  null;
      } else {
        let [params] = await this.$store.dispatch('bpmn/getAccessRecordsForFolder', item.id);
        let owner = item.ownerId == this.$t('bpmn.labels.You') ? this.$store.state.auth.user.userName : item.ownerId;
        res = params ? params.userName || params.groupName  || this.$t('bpmn.enums.AccessType.' + params.type) || owner : owner;

        let color = () => {
          let r = Math.floor(Math.random() * (100 - 25) + 25);
          let g = Math.floor(Math.random() * (206 - 25) + 25);
          let b = Math.floor(Math.random() * (256 - 25) + 25);
          let rgb = `rgb(${r}, ${g},${b})`;
          return rgb ;
        };
        item.color = item.color ? item.color : color();
      }
     
      item.access = res;
      return res;
    },
    async getAccesses() {
      let processArray =  async (array) => {
        const promises = array.map(item => {
          return this.getAccessRecords(item);
        });
        await Promise.all(promises);
      };
      await processArray(this.rows);
      this.$forceUpdate();
    },
  },
  computed: {
    rows() {
      if (this.items.length > 0) { this.loadUsers(); }
      let rows = this.items.map(  item => {
        item.editorId =  this.findUser(item.editorId);
        item.ownerId =  this.findUser(item.ownerId);
        return item;
      });
      return rows;
    },
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
        {text: this.$t('bpmn.labels.Editor'), value: 'editorId'},
        {text: this.$t('bpmn.labels.Owner'), value: 'ownerId'},
        {text: '', value: 'access' , sortable: false},
        {text: this.$t('bpmn.labels.Actions'), value: 'actions', sortable: false}];
    },
  },
  updated() {
    let property = !this.rows.every( it => it.hasOwnProperty('access'));
    if (this.rows.length > 0 && property) {
      this.getAccesses();
    }
  }
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