<template>
 <v-container align-center column pa-0>
    <v-row class="layout-title">
      <h1>{{$t('bpmn.labels.RecentlyActive')}}</h1>
      <h2>{{$t('bpmn.labels.LastChanged')}}</h2>
    </v-row>
    <v-divider class="elevation-5" />
    <v-row class="layout recent-diagrams">
      <v-col cols=4 v-for="item in items.slice(0, 3)" :key="item.id">
        <item-card :item="item" :activeItem.sync="active"/>
      </v-col>
    </v-row>
    <v-row class="layout-title py-0" justify="space-between">
      <h1>{{$t('bpmn.labels.Projects')}}</h1>
      <v-col cols="6" class="justify-end">
        <v-row class="align-center justify-end">
          <v-btn  class="text-left white--text blue" @click="addFolder()">
            {{ $t('bpmn.buttons.AddFolder') }}
          </v-btn>
          <v-text-field 
            class="search col-6 py-2"
            clearable
            v-model="search"
            append-icon="search"
            :label="$t('bpmn.labels.Search')"
            single-line
            hide-details
          ></v-text-field>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="elevation-5" />
    <v-row>
      <item-data-table :items="items" :search="search" :activeItem.sync="active"/>
    </v-row>
 </v-container>
</template>
<script>
import { formMixin, importMixin, propertiesPanelEventsHandlersMixin } from '../mixins';
export default {
  name: 'bpmn-main',
  data () {
    return {
      search: '',
    }
  },
  mixins: [ formMixin, importMixin, propertiesPanelEventsHandlersMixin ],
  props: {
      activeItem: String
  },
  methods: {
    addFolder() {
      this.createItem(null, 'folder');
      this.$forceUpdate()
    },
  },
  computed: {
    active: {
      get() {
        return this.activeItem;
      },
      set(value) {
        if (value === this.activeItem) {
          return;
        }
        this.$emit('update:activeItem', value);
      }
    },
    items() {
      return this.$store.state.bpmn.items;
    },
  }
};
</script>
<style lang="scss" scoped>
.layout-title {
  padding: 20px;
  display: flex;
  align-items: center;
  h1{
    color: #535353;
    font-size: 22px;
    font-weight: 700;
    vertical-align: bottom;
  }
  h2{
    margin-left: 30px;
    color: #7d7d7d;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.2;
  }
}

</style>
