<template>
    <vx-card>
        <vs-table stripe :data="education.data" :noDataText="$t('agGrid.noDataAvailabl')">

            <template slot="thead">
                <vs-th v-for='(element, index) in education.headers' :key="index" v-show="element.field !== 'detailRowValue'">{{element.headerName}}</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr.competenceTitle">
                        {{tr.competenceTitle}}
                    </vs-td>
                    <vs-td :data="tr.subject">
                        {{tr.subject}}
                    </vs-td>
                    <vs-td :data="tr.isRequired">
                        <vs-checkbox disabled="true" v-model="tr.isRequired"></vs-checkbox>
                    </vs-td>
                    <vs-td :data="tr.priority">
                        {{tr.priority}}
                    </vs-td>
                    <vs-td :data="tr.provider">
                        {{tr.provider}}
                    </vs-td>
                    <vs-td :data="tr.statusTitle">
                        {{tr.statusTitle}}
                    </vs-td>
                    <template class="expand-user" slot="expand">
                        <div class="con-expand-users w-full">
                            <vs-list>
                                <vs-list-item icon-pack="feather" icon="icon-type" :title="tr.detailRowValue"></vs-list-item>
                            </vs-list>
                        </div>
                    </template>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>
</template>

<script>
/* eslint-disable */
export default {
  props: ['education'],
}
</script>

<style scoped>
::v-deep .vs-table--thead{
    color: rgba(0, 0, 0, 0.54);
    font-weight: 600;
}
::v-deep .vs-table-text{
    font-size: 14px;
}
</style>