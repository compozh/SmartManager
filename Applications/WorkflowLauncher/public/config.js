
window.appConfig = {
  GrapgQlUrl: window.devMode ? 'http://localhost:15504/' : '/GraphQlServer/',
  BASE_URL: window.VUE_APP_BASE_PATH,
  WsUrl: window.devMode ? 'http://localhost:64137/ws/api/' : '/ws/api/',
  SignalRUrl: 'https://m.it.ua/ws/signalr/hubs'
}

const apps = [
  {
    'name': 'Smart Manager',
    'image': '/img/app/smartmanager.svg',
    'link': 'https://m.it.ua/webapps/SmartManager/'
  },
  {
    'name': 'Bpmn Modeler',
    'image': '/img/app/bpmnmodeler.svg', 
    'link': 'https://m.it.ua/webapps/BpmnModeler/'
  },
  {
    'name': 'Bpmn Cockpit',
    'image': '/img/app/admin.svg', 
    'link': 'https://m.it.ua/webapps/skd/'
  }
]

const documentation = [
  {
    'name': 'BPM концепция процессного управления',
    'image': 'ActivityIcon',
    'link': 'https://ru.wikipedia.org/wiki/BPM_(%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D0%BA%D0%BE%D0%BD%D1%86%D0%B5%D0%BF%D1%86%D0%B8%D1%8F)'
  },
  {
    'name': 'BPMN функциональная последовательность работ',
    'image': 'AlignJustifyIcon',
    'link': 'https://ru.wikipedia.org/wiki/BPMN'
  },
  {
    'name': 'EPC событийная последовательность работ',
    'image': 'PieChartIcon',
    'link': 'https://ru.wikipedia.org/wiki/%D0%A1%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D0%B9%D0%BD%D0%B0%D1%8F_%D1%86%D0%B5%D0%BF%D0%BE%D1%87%D0%BA%D0%B0_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D0%B2'
  },
  {
    'name': 'IDEF0 логическая последовательность работ',
    'image': 'SettingsIcon',
    'link': 'https://ru.wikipedia.org/wiki/IDEF0'
  },
  {
    'name': 'XPDL язык описания процессов',
    'image': 'CodeIcon',
    'link': 'https://ru.wikipedia.org/wiki/XPDL'
  },
  {
    'name': 'ДРАКОН язык программирования и моделирования процессов',
    'image': 'TerminalIcon',
    'link': 'https://ru.wikipedia.org/wiki/%D0%94%D0%A0%D0%90%D0%9A%D0%9E%D0%9D'
  }
]
//TODO вложить сюда данные как отдельный объект