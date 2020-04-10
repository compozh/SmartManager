/**
 * LMS. Ссылки для вспомогательной навигации вида Link1 > Link2 > Link3
 */

/**
 * Получить ссылку для текущего марщрута
 * @param {String} title        Название для отображения
 * @param {String} thisRoutPath путь текущего марщрута
 * @param {Boolean} isDisabled  доступность
 */
export function getThisLink(title, thisRoutPath, isDisabled) {
  let href = thisRoutPath
  let link = {
    text: title,
    disabled: isDisabled,
    href: href
  }
  return link
}

/**
 * Получить коллекцию ссылок: предшествующие маршруты + текущий
 * @param {Array} inputLinks - Ссылки предыдущих переходов от Home
 * @param {Object} thisLink  - текущая ссылка
 */
export function getRoutesLinks(inputLinks, thisLink) {
  let links = null
  if (inputLinks) {
    links = [...inputLinks, thisLink]
    links[links.length - 2].disabled = false
  }
  return links
}
