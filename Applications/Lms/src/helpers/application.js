/**
 * проверить устройство на котором запущено приложение
 */
export function isMobile() {
  const ua = navigator.userAgent
  if (ua.includes('Android') || ua.includes('iPhone') || ua.includes('iPad') || ua.includes('Tablet')) {
    return true
  } else {
    return false
  }
}
