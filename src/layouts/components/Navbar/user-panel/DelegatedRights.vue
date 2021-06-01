<template>
  <div>
    <dialog-card :value="showRights" width="70%"
                 @close="closeDialog"
                 @input="$emit('input', $event)"
                 :title="$t('user.delegatedRights')" persistent>
      <template #text>
        <v-text-field v-model="search"
                      clearable
                      clear-icon="+"
                      class="mb-5"
                      single-line
                      hide-details>
          <template #label>
        <span class="subtitle-2 font-weight-light font-italic"
              style="color: #9e9e9e">{{ $t('search') }}</span>
          </template>

          <template #append>
            <fa-icon icon="search" color="#9e9e9e"
                     flip="horizontal" size="sm"
                     class="mt-2"/>
          </template>
        </v-text-field>
        <v-data-table dense
                      height="400px"
                      fixed-header
                      disable-pagination
                      hide-default-footer
                      :headers="headers"
                      :items="delegatedRights"
                      :search="search">
          <template #item="{ item: rights, index }">
            <tr :class="{'lime lighten-5': selectedRights.ID === rights.ID }"
                style="cursor: pointer; width: 100%;"
                @click="selectedRights = rights">
              <td class="text-center text-truncate"
                  style="min-width: 70px; font-size: 13px;">
                {{ index + 1 }}
              </td>
              <td class="text-truncate"
                  style="max-width: 250px; font-size: 13px;">
                <v-tooltip top>
                  <template #activator="{ on }">
                    <span v-on="on">{{ rights.FIO }}</span>
                  </template>
                  <span>{{ rights.FIO }}</span>
                </v-tooltip>
              </td>
              <td class="text-truncate"
                  style="max-width: 250px; font-size: 13px;">
                <v-tooltip top>
                  <template #activator="{ on }">
                    <span v-on="on">{{ rights.FIOSUB }}</span>
                  </template>
                  <span>{{ rights.FIOSUB }}</span>
                </v-tooltip>
              </td>
              <td class="text-center text-truncate"
                  style="max-width: 100px; font-size: 13px;">
                {{ formatTimeStamp(rights.DATEFROM) }}
              </td>
              <td class="text-center text-truncate"
                  style="max-width: 100px; font-size: 13px;">
                {{ formatTimeStamp(rights.DATETO) }}
              </td>
              <td class="text-truncate"
                  style="max-width: 250px; font-size: 13px;">{{ rights.COMM }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </template>
      <template #actions>
        <outlined-btn x-small
                      color="success"
                      icon="layer-plus"
                      :handler="() => $emit('add-delegation')">
          <span>{{ $t('buttons.add') }}</span>
        </outlined-btn>
        <v-spacer/>
        <outlined-btn x-small
                      color="primary"
                      icon="edit"
                      :disabled="!selectedRights.ID"
                      :handler="() => rightsEditDialog = true">
          <span>{{ $t('buttons.edit') }}</span>
        </outlined-btn>
        <outlined-btn x-small
                      color="red darken-4"
                      icon="trash"
                      :disabled="!selectedRights.ID"
                      :handler="() => deleteConfirmDialog = true">
          <span>{{ $t('buttons.delete') }}</span>
        </outlined-btn>

      </template>
    </dialog-card>

    <!-- Edit dialog-->
    <delegation-edit v-model="rightsEditDialog" :rights="selectedRights"/>

    <!-- Delete dialog-->
    <delete-confirm v-model="deleteConfirmDialog"
                    @confirm="deleteRights">
      <template #title>{{ $t('user.delete') }}</template>
      <template #text>
        <span class="subtitle-2">{{ $t('user.delConfirmText') }}</span>
        <br><br>{{ `- ${selectedRights.ID} ${selectedRights.FIOSUB}` }}
      </template>
    </delete-confirm>
  </div>
</template>

<script>
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'
import { userInfo, userMethods } from '@/mixins/users'
import { date } from '@/mixins/dateTime'

const DelegationEdit = () => import('./DelegationEdit')
const DeleteConfirm = () => import('@/components/DeleteConfirm')

export default {
  name: 'DelegatedRights',
  mixins: [userInfo, userMethods, date],
  model: {
    prop: 'showRights'
  },
  props: ['showRights'],
  components: {
    DialogCard,
    OutlinedBtn,
    DelegationEdit,
    DeleteConfirm
  },
  data: () => ({
    search: '',
    selectedRights: {},
    rightsEditDialog: false,
    deleteConfirmDialog: false
  }),
  computed: {
    headers () {
      return [
        { text: this.$t('listNumber'), align: 'center', sortable: false },
        { text: this.$t('user.header'), align: 'center', value: 'FIO' },
        { text: this.$t('user.subUser'), align: 'center', value: 'FIOSUB' },
        { text: this.$t('pickers.dateFrom'), align: 'center', value: 'DATEFROM' },
        { text: this.$t('pickers.dateTo'), align: 'center', value: 'DATETO' },
        { text: this.$t('table.comment'), align: 'center', value: 'COMM' }
      ]
    }
  },
  beforeDestroy () {
    this.search = ''
    this.selectedRights = {}
  },
  methods: {
    deleteRights () {
      this.$store.dispatch('editDelegatedRights', {
        mode: 'DELETE',
        id: this.selectedRights.ID
      }).then(result => !result || (this.selectedRights = {}))
    },
    closeDialog () {
      this.$emit('input', false)
      this.search = ''
      this.selectedRights = {}
    }
  }
}
</script>

<style scoped>

  .v-input >>> .v-input__append-inner > div > button {
    transform: rotate(45deg);
    font-size: 30px;
    user-select: none;
    margin-top: 0.3em;
  }

</style>
