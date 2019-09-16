export function sourceIcon(source) {
  switch (source) {
    case "REMARKS_OF_STAFF":
      return "perm_identity";
    case "PLANNED_WORKS":
      return "insert_invitation";
    case "OPERATING_STATISTICS":
      return "multiline_chart";
    case "DOWN_TIME":
      return "query_builder";
    default:
      return "border_all";
  }
}

export function statusCaption(status) {
  switch (status) {
    case "CREATION":
      return "Заявитель";
    case "DISPATCHER":
      return "Диспетчер";
    case "RESPONSIBLE":
      return "Определение ответственного";
    case "PREPARATION":
      return "Подготовка";
    case "EXECUTION":
      return "Выполнение";
    case "DONE":
      return "Выполнено";
    case "CANCELED":
      return "Отменена";
    case "ARCHIVE":
      return "Архив";
    default:
      return "Не определена";
  }
}