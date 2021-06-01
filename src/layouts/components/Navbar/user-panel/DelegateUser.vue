<template>
  <dialog-card :value="showUsers" width="700px"
               @input="$emit('input', $event)"
               :title="$t('user.delegateRights')"
               @close="closeDialog" persistent>
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
                    :headers="headers"
                    :items="users"
                    :search="search"
                    :footer-props="{'items-per-page-text': $t('user.usersPerPage') }">
        <template #item="{ item: user }">
          <tr :class="{'lime lighten-5': selectedUser === user.userId }"
              style="cursor: pointer; width: 100%; font-size: 13px;"
              @click="selectedUser = user.userId">
            <td class="text-truncate">
              <v-avatar color="grey lighten-1" :class="`${mr}-3`" size="25px">
                <fa-icon v-if="!user.photo" icon="user" inverse/>
                <v-img v-else :src="user.photo"/>
              </v-avatar>
              {{ user.fio }}
            </td>
            <td class="text-center text-truncate">
              {{ user.userId }}
            </td>
          </tr>
        </template>

      </v-data-table>
    </template>
    <template #actions>
      <v-spacer/>
      <outlined-btn x-small
                    color="primary"
                    icon="check-circle"
                    :disabled="!selectedUser"
                    :handler="() => dateSelection = true">
        <span>{{ $t('buttons.select') }}</span>
      </outlined-btn>
      <date-selection v-model="dateSelection" :user-id="selectedUser"/>
    </template>
  </dialog-card>
</template>

<script>
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'
import DateSelection from './DateSelection'
import { users } from '@/mixins/users'

export default {
  name: 'DelegateUser',
  mixins: [users],
  model: {
    prop: 'showUsers'
  },
  props: ['showUsers'],
  components: {
    DialogCard,
    OutlinedBtn,
    DateSelection
  },
  data: () => ({
    search: '',
    selectedUser: '',
    dateSelection: false
  }),
  computed: {
    headers () {
      return [
        { text: this.$t('user.name'), value: 'fio' },
        { text: this.$t('user.id'), align: 'center', value: 'userId' }
      ]
    }
  },
  beforeDestroy () {
    this.search = ''
  },
  methods: {
    closeDialog () {
      this.search = ''
      this.$emit('input', false)
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
