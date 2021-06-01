<template>
  <v-row justify="center">
    <v-dialog :value="noteInputDialog"
              @input="$emit('input', $event)"
              max-width="600">
      <v-card>
        <v-card-text>
          <v-textarea v-model="noteText"
                      :loading="loading"
                      autofocus/>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer/>
          <v-btn outlined x-small
                 color="blue-grey"
                 class="notes-btn"
                 :disabled="loading"
                 @click="closeDialog">
            <fa-icon icon="times" size="lg" :class="`${mr}-1`"/>
            <span>{{ $t('buttons.cancel') }}</span>
          </v-btn>
          <v-btn outlined x-small
                 color="success"
                 class="notes-btn"
                 :disabled="!noteText || noteText === initNoteText || loading"
                 @click="addOrUpdateNote">
            <fa-icon icon="save" size="lg" :class="`${mr}-1`"/>
            <span>{{ $t('buttons.save') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'NoteInput',
  model: {
    prop: 'noteInputDialog'
  },
  props: {
    noteInputDialog: Boolean,
    note: Object,
    roots: Object
  },
  data: () => ({
    loading: false,
    noteText: '',
    initNoteText: ''
  }),
  watch: {
    note (note) {
      this.initNoteText = note.Text
      this.noteText = this.note.Text
    }
  },
  methods: {
    async addOrUpdateNote () {
      this.loading = true
      const action = this.initNoteText ? 'updateNote' : 'addNote'
      await this.$store.dispatch(action, {
        roots: this.roots,
        noteId: this.note.NoteId,
        noteText: this.noteText
      })
      this.loading = false
      this.closeDialog()
    },
    closeDialog () {
      this.noteText = this.initNoteText
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>

  .notes-btn {
    min-height: 25px;
    min-width: 50px;
  }

  .notes-btn >>> span {
    height: 25px;
    width: 100%;
  }

  .notes-btn >>> span > span {
    display: flex;
    align-items: center;
  }

</style>
