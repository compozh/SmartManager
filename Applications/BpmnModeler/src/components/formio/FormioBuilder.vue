<template>
    <div
        v-if="showFormioBuilder"
        class="formio-container"
    >
        <div class="overlay"/>
        <formio-builder-component
            class="formio-builder-component"
            :formDefinition=formDefinition
            :buttonLoading=buttonLoading
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
        buttonLoading: false,
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
        this.$store.commit('formio/setLinearLoader', true)
        await this.$store.dispatch('formio/getForm', { formCode }).then(result => {
            if(result.success) {
                me.formDefinition = result
                me.formDefinition.formCode = formCode //todo: добавить в оъект FormDefinition formCode

                this.$store.commit('formio/setLinearLoader', false)
                me.changeFormVisible(true)
            }
        })
    },
    async onAction(formDefinition) {
        var me = this
        this.buttonLoading = true
        if(!Object.keys(me.formDefinition).length) {
            await me.$store.dispatch('formio/createForm', formDefinition).then(result => {
                if(result.success && me.callback) {
                    me.callback(formDefinition.formCode)
                }
                me.callback = null
            })
        } else {
            await me.$store.dispatch('formio/saveForm', formDefinition)
        }
        this.buttonLoading = false
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
        border-radius: 10px;
        overflow: hidden;
    }
</style>
