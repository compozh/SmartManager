<template>
    <vx-card>
        <vs-table stripe :data="education.data">

            <template slot="thead">
                <vs-th v-for='(element, index) in education.headers' :key="index">{{element.headerName}}</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="tr.number">
                        {{tr.number}}
                    </vs-td>
                    <vs-td :data="tr.competence">
                        {{tr.competence}}
                    </vs-td>
                    <vs-td :data="tr.subject">
                        {{tr.subject}}
                    </vs-td>
                    <vs-td :data="tr.duty">
                        {{tr.duty}}
                    </vs-td>
                    <vs-td :data="tr.priority">
                        {{tr.priority}}
                    </vs-td>
                    <vs-td :data="tr.typeAdvancedTraining">
                        {{tr.typeAdvancedTraining}}
                    </vs-td>
                    <vs-td :data="tr.provider">
                        {{tr.provider}}
                    </vs-td>
                    <vs-td :data="tr.status">
                        {{tr.status}}
                    </vs-td>
                    <vs-td :data="tr.note">
                        {{tr.note}}
                    </vs-td>


                    <template class="expand-user" slot="expand">
                        <div class="con-expand-users w-full">
                            <div class="con-btns-user flex items-center justify-between">
                                <div class="con-userx flex items-center justify-start">
                                    <span>{{ tr.subject }}</span>
                                </div>
                            </div>
                            <vs-list>
                                <vs-list-item icon-pack="feather" icon="icon-mail" :title="tr.competence"></vs-list-item>
                                <vs-list-item icon-pack="feather" icon="icon-globe" :title="tr.subject"></vs-list-item>
                                <vs-list-item icon-pack="feather" icon="icon-globe" :title="tr.duty"></vs-list-item>
                                <vs-list-item icon-pack="feather" icon="icon-globe" :title="tr.typeAdvancedTraining"></vs-list-item>
                            </vs-list>
                        </div>
                    </template>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>
</template>

<script>
export default {
  data() {
    return {
      users: []
    }
  },
  props: ['education'],
  created() {
    this.users = this.education.headers.map(element => {
      var object = element
      object.filter = true
      object.width = 250
      return object
    })
  }
}
</script>
<style scoped>
.vx-card__header{
    display: none !important;
}
</style>
