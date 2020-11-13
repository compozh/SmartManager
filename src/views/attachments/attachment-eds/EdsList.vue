<template>
  <v-row justify="center">
    <v-col>
      <dialog-card :value="showEds" width="70%"
                   @input="$emit('input', $event)"
                   :title="$t('eds.title')"
                   @close="$emit('input', false)">
        <template #text>
          <v-simple-table dense v-if="signatures.length" fixed-header height="300px">
            <template>
              <thead>
              <tr>
                <th class="text-center">{{ $t('table.status') }}</th>
                <th class="text-center">{{ $t('table.date') }}</th>
                <th class="text-center">{{ $t('eds.signatory') }}</th>
                <th class="text-center">{{ $t('eds.organization') }}</th>
                <th class="text-center">{{ $t('eds.position') }}</th>
                <th class="text-center">{{ $t('eds.code') }}</th>
                <th class="text-center">{{ $t('eds.keyCenter') }}</th>
                <th class="text-center">{{ $t('eds.comment') }}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(eds, idx) in signatures" :key="idx"
                  :class="{'lime lighten-5': eds.Id === currentEds.Id}"
                  style="cursor: pointer; width: 100%;"
                  @click="currentEds = eds">
                <td class="text-center">{{ eds.Verification }}</td>
                <td class="text-center">{{ formatVersionDate(eds.SignDate) }}</td>
                <td>{{ eds.Fio }}</td>
                <td>{{ eds.Organization }}</td>
                <td>{{ eds.Post }}</td>
                <td class="text-center">{{ eds.OrganizationStateCode }}</td>
                <td>{{ eds.KeyCenter }}</td>
                <td>{{ eds.Comm }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div v-else
               class="subtitle-1 font-weight-light grey--text text--lighten-1">
            {{ $t('eds.noEds') }}</div>
        </template>
        <template #actions>
          <outlined-btn x-small
                        color="success"
                        icon="file-signature"
                        :handler="() => edsCreateDialog = true">
            <span>{{ $t('eds.sign') }}</span>
          </outlined-btn>
          <outlined-btn x-small
                        color="purple"
                        icon="file-contract"
                        :handler="() => {}">
            <span>{{ $t('eds.addFromFile') }}</span>
          </outlined-btn>
          <v-spacer/>
          <outlined-btn x-small
                        color="primary"
                        icon="clipboard-check"
                        :disabled="!currentEds.Id"
                        :handler="() => checkEds()">
            <span>{{ $t('eds.check') }}</span>
          </outlined-btn>
          <outlined-btn x-small
                        color="red darken-4"
                        icon="trash"
                        :disabled="!currentEds.Id"
                        :handler="() => deleteConfirmDialog = true">
            <span>{{ $t('buttons.delete') }}</span>
          </outlined-btn>
        </template>
      </dialog-card>

      <!-- Create eds dialog -->
      <eds-create v-model="edsCreateDialog"/>

      <!-- Delete eds dialog -->
      <delete-confirm v-model="deleteConfirmDialog"
                      @confirm="deleteEds">
        <template #title>{{ $t('eds.delete') }}</template>
        <template #text>
          <span class="subtitle-2">{{ $t('eds.delConfirmText') }}</span>
          <br><br>{{ '- ' + currentEds.KeyNumber }}
        </template>
      </delete-confirm>
    </v-col>
  </v-row>
</template>

<script>
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'
import { date } from '@/mixins/dateTime'

const EdsCreate = () => import('./eds-create/EdsCreate')
const DeleteConfirm = () => import('@/components/DeleteConfirm')

export default {
  name: 'Eds',
  mixins: [date],
  model: {
    prop: 'showEds'
  },
  props: {
    signatures: Array,
    showEds: Boolean
  },
  components: {
    DialogCard,
    OutlinedBtn,
    EdsCreate,
    DeleteConfirm
  },
  data: () => ({
    currentEds: {},
    edsCreateDialog: false,
    deleteConfirmDialog: false
  }),
  methods: {
    checkEds () {
      console.log('checkNote')
    },
    deleteEds () {
      console.log('deleteNote')
    }
  },
  beforeDestroy () {
    this.currentEds = {}
  }
}
</script>

<style scoped>

</style>
