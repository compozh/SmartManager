<template>
    <v-flex
        class="grow-0 user-description-block"
        v-if="$route.name !='login'"
    >
        <user-panel
            class="user-panel"
            hideDelegatedRightsButton="true"
            mini="true"
        />
    </v-flex>
</template>

<script>
import UserPanel from '@/components/layouts/userPanel/UserPanel.vue'

export default {
  name: 'main-toolbar',
  components: {
    UserPanel
  }
}
</script>

<style scoped>
    .user-panel {
        max-width: 70px;
        margin-left: auto;
        height: 48px;
    }
    .user-info-desc {
        display: flex;
        flex-direction: column;
        align-content: center;
        padding: 3px 5px 0px 5px;
    }
    .user-info-name {
        display: flex;
        font-size: 14px;
        color: #326da8;
        font-weight: 500;
        line-height: 12px;
    }
    .user-info-text {
        display: flex;
        font-size: 14px;
        color: #326da8;
        font-weight: 500;
    }
</style>
