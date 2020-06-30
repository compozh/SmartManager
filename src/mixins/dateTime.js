import moment from 'moment'

export const date = {
  filters: {
    date: value => {
      const formatDate = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
      return formatDate === '01.01.0001' ? '' : formatDate
    }
  },
  computed: {
    parseDateTime: () => dateTime => moment(dateTime, 'DD.MM.YYYY HH:mm'),
    parseVersionDate: () => dateTime => moment(dateTime, 'YYYY-MM-DD HH:mm:ss'),
    parsePickerDate: () => date => moment(date, 'YYYY-MM-DD'),
    defaultPlanDate: () => moment().add(1, 'days').format('YYYY-MM-DD'),
    formatPickerDate: () => date => date.format('YYYY-MM-DD'),
    formatDate () {
      return date => this.parsePickerDate(date).format('DD.MM.YYYY')
    },
    formatDateTime () {
      return dateTime => this.parseDateTime(dateTime).format('YYYY-MM-DD HH:mm')
    },
    formatVersionDate () {
      return dateTime => this.parseVersionDate(dateTime).format('DD.MM.YYYY HH:mm')
    }
  }
}

export const time = {
  computed: {

  }
}

// Special for chat component
export const commentDates = {
  methods: {
    isSameDay (dateTimeTo, dateTimeFrom) {
      const formal = 'DD.MM.YYYY HH:mm'
      const dateTo = moment(dateTimeTo, formal).format('LL')
      const dateFrom = moment(dateTimeFrom, formal).format('LL')
      return dateTo === dateFrom
    },
    toDate (dateTime) {
      moment.locale(this.$i18n.locale)
      return moment(dateTime, 'DD.MM.YYYY HH:mm')
        .format('D MMM YYYY')
    }
  }
}
