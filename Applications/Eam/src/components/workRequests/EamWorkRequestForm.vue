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
                placeholder="Введите содержание заявки"
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
import createWorkRequest from '@/api/workRequests/mutations/createWorkRequest.gql'
import addWorkRequestAttachment from '@/api/workRequests/mutations/addWorkRequestAttachment.gql'
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
      addAttachmentQuery: addWorkRequestAttachment,
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
          mutation: createWorkRequest,
          variables: {
            workRequest: this.internalItem
          }
        })
        .then(result => {
          const mutationResult = result[Object.keys(result)[0]]
          const innerResult = mutationResult
            ? mutationResult[Object.keys(mutationResult)[0]]
            : {}
          if (
            innerResult &&
            innerResult.createWorkRequest &&
            innerResult.createWorkRequest.id
          ) {
            this.workRequestId = innerResult.createWorkRequest.id
            if (
              attachments &&
              attachments.upload &&
              attachments.files &&
              attachments.files.length
            ) {
              attachments.upload()
            } else {
              this.internalItem.content = ''
            }
            eventBus.$emit('workRequestAdded', innerResult.createWorkRequest)
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

<style scoped>
.v-card__title {
  background-color: rgb(232, 253, 158);
}
</style>