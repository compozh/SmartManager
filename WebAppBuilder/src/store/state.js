const state = {
  applicationDescription:{},
  appData: {},
  // Текущий пользователь
  currentUser: localStorage.getItem('userName'),
  userData: {},
  // Массив с названием иконок
  existedIcons:[]

};
export default state