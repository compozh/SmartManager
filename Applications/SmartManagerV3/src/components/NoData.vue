<template>
  <div>
    <div class="no-data-container noise-bg border-light">
      <slot>
        <span class="headline font-weight-light grey--text">
          {{ $t('attachments.noData') }}
        </span>
      </slot>
    </div>
  </div>
</template>

<style scoped>

  .no-data-container {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 2.25rem;
    color: #dae1e7;
    text-align: center;
  }
  /* TODO: output border-light class to common styles */
  .border-light {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }
  /* TODO: output noise-bg class to common styles */
  .noise-bg {
    background: url('../assets/noise_bg.png');
  }

</style>
