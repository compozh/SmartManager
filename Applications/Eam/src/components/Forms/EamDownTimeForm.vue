<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ formTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-form v-model="form">
        <v-container grid-list-md :class="{'pa-0' : $vuetify.breakpoint.mdAndDown}" pb-0 pt-0>
          <v-layout wrap>
            <v-flex xs12>
              <eam-direction-select v-model="internalItem.additionalData.directionId" required></eam-direction-select>
            </v-flex>
            <v-flex xs12>
              <eam-failure-type-select v-model="internalItem.additionalData.failureTypeId" required></eam-failure-type-select>
            </v-flex>
            <v-flex xs12>
              <eam-failure-reason-select
                v-model="internalItem.additionalData.failureReasonId"
                required
              ></eam-failure-reason-select>
            </v-flex>
            <v-flex xs12>
              <v-textarea v-model="internalItem.description" label="Описание" box></v-textarea>
            </v-flex>
            <v-flex xs4>
              <v-switch
                label="Отменить"
                v-model="internalItem.additionalData.isValid"
                class="justify-center"
              ></v-switch>
            </v-flex>
            <v-flex xs4>
              <v-switch
                label="Аварийный"
                v-model="internalItem.additionalData.isEmergency"
                class="justify-center"
              ></v-switch>
            </v-flex>
            <v-flex xs4>
              <v-switch
                label="Плановый"
                v-model="internalItem.additionalData.isPlanned"
                class="justify-center"
              ></v-switch>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-flex xs12 sm2>
        <v-btn
          block
          medium
          class="white--text"
          color="green accent-4"
          :disabled="!form"
          :loading="loading"
          @click="save"
        >Сохранить</v-btn>
      </v-flex>
    </v-card-actions>
  </v-card>
</template>

<script>
import { EDIT_INSPECTION } from '@/api/eam-queries.js'
import { eventBus } from '@/main'

export default {
  name: 'eam-downtime-form',

  props: {
    item: Object
  },

  data: vm => {
    const internalItem = {
      id: vm.item.id,
      additionalData: {
        directionId:
          vm.item && vm.item.additionalData && vm.item.additionalData.direction
            ? vm.item.additionalData.direction.id
            : '',
        failureTypeId:
          vm.item &&
          vm.item.additionalData &&
          vm.item.additionalData.failureType
            ? vm.item.additionalData.failureType.id
            : '',
        failureReasonId:
          vm.item &&
          vm.item.additionalData &&
          vm.item.additionalData.failureReason
            ? vm.item.additionalData.failureReason.id
            : '',
        isValid:
          vm.item && vm.item.additionalData
            ? !!vm.item.additionalData.isValid
            : true,
        isEmergency:
          vm.item && vm.item.additionalData
            ? !!vm.item.additionalData.isEmergency
            : true,
        isPlanned:
          vm.item && vm.item.additionalData
            ? !!vm.item.additionalData.isPlanned
            : true
      },
      content: vm.item && vm.item.description ? vm.item.description : ''
    }
    return {
      internalItem,
      dialog: false,
      form: false
    }
  },

  computed: {
    formTitle() {
      return 'Изменить простой'
    },
    loading() {
      return this.$store.getters['eam/loading']
    }
  },

  methods: {
    save() {
      const input = (({ id, description }) => ({
        id,
        description
      }))(this.internalItem)
      //input.date = moment(this.item.date).format('YYYY-MM-DD HH:mm')
      if (this.internalItem.additionalData) {
        input.additionalData = (({
          isValid,
          isEmergency,
          isPlanned,
          failureReasonId,
          failureTypeId,
          directionId,
          downTimeType
        }) => ({
          isValid,
          isEmergency,
          isPlanned,
          failureReasonId,
          failureTypeId,
          directionId,
          downTimeType
        }))(this.internalItem.additionalData)
      }

      this.$apollo
        .mutate({
          mutation: EDIT_INSPECTION,
          variables: {
            inspection: input
          }
        })
        .then(() => {
          this.$emit('complete')
          eventBus.$emit('downTimeChanged')
        })
    }
  }
}
</script>

<style>
</style>