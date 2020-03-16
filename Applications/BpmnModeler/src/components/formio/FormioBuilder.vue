<template>
    <div
        v-if="showFormioBuilder"
        class="formio-container"
    >
        <div class="overlay"/>
        <formio-builder-component
            class="formio-builder-component"
            :formExpansionDefinition=formDefinition
            :buttonLoading=buttonLoading
            @action=onAction
            @cancel=onCancel
        />
  </div>
</template>

<script>
import { eventBus } from '../../main';
import { events } from '../../constants';

export default {
  name: 'formio-builder-container',
  data() {
    return {
      callback: null,
      showFormioBuilder: false,
      buttonLoading: false,
      isSystem: false,
      formDefinition: {}
    };
  },
  created() {
    eventBus.$on(events.formio.createForm, (callback, isSystem) => {
      this.createForm(callback, isSystem);
    });
    eventBus.$on(events.formio.editForm, (formCode) => {
      this.editForm(formCode);
    });
  },
  methods: {
    createForm(callback, isSystem) {
      this.callback = callback;
      this.isSystem = Boolean(isSystem);
      this.formDefinition = {};
      this.changeFormVisible(true);
    },
    async editForm(formCode) {
      await this.$store.dispatch('formio/getFormExpansionsDefinition', { formCode }).then(result => {
        if (result.formExpansionsDefinition) {
          this.formDefinition = result.formExpansionsDefinition;
          this.isSystem = this.formDefinition.isSystem;

          this.changeFormVisible(true);
        }
      });
    },
    async onAction(formDefinition) {
      this.buttonLoading = true;
      formDefinition.isSystem = this.isSystem;
      if (!Object.keys(this.formDefinition).length) {
        await this.$store.dispatch('formio/createForm', formDefinition).then(result => {
          if (result.success && this.callback) {
            this.callback(formDefinition.formCode, formDefinition.name);
          }
          this.callback = null;
        });
      } else {
        await this.$store.dispatch('formio/saveForm', formDefinition);
      }
      this.buttonLoading = false;
      this.changeFormVisible(false);
    },
    onCancel(formDefinition) {
      this.changeFormVisible(false);
    },
    changeFormVisible(state) {
      this.showFormioBuilder = state;
      this.$emit('changeFormVisible', state);
    }
  }
};
</script>

<style scoped lang="scss">
    .formio-container {
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 100;
    }
    .overlay {
        opacity: 0.46;
        background-color: rgb(33, 33, 33);
        border-color: rgb(33, 33, 33);
        border-radius: inherit;
        bottom: 0;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: inherit;
        width: 100%;
        z-index: 100;
    }
    .formio-builder-component {
        text-align: left;
        background-color: #fff;
        z-index: 101;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
        overflow: hidden;
    }
</style>
