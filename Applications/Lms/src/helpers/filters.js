/**
 * LMS. Фильтры для отбора курсов и модулей по категориям.
 */

// -----------------------------------
// Проверить изменения в фильтарх
// -----------------------------------
export function checkFiltersChanges (filters) {
  var setFilters = false
  if (filters) {
    for (let index = 0; index < filters.length; index++) {
      const filter = filters[index]
      for (let itemIndex = 0; itemIndex < filter.items.length; itemIndex++) {
        if (filter.items[itemIndex].selected) {
          setFilters = true
          break
        }
      }
      if (setFilters) {
        break
      }
    }
  }
  return setFilters
}

// --------------------------------------------------
// Рзаделить фильтры на roles, levels, products, tags
// --------------------------------------------------
export function separateFilters (filters) {
  var roles = []
  var levels = []
  var products = []
  var tags = []

  for (let index = 0; index < filters.length; index++) {
    const filter = filters[index]
    switch (filter.name) {
    case 'Роль':
      for (let index = 0; index < filter.items.length; index++) {
        if (filter.items[index].selected) {
          roles.push(filter.items[index])
        }
      }
      break
    case 'Уровень':
      for (let index = 0; index < filter.items.length; index++) {
        if (filter.items[index].selected) {
          levels.push(filter.items[index])
        }
      }
      break
    case 'Продукт':
      for (let index = 0; index < filter.items.length; index++) {
        if (filter.items[index].selected) {
          products.push(filter.items[index])
        }
      }
      break
    case 'Тэг':
      for (let index = 0; index < filter.items.length; index++) {
        if (filter.items[index].selected) {
          tags.push(filter.items[index])
        }
      }
      break
    }
    return {roles, levels, products, tags}
  }
}
