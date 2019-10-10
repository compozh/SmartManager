import Folder from '../../api/models/Folder';
import Process from '../../api/models/Process';

export default {
  data() {
    return {
      showForm: false,
      formMode: 'create',
      formModel: undefined,
      formLoading: false,
      formType: 'process'
    }
  },
  methods: {
    async formSave(item, type) {
      this.formLoading = true;
      let success = false;
      switch (this.formMode) {
      case 'create':
        if (type === 'folder') {
          success = await this.$store.dispatch('bpmn/createFolder', item);
        } else {
          success = await this.$store.dispatch('bpmn/createProcess', item);
        }
        if (success) {
          this.showForm = false;
          this.activeItem = item.id;
        } else {
          this.showMessage(this.$t('bpmn.errors.ProcessNotCreated'), 'error');
        }
        break;
      case 'edit':
        if (type === 'folder') {
          success = await this.$store.dispatch('bpmn/editFolder', item);
        } else {
          success = await this.$store.dispatch('bpmn/editProcess', item);
        }
        if (success) {
          this.showForm = false;
        } else {
          this.showMessage(this.$t('bpmn.errors.ProcessNotEdited'), 'error');
        }
        this.activeItem = item.id;
        break;
      case 'delete':
        if (await this.$store.dispatch('bpmn/deleteItem', item)) {
          this.showForm = false;
          this.activeItem = item.parentId;
        } else {
          this.showMessage(this.$t('bpmn.errors.ProcessNotDeleted'), 'error');
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
          this.showForm = false;
          this.activeItem = item.id;
        } else {
          this.showMessage(this.$t('bpmn.errors.ProcessNotCreated'), 'error');
        }
        break;
          
      }
      this.formLoading = false;
    },
    formClose() {
      this.showForm = false;
    },
    createItem(parent, type, xmlView) {
      const parentId = parent ? parent.id : null;
      this.$refs.form.reset();
      this.formMode = 'create';
      this.formModel = type === 'folder' ? new Folder({ parentId }) : new Process({ parentId, xmlView });
      this.formType = type;
      this.showForm = true;
    },
    editItem(item) {
      this.$refs.form.reset();
      this.formMode = 'edit';
      this.formModel = item.isFolder ? new Folder(item) : new Process(item);
      this.formType = item.isFolder ? 'folder' : 'process';
      this.showForm = true;
    },
    removeItem(item) {
      this.$refs.form.reset();
      this.formMode = 'delete';
      this.formModel = item;
      this.formType = item.isFolder ? 'folder' : 'process';
      this.showForm = true;
    },
    copyItem(item) {
      this.$refs.form.reset();
      this.formMode = 'copy';
      this.formModel = item instanceof Folder ? new Folder(item) : new Process(item);
      this.formModel.isSystem = false;
      this.formType = item.isFolder ? 'folder' : 'process';
      this.showForm = true;
    }
  }
}