<template>
  <v-dialog v-if="show" v-model="show" max-width="1200px" scrollable>
    <v-card>
      <v-card-title primary-title>
        <h4 class="headline mb-0">{{ $t('bpmn.labels.Sharing') }}</h4>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          :label="$t('bpmn.labels.Search')"
          single-line
          hide-details
          clearable
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="form.show" :persistent="form.loading" max-width="500px" scrollable>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" @click="createItem">{{ $t('bpmn.buttons.Add') }}</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ form.titles[form.mode] }}</span>
            </v-card-title>

            <v-card-text>
              <v-form ref="form" onSubmit="return false;">
                <!-- <v-radio-group v-model="form.editedItem.type" row :label="$t('bpmn.labels.Type')" :disabled="form.loading || form.mode !== 'create'">
                  <v-radio v-for="accessType in enums.accessType" :key="accessType"  :label="$t('bpmn.enums.AccessType.' + accessType)" :value="accessType"></v-radio>
                </v-radio-group> -->
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
                <!-- <v-radio-group v-model="form.editedItem.allowAccess" :label="$t('bpmn.labels.Access')"
                   :disabled="form.loading || form.mode !== 'create'"
                >
                  <v-radio :label="$t('bpmn.labels.Allowed')" :value="true"></v-radio>
                  <v-radio :label="$t('bpmn.labels.Declined')" :value="false"></v-radio>
                </v-radio-group> -->
                <h5>{{ $t('bpmn.labels.AccessRights') }}</h5>
                <v-container fluid>
                  <v-layout row wrap>
                    <v-checkbox v-model="form.editedItem.rights" 
                      v-for="right in enums.diagramRights" :key="right" 
                      :label="$t('bpmn.enums.DiagramAccessRights.' + right)" :value="right"
                      :rules="[form.rules.selectOne]" :disabled="form.loading || form.mode === 'delete'">
                    </v-checkbox>
                   </v-layout>
                 </v-container>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="formClose" :disabled="form.loading">{{ $t('bpmn.buttons.Cancel') }}</v-btn>
              <v-btn color="blue darken-1" flat @click="formSave" :loading="form.loading">{{ form.actions[form.mode] }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn icon @click="show = false">
          <v-icon>close</v-icon>
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
                <v-icon v-if="props.item.model.type === 'USER'" :title="$t('bpmn.labels.User')" small>person</v-icon>
                <v-icon v-else-if="props.item.model.type === 'GROUP'" :title="$t('bpmn.labels.Group')" small>group</v-icon>
              </td>
              <td class="text-xs-left" :title="props.item.userId || props.item.groupId" >{{ props.item.userName || props.item.groupName || $t('bpmn.labels.All') }}</td>
              <td class="text-xs-left">{{ props.item.rights }}</td>
              <td class="justify-left layout">
                <v-icon :title="$t('bpmn.buttons.Edit')" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon :title="$t('bpmn.buttons.Delete')" small @click="deleteItem(props.item)">delete</v-icon>
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
import AutoCompleteBox from '../AutoCompleteBox';

export default {
  name: 'access-dialog',
  // eslint-disable-next-line
  components: { AutoCompleteBox },
  data() {
    return {
      show: false,
      headers: [
        { text: this.$t('bpmn.labels.Type'), value: 'type' },
        { text: this.$t('bpmn.labels.WhoHasAccess'), value: 'groupName' },
        { text: this.$t('bpmn.labels.Rights'), value: 'rights' },
        { text: this.$t('bpmn.labels.Actions'), value: 'name', align: 'left', sortable: false }
      ],
      pagination: {
        sortBy: 'type',
        rowsPerPage: -1
      },
      search: '',
      loading: false,
      enums: {
        accessType: Models.AccessType,
        diagramRights: Models.DiagramAccessRights
      },
      form: {
        editedIndex: -1,
        editedItem: { 
          recordId: null, 
          identities: [], 
          allowAccess: true, 
          type: Models.AccessType.All,
          rights: [ ] 
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
      recordId: '',
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
        this.recordId = null;
        this.items = [];
      }
    },
    'form.show'(newValue, oldValue) {
      if (oldValue && !newValue) {
        this.$refs.form.reset();
      }
    },
    'form.editedItem.rights'(value, oldValue) {
      if (oldValue.includes(Models.DiagramAccessRights.Read) && !value.includes(Models.DiagramAccessRights.Read)) {
        this.$nextTick(() => {
          this.form.editedItem.rights = [];
        });
      } else if (value.length && !value.includes(Models.DiagramAccessRights.Read)) {
        this.$nextTick(() => {
          this.form.editedItem.rights.push(Models.DiagramAccessRights.Read);
        });
      }
    }
  },
  methods: {
    async onShowAccessDialog(diagramId) {
      this.show = true;
      this.loading = true;
      
      let items = await this.$store.dispatch('bpmn/getAccessRecordsForProcess', diagramId);
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
          rights: item.rights.map(right => this.$t('bpmn.enums.DiagramAccessRights.' + right)).join(', '),
          allowAccess: item.allowAccess ? this.$t('bpmn.labels.Allow') : this.$t('bpmn.labels.Decline')
        }
      });
      this.loading = false;
      this.recordId = diagramId;
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
      var users = (await this.$store.dispatch('bpmn/queryUsers')).map(user => { return { ...user, type: 'user' } });
      var groups = (await this.$store.dispatch('bpmn/queryGroups')).map(group => { return { ...group, type: 'group' } });
      this.form.usersAndGroups.push(
        { id: '', name: this.$t('bpmn.labels.All'), type: 'all' },
        { divider: true },
        { header: this.$t('bpmn.labels.Users')},
        users,
        { divider: true },
        { header: this.$t('bpmn.labels.Groups')},
        groups );
      this.form.usersAndGroups = this.form.usersAndGroups.flat();
    },
    createItem() {
      this.form.editedItem.recordId = this.recordId;
      this.form.editedItem.rights = [ Models.DiagramAccessRights.Read ];
      this.form.mode = 'create';
      this.form.show = true;
    },
    editItem(item) {
      this.form.editedItem.recordId = item.model.recordId;
      this.form.editedItem.rights = item.model.rights;
      this.form.editedItem.identities.push(item.model.identity);
      this.form.mode = 'edit';
      this.form.show = true;
    },
    deleteItem(item) {
      this.form.editedItem.recordId = item.model.recordId;
      this.form.editedItem.rights = item.model.rights;
      this.form.editedItem.identities.push(item.model.identity);
      this.form.mode = 'delete';
      this.form.show = true;
    },
    formClose() {
      this.form.loading = false;
      this.form.show = false;
      this.form.editedItem.recordId = this.recordId;
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

      switch (this.form.mode) {
      case 'create':
        storeAction = 'bpmn/giveAccessToProcess';
        break;
      case 'edit':
        storeAction = 'bpmn/editAccessToProcess';
        break;
      case 'delete':
        storeAction = 'bpmn/removeAccessToProcess', this.form.editedItem;
        break;
      }

      for (let i = 0; i < this.form.editedItem.identities.length; i++) {
        const identity = this.form.editedItem.identities[i];
        const access = new Models.DiagramAccess(this.form.editedItem);
        const { type: identityType, name } = this.form.usersAndGroups.find(e => e.id === identity);

        switch (identityType) {
        case 'user':
          access.userId = identity;
          result = await this.$store.dispatch(storeAction, access);
          break;
        case 'group':
          access.groupId = identity;
          result = await this.$store.dispatch(storeAction, access);
          break;
        case 'all':
          result = await this.$store.dispatch(storeAction, access);
          break;
        }

        if (!result) {
          Notification.error('bpmn.errors.AccessError', { identity: name });
        }
      }

      if (result) {
        this.formClose();
        this.onShowAccessDialog(this.recordId);
      } else {
        Notification.error('bpmn.errors.RequestError');
        this.form.loading = false;
      }
    }
  }
}
</script>
<style>

</style>