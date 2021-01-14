<template>
  <dialog-card :value="showEdsReadInfo"
               width="60%" persistent
               @input="$emit('input', $event)"
               :title="$t('eds.detailInfo')">
    <template #text>
      <v-simple-table dense>
        <template>
          <tbody>
            <tr>
              <td class="font-weight-bold"
                  colspan="2">{{ $t('eds.signatoryInfo') }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.signatory') }}</td>
              <td>{{ signature.subjCN || signature.subjFullName }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.organization') }}</td>
              <td>{{ signature.subjOrg }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.position') }}</td>
              <td>{{ signature.subjTitle }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.city') }}</td>
              <td>{{ signature.subjLocality }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.address') }}</td>
              <td>{{ signature.subjAddress }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.phone') }}</td>
              <td>{{ signature.subjPhone }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold"
                  colspan="2">{{ $t('eds.additionalInfo') }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.email') }}</td>
              <td>{{ signature.subjEMail }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.organizationCode') }}</td>
              <td>{{ signature.subjEDRPOUCode || signature.subjDRFOCode }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold"
                  colspan="2">{{ $t('eds.certificateInfo') }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.keyCenter') }}</td>
              <td>{{ signature.issuerCN }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.serialNumber') }}</td>
              <td>{{ signature.serial }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
    <template #actions>
      <v-spacer/>
      <outlined-btn icon="times"
                    class="mr-2"
                    color="blue-grey"
                    :handler="() => $emit('input', false)">
        <span>{{ $t('buttons.cancel') }}</span>
      </outlined-btn>
      <outlined-btn x-small
                    color="success"
                    icon="check"
                    :handler="() =>  $emit('sign')">
        <span>{{ $t('eds.sign') }}</span>
      </outlined-btn>
    </template>
  </dialog-card>
</template>

<script>
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'

export default {
  name: 'EdsReadInfo',
  model: {
    prop: 'showEdsReadInfo'
  },
  props: {
    signature: Object,
    showEdsReadInfo: Boolean
  },
  components: {
    DialogCard,
    OutlinedBtn
  }
}
</script>

<style scoped>

</style>
