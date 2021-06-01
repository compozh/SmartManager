<template>
  <div :class="`d-flex align-center py-2 ${mr}-5`">
    <v-avatar color="grey lighten-1"
              :class="`${mr}-3`" size="40px">
      <fa-icon v-if="!creator.photo" icon="user" inverse/>
      <v-img v-else :src="creator.photo"/>
    </v-avatar>
    <div class="d-flex flex-column">
      <span class="overline">{{ $t('cases.creator') }}:</span>
      <div id="creator" class="body-2 text-truncate">
        {{ creator.fio }}
      </div>
    </div>
  </div>
</template>

<script>
import { users } from '@/mixins/users'

export default {
  name: 'CaseCreator',
  mixins: [users],
  props: ['userId'],
  computed: {
    creator () {
      return this.users.find(i => i.userId === this.userId) || {}
    }
  },
  watch: {
    creator (creator) {
      if (creator.fio) {
        // this.setPerformerInputWidth(creator.fio)
      }
    }
  },
  methods: {
    setPerformerInputWidth (userName) {
      const input = document.querySelector('#creator')
      if (input && userName) {
        input.style.width = (userName.length + 2) * 7 + 'px'
      }
    }
  }
}
</script>

<style scoped>

  #creator {
    color: #3f51b5 !important;
    caret-color: #3f51b5 !important;
    padding: 0 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

</style>
