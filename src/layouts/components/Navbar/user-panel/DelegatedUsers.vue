<template>
  <dialog-card :value="showRights"
               width="700px" persistent
               @close="$emit('input', false)"
               @input="$emit('input', $event)"
               :title="$t('user.delegatedRights')">
    <template #text>

      <!-- Search field -->
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

      <!-- Delegated rights table -->
      <v-data-table dense
                    height="400px"
                    fixed-header
                    disable-pagination
                    hide-default-footer
                    :headers="headers"
                    :items="delegatedUsers"
                    :search="search">

        <template #item="{ item: rights, index }">
          <tr :class="{'lime lighten-5': selectedRights === rights.USERID }"
              style="cursor: pointer; width: 100%;"
              @click="selectedRights = rights.USERID">
            <td class="text-center text-truncate"
                style="max-width: 20px; font-size: 13px;">
              {{ index + 1 }}
            </td>
            <td class="text-truncate"
                style="max-width: 250px; font-size: 13px;">
              <v-tooltip top>
                <template #activator="{ on }">
                  <span v-on="on">{{ rights.USERNAME }}</span>
                </template>
                <span>{{ rights.USERNAME }}</span>
              </v-tooltip>
            </td>
            <td class="text-center text-truncate"
                style="max-width: 150px; font-size: 13px;">
              <v-tooltip top>
                <template #activator="{ on }">
                  <span v-on="on">{{ rights.USERID }}</span>
                </template>
                <span>{{ rights.USERID }}</span>
              </v-tooltip>
            </td>
            <td class="text-center" style="width: 150px;">
              <fa-icon v-if="rights.IsActive" icon="check" size="lg"/>
              <span v-else>-</span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </template>

    <!-- Apply delegated rights button -->
    <template #actions>
      <v-spacer/>
      <outlined-btn x-small
                    color="primary"
                    icon="edit"
                    :disabled="!selectedRights || selectedRights === userId"
                    :handler="() => applyDelegatedRights(selectedRights)">
        <span>{{ $t('buttons.apply') }}</span>
      </outlined-btn>
    </template>
  </dialog-card>
</template>

<script>
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'
import { userInfo, userMethods } from '@/mixins/users'

export default {
  name: 'DelegatedUsers',
  mixins: [userInfo, userMethods],

  model: {
    prop: 'showRights'
  },
  props: ['showRights'],

  components: {
    DialogCard,
    OutlinedBtn
  },

  data: () => ({
    search: '',
    selectedRights: ''
  }),

  computed: {
    headers () {
      return [
        { text: this.$t('listNumber'), align: 'center', sortable: false },
        { text: this.$t('user.name'), value: 'USERNAME' },
        { text: this.$t('user.id'), align: 'center', value: 'USERID' },
        { text: this.$t('user.isActive'), align: 'center', value: 'IsActive', filterable: false }
      ]
    }
  },

  beforeDestroy () {
    this.search = ''
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
