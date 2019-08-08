<template>
    <v-card v-if="item">
        <item-picture height="400px"  entityName="resources" :id="item.id"/>
        <span>Наименование: {{item.name}}</span>
        <span>Обозначение: {{item.designation}}</span>
        <span>Группа: {{item.resourceGroup.name}}</span>
    </v-card>
</template>

<script>
    import purchasesSchemaAxios from "../api/BaseFunctions"
    export default {
        name: "catalogue-item",
        data:() => ({
            item: {}
        }),
        props:{
            catalogueId: {
                required: true
            }
        },
        // computed:{
        //     itemCode(){
        //         return this.$route.params.catalogueId
        //     }
        // },
        created: async function () {
            const query = `{
                purchases {
                        resources (id: "${this.catalogueId}"){
                        id,
                        fullName,
                        name,
                        designation,
                        resourceGroup{
                                id,
                                name
                            }
                        }
                    }
                }
            `;
            await purchasesSchemaAxios(this, query).then(this.respCallback);
        },
        methods:{
            respCallback (resp) {
                this.item = _.first(resp.data.data.purchases.resources);
            }
        }
    }
</script>