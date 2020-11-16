<template>
  <div class="d-flex align-center btns-container">
    <!-- New version button -->
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               id="addBtn"
               :disabled="!access.editNewVersion"
               @click.stop="$emit('new-version')"
               color="success"
               class="ml-5 btn-border"
               text fab x-small dark depressed>
          <label :for="objectId" class="add-label pa-2">
            <fa-icon icon="files-medical" type="fal" size="2x"/>
          </label>
        </v-btn>
      </template>
      <span>{{ $t('versions.add') }}</span>
    </v-tooltip>
    <!-- Download attachment button -->
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               :loading="loading"
               :disabled="!access.download"
               @click.stop="$emit('download')"
               color="primary"
               class="ml-5 btn-border"
               text fab x-small dark depressed>
          <fa-icon icon="arrow-alt-down" type="fal" size="2x"/>
          <template #loader>
            <span class="custom-loader">
              <fa-icon icon="sync" size="lg"/>
            </span>
          </template>
        </v-btn>
      </template>
      <span>{{ $t('attachments.download') }}</span>
    </v-tooltip>
    <!-- Delete attachment button -->
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               :disabled="!access.delete"
               color="red darken-4"
               class="ml-5 btn-border"
               @click.stop="$emit('delete')"
               text fab x-small dark depressed>
          <fa-icon icon="times" type="fal" size="lg"/>
        </v-btn>
      </template>
      <span>{{ $t('attachments.delete') }}</span>
    </v-tooltip>
    <!-- EDS dialog button -->
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               color="purple"
               class="ml-5 btn-border"
               @click.stop="$emit('eds')"
               text fab x-small dark depressed>
          <fa-icon icon="file-signature" type="fal" size="lg"/>
        </v-btn>
      </template>
      <span>{{ $t('eds.title') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'AttachmentBtns',
  props: {
    objectId: [String, Number],
    access: Object,
    loading: Boolean
  }
}
</script>

<style scoped>

  .btns-container {
    position: absolute;
    top: 0;
    right: 25px;
    height: 100%;
  }

  .btn-border {
    border: 1px dashed;
  }

</style>
