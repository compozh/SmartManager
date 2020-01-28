<template>
    <div id="app">
        <tools v-if="signedin" />
        <signin v-if="!signedin" />
    </div>
</template>

<script>
	import signin from './components/signin.vue';
	import tools from './components/tools.vue';
    import Auth from './lib/auth'

    export default {
        name: 'app',
        components: {
			signin,
            tools
		},
		data() {
			return {
				signedin: false,
                mgr: new Auth(),
			}
		},
		mounted() {
			this.mgr.setReactiveCallback(this.signinCallback);
			this.mgr.renewToken(true);
		},
		methods: {
			signinCallback: function (signedin) {
				this.signedin = signedin;
            }
        }
    };
</script>

<style>
</style>

