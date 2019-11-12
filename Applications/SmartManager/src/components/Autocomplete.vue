<template>
  <div>
    <label>{{ title }}</label>
    <multiselect :value="value"
                 @input="$emit('input', $event)"
                 :loading="loading"
                 :disabled="loading"
                 :placeholder="placeholder"
                 :label="label"
                 :track-by="label"
                 :options="items"
                 :multiple="multiple"
                 :hideSelected="true"
                 :showLabels="false"
                 :avatar="avatar"
                 :icon="icon"
    >
      <template slot="option" slot-scope="props">
        <div class="flex items-center">
          <vs-avatar v-if="avatar"
                     size="30px"
                     :src="props.option.photo"
                     class="m-0 ml-2"
          />
          <feather-icon :icon="icon"
                        class="ml-2 w-5 h-5"
                        v-else
          >
          </feather-icon>
          <span class="ml-3 option__title">{{ props.option[label] }}</span>
        </div>
      </template>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect
  },
  props: {
    items: Array,
    placeholder: String,
    multiple: Boolean,
    loading: Boolean,
    label: String,
    title: String,
    value: [Object, Array],
    avatar: Boolean,
    icon: String
  }
}
</script>

<style scoped>
  @import "~vue-multiselect/dist/vue-multiselect.min.css";

  .vs-input >>> input {
    font-family: "Montserrat", Helvetica, Arial, sans-serif !important;
  }

  label {
    line-height: 2.5;
  }

  .multiselect >>> .multiselect__placeholder,
  .multiselect >>> .multiselect__tags,
  .multiselect >>> .multiselect__tag {
    margin-bottom: 0;
    border-color: rgba(0, 0, 0, .2);
  }

  .multiselect >>> .multiselect__option {
    padding: 4px !important;
    min-height: 18px !important;
  }

  .multiselect >>> .multiselect__tag,
  .multiselect >>> .multiselect__tag-icon:focus,
  .multiselect >>> .multiselect__tag-icon:hover,
  .multiselect >>> .multiselect__option--highlight {
    background: #7367F0;
  }

  .multiselect >>> .multiselect__option,
  .multiselect >>> .multiselect__placeholder,
  .multiselect >>> .multiselect__tags,
  .multiselect >>> .multiselect__tag,
  .multiselect >>> .multiselect__input,
  .multiselect >>> .multiselect__single {
    font-size: 1rem !important;
    font-family: "Montserrat", Helvetica, Arial, sans-serif !important;
    font-weight: 400;
    touch-action: manipulation;
    transition: all .2s ease !important;
  }

  .multiselect >>> .multiselect__spinner:after,
  .multiselect >>> .multiselect__spinner:before {
    border-top-color: #7367F0;
  }

  .vs-input--input.hasValue + .vs-placeholder-label, .vs-input--input:focus + .vs-placeholder-label {
    -webkit-transform: translate(-3px, -90%) !important;
    transform: translate(-3px, -90%) !important;
    font-size: .7rem;
    padding-left: .5rem !important;
  }

  .vs-input--placeholder.normal {
    padding: 0.6rem;
  }

  .vs-input--placeholder {
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    position: absolute;
    border-radius: 5px;
    left: 0;
    padding: .4rem;
    padding-left: .55rem;
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    font-size: .85rem;
    color: rgba(0, 0, 0, .4);
    white-space: nowrap;
    cursor: text;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    top: 2px;
    pointer-events: none;
  }
</style>
