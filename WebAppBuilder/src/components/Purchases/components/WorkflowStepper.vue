<template>
    <div>
        <v-stepper>
            <v-stepper-header>
                <template v-for="(stage, n) in stages">
                    <v-stepper-step :key="n" :step="stage.id" :complete="stage.isCurrent">
                        {{stageNameComp.concat(String(n))}}
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
        props: {
            stageName: ""
        },
        data:()=>({
            stages: [
                {                    
                    id: "_1",
                    isCurrent: false
                },
                {
                    id: "2",
                    isCurrent: true
                },
                {
                    id: "34",
                    isCurrent: false
                }


            ]
        }),
        computed:{
            stageNameComp(){
                if (this.stageName)
                    return this.stageName;
                return $t('purchases.CartItems.Stage');
            }
        }
    }
</script>
<style scope>
    .v-stepper{
        box-shadow: none;
    }
</style>
