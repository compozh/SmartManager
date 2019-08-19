<template>
    <v-layout row lg12 xs12 md12 sm12 show-arrows class="toolbar">
        <v-flex
            class="toolbar-basebuttons"
        >
            <v-btn class="setup-installations-button" outlined @click="onclickSetupMaterial" outline color="#326DA8">Установить материалы</v-btn>

            <v-btn class="status-task-btn"
                outlined outline
                color="rgba(179, 2, 2, 0.81)"
                @click="onclickCancelRegistration"
            >
                Приостановить
            </v-btn>

            <v-btn flat icon :class="dragResizeMode ? 'active-drag-resize-button' : 'drag-resize-button'" color="#326DA8" @click="changeDragResizeMode">
                <v-icon>aspect_ratio</v-icon>
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name: "mes-task-in-progress-layout-toolbar",
    computed: {
        selectedTask() {
            return this.$store.getters['mes/selectedTask'];
        },
        dragResizeMode: {
            get() {
                return this.$store.getters['mes/dragResizeMode'];
            },
            set(value) {
                this.$store.dispatch('mes/changeDragResizeMode');
            }
        }
    },
    methods: {
        onclickSetupMaterial() {
            this.$store.commit('mes/setCurrentLayout', 'installations');
        },
        onclickCancelRegistration() {
            this.$store.dispatch('mes/cancelBeginRegistration', this.selectedTask);
        },
        changeDragResizeMode() {
            this.dragResizeMode = !this.dragResizeMode;
        }
    }
}
</script>

<style type="text/css" scoped>
    .toolbar {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        justify-content: space-between;
    }
    .toolbar-basebuttons {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid rgba(2, 2, 2, 0.08);
    }
    .status-task-btn {
        color: white;
        border-radius: 5px;
    }
    .drag-resize-button {
        margin-left: auto;
    }
    .active-drag-resize-button {
        margin-left: auto;
        background-color: rgba(50, 109, 168, 0.2);
    }
    .setup-installations-button {
        border-radius: 5px;
    }
</style>
