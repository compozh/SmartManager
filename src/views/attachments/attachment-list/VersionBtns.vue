<template>
  <div class="d-flex justify-center">

    <!-- Set active version button -->
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               :disabled="version.IsActive || !access.changeActiveVersion"
               @click.stop="$emit('set-active')"
               color="success"
               :class="`${mr}-2 btn-border`"
               icon x-small depressed>
          <fa-icon icon="check" type="fal" size="lg"/>
        </v-btn>
      </template>
      <span>{{ $t('versions.setActive') }}</span>
    </v-tooltip>

    <!-- Download version button -->
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               :href="version.Details.SrcUrl"
               :disabled="!access.download"
               @click.stop="() => {}"
               color="primary"
               :class="`${mr}-2 btn-border`"
               icon x-small depressed>
          <fa-icon icon="arrow-alt-down" type="fal" size="lg"/>
        </v-btn>
      </template>
      <span>{{ $t('versions.download') }}</span>
    </v-tooltip>

    <!-- Version remarks show button -->
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               :disabled="!access.remarksView"
               @click.stop="$emit('show-notes')"
               color="warning"
               :class="`${mr}-2 btn-border`"
               icon x-small depressed>
          <fa-icon icon="exclamation" type="fal" size="lg"/>
        </v-btn>
      </template>
      <span>{{ $t('versions.notes') }}</span>
    </v-tooltip>

    <!-- Delete version button -->
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               :disabled="version.IsActive || !access.deleteVersion"
               @click.stop="$emit('delete')"
               color="red darken-4"
               :class="`${mr}-2 btn-border`"
               icon x-small depressed>
          <fa-icon icon="times" type="fal" fixed-size="12"/>
        </v-btn>
      </template>
      <span>{{ $t('versions.delete') }}</span>
    </v-tooltip>

    <!-- Sing version button -->
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               color="pink"
               class="btn-border"
               icon x-small depressed
               :disabled="!signBtnActive"
               @click.stop="$emit('sign')">
          <fa-icon icon="file-signature" type="fal"
                   fixed-size="12"
                   style="margin-left: 4px;"/>
        </v-btn>
      </template>
      <span>{{ $t('eds.signVersion') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'VersionBtns',
  props: {
    version: Object,
    access: Object,
    signBtnActive: Boolean
  }
}
</script>
