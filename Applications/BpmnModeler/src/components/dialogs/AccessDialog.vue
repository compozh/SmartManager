<template>
  <v-dialog v-if="show" v-model="show" max-width="1200px" scrollable>
    <v-card>
      <v-card-title primary-title>
        <h4 class="headline mb-0">{{ $t('bpmn.labels.Sharing') }}</h4>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('bpmn.labels.Search')"
          single-line
          hide-details
          clearable
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" @click="createItem">{{ $t('bpmn.buttons.Add') }}</v-btn>
        <v-dialog v-model="form.show" :persistent="form.loading" max-width="500px" scrollable>
          <v-card>
            <v-card-title>
              <span class="headline">{{ form.titles[form.mode] }}</span>
            </v-card-title>

            <v-card-text>
              <v-form ref="form" onSubmit="return false;">
                <autocompletebox
                  v-model="form.editedItem.identities"
                  :queryItems="queryUsersAndGroups"
                  :disabled="form.loading || form.mode !== 'create'"
                  :rules="[form.rules.selectOne]"
                  :label="$t('bpmn.labels.WhoHasAccess')"
                  multiple
                >
                  <template #item="{ data }">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                        <v-list-tile-content>
                          <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                          <v-list-tile-sub-title v-html="data.item.id + ' ' + (data.item.login || '')"></v-list-tile-sub-title>
                        </v-list-tile-content>
                    </template>
                  </template>
                </autocompletebox>
                <p style="text-align: left; margin: 0;">{{ $t('bpmn.labels.AccessRights') }}</p>
                <v-container fluid>
                  <v-layout column>
                    <v-checkbox
                      class="rights-checkbox"
                      hide-details
                      v-model="form.editedItem.rights" 
                      v-for="right in enums.accessRights" :key="right" 
                      :label="$t('bpmn.enums.AccessRights.' + right)" 
                      :value="right"
                      :rules="[form.rules.selectOne]" 
                      :disabled="form.loading || form.mode === 'delete'">
                    </v-checkbox>
                   </v-layout>
                 </v-container>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="formClose" :disabled="form.loading">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
              <v-btn flat @click="formSave" :loading="form.loading" color="primary">{{ form.actions[form.mode] }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn icon @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 500px; overflow-y: auto;">
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          hide-actions
          :pagination.sync="pagination"
          item-key="id"
          :loading="loading"
          :no-data-text="$t('bpmn.labels.NoData')"
          :no-results-text="$t('bpmn.labels.NoData')"
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td class="text-xs-left">
                <v-icon v-if="props.item.model.type === 'USER'" :title="$t('bpmn.labels.User')" small>mdi-account</v-icon>
                <v-icon v-else-if="props.item.model.type === 'GROUP'" :title="$t('bpmn.labels.Group')" small>mdi-account-multiple</v-icon>
              </td>
              <td class="text-xs-left" :title="props.item.userId || props.item.groupId" >{{ props.item.userName || props.item.groupName || $t('bpmn.labels.All') }}</td>
              <td 
                v-for="right in enums.accessRights" :key="right" 
                class="text-xs-left">
                <v-checkbox
                  class="rights-checkbox"
                  hide-details
                  v-model="props.item.rights" 
                  :value="right"
                  :readonly="true">
                </v-checkbox>
              </td>
              <td class="justify-left layout">
                <v-icon :title="$t('bpmn.buttons.Edit')" small class="mr-2" @click="editItem(props.item)">mdi-pencil</v-icon>
                <v-icon :title="$t('bpmn.buttons.Delete')" small @click="deleteItem(props.item)">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { Notification } from 'element-ui';
import * as Models from '../../api/models';
import { eventBus } from '../../main';
import { events } from '../../constants';
import { map } from 'min-dash';

export default {
  name: 'access-dialog',
  data() {
    return {
      show: false,
      headers: [
        { text: '', value: 'type' },
        { text: this.$t('bpmn.labels.UserOrGroup'), value: 'groupName' },
        ...map(Models.AccessRights, right => { return { text: this.$t('bpmn.enums.AccessRights.' + right), value: 'rights' } }),
        { text: '', value: 'name', align: 'left', sortable: false }
      ],
      pagination: {
        sortBy: 'type',
        rowsPerPage: -1
      },
      search: '',
      loading: false,
      enums: {
        accessType: Models.AccessType,
        accessRights: Models.AccessRights
      },
      form: {
        editedIndex: -1,
        editedItem: { 
          id: '',
          record: null, 
          identities: [], 
          allowAccess: true, 
          type: Models.AccessType.All,
          rights: [] 
        },
        show: false,
        loading: false,
        title: '',
        mode: '',
        actions: {
          'create': this.$t('bpmn.buttons.Create'),
          'edit': this.$t('bpmn.buttons.Save'),
          'delete': this.$t('bpmn.buttons.Delete')
        },
        titles: {
          'create': this.$t('bpmn.labels.AddRights'),
          'edit': this.$t('bpmn.labels.EditRights'),
          'delete': this.$t('bpmn.labels.RemoveRights')
        },
        rules: {
          selectOne: value => (value && value.length > 0) || ' '
        },
        usersAndGroups: [],
      },
      record: null,
      items: []
    }
  },
  mounted() {
    eventBus.$on(events.modeler.showAccessDialog, this.onShowAccessDialog);
  },
  beforeDestroy() {
    eventBus.$off(events.modeler.showAccessDialog, this.onShowAccessDialog)
  },
  watch: {
    show(newValue, oldValue) {
      if (oldValue && !newValue) {
        this.record = null;
        this.items = [];
      }
    },
    'form.show'(newValue, oldValue) {
      if (oldValue && !newValue) {
        this.$refs.form.reset();
      }
    },
    'form.editedItem.rights'(value, oldValue) {
      if (oldValue.includes(Models.AccessRights.Read) && !value.includes(Models.AccessRights.Read)) {
        this.$nextTick(() => {
          this.form.editedItem.rights = [];
        });
      } else if (value.length && !value.includes(Models.AccessRights.Read)) {
        this.$nextTick(() => {
          this.form.editedItem.rights.push(Models.AccessRights.Read);
        });
      }
    }
  },
  methods: {
    async onShowAccessDialog(record) {
      this.show = true;
      this.loading = true;
      let items;

      console.log(record);
      if (record instanceof Models.Diagram) {
        items = await this.$store.dispatch('bpmn/getAccessRecordsForDiagram', record.id);
      } else if (record instanceof Models.Folder) {
        items = await this.$store.dispatch('bpmn/getAccessRecordsForFolder', record.id);
      }
     
      if (!items) {
        Notification.error(this.$t('bpmn.errors.AccessRecordsNotLoaded'));
        this.loading = false;
        this.show = false;
        return;
      }

      this.items = items.map(item => {
        return {
          model: item,
          id: item.id,
          type: this.$t('bpmn.enums.AccessType.' + item.type),
          groupId: item.groupId,
          groupName: item.groupName,
          userId: item.userId,
          userName: item.userName,
          rights: item.rights,
          allowAccess: item.allowAccess ? this.$t('bpmn.labels.Allow') : this.$t('bpmn.labels.Decline')
        }
      });
      this.loading = false;
      this.record = record;
    },
    async queryUsersAndGroups(filter) {
      if (!this.form.usersAndGroups.length) {
        await this.loadUsersAndGroups();
      }

      if (typeof filter !== 'string') {
        return this.form.usersAndGroups;
      }
      filter = filter.toLowerCase();
      return this.form.usersAndGroups.filter(item => {
        for (const key in item) {
          if (({}).hasOwnProperty.call(item, key)) {
            const property = item[key];
            if (property && property.toString().toLowerCase().indexOf(filter) >= 0) {
              return true;
            }
          }
        }
      });
    },
    async loadUsersAndGroups() {
      const users = await this.$store.dispatch('bpmn/queryUsers');
      const groups = await this.$store.dispatch('bpmn/queryGroups');

      this.form.usersAndGroups = [ { id: '', name: this.$t('bpmn.labels.All'), type: 'all' } ];

      if (users) {
        this.form.usersAndGroups.push(
          { divider: true },
          { header: this.$t('bpmn.labels.Users')},
          ...users.map(user => { return { ...user, type: 'user' } }),
        );
      }
      if (groups) {
        this.form.usersAndGroups.push(
          { divider: true },
          { header: this.$t('bpmn.labels.Groups')},
          ...groups.map(group => { return { ...group, type: 'group' } })
        );
      }
    },
    createItem() {
      this.form.editedItem.record = this.record;
      this.form.editedItem.rights = [ Models.AccessRights.Read ];
      this.form.mode = 'create';
      this.form.show = true;
    },
    editItem(item) {
      console.log(this.record);
      console.log(this);
      this.form.editedItem.id = item.model.id;
      this.form.editedItem.record = this.record;
      this.form.editedItem.rights = item.model.rights;
      this.form.editedItem.identities.push(item.model.identity);
      this.form.mode = 'edit';
      this.form.show = true;
    },
    deleteItem(item) {
      this.form.editedItem.id = item.model.id;
      this.form.editedItem.record = this.record;
      this.form.editedItem.rights = item.model.rights;
      this.form.editedItem.identities.push(item.model.identity);
      this.form.mode = 'delete';
      this.form.show = true;
    },
    formClose() {
      this.form.loading = false;
      this.form.show = false;
      this.form.editedItem.record = this.record;
      this.form.editedItem.identities = [];
      this.form.editedItem.rights = [];
    },
    async formSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.form.loading = true;
      let result = false;

      let storeAction;

      console.log(this.form.editedItem.record);
      const entityType = this.form.editedItem.record instanceof Models.Diagram ? 'Diagram' : this.form.editedItem.record instanceof Models.Folder ? 'Folder' : '';

      switch (this.form.mode) {
      case 'create':
        storeAction = 'bpmn/giveAccessTo' + entityType;
        break;
      case 'edit':
        storeAction = 'bpmn/editAccessTo' + entityType;
        break;
      case 'delete':
        storeAction = 'bpmn/removeAccessTo' + entityType;
        break;
      }

      for (let i = 0; i < this.form.editedItem.identities.length; i++) {
        const identity = this.form.editedItem.identities[i];

        const access = new Models.AccessParams({ id: this.form.editedItem.id, recordId: this.form.editedItem.record.id });
        access.rights = this.form.editedItem.rights;

        const { type: identityType, name } = this.form.usersAndGroups.find(e => e.id === identity);

        switch (identityType) {
        case 'user':
          access.userId = identity;
          break;
        case 'group':
          access.groupId = identity;
          break;
        case 'all':
          break;
        default:
          continue;
        }

        result = await this.$store.dispatch(storeAction, access);

        if (!result) {
          Notification.error('bpmn.errors.AccessError', { identity: name });
        }
      }

      if (result) {
        this.formClose();
        this.onShowAccessDialog(this.record);
      } else {
        Notification.error('bpmn.errors.RequestError');
        this.form.loading = false;
      }
    }
  }
}
</script>
<style>
.rights-checkbox {
  margin: 0;
}
</style>