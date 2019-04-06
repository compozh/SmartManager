import moment from "moment";

// https://vuex.vuejs.org/en/state.html
//Состояние
const state = {
    //Состояние инфы пришедшей с сервера
    userName:localStorage.getItem('userName'),//Имя пользователя
    curentDate:moment().format("DD.MM.YYYY"),//Текущая дата
    preLoading:false,//Прелодер
    blockedWindow:false,//Блокируем окно при прелодере
    information_from_server_list: [],//Полная информация
    loginStatus:false,//Залогинен ли
    errorToday:false,//Красить шапку отпадает без надобности
    cardIsShow:1,//Какая карта будет показана
    isDetail:false,
    detailsErrorsTable:[],
    detailsSQLLongTable:[],
    detailPerfExec:[],
    detailWebRequestExec:[],
    detailSchedulerFails:[],
    showDateP:false,
    showiframe:false,
    localization:[{
        "name": "ru",
    "options": {
      "months": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      "shortMonths": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
      "days": ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      "shortDays": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      "toolbar": {
        "exportToSVG": "Сохранить SVG",
        "exportToPNG": "Сохранить PNG",
        "menu": "Menu",
        "selection": "Выбор",
        "selectionZoom": "Выбор с увеличением",
        "zoomIn": "Увеличить",
        "zoomOut": "Уменьшить",
        "pan": "Перемещение",
        "reset": "Сбросить увеличение"
      }
    }
      }]
};
export default state
