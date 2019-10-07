export function typeName(type) {
  switch (type) {
  case 'T':
    return 'Технологический'
  case 'M':
    return 'Ремонтный'
  case 'E':
    return 'Внешний'
  default:
    return ''
  }
}