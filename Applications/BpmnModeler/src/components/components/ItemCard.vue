<template>
  <v-card class="item-card pa-2" elevation="5" :loading="loading">
    <v-card-text @click="openProject(item)" ref="container" class="preview" :style="loading ? 'height: 45px' : 'height: 200px'">
    </v-card-text>
    <v-card-title class="justify-space-between py-1 px-2 ma-0 row">
      <v-col class="py-0">
        <v-row>
          <bpmn-tree-icon :node="item"></bpmn-tree-icon>
          <h1 class="pl-2" :title="item.name">{{item.name}}</h1>
          <h2>{{$t('bpmn.labels.EditTime')}}: </h2> <h2 class="pl-1">{{item.editTime || item.creationTime | formatDate}}</h2>
        </v-row>
      </v-col>
      <v-checkbox v-model="choose" v-if="chosen" class="ma-0"/>
    </v-card-title>
  </v-card>
</template>

<script>
import moment from 'moment'
import { events } from '../../constants';
import { CancellationToken, editorFactory } from '../../api';
import { eventBus } from '../../main';
import { debounce } from 'throttle-debounce';
export default {
  name: 'item-card',
  data() {
    return {
      modeler: null,
      loading: false,
      cancellationToken: new CancellationToken(),
      onElementChanged: null,
      preview: null
    };
  },
  props: {
    item: Object,
    activeItem: String,
    chosen: Array
  },
  filters: {
    formatDate: (value) => {
      if (value) {
        return moment(value).format('DD.MM.YYYY HH:mm:ss')
      }
    },
  },
  mounted() {
    if (this.item) {
      this.createModeler()
    }
  },
  methods: {
    createModeler() {
      this.modeler = editorFactory(this.item.type, true, this.$refs.container, null, () => {})
      this.loadXml();
    },
    setSVG() {
      let self = this
      this.modeler.saveSVG((err, svg) => {
        if (err) {
          console.error(err);
          return;
        }
        self.preview = svg 
        self.$refs.container.innerHTML = svg
        let style = self.$refs.container.children[0].style
        style.maxWidth = '100%'
        style.maxHeight = '100%'
      });
    },
    async loadXml() {
      if (!this.item || !this.modeler) {
        return;
      }
      this.loading = true;
      if (!this.cancellationToken.isCancelled) {
        this.cancellationToken.cancel();
      }
      
      const debounced = debounce(500, async (cancellationToken) => {
        const xml = await this.$store.dispatch('bpmn/getXml', this.item.id);
        if (cancellationToken.isCancelled) {
          return;
        }
        if (xml === false) {
          this.loading = false;
          // TODO: display exception
          return;
        }
        if (!xml || xml === '') {
          if(this.modeler.createDiagram){
            this.modeler.createDiagram(() => {
              this.loading = false;
            })
          } else {
            this.loading = false;
            }
        } else {
          this.modeler.importXML(xml, (err) => {
            this.loading = false;
            if (err) {
              console.error(err);
              // TODO: display exception
              this.modeler.createDiagram();
              this.loading = false;
            }
          })
        }
      })

      this.cancellationToken = new CancellationToken(debounced);
      debounced(this.cancellationToken);
    },
    openProject(el) {
      this.active = el
    },
  },
  updated() {
    if (!this.preview && !this.loading && this.item.type == 'BPMN') {
      eventBus.$on(events.modeler.export, this.setSVG)
      eventBus.$emit(events.modeler.export, 'svg')
      eventBus.$off(events.modeler.export, this.setSVG)
    }
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
    choose: {
      get() {
        return this.chosen.find( el => el.id == this.item.id);
      },
      set(value) {
        this.$emit('choosed', this.item)        
      }
    }
  },
};
</script>
<style lang="scss" scoped>

.v-card__text{
  cursor: pointer;
}

h1 {
  color: #535353;
  font-size: 22px;
  font-weight: 700;
  vertical-align: bottom;
  text-align: start;
  height: 32px;
  width: calc(100% - 30px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.preview {
  padding: 0;
}
h2 {
  line-height: 20px;
  color: #535353;
  font-size: 13px;
  font-weight: 500;
  vertical-align: bottom;
}
</style>