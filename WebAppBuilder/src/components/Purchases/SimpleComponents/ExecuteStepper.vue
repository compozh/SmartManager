<template>
    <div>
        <ul class="execute-breadcrumbs">
            <template v-for="(item, i) in items">
                <li :key="i">
                    <div v-if="item !== current" :class="`div-circle ${i < current ? 'executed' : ''}`">&nbsp;</div>
                    <v-icon :class="`${i < current ? 'executed' : ''}`" v-else>local_shipping</v-icon>
                </li>
            </template>
        </ul>
    </div>
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

<style scoped>
.execute-breadcrumbs { 
    font-size: .85em; 
    color: #ccc; 
    line-height: 2;
    margin: 0px; 
    padding-top: 10px; 
}
.executed-breadcrumbs  li { 
    display: inline; 
    list-style-type: circle;  
}
.breadcrumbs li:before { 
    display: inline-block;
    content: ""; 
    border-top: .1rem solid grey; 
    padding-right: 0px;
    width: 1rem;
    margin-right: 2px;
    transform: translateY(-0.65rem);
}
.breadcrumbs li:after { 
    display: inline-block;
    content: ""; 
    border-top: .1rem solid grey; 
    padding-right: 0px;
    width: 1rem;
    margin-left: 2px;
    transform: translateY(-0.65rem);
}
.breadcrumbs-circle{
    display: inline-block;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background-color: grey;
}
.breadcrumbs li.executed:before { 
    border-top-color: green; 
}
.breadcrumbs li.executed:after { 
    border-top-color: grey;
}
.breadcrumbs-circle .executed{
    background-color: green;
}
</style>