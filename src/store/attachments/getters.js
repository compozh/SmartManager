import moment from 'moment'
// Attachments sorting by adding date
export default {
  attachments: state => {
    if (state.attachments) {
      const attachments = [...state.attachments]
      return attachments.sort((a, b) => {
        const date = date => moment(date, 'DD.MM.YYYY HH:mm')
        return date(a.date).isBefore(date(b.date)) ? 1 : -1
      })
    } else {
      return []
    }
  }
}
