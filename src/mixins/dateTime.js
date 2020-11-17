import moment from 'moment'

export const date = {
  filters: {
    date: value => {
      const formatDate = moment(value, 'DD.MM.YYYY').format('DD.MM.YYYY')
      return formatDate === '01.01.0001' ? '' : formatDate
    }
  },
  computed: {
    currentDate: () => moment(),
    parseTimeStamp: () => timeStamp => moment(timeStamp),
    parseDateTime: () => dateTime => moment(dateTime, 'DD.MM.YYYY HH:mm'),
    parseUtcDateTime: () => dateTime => moment.utc(dateTime, 'DD.MM.YYYY HH:mm'),
    parseVersionDate: () => dateTime => moment.utc(dateTime, 'YYYY-MM-DD HH:mm:ss'),
    parsePickerDate: () => date => moment(date, 'YYYY-MM-DD'),
    parsePickerDateTime: () => date => moment(date, 'YYYY-MM-DD HH:mm'),
    defaultPlanDate: () => moment().add(1, 'days').format('YYYY-MM-DD'),
    delegationDateEnd: () => moment().add(1, 'months'),
    formatPickerDate: () => date => date.format('YYYY-MM-DD'),
    defaultDateTime () {
      return this.defaultPlanDate + ' 12:00'
    },
    formatDate () {
      return date => this.parsePickerDate(date).format('DD.MM.YYYY')
    },
    formatTimeStamp () {
      return timeStamp => this.parseTimeStamp(timeStamp).format('DD.MM.YYYY')
    },
    toLocalString () {
      return dateTime => this.parseUtcDateTime(dateTime).local().format('DD.MM.YYYY HH:mm')
    },
    toIsoLocalString () {
      return dateTime => this.parseDateTime(dateTime).local().format()
    },
    formatDateTime () {
      return dateTime => this.parseDateTime(dateTime).format('YYYY-MM-DD HH:mm')
    },
    formatVersionDate () {
      return dateTime => this.parseVersionDate(dateTime).local().format('DD.MM.YYYY HH:mm')
    },
    compareCurrentDate () {
      return date => this.parsePickerDate(date).isSameOrAfter(this.currentDate, 'day')
    }
  },
  methods: {
    dateSort (itemsArray, fieldName = 'date') {
      return [...itemsArray].sort((a, b) => {
        return this.parseVersionDate(a[fieldName])
          .isBefore(this.parseVersionDate(b[fieldName])) ? 1 : -1
      })
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
      return moment.utc(dateTime, 'DD.MM.YYYY HH:mm')
        .local()
        .format('D MMM YYYY')
    },
    toTime (dateTime) {
      return moment.utc(dateTime, 'DD.MM.YYYY HH:mm')
        .local()
        .format('HH:mm')
    }
  }
}
