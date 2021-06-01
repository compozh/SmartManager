<template>
  <dialog-card :value="showEdsDetails"
               width="60%"
               @input="$emit('input', $event)"
               :title="$t('eds.detailInfo')">
    <template #text>
      <v-simple-table dense>
        <template>
          <tbody>
            <tr>
              <td class="font-weight-bold">{{ $t('eds.signatory') }}</td>
              <td>{{ signature.Fio }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold"
                  colspan="2">{{ $t('eds.signatoryInfo') }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.name') }}</td>
              <td>{{ signature.Fio }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.organization') }}</td>
              <td>{{ signature.Organization }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.position') }}</td>
              <td>{{ signature.Post }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.city') }}</td>
              <td>{{ signature.City }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold"
                  colspan="2">{{ $t('eds.additionalInfo') }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.email') }}</td>
              <td>{{ signature.Email }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.organizationCode') }}</td>
              <td>{{ signature.OrganizationStateCode }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.signatoryCode') }}</td>
              <td>{{ signature.UserStateCode }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold"
                  colspan="2">{{ $t('eds.certificateInfo') }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.keyCenter') }}</td>
              <td>{{ signature.KeyCenter }}</td>
            </tr>
            <tr>
              <td>{{ $t('eds.serialNumber') }}</td>
              <td>{{ signature.KeyNumber }}</td>
            </tr>
            <tr>
              <td>{{ $t('pickers.dateFrom') }}</td>
              <td></td>
            </tr>
            <tr>
              <td>{{ $t('pickers.dateTo') }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="font-weight-bold">{{ $t('eds.timeStamp') }}</td>
              <td>{{ formatVersionDate(signature.SignDate) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
    <template #actions>
      <v-spacer/>
      <outlined-btn x-small
                    color="primary"
                    icon="check"
                    :handler="() => $emit('input', false)">
        {{ $t('buttons.ok') }}</outlined-btn>
    </template>
  </dialog-card>
</template>

<script>
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'
import { date } from '@/mixins/dateTime'

export default {
  name: 'EdsDetails',
  mixins: [date],
  model: {
    prop: 'showEdsDetails'
  },
  props: {
    signature: Object,
    showEdsDetails: Boolean
  },
  components: {
    DialogCard,
    OutlinedBtn
  }
}
</script>

<style scoped>

</style>
