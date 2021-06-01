<template>
  <div>
    <dialog-card :value="showEds" width="70%"
                 @input="$emit('input', $event)"
                 :title="$t('eds.title')"
                 :loading="loading"
                 @close="$emit('input', false)">
      <template #text>

        <!-- Signatures table -->
        <v-simple-table v-if="signatures && signatures.length"
                        dense fixed-header height="300px">
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
              <tr v-for="(sign, idx) in signatures" :key="idx"
                :class="{'lime lighten-5': sign.Id === currentEds.Id}"
                style="cursor: pointer; width: 100%;"
                @click="currentEds = sign">

              <td class="text-center px-0">
                <fa-icon v-if="checkingSigns === sign.Id" icon="sync" class="custom-loader" color="grey"/>
                <fa-icon v-else icon="award" size="lg" :color="checkIconColor(sign.Id)"/>
              </td>

              <td class="text-center text-field text-truncate px-0"
                  style="max-width: 90px;">{{ formatVersionDate(sign.SignDate) }}</td>

              <td class="text-field text-truncate">{{ sign.Fio | capitalize }}</td>
              <td class="text-field text-truncate">{{ sign.Organization }}</td>
              <td class="text-field text-truncate">{{ sign.Post }}</td>
              <td class="text-field text-center text-truncate">{{ sign.OrganizationStateCode }}</td>
              <td class="text-field text-truncate">{{ sign.KeyCenter }}</td>
              <td class="text-field text-truncate">{{ sign.Comm }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-skeleton-loader v-else-if="detailsLoading"
                           type="table-tbody"
                           height="180"/>

        <div v-else
             class="subtitle-1 font-weight-light grey--text text--lighten-1">
          {{ $t('eds.noEds') }}
        </div>
      </template>

      <template #actions>
        <outlined-btn x-small
                      color="success"
                      icon="file-signature"
                      :handler="showEdsCreateDialog">
          <span>{{ $t('eds.sign') }}</span>
        </outlined-btn>
        <outlined-btn v-if="privateKeyIsSaved"
                      x-small
                      color="warning"
                      icon="file-times"
                      :handler="resetPrivateKey">
          <span>{{ $t('eds.clearKey') }}</span>
        </outlined-btn>
        <v-spacer/>
        <outlined-btn x-small
                      color="purple"
                      icon="info-circle"
                      :disabled="!currentEds.Id"
                      :handler="() => showDetails = true">
          <span>{{ $t('eds.details') }}</span>
        </outlined-btn>
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
    <eds-create v-if="edsCreateDialog"
                v-model="edsCreateDialog"
                :loading.sync="loading"
                :attachment="attachmentParams"/>

    <!-- Eds details dialog -->
    <eds-details v-if="showDetails"
                 v-model="showDetails"
                 :signature="currentEds"/>

    <!-- Delete eds dialog -->
    <delete-confirm v-if="deleteConfirmDialog"
                    v-model="deleteConfirmDialog"
                    @confirm="deleteEds">

      <template #title>{{ $t('eds.delete') }}</template>
      <template #text>
        <span class="subtitle-2">{{ $t('eds.delConfirmText') }}</span>
        <br><br>{{ '- ' + currentEds.KeyNumber }}
      </template>
    </delete-confirm>
  </div>
</template>

<script>
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'
import { date } from '@/mixins/dateTime'

const EdsCreate = () => import('./eds-create/EdsCreate')
const EdsDetails = () => import('./EdsDetails')
const DeleteConfirm = () => import('@/components/DeleteConfirm')

export default {
  name: 'EdsList',
  mixins: [date],

  filters: {
    capitalize (value) {
      if (!value) { return '' }
      const transform = i => {
        return i.charAt(0).toUpperCase() + i.slice(1).toLowerCase()
      }
      return value.split(' ').map(transform).join(' ')
    }
  },

  model: {
    prop: 'showEds'
  },
  props: {
    showEds: Boolean,
    signatures: Array,
    attachmentParams: Object,
    detailsLoading: Boolean
  },

  components: {
    DialogCard,
    OutlinedBtn,
    EdsCreate,
    EdsDetails,
    DeleteConfirm
  },

  data: () => ({
    currentEds: {},
    checkingSigns: null,
    verifiedSigns: [],
    filedSigns: [],
    edsCreateDialog: false,
    deleteConfirmDialog: false,
    showDetails: false,
    loading: false
  }),

  computed: {
    checkIconColor () {
      return id => {
        switch (true) {
          case this.verifiedSigns.includes(id):
            return '#33691E'
          case this.filedSigns.includes(id):
            return '#B71C1C'
          default: return 'grey'
        }
      }
    },

    privateKeyIsSaved () {
      return this.$store.state.app.privateKeyIsSaved
    }
  },

  methods: {
    async checkEds () {
      this.loading = true
      this.checkingSigns = this.currentEds.Id
      const result = await this.$store.dispatch('checkSign', this.currentEds.Id)
      if (result.VERIFICATION === '+') this.verifiedSigns.push(this.currentEds.Id)
      if (result.VERIFICATION === '-') this.filedSigns.push(this.currentEds.Id)
      this.checkingSigns = null
      this.loading = false
    },

    showEdsCreateDialog () {
      this.loading = true
      this.edsCreateDialog = true
    },

    async deleteEds () {
      await this.$store.dispatch('deleteSign', {
        attachmentId: this.attachmentParams.fileId,
        signId: this.currentEds.Id
      })
      this.currentEds = {}
      this.$emit('update:eds', {})
    },

    resetPrivateKey () {
      if (window.ds) {
        window.ds.resetPrivateKey()
      }
      this.$store.commit('SET_PRIVATE_KEY', false)
    }
  },

  beforeDestroy () {
    this.currentEds = {}
  }
}
</script>

<style scoped>

  .text-field {
    font-size: 13px !important;
  }

  .custom-loader {
    animation: loader 1s infinite;
  }

  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

</style>
