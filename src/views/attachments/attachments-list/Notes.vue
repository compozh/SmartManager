<template>
  <v-row justify="center">
    <v-dialog :value="showNotes"
              @input="$emit('input', $event)"
              width="1000px">
      <v-card class="d-flex flex-column flex-grow-1 overflow-hidden">
        <v-card-title class="subtitle-1 white--text blue-grey py-1">
          {{ $t('versions.notes') }}
          <v-spacer/>
          <v-btn icon small
                 depressed
                 class="notes-close mr-n5"
                 @click="$emit('input', false)">
            <fa-icon icon="times" type="fal"
                     size="lg" color="#fff"/>
          </v-btn>
        </v-card-title>
        <v-card-text class="d-flex flex-column flex-grow-1">
            <v-simple-table dense v-if="notes.length" fixed-header height="300px">
              <template>
                <thead>
                <tr>
                  <th class="text-center px-1">{{ $t('notes.fioAdd') }}</th>
                  <th class="text-center px-1">{{ $t('notes.dateAdd') }}</th>
                  <th class="text-center">{{ $t('notes.result') }}</th>
                  <th class="text-center">{{ $t('notes.fioWatch') }}</th>
                  <th class="text-center">{{ $t('notes.dateWatch') }}</th>
                  <th class="text-center">{{ $t('notes.comment') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(note, idx) in sortedNotes" :key="idx"
                    :class="{'lime lighten-5': note.NoteId === currentNote.NoteId}"
                    style="cursor: pointer; width: 100%;"
                    @click="currentNote = note">
                  <td class="text-center text-truncate"
                      style="max-width: 160px; font-size: 13px;">
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <span v-on="on">{{ note.UserAdd }}</span>
                      </template>
                      <span>{{ note.UserAdd }}</span>
                    </v-tooltip>
                  </td>
                  <td class="text-center text-truncate"
                      style="max-width: 120px; font-size: 13px;">
                    <v-tooltip top>
                      <template #activator="{ on }">
                              <span v-on="on">
                                {{ formatVersionDate(note.DateAdd) }}
                              </span>
                      </template>
                      <span>{{ formatVersionDate(note.DateAdd) }}</span>
                    </v-tooltip>
                  </td>
                  <td class="text-center" style="width: 20px;">
                    <fa-icon v-if="note.Corrected" icon="check" size="lg"/>
                    <span v-else>-</span>
                  </td>
                  <td class="text-center text-truncate"
                      style="max-width: 150px; font-size: 13px;">
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <span v-on="on">{{ note.UserCorr }}</span>
                      </template>
                      <span>{{ note.UserCorr }}</span>
                    </v-tooltip>
                  </td>
                  <td class="text-center text-truncate"
                      style="max-width: 100px; font-size: 13px;">
                    <v-tooltip top>
                      <template #activator="{ on }">
                          <span v-on="on">
                            {{ formatVersionDate(note.DateCorr) }}
                          </span>
                      </template>
                      <span>{{ formatVersionDate(note.DateCorr) }}</span>
                    </v-tooltip>
                  </td>
                  <td class="text-truncate"
                      style="min-width: 5px; max-width: 100px; font-size: 13px;">
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <span v-on="on">{{ note.Comment }}</span>
                      </template>
                      <span>{{ note.Comment }}</span>
                    </v-tooltip>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-else
                 class="subtitle-1 font-weight-light grey--text text--lighten-1">
              {{ $t('notes.noNotes') }}</div>
          <v-divider/>
          <perfect-scrollbar class="flex-grow-1 pt-2" style="height: 200px;">
            {{ currentNote.Text }}
          </perfect-scrollbar>
        </v-card-text>
        <v-divider/>
        <v-card-actions class="pa-4">
          <outlined-btn x-small
                        color="success"
                        icon="layer-plus"
                        :handler="() => noteInputDialog = true">
            <span>{{ $t('buttons.add') }}</span>
          </outlined-btn>
          <v-spacer/>
          <outlined-btn x-small
                        color="primary"
                        icon="edit"
                        :disabled="!currentNote.NoteId"
                        :handler="() => editNote()">
            <span>{{ $t('buttons.edit') }}</span>
          </outlined-btn>
          <outlined-btn x-small
                        color="red darken-4"
                        icon="trash"
                        :disabled="!currentNote.NoteId"
                        :handler="() => deleteConfirmDialog = true">
            <span>{{ $t('buttons.delete') }}</span>
          </outlined-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <note-input v-model="noteInputDialog"
                :roots="roots"
                :note="note"/>
    <delete-confirm v-model="deleteConfirmDialog"
                    @confirm="deleteNote">
      <template #title>{{ $t('notes.delete') }}</template>
      <template #text>
        <span class="subtitle-2">{{ $t('notes.delConfirmText') }}</span>
        <br><br>{{ '- ' + currentNote.Text }}
      </template>
    </delete-confirm>
  </v-row>
</template>

<script>
import DeleteConfirm from '@/components/DeleteConfirm'
import OutlinedBtn from '@/components/OutlinedBtn'
import NoteInput from './NoteInput'
import { date } from '@/mixins/dateTime'

export default {
  name: 'Notes',
  mixins: [date],
  model: {
    prop: 'showNotes'
  },
  props: {
    notes: Array,
    roots: Object,
    showNotes: Boolean
  },
  components: {
    NoteInput,
    DeleteConfirm,
    OutlinedBtn
  },
  data: () => ({
    currentNote: {},
    noteInputDialog: false,
    note: {},
    deleteConfirmDialog: false
  }),
  computed: {
    sortedNotes () {
      return this.dateSort(this.notes, 'DateAdd')
    }
  },
  watch: {
    notes (notes) {
      this.currentNote = notes.length ? this.sortedNotes[0] : {}
    }
  },
  methods: {
    editNote () {
      this.note = this.currentNote
      this.noteInputDialog = true
    },
    deleteNote () {
      this.$store.dispatch('deleteNote', {
        roots: this.roots,
        noteId: this.currentNote.NoteId
      })
    }
  },
  beforeDestroy () {
    this.currentNote = {}
  }
}
</script>

<style scoped>

  .v-dialog__content >>> .v-dialog {
    display: flex;
    flex-direction: column;
    min-height: 400px;
  }

  .v-card-text {
    flex-basis: 50%;
  }

  .notes-close:hover {
    transform: rotate(180deg);
  }

</style>
