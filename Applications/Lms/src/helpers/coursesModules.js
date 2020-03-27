/**
 * стили для отображения данных курсов модулей в карточках
 */
export function addStyles(item) {
  if (item.backgroundColor != undefined) {
    if (item.backgroundColor.toUpperCase() === '#FFFFFF') {
      item.courseTypeInfoClass = 'title font-weight-regular pt-4 pb-1 grey--text text--darken-4'
      item.courseNameInfoClass = 'display-1 font-weight-medium pt-0 pb-2 grey--text text--darken-4'
      item.courseDescriptionInfoClass = 'body-2 font-weight-medium pt-0 pb-3 grey--text text--darken-4'
      item.courseDetailedDurationInfoClass = 'body-2 font-weight-medium pt-0 pb-4 grey--text text--darken-4'
      item.durationInfoClass = 'grey--text text--darken-4'
      item.modulesQtInfoClass = 'grey--text text--darken-4 mt-1 pb-1'
    } else {
      item.courseTypeInfoClass = 'title font-weight-regular pt-4 pb-1 white--text'
      item.courseNameInfoClass = 'display-1 font-weight-medium pt-0 pb-2 white--text'
      item.courseDescriptionInfoClass = 'body-2 font-weight-medium pt-0 pb-3 white--text'
      item.courseDetailedDurationInfoClass = 'body-2 font-weight-medium pt-0 pb-4 white--text'
      item.durationInfoClass = 'white--text'
      item.modulesQtInfoClass = 'white--text mt-1 pb-1'
    }
  }
}
