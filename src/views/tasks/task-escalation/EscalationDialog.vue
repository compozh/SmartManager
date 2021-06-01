<template>
  <dialog-card :value="showDialog"
               width="50%"
               @input="$emit('input', $event)"
               :title="$t('tasks.newEscalation')"
               @close="$emit('input', false)">

    <template #text>
      <formio-form-component class="formio"
                             ref="form"
                             :formCode="formCode"
                             :formDefinition="formDefinition"/>
    </template>

    <!-- Dialog actions -->
    <template #actions>
      <v-spacer/>

      <!-- Cancel button -->
      <outlined-btn icon="times"
                    :class="`${mr}-2`"
                    color="blue-grey"
                    :handler="() => $emit('input', false)">
        <span>{{ $t('buttons.cancel') }}</span>
      </outlined-btn>

      <!-- Sign button -->
      <outlined-btn x-small
                    color="success"
                    icon="check"
                    :handler="createEscalation">
        <span>{{ $t('buttons.create') }}</span>
      </outlined-btn>

    </template>

  </dialog-card>
</template>

<script>
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'

export default {
  name: 'EscalationDialog',

  model: {
    prop: 'showDialog'
  },
  props: {
    showDialog: Boolean,
    formCode: String,
    formDefinition: Object
  },

  components: {
    DialogCard,
    OutlinedBtn
  },

  methods: {
    createEscalation () {
      const variables = this.$refs.form.submission
      this.$emit('create-escalation', variables)
      this.$emit('input', false)
    }
  }
}
</script>
