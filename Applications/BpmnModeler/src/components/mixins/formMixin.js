import { Folder, Diagram } from '../../api/models';
import { eventBus } from '../../main';
import { events } from '../../constants';
import { Notification } from 'element-ui';

export default {
  methods: {
    async formSave(item, type, mode) {
      let success = false;
      switch (mode) {
      case 'create':
        let create = async (elem) => {
          let val
            if (elem.isFolder) {
              val = await this.$store.dispatch('bpmn/createFolder', elem);
            } else {
              console.log(elem)
              val = await this.$store.dispatch('bpmn/createProcess', elem);
            }
          return val
        }
        if (type === 'all') {
          let processArray =  async (array) => {
            const promises = array.map(elem => create(elem))
            success =  await Promise.all(promises)
            success = success.every( el => el)
          }
          await processArray(item)
        } else {
          success = await create(item)
        }
        
        if (!success) {
          Notification.error(this.$t('bpmn.errors.ProcessNotCreated'));
        } 
        break;
      case 'edit':
        if (type === 'folder' ) {
          success = await this.$store.dispatch('bpmn/editFolder', item);
        } else {
          success = await this.$store.dispatch('bpmn/editProcess', item);
        }
        if (!success) {
          Notification.error(this.$t('bpmn.errors.ProcessNotEdited'));
        } else {
          this.$forceUpdate()
        }
        break;
      case 'delete':
        let deleting = async (elem) => {
          let val = await this.$store.dispatch('bpmn/deleteItem', elem);
          return val
        }
        if (type === 'all') {          
          let processArray =  async (array) => {
            const promises = array.map(elem => (deleting(elem)))
            success =  (await Promise.all(promises)).every( el => el)
          }
          await processArray(item)
        } else {
          success = await deleting(item)
          if (success ) {
            this.$forceUpdate()
            this.active = item.parentId
          }
        }
        if (!success) {
          Notification.error(this.$t('bpmn.errors.ProcessNotDeleted'));
        } else if (this.choose) {
          this.choose = this.choose.filter( el => !item.find(it => el.id == it.id))
        }
        break;
      case 'copy':
        let copy = async (elem) => {
          let val
            if (elem.isFolder) {
              val = await this.$store.dispatch('bpmn/copyFolder', elem);
            } else {
              val = await this.$store.dispatch('bpmn/copyProcess', elem);
            }
          return val
        }
        if (type === 'all') {
          let processArray =  async (array) => {
            const promises = array.map(elem => copy(elem))
            success =  await Promise.all(promises)
            success = success.every( el => el)
          }
          await processArray(item)
        } else {
          success = await copy(item)
        }
        
        if (!success) {
          Notification.error(this.$t('bpmn.errors.ProcessNotCreated'));
        } else if (this.choose) {
          this.choose = this.choose.filter( el => item.find(it => el.id == it.id))
        }
        
        break;
      }
      return success;
    },
    createItem(parent, type, xmlView, options) {
      let model, mode = options?  'import' : 'create'
      const parentId = parent ? parent.id : null;
      if ( type == 'all') {
        model = options.map( it => new Diagram({ parentId, xmlView: it.xmlView, name: it.name, type: it.type}))
      } else if(options) {
        model =  new Diagram({ parentId, xmlView: options[0].xmlView || xmlView, name: options[0].name, type: options[0].type})
      } else {
        model = type === 'folder' ? new Folder({ parentId }) : new Diagram({ parentId, xmlView});
      }
      eventBus.$emit(events.modeler.showForm,
        mode,
        type,
        model,
        this.formSave);
    },
    editItem(item) {
      eventBus.$emit(events.modeler.showForm,
        'edit',
        item.isFolder ? 'folder' : 'process',
        item.isFolder ? new Folder(item) : new Diagram(item),
        this.formSave);
    },
    removeItem(item) {
      let  type, model
      if (Array.isArray(item)) {
        type = 'all'
        model = item.map( it => it.isFolder ? new Folder(it) : new Diagram(it))
      } else {
        type = item.isFolder ?  'folder' : 'process'
        model = item.isFolder ? new Folder(item) : new Diagram(item)
      }
      eventBus.$emit(events.modeler.showForm,
        'delete',
        type,
        model,
        this.formSave);
    },
    copyItem(item) {
      let  type, model
      if (Array.isArray(item) && item.length > 1) {
        type = 'all'
        model = item.map( it => it.isFolder ? new Folder(it) : new Diagram(it))
      } else {
        type = item.isFolder ? 'folder' : 'process'
        model = item.isFolder ? new Folder(item) : new Diagram(Array.isArray(item) ? item[0] : item)
      }
      eventBus.$emit(events.modeler.showForm,
        'copy',
        type,
        model,
        this.formSave);

    }
  }
}