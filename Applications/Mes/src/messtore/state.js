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
    aspectRatioLayout: [25, 75],
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
  mobilityProperties: null,
  userName: null,
  workCenter: null,
  workCenterFixationData: {},
  initialWorkCenter: false,
  workCentersForWorker: [],
  selectedDowntime: null,
  selectedQuality: null,
  selectedDocument: null,
  tasks: [],
  downtimes: [],
  qualities: [],
  documents: [],
  installations: [],
  workCenterProductionEvents: [],
  usersProductionEvents: [],
  productionFormio: {},
  downtimeFormio: {},
  qualityFormio: {},
  documentFormio: {},
  createDowntimeFormio: {},
  menuMiniMode: true,
  ticket: '',
  mainContainerKey: 0,
  actionsAfterInitializeProperties: [],
  initializeDocuments: false,
  initializeQualities: false,
  documentSearchValue: '',
  dynamicPagesCache: [],
  documentKey: 0
}
