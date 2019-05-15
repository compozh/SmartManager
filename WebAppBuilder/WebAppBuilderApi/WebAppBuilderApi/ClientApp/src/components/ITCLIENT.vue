<template>
    <div>
        <iframe class="frame" :src="this.$route.query.licnk" name="iframe_a"></iframe>
    </div>
</template>

<script>
export default {
name:"it-client",
created(){
    // window.parent.location.href= this.$route.params.client;
},
}
</script>

<style scoped>
    .frame{
        width: 100%;
        height: 900px;
    }
</style>
