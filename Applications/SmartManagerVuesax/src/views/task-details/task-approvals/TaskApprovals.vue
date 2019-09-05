<template>
  <VuePerfectScrollbar
    class="scroll-area md:px-8 pt-4 px-6"
    :settings="settings"
  >
    <div class="vx-row">
      <div class="vx-col w-full">
        <vx-card class="px-4">
          <!-- TASK APPROVALS -->
          <div class="vx-row">
            <div class="vx-col w-full">
              <div class="mail__content break-words mt-8 mb-4">TASK APPROVALS</div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    },
  })
}
</script>

<style scoped>

</style>
