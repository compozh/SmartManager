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
    aspectRatioLayout: [35, 65],
    filterValue: ''
  },
  productionPageState: {
    selectedProductionTab: 0
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
  userName: null,
  workCenter: null,
  workCenterState: null,
  workCenterDescription: null,
  initialWorkCenter: false,
  workCentersForWorker: [],
  selectedDowntime: null,
  tasks: [],
  downtimes: [],
  installations: [],
  workCenterProductionEvents: [],
  usersProductionEvents: [],
  productionFormio: {},
  downtimeFormio: {},
  createDowntimeFormio: {},
  menuMiniMode: true,
  ticket: '',
  mainContainerKey: 0,
  actionsAfterInitializeProperties: []
}
