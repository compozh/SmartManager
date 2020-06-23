<template>
  <div>
    <list-header v-model="attachmentsListMode"/>

    <!-- UPLOAD COMPONENT -->
    <files-upload v-slot="{ files }" upload-auto>
        <v-simple-table>
          <template>
            <tbody>
            <tr v-for="item in files"
                :key="item.id"
                class="grey--text">
              <td style="width: 30px;">
                <v-progress-circular
                  :size="25"
                  :value="item.progress"
                  :width="3"
                  color="primary"
                  class="caption"/>
              </td>
              <td class="text-truncate" style="max-width: 0;">{{ item.name }}</td>
              <td style="width: 100px;">{{ fileSize(item.size) }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
    </files-upload>

    <perfect-scrollbar v-show="attachments.length">
<!--                       style="max-height: 300px;"-->
      <div v-if="attachmentsListMode" class="py-2 d-flex flex-wrap">
        <v-chip v-for="item in attachments"
                :key="item.id" small
                class="my-2 mr-2 text-truncate"
                :class="{ warning: item.id === activeAttachment.id }"
                style="min-width: 100px; max-width: 33%; flex: 1 1 24%"
                @click="selectAttachment(item)">
          <fa-icon icon="file-alt" class="mr-3" size="lg"/>
          <span class="text-truncate">{{ item.fileName }}</span>
        </v-chip>
      </div>
      <div v-else>
        <v-data-table
          :headers="headers"
          :items="attachments"
          item-key="id"
          show-expand
          :expanded.sync="expanded"
          disable-filtering
          disable-pagination
          disable-sort
          hide-default-footer>

          <template #item="{ item, index, headers, expand, isExpanded }">
            <v-hover #default="{ hover }">
              <tr style="cursor: pointer; width: 100%;"
                  :class="{ 'light-blue lighten-5': item.id === activeAttachment.id }"
                  @click="selectAttachment(item)">
                <td class="px-1">
                  <v-btn icon :loading="item.loading"
                         @click.stop="expandVersions(item, expand, isExpanded)">
                    <fa-icon icon="chevron-right" size="xs"
                             style="transition: transform .2s"
                             :style="{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }"/>
                    <template #loader>
                      <span class="custom-loader">
                        <fa-icon icon="sync"/>
                      </span>
                    </template>
                  </v-btn>
                </td>
                <td class="text-center px-0"
                    style="width: 30px;">
                  <file-type-icon :extension="item.fileExt"/>
                </td>
                <td class="text-truncate"
                    style="max-width: 0;">{{ item.fileName }}</td>
                <td :class="hover ? 'text-right' : 'text-center text-truncate'"
                    style="width: 150px; max-width: 120px;">
                  <span v-if="!hover">{{ item.date }}</span>
                  <v-tooltip v-if="hover" top>
                    <template #activator="{ on }">
                      <v-btn v-on="on"
                             @click.stop
                             color="grey"
                             class="mr-8"
                             style="border: 1px dashed;"
                             text fab x-small dark depressed>
                        <fa-icon icon="files-medical" type="fal" size="2x"/>
                      </v-btn>
                    </template>
                    <span>{{ 'Add version' /* TODO: add resource */ }}</span>
                  </v-tooltip>
                  <v-tooltip v-if="hover && item.srcUrl" top>
                    <template #activator="{ on }">
                      <v-btn v-on="on"
                             :href="item.srcUrl"
                             @click.stop
                             color="grey"
                             style="border: 1px dashed;"
                             text fab x-small dark depressed>
                        <fa-icon icon="arrow-alt-down" type="fal" size="2x"/>
                      </v-btn>
                    </template>
                    <span>{{ 'Download' /* TODO: add resource */ }}</span>
                  </v-tooltip>
                </td>
                <td :class="hover ? 'text-left' : 'text-center text-truncate'"
                    style="width: 100px; max-width: 0;">
                  <span v-if="!hover">{{ fileSize(item.fileSize) }}</span>
                  <v-tooltip v-else top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on"
                             color="grey"
                             style="border: 1px dashed;"
                             @click="attachmentDelete(item.id)"
                             text fab x-small dark depressed>
                        <fa-icon icon="trash" type="fal" size="lg"/>
                      </v-btn>
                    </template>
                    <span>{{ 'Delete' /* TODO: add resource */ }}</span>
                  </v-tooltip>
                </td>
                <td class="text-center" style="width: 20px;">
                  <div v-if="!hover">
                    <fa-icon v-if="item.isSign" icon="medal" size="lg"/>
                    <span v-else>-</span>
                  </div>
                </td>
              </tr>
            </v-hover>
          </template>

          <template #expanded-item="{ item }">
            <tr class="expanded" style="transition: all .4s">
                <td :colspan="headers.length + 1" class="pl-10 pr-0 pb-5">
                  <v-simple-table dense>
                    <template>
                      <thead>
                      <tr>
                        <th>{{ $t('table.sign') }}</th>
                        <th>{{ $t('table.date') }}</th>
                        <th>{{ $t('table.version') }}</th>
                        <th>{{ $t('table.fioAdd') }}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(version, index) in item.versions"
                          :key="index"
                          :class="{'font-weight-medium': version.IsActive}"
                          @click="() => {}">
                        <td>Sign</td>
                        <td>{{ version.Date }}</td>
                        <td>{{ version.Version }}</td>
                        <td>{{ version.User }}</td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </tr>
          </template>
          <template #group="{ group }">
            group {{ group }}
          </template>
        </v-data-table>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import ListHeader from './ListHeader'
import FilesUpload from '@/views/attachments/attachments-upload/FilesUpload'
import FileTypeIcon from '@/components/FileTypeIcon'
import { common, tasks, attachments } from '@/mixins/units'

export default {
  name: 'AttachmentsList',
  mixins: [common, tasks, attachments],
  components: {
    ListHeader,
    FilesUpload,
    FileTypeIcon
  },
  data: () => ({
    attachmentsListMode: false,
    loading: false,
    expanded: []
  }),
  computed: {
    headers () {
      return [
        { text: this.$t('table.type'), value: 'type', align: 'center' },
        { text: this.$t('table.name'), value: 'name', align: 'center' },
        { text: this.$t('table.date'), value: 'date', align: 'center' },
        { text: this.$t('table.size'), value: 'size', align: 'center' },
        { text: this.$t('table.sign'), value: 'sign', align: 'center' }
      ]
    }
  },
  created () {
    this.getAttachmentTypes()
    if (this.attachments.length && !this.activeAttachment.id) {
      this.selectAttachment(this.attachments[0])
    }
  },
  methods: {
    selectAttachment (attachment) {
      this.setActiveAttachment(attachment)
      this.$emit('selectAttachment')
    },
    async expandVersions (item, expand, isExpanded) {
      if (item.versions || isExpanded) {
        expand(!isExpanded)
      } else {
        item.loading = true
        await this.getAttachmentDetails(item)
        item.loading = false
        expand(!isExpanded)
      }
    }
  }
}
</script>

<style scoped>

  .v-data-table >>> th:nth-child(2) {
    padding-left: 0;
    padding-right: 0;
  }

  tr.expanded:hover {
    background: none !important;
  }

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }

  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

</style>
