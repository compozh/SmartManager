/**
 * LMS. Состояние теста
 */
export const testStatus = {
  open: 1,
  closed: 2,
  finished: 3,
  notActual: 4,
  canseled: 5
}

/**
 * LMS. перечисление типы вопросов
 */
export const questionType = {
  // Одиночный выбор
  singleChoice: 1,
  // Множественный выбор
  multipleChoice: 2,
  // Сетка (одиночный выбор)
  gridSingleChoice: 3,
  // Сетка флажков
  gridMultipleChoice: 4,
  /// Правильная последовательность
  rightSequence: 5,
  /// Поле ввода
  inputField: 6,
  /// Шкала
  scale: 7,
  // Нет атрибутов
  unknown: 8
}

/**
 * LMS. Перечисление типы полей ввода
 */
export const fieldType = {
  // Строка
  row: 1,
  // Столбец
  column: 2,
  // Однострочный текст
  singleLineText: 3,
  // Многострочный текст
  multilineText: 4,
  // Дата
  dateValue: 5,
  // Число
  digit: 6,
  // Время
  time: 7,
  // Дата-время
  dateTime: 8,
  // e-mail
  email: 9
}
