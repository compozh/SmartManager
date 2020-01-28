<template>
   <div class="custom-tooltip">
        <p><span>{{athlete}}</span></p>
    </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      athlete: null
    }
  },
  beforeMount() {
    var valueToDisplay = this.params.value.value ? this.params.value.value : '- Missing -'
    this.setState({
      athlete: valueToDisplay
    })
  },
  methods: {
    setState(obj) {
      Object.assign(this, obj)
    }
  }
})
</script>

<style scoped>
.custom-tooltip {
    position: absolute;
    pointer-events: none;
    transition: opacity 1s;
    background-color: #323232;
    border-radius: 5px;
}

.custom-tooltip p {
    color: white;
    padding: 10px;
}

.custom-tooltip p:first-of-type {
    font-weight: 300;
}
</style>