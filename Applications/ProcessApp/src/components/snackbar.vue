<template>
  <div id="snackbar">
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'process-snackbar',
  data () {
    return {
      messageTimeout: 5000
    }
  },
  computed: {
  snackbar() {
     return this.$store.getters['snackbar']
    }
  },
  methods: {

  }
}
</script>
<style lang="scss">
  #snackbar {
	background-color: var(--accent);
	color: #fff;
	text-align: center;
	border-radius: 3px;
	padding: 16px 32px;
	position: fixed;
	top: 10px;
	left: 50%;
	transform: translate(-50%, 100%);
	transition: 0.3s;
	opacity: 0;
	z-index: 101;
	box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  .show {
    transform: translate(-50%, 0%);
    transition: 0.5s;
    opacity: 1;
  }
  .success {
    background-color: #4CAF50;
  }
  .error {
    background-color: #ff5252;
  }
}
</style>
