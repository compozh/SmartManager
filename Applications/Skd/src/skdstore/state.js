export default {
  message: {}, // Snackbar for messages
  itemsOffset: 20,
  filter: localStorage.getItem('filter') || '',
  // filter: localStorage.getItem('filter') || {name: '', value: ''},
  users: [],
  grouping: localStorage.getItem('grouping') || 0,
  user: {}, //состояние юзера
  sort: localStorage.getItem('sorting') || 0
}