export const lessonType = {
  text: 'TEXT',
  video: 'VIDEO',
  test: 'TEST'
}

export const materialType = {
  file: 'FILE',
  presentation: 'PRESENTATION',
  link: 'LINK'
}

export const lessonIcons = {
  text: 'insert_drive_file',
  video: 'ondemand_video',
  test: 'playlist_add_check'
}

export function addTicketToLink(rowLink) {
  const token = sessionStorage.getItem('refreshToken')
  return rowLink.concat(token)
}
