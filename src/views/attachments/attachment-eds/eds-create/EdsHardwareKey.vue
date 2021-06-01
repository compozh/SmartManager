<template>
  <div>
    <!-- Sign type selection -->
    <v-select :value="hardwareKey"
              @input="$emit('input', $event)"
              color="primary"
              :label="$t('eds.keyCarrier')"
              :placeholder="$t('eds.selectKeyCarrier')"
              :items="keyMedias"
              item-text="visibleName"
              return-object
              hide-details
              menu-props="offsetY"
              outlined dense
              :disabled="loading"
              class="body-1 mb-8">

      <template #prepend-inner>
        <v-icon small :class="`pt-1 ${pr}-2`">fa-usb</v-icon>
      </template>

      <template #append-item>
        <a v-if="!keyMedias.length"
           :class="`${ml}-4 primary--text body-2 text-decoration-underline`"
           @click="$emit('reload')"
           v-text="$t('buttons.refresh')"/>
      </template>

    </v-select>

    <!-- Key password input -->
    <v-text-field :value="password"
                  @input="$emit('update:password', $event)"
                  :label="$t('login.password')"
                  :placeholder="$t('login.passwordPlaceholder')"
                  outlined dense
                  name="password"
                  type="password"
                  hide-details
                  :disabled="loading || !hardwareKey"
                  autocomplete="off"
                  @keyup.enter="$emit('sign')"
                  class="body-1 clearable mb-8">

      <template #prepend-inner>
        <v-icon small :class="`pt-1 ${pr}-2`">fas fa-unlock</v-icon>
      </template>

      <template #append>
        <v-btn icon small class="clear-btn"
               @click="password = null">
          <fa-icon icon="times" type="fal" size="lg"/>
        </v-btn>
      </template>

    </v-text-field>
  </div>
</template>

<script>
export default {
  name: 'EdsHardwareKey',
  model: {
    prop: 'hardwareKey'
  },
  props: {
    keyMedias: {
      type: Array
    },
    hardwareKey: {
      type: Object
    },
    password: {
      type: [String, null]
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>
