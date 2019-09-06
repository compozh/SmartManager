export default {
  circularLoader: false, // Circular progress component
  linearLoader: false, // Linear progress component
  message: {}, // Snackbar for messages
  menuMode: {
    currentState: 'close', // Main menu state: open, mini, close
    lastState: '' // Stores last main menu state before addTaskForm open
  },
  taskAddForm: 'close', // Task addition form: open, close
  folders: null,
  currentFolder: null,
  search: null,
  tasks: {},
  taskInfo: {},
  users: []
}
