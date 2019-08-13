export default {
  linearLoader: false, // Linear progress component
  snackbar: {
    type: 'error', // error / success
    message: '',
    visible: false
  },
  menuMode: 'close', // Main menu state: open, mini, close
  tasksPageState: {
    selectedTask: null,
    selectedTasksTab: 0,
    currentLayout: 'mes-task-main-layout',
  },
  dialogLinearLoader: {
    visible: false,
    message: ''
  },
  stuffPageState: {
    stuffInputText: ''
  },
  properties: null,
  workCenters: {},
  tasks: {},
  installations: {},
  productions: [],
  productionFormio: {},
  dragResizeMode: false,
  menuMiniMode: true
}