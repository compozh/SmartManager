<template>
  <div :class="`d-flex align-center py-3 ${mr}-5`">

    <!-- Performer photo -->
    <v-avatar color="grey lighten-1"
              :class="`${mr}-3`" size="45px">
      <fa-icon v-if="!performer.photo" icon="user" inverse/>
      <v-img v-else :src="performer.photo"/>
    </v-avatar>

    <!-- Performer name -->
    <div class="d-flex flex-column">
      <span class="overline">{{ $t('tasks.performer') }}:</span>
      <v-autocomplete id="performer"
                      :value="performer"
                      @input="$emit('input', $event)"
                      :items="users"
                      :readonly="!taskEditable"
                      append-icon=""
                      solo flat dense
                      hide-details
                      hide-no-data
                      item-text="fio"
                      return-object
                      class="body-2 text-truncate">
      </v-autocomplete>
    </div>
  </div>
</template>

<script>
import { users } from '@/mixins/users'

export default {
  name: 'TaskPerformer',
  mixins: [users],
  model: {
    prop: 'performer'
  },
  props: {
    performer: Object
  },
  data: () => ({
    needInitValue: true,
    initTaskPerformerId: ''
  }),
  computed: {
    taskEditable () {
      return this.$store.state.tasks.taskEditable
    }
  },
  watch: {
    performer (performer, oldPerformer) {
      const userId = performer.userId
      const userExist = this.users.some(i => i.userId === userId)
      userExist || this.addUser(this.performer)
      if (this.needInitValue) {
        this.needInitValue = false
        this.initTaskPerformerId = userId
      }
      if (performer.fio) {
        this.setPerformerInputWidth(performer.fio)
      }
      if (userId !== oldPerformer.userId && userId !== this.initTaskPerformerId) {
        this.$store.commit('SET_TASK_CHANGED', true)
      }
    }
  },
  methods: {
    setPerformerInputWidth (userName) {
      const input = document.querySelector('#performer')
      if (input && userName) {
        input.style.width = (userName.length + 2) * 7 + 'px'
      }
    }
  }
}
</script>

<style scoped>

  .v-input >>> .v-input__control {
    min-height: 20px !important;
    padding: 0 !important;
  }

  .v-input >>> .v-input__slot {
    min-height: 20px !important;
    padding: 0 !important;
  }

  .v-input >>> #performer {
    color: #3f51b5 !important;
    caret-color: #3f51b5 !important;
    padding: 0 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

</style>
