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
          <version-btns :version="version"
                        :access="attachment.access"
                        :sign-btn-active="privateKeyIsSaved"
                        @set-active="setActiveVersion(attachment.id, version)"
                        @show-notes="showNotes(version)"
                        @sign="signVersion(version)"
                        @delete="versionDeleteDialog(version)"/>
        </td>
        <td class="text-center">
          <div>

            <!-- EDS dialog button -->
            <v-tooltip top>
              <template #activator="{ on }">
                <v-btn v-on="on"
                       :color="isSign(version) ? 'amber' : 'purple'"
                       @click.stop="showEds(version)"
                       icon small depressed>
                  <fa-icon :icon="isSign(version) ? 'award' : 'file-contract'"
                           type="fal" fixed-size="20"/>
                </v-btn>
              </template>
              <span>{{ $t('eds.title') }}</span>
            </v-tooltip>
          </div>
        </td>
      </tr>
      </tbody>
    </template>

    <!-- Notes list -->
    <notes v-model="notesDialog"
           :access="attachment.access"
           :notes="notes"
           :roots="roots"/>

    <!-- Delete version dialog -->
    <delete-confirm v-model="deleteConfirmDialog"
                    @confirm="deleteVersion(attachment, deleteParams.versionId)">
      <template #title>{{ $t('versions.delete') }}</template>
      <template #text>
        <span class="subtitle-2">{{ $t('versions.delConfirmText') }}</span>
        <br><br>{{ '- ' + deleteParams.fileName }}
      </template>
    </delete-confirm>

    <!-- Eds list-->
    <eds v-if="edsDialog"
         v-model="edsDialog"
         :signatures="version.Details.Signatures"
         :attachmentParams="versionParams"/>

    <!-- Create eds dialog -->
    <eds-create v-if="edsCreateDialog"
                v-model="edsCreateDialog"
                :attachment="versionParams"/>
  </v-simple-table>
</template>

<script>
import FileTypeIcon from '@/components/FileTypeIcon'
import VersionBtns from './VersionBtns'
import { attachments } from '@/mixins/units'
import { date } from '@/mixins/dateTime'
import eds from '@/mixins/eds'

const DeleteConfirm = () => import('@/components/DeleteConfirm')
const Notes = () => import('../attachment-notes/Notes')
const Eds = () => import('../attachment-eds/EdsList')
const EdsCreate = () => import('../attachment-eds/eds-create/EdsCreate')

export default {
  name: 'VersionList',
  mixins: [attachments, eds, date],

  props: {
    attachment: Object
  },

  components: {
    FileTypeIcon,
    DeleteConfirm,
    Notes,
    VersionBtns,
    Eds,
    EdsCreate
  },

  data: () => ({
    deleteConfirmDialog: false,
    deleteParams: {},
    roots: {},
    notes: [],
    version: {},
    versionParams: {},
    notesDialog: false,
    edsDialog: false,
    edsCreateDialog: false
  }),

  computed: {
    isSign: () => version => !!version.Details?.Signatures?.length
  },

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
        this.notes = version.Details.Notes || []
      }
    },

    signVersion (version) {
      this.getVersionParams(version)
      this.edsCreateDialog = true
    },

    showEds (version) {
      this.getVersionParams(version)
      this.edsDialog = true
    },

    getVersionParams (version) {
      this.version = version
      this.versionParams = {
        isVersion: true,
        fileId: version.Id,
        fileUrl: version.Details.FileUrl,
        fileSize: version.FileSize,
        fileExt: version.FileExt
      }
    }
  }
}
</script>
