<template>
  <div class="no-data-container">
    <slot>No data</slot>
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
</style>
