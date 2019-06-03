<template>
    <div>
        <v-stepper>
            <v-stepper-header>
                <template v-for="(stage, n) in stages">
                    <v-stepper-step :key="`step-${n}`" :step="stage.id" :complete="stage.isCurrent">
                        {{stage.name}}
                    </v-stepper-step>
                    <v-divider
                        v-if="n !== stages.length - 1"
                        :key="`div-${n}`"
                    />
                </template>
            </v-stepper-header>

            <v-stepper-items>

            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
    export default {
        name: "workflow-stepper",
        props: ["object", "keyvalue"],
        data:()=>({
            stages: [
                {
                    id: "_1",
                    name: "Стадия 1",
                    isCurrent: false
                },
                {
                    id: "2",
                    name: "Стадия 2",
                    isCurrent: true
                },
                {
                    id: "34",
                    name: "Стадия 3",
                    isCurrent: false
                }


            ]
        })
    }
</script>

<style lang="scss" scoped>

</style>