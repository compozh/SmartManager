<template>
  <dialog-card :value="showDialog"
               width="400px"
               :min-height="progressBar ? '150px' : '500px'"
               :title="$t('eds.eds')"
               :loading="loading"
               persistent
               :no-actions="progressBar"
               @input="$emit('input', $event)">

    <!-- Main content -->
    <template #text>
      <v-row v-if="!progressBar">
        <v-col class="pb-0 pt-12">

          <!-- Sign type selection -->
          <v-select v-model="keyType"
                    color="primary"
                    :label="$t('eds.signType')"
                    :items="signItems"
                    item-text="label"
                    item-value="value"
                    return-object
                    hide-details
                    menu-props="offsetY"
                    outlined dense
                    :disabled="loading || privateKeyIsSaved"
                    class="body-1 mb-8">
            <template #prepend-inner>
              <v-icon small :class="`pt-1 ${pr}-2`">fas fa-key</v-icon>
            </template>
          </v-select>

          <!-- Key center selection -->
          <v-autocomplete :items="issuerCNs"
                          v-model="issuerCN"
                          outlined dense
                          hide-details
                          class="body-1 mb-8"
                          autocomplete="off"
                          :disabled="loading || privateKeyIsSaved"
                          :label="$t('eds.serviceProvider')"
                          :placeholder="$t('eds.providerPlaceholder')">
            <template #prepend-inner>
              <v-icon small :class="`pt-1 ${pr}-2`">fas fa-passport</v-icon>
            </template>
          </v-autocomplete>

          <!-- File key -->
          <eds-file-key v-if="keyType.name === 'fileKey'"
                        v-model="fileKey"
                        :loading="loading || privateKeyIsSaved"
                        :password.sync="password"
                        @sign="toSign"/>

          <!-- Hardware key -->
          <eds-hardware-key v-if="keyType.name === 'hardwareKey'"
                            v-model="hardwareKey"
                            :key-medias="keyMedias"
                            :loading="loading || privateKeyIsSaved"
                            :password.sync="password"
                            @reload="reload"
                            @sign="toSign"/>

          <!-- Save key options -->
          <v-radio-group v-model="saveKeyOption"
                         hide-details
                         :disabled="loading"
                         dense class="eds-save">
            <v-radio :label="$t('eds.notSaveKey')"
                     value="notSave"
                     class="align-start mb-4"/>
            <v-radio :label="$t('eds.saveKeyInSession')"
                     value="saveInSession"
                     class="align-start mb-4"/>
<!--            <v-radio :label="$t('eds.saveKeyInBrowser')"-->
<!--                     value="saveInBrowser"-->
<!--                     class="align-start"-->
<!--                     disabled/>-->
          </v-radio-group>

        </v-col>
      </v-row>

      <!-- Progress bar for multiple sign -->
      <v-row v-else align="center" class="pt-4">
        <v-col>
          <v-progress-linear color="primary"
                             height="40"
                             :value="progressBarValue / attachments.length * 100"
                             striped>
            {{ progressBarValue }} / {{ attachments.length }}
          </v-progress-linear>
        </v-col>
      </v-row>

      <!-- Error message -->
      <v-alert v-if="error"
               outlined prominent
               color="warning"
               class="mb-6"
               border="left">

        <div class="body-2"
             v-html="error.message"
             style="word-break: break-word">
        </div>

        <!-- Refresh button -->
        <outlined-btn x-small
                      class="mt-4"
                      color="secondary"
                      icon="redo"
                      :handler="reload">
          <span>{{ $t('buttons.refresh') }}</span>
        </outlined-btn>
      </v-alert>
    </template>

    <!-- Dialog actions -->
    <template #actions>
      <v-spacer/>

      <!-- Cancel button -->
      <outlined-btn icon="times"
                    :class="`${mr}-2`"
                    color="blue-grey"
                    :disabled="loading"
                    :handler="() => $emit('input', false)">
        <span>{{ $t('buttons.cancel') }}</span>
      </outlined-btn>

      <!-- Sign button -->
      <outlined-btn x-small
                    color="success"
                    icon="check"
                    :disabled="isSignBtnDisabled"
                    :handler="toSign">
        <span>{{ $t('eds.sign') }}</span>
      </outlined-btn>

    </template>

  </dialog-card>
</template>

<script>
import EdsFileKey from './EdsFileKey'
import EdsHardwareKey from './EdsHardwareKey'
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'
import eds from '@/mixins/eds'

export default {
  name: 'EdsCreate',
  mixins: [eds],

  model: {
    prop: 'showDialog'
  },
  props: {
    attachment: Object,
    attachments: Array,
    showDialog: Boolean,
    multipleSign: Boolean
  },

  components: {
    EdsFileKey,
    EdsHardwareKey,
    DialogCard,
    OutlinedBtn
  },

  data: () => ({
    fileKey: null,
    hardwareKey: null,
    password: null,
    issuerCN: null,
    issuerCNs: [],
    saveKeyOption: 'notSave',
    progressBar: false
  }),

  computed: {
    signItems () {
      return [
        {
          name: 'fileKey',
          label: this.$t('eds.fileKey'),
          value: 0
        },
        {
          name: 'hardwareKey',
          label: this.$t('eds.hardwareKey'),
          value: 1
        }
      ]
    },

    isSignBtnDisabled () {
      switch (this.keyType.name) {
        case 'fileKey':
          return !this.fileKey || !this.password || this.loading
        case 'hardwareKey':
          return !this.password || this.loading
        default: return false
      }
    }
  },

  created () {
    this.$emit('update:loading', false)
  },

  async mounted () {
    if (this.privateKeyIsSaved) {
      this.toSign()
      return
    }

    this.loading = true
    try {
      this.dsInit()
      await this.postInitActions()
    } catch (e) {
      this.error = e
    }
    this.loading = false
  }
}
</script>
