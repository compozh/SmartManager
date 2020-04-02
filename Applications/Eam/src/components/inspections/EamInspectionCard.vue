<template>
  <v-flex xs12 pa-1>
    <v-layout row wrap align-center justify-center style="height: 100%">
      <!-- <v-flex xs12>
        <v-divider />
      </v-flex>-->
      <v-flex xs10 md2 pr-3>
        <!-- <date-text-field :dateType="item" :editable="true"></date-text-field> -->
        <v-datetime-picker
          label
          :datetime="dateTimeInner"
          locale="ru"
          :disabled="item.additionalData && !item.additionalData.isValid || item.isClosed"
          @input="setValue()"
          ref="datetimepicker"
          dateFormat="dd.MM.yyyy"
          timeFormat="HH:mm"
        >
          <v-btn
            slot="actions"
            color="green darken-1"
            flat
            @click="$refs.datetimepicker.okHandler()"
          >OK</v-btn>
        </v-datetime-picker>
      </v-flex>
      <v-flex xs1 md1>
        <v-icon v-if="item.unsynced">wifi_off</v-icon>
        <v-btn icon :disabled="item.isClosed" @click="closeClick()">
          <v-icon>{{item.isClosed ? 'lock' : 'lock_open'}}</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs11 md3>{{ item.conditionParameter.name }}</v-flex>
      <v-flex xs7 md3>
        <v-layout justify-center>
          <v-text-field
            v-if="item.conditionParameter.valueInputType == ''"
            label="Значение"
            type="number"
            v-model="item.value"
            :suffix="item.conditionParameter.measurementUnit.name"
            @focus="$event.target.select()"
            @input="item.isModified = true"
            @keyup.enter="setValue"
            :class="{'value-text-field-input': item.value == 0 || item.value == null}"
            :disabled="item.additionalData && !item.additionalData.isValid || item.isClosed"
          >
            <v-icon slot="append-outer" v-if="item.value" :color="itemIcon.color">{{itemIcon.icon}}</v-icon>
          </v-text-field>
          <v-radio-group
            v-if="item.conditionParameter.valueInputType == 'B'"
            v-model="item.value"
            row
            @click="setValue"
            class="justify-center"
            style="margin:0px"
            hide-details
            :disabled="item.additionalData && !item.additionalData.isValid || item.isClosed"
          >
            <v-radio label="yes" :value="1" color="green"></v-radio>
            <v-radio label="no" :value="-1" color="red"></v-radio>
          </v-radio-group>
          <v-rating
            v-if="item.conditionParameter.valueInputType == 'S'"
            v-model="item.value"
            :color="item.isClosed ? 'grey' : colors[item.value-1]"
            background-color="grey"
            empty-icon="check_box_outline_blank"
            full-icon="check_box"
            @input="setValue"
            :readonly="item.additionalData && !item.additionalData.isValid || item.isClosed"
          ></v-rating>
        </v-layout>
      </v-flex>
      <v-flex xs3 md2>
        <v-switch
          :label="$vuetify.breakpoint.smAndDown ? 'Отм' : 'Отменить'"
          v-model="isValid"
          class="justify-center"
          :disabled="item.isClosed"
          @change="setValue"
        ></v-switch>
      </v-flex>
      <v-flex xs1 sm2 md1>
        <v-dialog max-width="700" v-model="attachmentDialog">
          <v-btn slot="activator" flat icon :color="'indigo'">
            <v-icon>add_a_photo</v-icon>
          </v-btn>
          <v-card>
            <v-layout column>
              <v-toolbar color="orange" dark dense>
                <v-toolbar-title>Прикрепить фото</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  class="white--text"
                  color="green accent-4"
                  depressed
                  @click="sendImage()"
                >Сохранить</v-btn>
              </v-toolbar>
              <eam-add-attachment-control
                ref="attachments"
                :variables="attachmentVariables"
                :query="addAttachmentQuery"
                @filesUploaded="filesUploaded"
              ></eam-add-attachment-control>
            </v-layout>
          </v-card>
        </v-dialog>
        <v-btn flat icon color="green" @click="showPlot">
          <v-icon>timeline</v-icon>
        </v-btn>
        <v-btn
          flat
          icon
          color="orange"
          @click="$router.push({name: 'EAMINSPECTIONATTACHMENTS', params: { inspectionId: item.id } })"
        >
          <v-icon>attachment</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import * as inspectionsHelper from '../helpers/inspections'
import editInspection from '@/api/inspections/mutations/editInspection.gql'
import addInspectionAttachment from '@/api/inspections/mutations/addInspectionAttachment.gql'
import moment from 'moment'

export default {
  name: 'eam-inspection-card',
  props: {
    item: Object
  },
  data(vm) {
    return {
      addAttachmentQuery: addInspectionAttachment,
      attachmentDialog: false,
      colors: ['red', 'orange', 'orange', 'green', 'green'],
      dateTimeInner: moment(vm.item.date).format('DD.MM.YYYY HH:mm')
    }
  },
  computed: {
    itemIcon() {
      return inspectionsHelper.getIcon(this.item)
    },
    isValid: {
      get: function() {
        return this.item.additionalData && !this.item.additionalData.isValid
      },
      set: function(newValue) {
        if (!this.item.additionalData) {
          this.item.additionalData = {}
        }
        this.item.additionalData.isValid = !newValue
      }
    },
    attachmentVariables() {
      return { inspectionId: this.item.id }
    }
  },
  methods: {
    setValue() {
      const inspectionInput = (({
        id,
        value,
        date,
        comment,
        description,
        isClosed
      }) => ({
        id,
        value,
        date,
        comment,
        description,
        isClosed
      }))(this.item)
      inspectionInput.date = moment(this.dateTimeInner, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm')
      if (this.item.additionalData) {
        inspectionInput.additionalData = (({
          isValid,
          failureReasonId,
          failureTypeId
        }) => ({
          isValid,
          failureReasonId,
          failureTypeId
        }))(this.item.additionalData)
      }

      this.$apollo
        .mutate({
          mutation: editInspection,
          variables: {
            inspection: inspectionInput
          }
        })
        .then(result => {
          console.log(result)
        })
        .catch(e => {
          this.$store.commit('eam/setError', e.message)
        })
    },
    closeClick() {
      this.item.isClosed = true
      this.setValue()
    },
    sendImage() {
      const attachments = this.$refs.attachments
      if (attachments && attachments.upload) {
        attachments.upload()
      }
    },
    showPlot() {},
    filesUploaded() {
      this.attachmentDialog = false
      console.log('Files uploaded')
    }
  }
}
</script>

<style scoped>
.v-card__title {
  background-color: rgb(192, 243, 215);
}
</style>
