<template>
  <v-row justify="center">
    <v-col>
      <dialog-card :value="showDialog"
                   width="400px" height="500px"
                   @input="$emit('input', $event)"
                   :title="$t('eds.sign')"
                   @close="$emit('input', false)">
        <template #text>

          <v-row>
            <v-col>
              <v-select
                v-model="signType"
                :label="$t('eds.signType')"
                :items="signItems"
                item-text="name"
                outlined dense
                class="body-1">
                <template #prepend-inner>
                  <v-icon small class="pt-1 pr-2">fas fa-key</v-icon>
                </template>
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col v-if="signType === 0">
              <v-file-input
                v-model="fileKey"
                :label="$t('eds.privateKey')"
                :placeholder="$t('eds.selectKey')"
                outlined dense
                prepend-icon=""
                clear-icon="fas fa-times"
                :show-size="1000"
                class="body-1">
                <template #prepend-inner>
                  <v-icon small class="pt-1 pr-2">fas fa-paperclip</v-icon>
                </template>
                <template #selection="{ text }">
                  <v-chip label small color="primary">{{ text }}</v-chip>
                </template>
              </v-file-input>
              <v-text-field v-model="password"
                            :label="$t('login.password')"
                            :placeholder="$t('login.passwordPlaceholder')"
                            outlined dense
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            class="body-1 red--text">
                <template #prepend-inner>
                  <v-icon small class="pt-1 pr-2">fas fa-unlock</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col v-if="signType === 1">
              {{ $t('eds.hardwareKey') }}
            </v-col>
            <v-col v-if="signType === 2">
              {{ $t('eds.mobileId') }}
            </v-col>
            <v-col v-if="signType === 3">
              {{ $t('eds.widget') }}
            </v-col>
            <v-col v-if="signType === 4">
              {{ $t('eds.depositSign') }}
            </v-col>
          </v-row>

        </template>
        <template #actions>
          <v-spacer></v-spacer>
          <outlined-btn x-small
                        color="primary"
                        icon="check"
                        :handler="() => {}">
            <span>{{ $t('eds.sign') }}</span>
          </outlined-btn>
        </template>
      </dialog-card>
    </v-col>
  </v-row>
</template>

<script>
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'

export default {
  name: 'EdsCreate',
  model: {
    prop: 'showDialog'
  },
  props: {
    signatures: Array,
    showDialog: Boolean
  },
  components: {
    DialogCard,
    OutlinedBtn
  },
  data: () => ({
    signType: 0,
    password: '',
    fileKey: []
  }),
  computed: {
    signItems () {
      return [
        {
          name: this.$t('eds.fileKey'),
          value: 0
        },
        {
          name: this.$t('eds.hardwareKey'),
          value: 1
        },
        {
          name: this.$t('eds.mobileId'),
          value: 2
        },
        {
          name: this.$t('eds.widget'),
          value: 3
        },
        {
          name: this.$t('eds.depositSign'),
          value: 4
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
