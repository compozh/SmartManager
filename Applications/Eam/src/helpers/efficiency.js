export function typeName(type) {
  switch (type) {
  case 'PLANNED':
    return 'Плановый'
  case 'ACTUAL':
    return 'Фактический'
  default:
    return 'Не определено'
  }
}

export function indicatorName(indicator) {  
  switch (indicator) {
  case 'AVAILABILITY':
    return 'Доступность'
  case 'PERFORMANCE':
    return 'Продуктивность'
  case 'QUALITY':
    return 'Качество'
  default:
    return ''
  }
}

const indicatorCodes = ['AVAILABILITY', 'PERFORMANCE', 'QUALITY']

export const indicators = indicatorCodes.map(i => { return { code: i, name: indicatorName(i) } })

const typeCodes = ['PLANNED', 'ACTUAL']

export const lossTypes = typeCodes.map(i => { return { code: i, name: typeName(i) } })