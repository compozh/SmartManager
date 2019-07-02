<template>
        <v-card>
        <v-sheet class="pa-3 primary lighten-2 resource-group-header-class">
            <v-text-field
                v-model="search"
                label="Поиск группы ресурсов"
                dark
                flat
                solo-inverted
                hide-details
                clearable
                clear-icon="mdi-close-circle-outline"
            />
        </v-sheet>
        <v-card-text>
            <v-treeview class = "non-overflowed text-sm-left resource-group-scroll"
                :items="items"
                :search="search"
                :filter="filter"
                :open.sync="open"
                :active.sync="active"
                :load-children="fetchGroups"
                activatable
                transition
            >
            <template v-slot:prepend="{ item }">
                <v-icon
                    v-if="item.children"
                    v-text="`mdi-${item.id === 1 ? 'home-variant' : 'folder-network'}`"
                />
            </template>
            </v-treeview>
        </v-card-text>
        </v-card>
</template>

<script>
    import purchasesSchemaAxios from "../BaseFunctions"
    export default {
        name: "resource-groups-treeview",
        data:()=>({
            active: [],
            open: [],
            items: [],
            search: "",
            caseSensitive: false
        }),
        methods:{
            async axiosGroups(parenGroup, item){
                //debugger;
                const query = `
                {
                    purchases{
                        resourcesGrops(parent:"${ parenGroup ? parenGroup : "               " }"){
                            id,
                            name,
                            parentId,
                            parent{
                                id,
                                name
                            },
                            children(take:0){
                                id,
                                name
                            }
                        }
                    }
                }`;
                var ret = await purchasesSchemaAxios(this, query);
                return ret;
            },
            async fetchGroups (item) {
                //debugger;
                await this.axiosGroups(item.id).then(i=> {
                   item.children = i.data.data.purchases.resourcesGrops;
                });
            }
        },
        created: function () {
          this.axiosGroups(undefined).then(i=> {
              this.items = i.data.data.purchases.resourcesGrops;
          });
        },
        computed: {
            filter () {
                return this.caseSensitive
                    ? (item, search, textKey) => item[textKey].indexOf(search) > -1
                    : undefined
            }
        },
        watch:{
            active(item){
                if (item.length > 0)
                {
                    this.$emit('onSelect', item[item.length - 1])
                }
            }
        }
}
</script>

<style>
/*.non-overflowed{
    overflow:hidden
}*/
.resource-group-scroll {
  overflow-y: auto;
  max-height: 75.4vh;
}
.resource-group-header-class{
  height: 80px;
}
</style>