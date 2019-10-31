<template>
  <v-dialog v-if="show" v-model="show" max-width="1200px">
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
        <v-dialog v-model="form.show"  :persistent="form.loading" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" @click="createItem">{{ $t('bpmn.buttons.Add') }}</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ form.titles[form.mode] }}</span>
            </v-card-title>

            <v-card-text>
              <v-form ref="form">
                <v-radio-group v-model="form.editedItem.type" row :label="$t('bpmn.labels.Type')" :disabled="form.loading || form.mode !== 'create'">
                  <v-radio v-for="accessType in enums.accessType" :key="accessType"  :label="$t('bpmn.enums.AccessType.' + accessType)" :value="accessType"></v-radio>
                </v-radio-group>
                <v-text-field v-if="form.editedItem.type === 'GROUP'" :disabled="form.loading || form.mode !== 'create'"
                  v-model="form.editedItem.groupId" :rules="[form.rules.required]" :label="$t('bpmn.labels.Group')"></v-text-field>
                <v-text-field v-if="form.editedItem.type === 'USER'"  :disabled="form.loading || form.mode !== 'create'"
                  v-model="form.editedItem.userId" :rules="[form.rules.required]" :label="$t('bpmn.labels.User')"></v-text-field>
                <v-radio-group v-model="form.editedItem.allowAccess" :label="$t('bpmn.labels.Access')"
                   :disabled="form.loading || form.mode !== 'create'"
                >
                  <v-radio :label="$t('bpmn.labels.Allowed')" :value="true"></v-radio>
                  <v-radio :label="$t('bpmn.labels.Declined')" :value="false"></v-radio>
                </v-radio-group>
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
              <td>{{ props.item.type }}</td>
              <td>{{ props.item.group }}</td>
              <td>{{ props.item.user }}</td>
              <td>{{ props.item.rights }}</td>
              <td>{{ props.item.allowAccess }}</td>
              <td class="justify-center layout px-0">
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

export default {
  name: 'access-dialog',
  data() {
    return {
      show: false,
      headers: [
        { text: this.$t('bpmn.labels.Type'), value: 'type', align: 'center' },
        { text: this.$t('bpmn.labels.Group'), value: 'group', align: 'center' },
        { text: this.$t('bpmn.labels.User'), value: 'user', align: 'center' },
        { text: this.$t('bpmn.labels.Rights'), value: 'rights', align: 'center' },
        { text: this.$t('bpmn.labels.Access'), value: 'allowAccess', align: 'center' },
        { text: this.$t('bpmn.labels.Actions'), value: 'name', align: 'center', sortable: false }
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
        editedItem: new Models.DiagramAccess(),
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
          required: value => !!value || this.$t('bpmn.labels.RequiredField'),
          selectOne: value => (value && value.length > 0) || ' '
        }
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
          group: item.groupId,
          user: item.userId,
          rights: item.rights.map(right => this.$t('bpmn.enums.DiagramAccessRights.' + right)).join(', '),
          allowAccess: item.allowAccess ? this.$t('bpmn.labels.Allow') : this.$t('bpmn.labels.Decline')
        }
      });
      this.loading = false;
      this.recordId = diagramId;
    },
    createItem() {
      this.form.editedItem = new Models.DiagramAccess({ recordId: this.recordId, rights: [ Models.DiagramAccessRights.Read ] });
      this.form.mode = 'create';
      this.form.show = true;
    },
    editItem(item) {
      this.form.editedItem = new Models.DiagramAccess(item.model);
      this.form.mode = 'edit';
      this.form.show = true;
    },
    deleteItem(item) {
      this.form.editedItem = item.model;
      this.form.mode = 'delete';
      this.form.show = true;
    },
    formClose () {
      this.form.loading = false;
      this.form.show = false;
      this.form.editedItem = {}
    },
    async formSave () {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.form.loading = true;
      let result = false;
      
      switch (this.form.mode) {
      case 'create':
        result = await this.$store.dispatch('bpmn/giveAccessToProcess', this.form.editedItem);
        break;
      case 'edit':
        result = await this.$store.dispatch('bpmn/editAccessToProcess', this.form.editedItem);
        break;
      case 'delete':
        result = await this.$store.dispatch('bpmn/removeAccessToProcess', this.form.editedItem);
        break;
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