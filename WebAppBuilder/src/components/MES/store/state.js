export default {
  linearLoader: false, // Linear progress component
  error: null, // Snackbar for errors
  menuMode: 'open', // Main menu state: open, mini, close
  tasksPageState: {
    selectedTask: null,
    selectedTasksTab: 0,
    currentLayout: 'mes-task-main-layout',
  },
  stuffPageState: {
    stuffInputText: ''
  },
  properties: null,
  workCenters: [],
  tasks: {},
  installations: {},
  productions: [],
  productionFormio: {},
  menuMiniMode: true
}