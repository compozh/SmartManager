/**
 * Получить значение объекта по пути
 * @param {*} targetObject Целевой объект
 * @param {*} path Путь, по которому нужно получить значение
 */
export function get(targetObject, path) {
  let object = getObjectByPath(targetObject, path)
  let key = getLastPathKey(path)
  return object[key]
}

/**
 * Применить список патчей к объекту
 * @param {*} targetObject Объект, к которому нужно применить патч
 * @param {*} patchlist Список патчей
 */
export function applyPatchList(targetObject, patchlist) {
  if (Array.isArray(patchlist)) {
    patchlist.forEach(patch => {
      applyPatch(targetObject, patch)
    })
  }
}

/**
 * Применить патч к объекту
 * (Изменение части объекта по пути)
 * @param {object} targetObject Объект, к которому нужно применть патч
 * @param {Array<object>} patch Применяемый патч
 */
export function applyPatch(targetObject, patch) {
  let object = getObjectByPath(targetObject, patch.path)

  // Получение ключа в виде строки и числа
  let key = getLastPathKey(patch.path)
  let intKey = Number(key)

  let targetIsArray = Array.isArray(object)

  // Проходим по возможным операциям
  switch (patch.op) {
  // Добавление
  case PatchOperations.ADD:
    // Добавление в массив
    if (targetIsArray) {
      // Добавление в массив по индексу
      if (!isNaN(intKey)) {
        object.splice(intKey, 0, patch.value)
        break
      }
      // Добавление в конец массива
      if (key == '-') {
        object.push(patch.value)
        break
      }
    }
    //TODO: Добавление в объект
    break

    // Удаление
  case PatchOperations.REMOVE:
    // Удаление из массива
    if (targetIsArray && !isNaN(intKey)) {
      object.splice(intKey, 1)
    }
    // TODO: Удаление из объекта
    break
    // Замена значения
  case PatchOperations.REPLACE:
    object[key] = patch.value
    break

  default:
    break
  }
}

/** Возможные операции патчинга объектов */
export const PatchOperations = {
  ADD: 'add',
  REMOVE: 'remove',
  REPLACE: 'replace'
}

//////////////////////////////////////////////////////
//                INTERNAL FUNCTIONS
//////////////////////////////////////////////////////

function getPathStack(path) {
  // Нормализуем путь
  path = path.replace(/(^\/)|(\/$)/, '')
  // Стек сегментов пути
  return path.split('/')
}

function getLastPathKey(path) {
  return getPathStack(path).pop()
}

function getObjectByPath(targetObject, path) {
  let stack = getPathStack(path)

  // Находим целевой объект по пути в патче
  var object = targetObject
  while (stack.length > 1) {
    object = object[stack.shift()]
  }
  return object
}
