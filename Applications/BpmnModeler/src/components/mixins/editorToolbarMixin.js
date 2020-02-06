export default {
  data() {
    return {
      canRedo: false,
      canUndo: false,
      canMinimap: false,
      canZoom: false
    };
  },
  methods: {
    onEditorChanged() {
      this.onCanMinimap();
      this.onCanUndoRedo();
      this.onCanZoom();
    },
    onMinimap() {
      const minimap = this.getEditorModule('minimap');
      if (minimap) {
        minimap.toggle();
      }
    },
    onCanMinimap() {
      this.canMinimap = this.getEditorModule('minimap');
    },
    onUndo() {
      const commandStack = this.getEditorModule('commandStack');
      if (commandStack) {
        commandStack.undo();
      }
    },
    onRedo() {
      const commandStack = this.getEditorModule('commandStack');
      if (commandStack) {
        commandStack.redo();
      }
    },
    onCanUndoRedo() {
      const commandStack = this.getEditorModule('commandStack');
      if (commandStack) {
        this.canUndo = commandStack.canUndo();
        this.canRedo = commandStack.canRedo();
      }
    },
    onZoomOut() {
      var zoomScroll = this.getEditorModule('zoomScroll');
      if (zoomScroll) {
        zoomScroll.stepZoom(-1);
      }
    },
    onZoomIn() {
      var zoomScroll = this.getEditorModule('zoomScroll');
      if (zoomScroll) {
        zoomScroll.stepZoom(1);
      }
    },
    onZoomReset() {
      var zoomScroll = this.getEditorModule('zoomScroll');
      if (zoomScroll) {
        zoomScroll.reset();
      }
    },
    onCanZoom() {
      this.canZoom = this.getEditorModule('zoomScroll');
    }
  }
};