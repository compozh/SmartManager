const state = {
  applicationDescription:{},
  appData: {},
  // Текущий пользователь
  currentuser: localStorage.getItem('userName'),
  // Массив с названием иконок
  existedIcons:[]

};
export default state