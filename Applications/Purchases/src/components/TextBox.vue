 <template >
 <v-text-field 
                   v-model="text"
                   outlined
                   @focus="onFocus"
                   @blur="onBlur"
                   @input="onChage"
                >
                 <template v-slot:append v-if="isVisibleSave()">
                     <button @click="onSave">
                         <v-icon v-text="'save'" />
                     </button>
                 </template>
                 </v-text-field>
                 </template>
                

<script>

import {PurchasesApi} from '../api/purchasesApi'
import _ from 'lodash'
// import draggable from 'vuedraggable'
import draggable from  './Draggable'// 'vuedraggable'

const api = new PurchasesApi()


export default {
  name: 'textbox',
  props: {
    item: undefined,
    field: null,
    change: { type: Function }
  },
  data: () => ({
    saveVisible: false,
    oldValue: '',
    savedd: false
  }),
  computed: {
    text: {
      get: function() {
        return this.item[this.field]
      },
      set: function(newVal) {
        this.item[this.field] = newVal
      }
    }
  },
  methods: {
    onFocus() {
      this.saveVisible = true
      this.oldValue = this.text
    },
    onBlur() {
      if (this.oldValue !== this.text) {
        this.text = this.oldValue
        this.saveVisible = false
      }
    },
    onChage() {
      this.saveVisible = true
    },
    onSave() {
      this.change(this.item)
      this.oldValue = this.text
      this.saveVisible = false
    },
    isVisibleSave() {
      return this.saveVisible && this.oldValue !== this.text
    }
  }
}
</script>