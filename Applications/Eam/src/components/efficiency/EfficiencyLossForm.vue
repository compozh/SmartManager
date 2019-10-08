<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ formTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-list class="pt-0 info-list">
        <eam-equipment-main-info-list-item
          v-if="item.workCenter"
          icon="local_laundry_service"
          color="purple"
          title="Рабочий центр"
          :value="item.workCenter.name"
        ></eam-equipment-main-info-list-item>
        <eam-equipment-main-info-list-item
          v-if="item.technicalPlace"
          icon="center_focus_weak"
          color="cyan"
          title="Техническое место"
          :value="item.technicalPlace.name"
        ></eam-equipment-main-info-list-item>
        <eam-equipment-main-info-list-item
          icon="schedule"
          color="green"
          title="Начало"
          :value="startDateText"
        ></eam-equipment-main-info-list-item>
        <eam-equipment-main-info-list-item
          icon="av_timer"
          color="orange"
          title="Завершение"
          :value="endDateText"
        ></eam-equipment-main-info-list-item>
      </v-list>
      <v-form v-model="form">
        <v-container grid-list-md :class="{'pa-0' : $vuetify.breakpoint.mdAndDown}" pb-0 pt-0>
          <v-layout wrap>
            <v-flex xs12 md6>
              <v-select
                :items="indicators"
                label="Показатель"
                item-value="code"
                item-text="name"
                v-model="internalItem.indicator"
              ></v-select>
            </v-flex>
            <v-flex xs12 md6>
              <v-select
                :items="lossTypes"
                label="Тип"
                item-value="code"
                item-text="name"
                v-model="internalItem.lossType"
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <efficiency-loss-category-select v-model="internalItem.categoryId" required></efficiency-loss-category-select>
            </v-flex>
            <v-flex xs12>
              <efficiency-loss-reason-select v-model="internalItem.reasonId" required></efficiency-loss-reason-select>
            </v-flex>
            <v-flex xs12>
              <efficiency-loss-source-select v-model="internalItem.sourceId" required></efficiency-loss-source-select>
            </v-flex>
            <!-- <v-flex xs12>
              <v-textarea
                v-model="internalItem.description"
                label="Описание"
                placeholder="Введите описание"
                box
              ></v-textarea>
            </v-flex>-->
            <v-layout xs12 md4>
              <v-slider label="Уровень" v-model="internalItem.lossLevel" :max="100" :min="0"></v-slider>
              <v-flex shrink ml-2 style="width: 60px">
                <v-text-field
                  v-model="internalItem.lossLevel"
                  class="mt-0"
                  hide-details
                  single-line
                  type="number"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-flex xs6 md4>
              <v-switch label="Утвердить" v-model="internalItem.isApproved" class="justify-center"></v-switch>
            </v-flex>
            <v-flex xs6 md4>
              <v-switch label="Отменить" v-model="internalItem.isValid" class="justify-center"></v-switch>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-flex xs12 sm2>
        <v-btn
          block
          medium
          :loading="loading"
          @click="$emit('complete')"
        >Отменить</v-btn>
      </v-flex>
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
import modifyEfficiencyLoss from '@/api/efficiency/mutations/modifyEfficiencyLoss.gql'
import { indicators, lossTypes } from '@/helpers/efficiency'
import * as moment from 'moment'
import { eventBus } from '@/main'

export default {
  name: 'efficiency-loss-form',

  props: {
    item: Object
  },

  data: vm => {
    const internalItem = Object.assign({}, vm.item)
    internalItem.categoryId = internalItem.category
      ? internalItem.category.id
      : null
    internalItem.reasonId = internalItem.reason ? internalItem.reason.id : null
    internalItem.sourceId = internalItem.source ? internalItem.source.id : null
    internalItem.workCenterId = internalItem.workCenter
      ? internalItem.workCenter.id
      : null
    internalItem.technicalPlaceId = internalItem.technicalPlace
      ? internalItem.technicalPlace.id
      : null
    return {
      internalItem,
      dialog: false,
      form: false,
      indicators: indicators,
      lossTypes: lossTypes
    }
  },

  computed: {
    formTitle() {
      return 'Потеря эффективности'
    },
    loading() {
      return this.$store.getters['eam/loading']
    },
    startDateText() {
      return moment(this.item.startTime).format('DD.MM.YYYY HH:mm')
    },
    endDateText() {
      return this.item.endTime
        ? moment(this.item.endTime).format('DD.MM.YYYY HH:mm')
        : '...'
    }
  },

  methods: {
    save() {
      const input = (({
        id,
        workCenterId,
        technicalPlaceId,
        lossType,
        indicator,
        categoryId,
        reasonId,
        sourceId,
        lossLevel,
        isApproved,
        isValid
      }) => ({
        id,
        workCenterId,
        technicalPlaceId,
        lossType,
        indicator,
        categoryId,
        reasonId,
        sourceId,
        lossLevel,
        isApproved,
        isValid
      }))(this.internalItem)

      this.$apollo
        .mutate({
          mutation: modifyEfficiencyLoss,
          variables: {
            efficiencyLoss: input
          }
        })
        .then(() => {
          this.$emit('complete')
          eventBus.$emit('efficiencyLossChanged')
        })
    }
  }
}
</script>

<style scoped>
.v-card__title {
  background-color: rgb(144, 219, 238);
}
.info-list >>> .v-list__tile {
  padding: 0px !important;
}
</style>