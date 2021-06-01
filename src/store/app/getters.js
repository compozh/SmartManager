export default {
  appParams: state => state.applicationParams,
  search: () => (item, searchFields, value) => {
    for (let i = 0; i < searchFields.length; i++) {
      const searchField = searchFields[i]
      const taskField = item[searchField]
      // Если такого поля нет - пропуск без проверки
      if (!taskField) {
        continue
      }
      const taskFieldValue = String(taskField).toLowerCase()
      const isMatching = taskFieldValue.includes(value.toLowerCase())
      // При первом же совпадении отбор и переход к следующей задаче
      if (isMatching) {
        return true
      }
    }
  }
}
