<template>
    <div
        v-if="showFormioBuilder"
        class="formio-container"
    >
        <div class="overlay"/>
        <formio-builder-component
            class="formio-builder-container"
            :formDefinition=formDefinition
            @action=onAction
            @cancel=onCancel
        />
  </div>
</template>

<script>
/* eslint-disable */
import { eventBus } from '../../main'
export default {
  name: 'formio-builder-container',
  data() {
    return {
        callback: null,
        showFormioBuilder: false,
        formDefinition: {}
    }
  },
  created() {
    var me = this;
    eventBus.$on('properties-panel.create-formio', (callback) => {
        me.createForm(callback)
    })
    eventBus.$on('properties-panel.edit-formio', (formCode) => {
        me.editForm(formCode)
    })
  },
  methods: {
    createForm(callback) {
        this.callback = callback
        this.formDefinition = {}
        this.changeFormVisible(true)
    },
    async editForm(formCode) {
        var me = this
        await this.$store.dispatch('formio/getForm', { formCode }).then(result => {
            if(result.success) {
                me.formDefinition = formDefinition
                me.changeFormVisible(true)
            }
        })
    },
    async onAction(formDefinition) {
        var me = this
        
        if(!Object.keys(me.formDefinition).length) {
            await me.$store.dispatch('formio/createForm', formDefinition).then(result => {
                if(result.success && me.callback) {
                    me.callback(formDefinition)
                }
                me.callback = null
            })
        } else {
            await me.$store.dispatch('formio/saveForm', formDefinition)
        }
        this.changeFormVisible(false)
    },
    onCancel(formDefinition) {
        this.changeFormVisible(false)
    },
    changeFormVisible(state) {
        this.showFormioBuilder = state
        this.$emit('changeFormVisible', state)
    }
  }
}
</script>

<style scoped lang="scss">
    .formio-container /deep/ {
        @import "~bootstrap/scss/bootstrap.scss";
        @import "~choices.js/public/assets/styles/choices.css";
        @import "~flatpickr/dist/flatpickr.min.css";
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
    }
    .formio-builder-container {
        background-color: #fff;
        z-index: 101;
    }
</style>
