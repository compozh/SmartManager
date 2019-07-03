<template>
  <v-flex xs12 pa-1>
    <v-layout row wrap align-center justify-center style="height: 100%">
      <v-flex xs10 md4>{{ item.conditionParameter.name }}</v-flex>
      <v-flex xs7 md4>
        <v-layout justify-center>
          <v-text-field
            v-if="true"
            label="Значение"
            type="number"
            v-model="item.value"
            :suffix="item.conditionParameter.measurementUnit.name"
            @focus="$event.target.select()"
            @input="item.isModified = true"
            @keyup.enter="setValue"
            :class="{'value-text-field-input': item.value == 0 || item.value == null}"
            :disabled="(item.additionalData && !item.additionalData.isValid)"
          >
            <v-icon
              slot="append-outer"
              v-if="item.value && !item.isModified"
              :color="itemColor"
            >{{itemIcon}}</v-icon>
          </v-text-field>
          <!-- <v-radio-group
                  v-if="props.item.InputType == 'B'"
                  v-model="props.item.ParameterValue"
                  row
                  @click="if (!(props.item.ParameterValue < props.item.MinValue || props.item.ParameterValue > props.item.MaxValue)) setValue(props.item)"
                  class="justify-center"
                  style="margin:0px"
                  hide-details
                  :disabled="props.item.cancelled || props.item.Closed"
                >
                  <v-radio :label="$vuetify.t('$vuetify.Inspections.yes')" :value="1" color="green"></v-radio>
                  <v-radio :label="$vuetify.t('$vuetify.Inspections.no')" :value="-1" color="red"></v-radio>
                </v-radio-group>
                <v-rating
                  v-if="props.item.InputType == 'S'"
                  v-model="props.item.ParameterValue"
                  :color="props.item.Closed ? 'grey' : colors[props.item.ParameterValue-1]"
                  background-color="grey"
                  empty-icon="check_box_outline_blank"
                  full-icon="check_box"
                  @input="if (!(props.item.ParameterValue < props.item.MinValue || props.item.ParameterValue > props.item.MaxValue)) setValue(props.item)"
                  :readonly="props.item.cancelled || props.item.Closed"
          ></v-rating>-->
        </v-layout>
      </v-flex>
      <!-- <v-flex xs4 md2>
              <v-switch
                label="Отменить"
                v-model="item.additionalData"
                class="justify-center"
                :disabled="props.item.Closed"
              ></v-switch>
      </v-flex>-->
      <v-flex xs1>
        <v-btn flat icon :color="'indigo'" @click="addAttachment">
          <v-icon>add_a_photo</v-icon>
        </v-btn>
        <v-btn flat icon color="green" @click="showPlot">
          <v-icon>timeline</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
export default {
  name: "eam-inspection-card",
  props: {
    item: Object
  },
  computed: {
    itemColor() {
      return 'green'
    },
    itemIcon() {
      return 'user'
    }
  },
  methods: {
    setValue() {

    },
    addAttachment() {

    },
    showPlot() {

    }
  }
};
</script>

<style scoped>
.v-card__title {
  background-color: rgb(192, 243, 215);
}
.v-card__text {
  text-align: initial;
}
</style>
