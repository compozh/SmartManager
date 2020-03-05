export const colors = ['red', 'pink', 'purple', 'indigo', 'blue','cyan', 'teal', 'green', 'lime', 'yellow', 'amber', 'orange', 'brown', 'blue-grey', 'grey']

export function randomColor(colors) {
  let number = Math.floor(Math.random() * colors.length)
  return colors[number]
}

export function addPrescriptionToPost(postDateTimeStamp) {
  const postDateTime = new Date(postDateTimeStamp)
  const postDate = postDateTime.getUTCDate()
  const postTiks = Date.parse(postDateTime)
  const now = new Date()
  const nowDate = now.getUTCDate()
  const diff = (now - postTiks) / 60 / 60 / 24 / 1000
  const diffDates = nowDate - postDate
  if (diff < 1) {
    if (diffDates === 0) {
      const diffHourse = diff * 24
      if (diffHourse) {
        return 'Сейчас'
      } else {
        return 'Сегодня'
      }
    } else {
      return 'Вчера'
    }
  } else {
    if (diffDates === 1) {
      return 'Вчера'
    }
    if (diffDates <= 4) {
      return `${diffDates} дня назад`
    }
    return postDateTime.toLocaleDateString()
  }
}
