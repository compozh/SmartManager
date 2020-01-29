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
        if (type === 'folder') {
          success = await this.$store.dispatch('bpmn/createFolder', item);
        } else {
          success = await this.$store.dispatch('bpmn/createProcess', item);
        }
        if (success) {
          this.activeItem = item.id;
          this.$forceUpdate()
        } else {
          Notification.error(this.$t('bpmn.errors.ProcessNotCreated'));
        }
        break;
      case 'edit':
        if (type === 'folder') {
          success = await this.$store.dispatch('bpmn/editFolder', item);
        } else {
          success = await this.$store.dispatch('bpmn/editProcess', item);
        }
        if (!success) {
          Notification.error(this.$t('bpmn.errors.ProcessNotEdited'));
        }
        this.$forceUpdate()
        this.activeItem = item.id;
        break;
      case 'delete':
        let deleting = async (elem) => {
          success = await this.$store.dispatch('bpmn/deleteItem', elem);
        }
        if (type === 'all') {
          let successes = []
          item.forEach(async elem => {
            await deleting(elem)
            successes.push(success)
          })
          success = successes.every( el => el)
          if (success) {
            this.chosen = this.chosen.filter( el => !item.find(it => el.id == it.id))
          }
        } else {
          await deleting(item)
          if (success) {
            if (this.chosen) { this.chosen = this.chosen.filter( el => el.id != item.id) }
            this.activeItem = item.parentId
          }
        }
        if (!success) {
          Notification.error(this.$t('bpmn.errors.ProcessNotDeleted'));
        }
        break;
      case 'copy':
        let copy = async (elem) => {
          if (elem.isFolder) {
            success = await this.$store.dispatch('bpmn/copyFolder', elem);
          } else {
            success = await this.$store.dispatch('bpmn/copyProcess', elem);
          }
        }
        if (type === 'all') {
          let successes = []
          item.forEach(async elem => {
            await copy(elem)
            successes.push(success)
          })
          success = successes.every( el => el)
        } else {
          copy(item)
        }
        
        if (success) {
          if (this.chosen) { this.chosen = [] }
        } else {
          Notification.error(this.$t('bpmn.errors.ProcessNotCreated'));
        }
        break;
      }
      return success;
    },
    createItem(parent, type, xmlView) {
      const parentId = parent ? parent.id : null;
      const model = type === 'folder' ? new Folder({ parentId }) : new Diagram({ parentId, xmlView });
      eventBus.$emit(events.modeler.showForm,
        'create',
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
        
        type = item.isFolder ? 'folder' : 'process'
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
      if (Array.isArray(item)) {
        type = 'all'
        model = item.map( it => it.isFolder ? new Folder(it) : new Diagram(it))
      } else {
        
        type = item.isFolder ? 'folder' : 'process'
        model = item.isFolder ? new Folder(item) : new Diagram(item)
      }
      eventBus.$emit(events.modeler.showForm,
        'copy',
        type,
        model,
        this.formSave);

    }
  }
}