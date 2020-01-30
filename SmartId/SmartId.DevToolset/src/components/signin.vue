<template>
    <div>
		<button @click="signin">SignIn</button>
    </div>
</template>

<script>
    import Auth from '../lib/auth'
    export default {
        name: 'Home',
        props: {
            msg: String
		},
		data() {
            return {
                mgr: new Auth(),
            }
		},
        methods: {
            signin(){
				this.mgr.signIn();
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

