<template>
  <div>
    <!-- File key input -->
    <v-file-input :value="fileKey"
                  @change="$emit('input', $event)"
                  :label="$t('eds.privateKey')"
                  :placeholder="$t('eds.selectKey')"
                  outlined dense
                  prepend-icon=""
                  :clearable="false"
                  :show-size="1000"
                  :disabled="loading"
                  autocomplete="off"
                  class="body-1 clearable">
      <template #prepend-inner>
        <v-icon small class="pt-1 pr-2">fas fa-paperclip</v-icon>
      </template>
      <template #selection="{ text }">
        <v-chip label small color="primary">{{ text }}</v-chip>
      </template>
      <template #append>
        <v-btn icon small class="clear-btn"
               @click="$emit('input', null)">
          <fa-icon icon="times" type="fal" size="lg"/>
        </v-btn>
      </template>
    </v-file-input>

    <!-- Key password input -->
    <v-text-field :value="password"
                  @input="$emit('update:password', $event)"
                  :label="$t('login.password')"
                  :placeholder="$t('login.passwordPlaceholder')"
                  outlined dense
                  name="password"
                  type="password"
                  hide-details
                  :disabled="loading"
                  autocomplete="off"
                  @keyup.enter="$emit('read-key')"
                  class="body-1 clearable">
      <template #prepend-inner>
        <v-icon small class="pt-1 pr-2">fas fa-unlock</v-icon>
      </template>
      <template #append>
        <v-btn icon small class="clear-btn"
               @click="$emit('update:password', null)">
          <fa-icon icon="times" type="fal" size="lg"/>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script>
export default {
  name: 'EdsFileKey',
  model: {
    prop: 'fileKey'
  },
  props: {
    fileKey: [File, null],
    password: [String, null],
    loading: Boolean
  }
}
</script>

<style scoped>

</style>
