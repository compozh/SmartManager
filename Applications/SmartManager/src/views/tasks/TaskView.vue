<template>
  <div id="task-app" class="h-full relative rounded-lg">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
  }
}
</script>

<style lang="scss">
  @import "@/assets/scss/vuesax/apps/task.scss";

  .vs-sidebar.vs-sidebar-reduce {
    max-width: 64px;
  }

  .md-sidebar-spacer {
    width: calc(100% - 64px);
    margin-left: 64px;
  }

  .app-fixed-height {
    height: calc(100vh - 11rem);
  }

  @media (max-width: 768px) {
    .vs-sidebar.vs-sidebar-reduce {
      max-width: 38px;
    }

    .md-sidebar-spacer {
      width: calc(100% - 38px);
      margin-left: 38px;
    }
  }

</style>
