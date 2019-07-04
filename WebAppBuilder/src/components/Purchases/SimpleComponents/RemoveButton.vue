<template>
    <div class="remove-btn">
        <v-btn  icon @click="click">
            <v-icon color="error">
                cancel
            </v-icon>
        </v-btn>
    </div>
</template>

<script>
    export default {
        name: "remove-button-icon",
        methods:{
            click(){
                this.$emit('click')
            }
        }
    }
</script>

<style lang="scss" scoped>
.remove-btn {
    height: 100%;
    margin: -25px -15px 0 -15px;
}
</style>