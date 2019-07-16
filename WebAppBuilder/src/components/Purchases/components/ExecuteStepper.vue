<template>
    <v-layout row execute-breadcrumbs>
        <template v-for="(item, i) in items">
            <v-layout :key="i" :class="`item ${i < current ? 'executed' : i === current ? 'current' : ''}`" >
                <v-flex before grow>
                    <v-divider />
                </v-flex>
                <v-flex curr shrink>
                    <v-icon v-text="item !== current ? 'panorama_fish_eye' : 'local_shipping'" />
                </v-flex>
                <v-flex after grow>
                    <v-divider />
                </v-flex>
            </v-layout>
        </template>
    </v-layout>
</template>

<script>
    export default {
        name: "esecute-stepper",
        data:()=>({
            items: [0,1,2,3],
            current: 2
        })
    }
</script>

<style lang="scss" scoped>
$color-neutral: #ccc !default;
$color-active: #4183D7 !default;
$color-complete: #87D37C !default;

.execute-breadcrumbs { 
    color: $color-neutral;
    margin: 0px;
    padding: 5px;

    .item{
        .curr{
            margin: 0 0 0 0;
        }
        i{
            margin: 0 0 0 0;
        }
        hr{
            width: 100% !important;
            margin-top: 12px;
        }
    }

    .executed{
        i{
            color: $color-complete;
        }
    }
    .current{
        i{
            color: $color-active;
        }
    }
}
</style>