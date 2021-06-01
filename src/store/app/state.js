export default {
  applicationParams: {},
  refreshLoader: false,
  preLoaders: [],
  linearPreLoaders: [],
  sideBarLocked: false,
  expandOnHover: true,
  miniVariant: true,
  search: '',
  notify: null,
  helperExec: true,
  activeZone: null,
  privateKeyIsSaved: false,

  // TODO: рассмотреть вариант хранения списка пользователей
  // TODO: в виде объекта с ID в качестве ключей, чтоб не перебирать массив каждый раз
  // Преобразование: Object.fromEntries(users.map(user => [user.id, user]))
  users: []
}
