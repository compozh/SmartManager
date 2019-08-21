export default {
  linearLoader: false, // Linear progress component
  snackbar: {
    type: 'error', // error / success
    message: '',
    visible: false
  },
  menuMode: 'open', // Main menu state: open, mini, close
  tasksPageState: {
    selectedTask: null,
    selectedTasksTab: 0,
    currentLayout: 'main',
    dragResizeMode: false,
    aspectRatioLayout: [35, 65]
  },
  dialogLinearLoader: {
    visible: false,
    message: ''
  },
  stuffPageState: {
    stuffInputText: ''
  },
  obsoleteData: {
    tasks: false
  },
  properties: null,
  workCenter: null,
  initialWorkCenter: false,
  workCentersForWorker: [],
  tasks: [],
  installations: [],
  productions: [],
  productionFormio: null,
  menuMiniMode: true,
  ticket: ''
}