<template>

   <div
        v-if="showFormioOverview"
        class="formio-container"
    >
        <div class="overlay"/>
        <formio-overview-component
            class="formio-overview-component"
            :formExpansionDefinition=formDefinition
            :buttonLoading=buttonLoading
            @cancel=onCancel
        />
  </div>
</template>
<script>
import { eventBus } from '../../main';
import { events } from '../../constants';

export default {
  name: 'formio-overview-container',
  data() {
    return {
      showFormioOverview: false,
      buttonLoading: false,
      code: '',
      formDefinition: null
    };
  },
  mounted() {
    eventBus.$on(events.formio.showFormOverview, this.onShowFormOverview);
  },
  beforeDestroy() {
    eventBus.$off(events.formio.showFormOverview, this.onShowFormOverview);
  },
  methods: {
    async onShowFormOverview(formCode) {
      this.code = formCode;
      await this.$store.dispatch('formio/getFormExpansionsDefinition', { formCode }).then(result => {
        this.formDefinition = result.formExpansionsDefinition;
        this.changeFormVisible(true);
      });
    },
    changeFormVisible(state) {
      this.showFormioOverview = state;
      this.$emit('changeFormVisible', state);
    },
    onCancel(formDefinition) {
      this.changeFormVisible(false);
    }
  }
};
</script>

<style lang="scss">
  .formio-container {
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 210;
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
    .formio-overview-component {
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
