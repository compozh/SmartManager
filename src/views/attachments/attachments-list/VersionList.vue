<template>
  <v-simple-table dense>
    <template>
      <thead>
      <tr>
        <th class="text-center px-1">{{ $t('table.version') }}</th>
        <th class="text-center px-1">{{ $t('table.type') }}</th>
        <th class="text-center">{{ $t('table.name') }}</th>
        <th class="text-center">{{ $t('table.date') }}</th>
        <th class="text-center">{{ $t('table.fioAdd') }}</th>
        <th class="text-center">{{ $t('table.actions') }}</th>
        <th class="text-center px-1">{{ $t('table.sign') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(version, idx) in attachment.versions" :key="idx"
          :class="{'light-blue--text text--darken-4': version.IsActive,
                                 'lime lighten-5': version.Id === currentVersion.Id}"
          style="cursor: pointer; width: 100%;"
          @click="setActiveAttachment(attachment, version)">
        <td class="text-center" style="width: 50px; font-size: 13px;">
          {{ attachment.versions.length === 1 && version.Version === 0 ? 1 : version.Version }}
        </td>
        <td style="width: 35px;">
          <div class="d-flex justify-center">
            <file-type-icon :size="18"
                            :extension="version.Details.FileType"/>
          </div>
        </td>
        <td class="text-truncate"
            style="min-width: 5px; max-width: 200px; font-size: 13px;">
          <v-tooltip top>
            <template #activator="{ on }">
              <span v-on="on">{{ version.Name }}</span>
            </template>
            <span>{{ version.Name }}</span>
          </v-tooltip>
        </td>
        <td class="text-center text-truncate"
            style="max-width: 100px; font-size: 13px;">
          <v-tooltip top>
            <template #activator="{ on }">
                              <span v-on="on">
                                {{ formatVersionDate(version.Date) }}
                              </span>
            </template>
            <span>{{ formatVersionDate(version.Date) }}</span>
          </v-tooltip>
        </td>
        <td class="text-center text-truncate"
            style="max-width: 150px; font-size: 13px;">
          <v-tooltip top>
            <template #activator="{ on }">
              <span v-on="on">{{ version.User }}</span>
            </template>
            <span>{{ version.User }}</span>
          </v-tooltip>
        </td>
        <td class="text-center px-2">
          <div class="d-flex justify-center">
            <v-tooltip top>
              <template #activator="{ on }">
                <v-btn v-on="on"
                       :disabled="version.IsActive"
                       @click.stop="setActiveVersion(attachment.id, version)"
                       color="green"
                       class="mr-2"
                       style="border: 1px dashed;"
                       icon x-small depressed>
                  <fa-icon icon="check" type="fal" size="lg"/>
                </v-btn>
              </template>
              <span>{{ $t('versions.setActive') }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on }">
                <v-btn v-on="on"
                       :href="version.Details.SrcUrl"
                       @click.stop="() => {}"
                       color="blue"
                       class="mr-2"
                       style="border: 1px dashed;"
                       icon x-small depressed>
                  <fa-icon icon="arrow-alt-down" type="fal" size="lg"/>
                </v-btn>
              </template>
              <span>{{ $t('versions.download') }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on }">
                <v-btn v-on="on"
                       @click.stop="showNotes(version)"
                       color="warning"
                       class="mr-2"
                       style="border: 1px dashed;"
                       icon x-small depressed>
                  <fa-icon icon="exclamation" type="fal" size="lg"/>
                </v-btn>
              </template>
              <span>{{ $t('versions.notes') }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on }">
                <v-btn v-on="on"
                       :disabled="version.IsActive"
                       @click.stop="versionDeleteDialog(version)"
                       color="red darken-4"
                       style="border: 1px dashed;"
                       icon x-small depressed>
                  <fa-icon icon="times" type="fal"/>
                </v-btn>
              </template>
              <span>{{ $t('versions.delete') }}</span>
            </v-tooltip>
          </div>
        </td>
        <td class="text-center">
          <div>
            <fa-icon v-if="version.Signatures && version.Signatures.length"
                     icon="medal" size="lg"/>
            <span v-else>-</span>
          </div>
        </td>
      </tr>
      </tbody>
    </template>
    <notes v-model="notesDialog"
           :notes="notes"
           :roots="roots"/>
    <delete-confirm v-model="deleteConfirmDialog"
                    @confirm="deleteVersion(attachment, deleteParams.versionId)">
      <template #title>{{ $t('versions.delete') }}</template>
      <template #text>
        <span class="subtitle-2">{{ $t('versions.delConfirmText') }}</span>
        <br><br>{{ '- ' + deleteParams.fileName }}
      </template>
    </delete-confirm>
  </v-simple-table>
</template>

<script>
import { attachments } from '@/mixins/units'
import { date } from '@/mixins/dateTime'

const FileTypeIcon = () => import('@/components/FileTypeIcon')
const DeleteConfirm = () => import('@/components/DeleteConfirm')
const Notes = () => import('./Notes')

export default {
  name: 'VersionList',
  mixins: [attachments, date],
  props: {
    attachment: Object
  },
  components: {
    FileTypeIcon,
    DeleteConfirm,
    Notes
  },
  data: () => ({
    deleteConfirmDialog: false,
    deleteParams: {},
    notes: [],
    roots: {},
    notesDialog: false
  }),
  methods: {
    versionDeleteDialog (version) {
      this.deleteConfirmDialog = true
      this.deleteParams.versionId = version.Id
      this.deleteParams.fileName = `${version.Name} (${this.$t('table.version')} ${version.Version})`
    },
    showNotes (version) {
      this.notesDialog = true
      this.roots.attachmentId = this.attachment.id
      this.roots.versionId = version.Id
      if (version.Details) {
        // Notes must always be array, because adding note mutation used "unshift" method
        // and will be fail if value of notes be null as it is in initial object
        this.notes = version.Details.Notes = version.Details.Notes || []
      }
    }
  }
}
</script>

<style scoped>

</style>
