import { Folder, Process } from '../../api/models';
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
        this.activeItem = item.id;
        break;
      case 'delete':
        success = await this.$store.dispatch('bpmn/deleteItem', item);
        if (success) {
          this.activeItem = item.parentId;
        } else {
          Notification.error(this.$t('bpmn.errors.ProcessNotDeleted'));
          this.activeItem = item.id;
        }
        break;
      case 'copy':
        if (type === 'folder') {
          success = await this.$store.dispatch('bpmn/copyFolder', item);
        } else {
          success = await this.$store.dispatch('bpmn/copyProcess', item);
        }
        if (success) {
          this.activeItem = item.id;
        } else {
          Notification.error(this.$t('bpmn.errors.ProcessNotCreated'));
        }
        break;
      }
      return success;
    },
    createItem(parent, type, xmlView) {
      const parentId = parent ? parent.id : null;
      const model = type === 'folder' ? new Folder({ parentId }) : new Process({ parentId, xmlView });
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
        item.isFolder ? new Folder(item) : new Process(item),
        this.formSave);
    },
    removeItem(item) {
      eventBus.$emit(events.modeler.showForm,
        'delete',
        item.isFolder ? 'folder' : 'process',
        item.isFolder ? new Folder(item) : new Process(item),
        this.formSave);
    },
    copyItem(item) {
      const model = item instanceof Folder ? new Folder(item) : new Process(item);
      model.isSystem = false;
      eventBus.$emit(events.modeler.showForm,
        'copy',
        this.formType = item.isFolder ? 'folder' : 'process',
        model,
        this.formSave);
    }
  }
}