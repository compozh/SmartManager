/**
 * LMS. Ссылки для вспомогательной навигации вида Link1 > Link2 > Link3
 */

/**
 * Получить ссылку для текущего марщрута
 * @param {String} title        Название для отображения
 * @param {String} thisRoutPath путь текущего марщрута
 */
export function getThisLink(title, thisRout) {
  let link = {
    title,
    name: thisRout.name,
    params: thisRout.params
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


export function getLinks(title, route, links) {
  let linksNew = links.slice()
  // найти текущий
  let index = linksNew.findIndex(item => item.title === title)
  if (index === -1) {
    linksNew.push({
      title,
      name: route.name,
      params: route.params
    })
  } else {
    linksNew = linksNew.slice(0, index + 1)
    linksNew[linksNew.length - 1].params = route.params
  }
  return linksNew
}
