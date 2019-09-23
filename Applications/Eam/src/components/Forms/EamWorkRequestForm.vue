<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ formTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-form v-model="form">
        <v-container grid-list-md :class="{'pa-0' : $vuetify.breakpoint.mdAndDown}" pb-0 pt-0>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              <eam-direction-select v-model="internalItem.workRequestDirectionId" required></eam-direction-select>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <eam-category-select v-model="internalItem.workRequestCategoryId" required></eam-category-select>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <eam-equipment-autocomplete v-model="internalItem.equipmentId" required></eam-equipment-autocomplete>
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="internalItem.content"
                label="Содержание"
                box
                :rules="internalItem.content.length ? [rules.length(10)] : []"
              ></v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-layout wrap :class="{'ml-4 mr-4' : $vuetify.breakpoint.mdAndUp}">
        <v-flex xs12 sm10>
          <eam-add-attachment-control
            ref="attachments"
            :variables="attachmentVariables"
            :query="addAttachmentQuery"
            @filesUploaded="filesUploaded"
          ></eam-add-attachment-control>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs12 sm2>
          <v-btn
            block
            medium
            class="white--text"
            color="green accent-4"
            :disabled="!form || !internalItem.content"
            :loading="loading"
            @click="save"
          >Добавить</v-btn>
        </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
import { CREATE_WORK_REQUEST } from '@/api/eam-queries.js'
import { ADD_WORK_REQUEST_ATTACHMENTS } from '@/api/eam-queries.js'
import { eventBus } from '@/main'

export default {
  name: 'eam-work-request-form',

  props: {
    item: Object,
    action: String,
    updateCache: Object,
    query: Object
  },

  data: vm => {
    return {
      internalItem: {
        workRequestDirectionId:
          vm.item && vm.item.workRequestDirectionId
            ? vm.item.workRequestDirectionId
            : '',
        workRequestCategoryId:
          vm.item && vm.item.workRequestCategoryId
            ? vm.item.workRequestCategoryId
            : '',
        equipmentId: vm.item && vm.item.equipmentId ? vm.item.equipmentId : '',
        content: vm.item && vm.item.content ? vm.item.content : ''
      },
      addAttachmentQuery: ADD_WORK_REQUEST_ATTACHMENTS,
      dialog: false,
      form: false,
      workRequestId: 0,
      rules: {
        length: len => v =>
          (v || '').length >= len || `Длина должна быть больше ${len} символов`
      }
    }
  },

  computed: {
    formTitle() {
      return 'Добавить заявку'
    },
    loading() {
      return this.$store.getters['eam/loading']
    },
    attachmentVariables() {
      return { workRequestId: this.workRequestId }
    }
  },

  methods: {
    save() {
      const attachments = this.$refs.attachments
      this.$apollo
        .mutate({
          mutation: CREATE_WORK_REQUEST,
          variables: {
            workRequest: this.internalItem
          }
        })
        .then(result => {
          if (
            result.data &&
            result.data.eamMutation &&
            result.data.eamMutation.createWorkRequest &&
            result.data.eamMutation.createWorkRequest.id
          ) {
            this.workRequestId = result.data.eamMutation.createWorkRequest.id
            if (attachments && attachments.upload) {
              attachments.upload()
            } else {
              this.internalItem.content = ''
            }
            eventBus.$emit(
              'workRequestAdded',
              result.data.eamMutation.createWorkRequest
            )
          }
        })
    },
    filesUploaded() {
      this.internalItem.content = ''
      console.log('Files uploaded')
    }
  }
}
</script>

<style>
</style>