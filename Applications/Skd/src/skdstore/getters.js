import _ from 'lodash'

var userFilterFunction = state => {
  if (state.users) {
    if (!state.users.personsTable) { return }
  }
  var users = state.users.personsTable.data.filter(u => {
    if (!state.filter) {
      return true
    }
    return u.fullName && u.fullName.toUpperCase().includes(state.filter.toUpperCase()) ||
			u.mobileTel && u.mobileTel.toUpperCase().includes(state.filter.toUpperCase()) ||
			u.email && u.email.toUpperCase().includes(state.filter.toUpperCase())
  })
  if (!state.sort) {
    return users
  }
  function compare(a,b) {
    if (a.movementDate < b.movementDate) { return 1 }
    if (a.movementDate > b.movementDate) { return -1 }
    return 0
  }
	
  return users.sort(compare)
}

export default {
  getUsersListFiltered: state => userFilterFunction(state),
  getGroupedUserList: state => {
    if (!state.users.personsTable) {
      return 
    }
    var users = userFilterFunction(state)
    switch (+state.grouping) {
    case 0:
      return [{group: '', users}]
    case 1:
      return [{group: '', users: _.filter(users, u => !u.IsGone && !u.IsAbsend)}]
    case 2:
      return [{group: '', users: _.filter(users, u => u.hasKey == true && !u.IsGone && !u.IsAbsend)}]
    case 3:
      return [{group: '', users: _.filter(users, u => u.IsGone || u.IsAbsend)}]
    case 4:

      return _.transform(_.groupBy(users, u => u.department), (result, users, group) => {
        result.push({group, users})
      }, [])
				
    case 5:
      return _.transform(_.groupBy(users, u => u.placeName), (result, users, group) => {
        result.push({group, users})
      }, [])

    case 6:
      return [{group: '', users: _.filter(users, u => !u.IsGone && !u.IsAbsend && u.placeName == 'Кухня')}]

    }
		
  },
  getUsersList(state) {
    if (!state.users.personsTable) {
      return null
    }
    const users = state.users.personsTable.data
    const search = state.search ? state.search.trim() : ''
    // Определение необходимость поиска/фильтрации задач
    if (!search || !users) {
      return users
    }
    // Список полей, по которым осуществляется поиск
    const searchFields = [
      'placeName',
      'fullName',
    ]
    return users.filter(user => {
      // Цикл for по ключам задачи для возможности использовать continue
      for (let i = 0; i < searchFields.length; i++) {
        let searchField = searchFields[i]
        let userField = user[searchField]
        // Если такого поля нет - пропуск без проверки
        if (!userField) {
          continue
        }
        let userFieldValue = String(userField).toLowerCase()
        let isMatching = userFieldValue.includes(search.toLowerCase())
        // При первом же совпадении отбор и переход к следующей задаче
        if (isMatching) {
          return true
        }
      }
    })
  },

  getItemsOffset: state => state.itemsOffset,
  getFilter: state => state.filter,
}