import moment from "moment";

// https://vuex.vuejs.org/en/state.html
//состояние
const state = {
    //состояние инфы пришедшей с сервера
    userName:localStorage.getItem('userName'),//имя пользователя
    curentDate:moment().format("DD.MM.YYYY"),//текущая дата
    preLoading:false,//прелодер
    blockedWindow:false,//блокируем окно при прелодере
    information_from_server_list: [],//полная информация
    loginStatus:false,//залогинен ли
    errorToday:false,//красить шапку отпадает без надобности
    cardIsShow:1,//какая карта будет показана
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
