import smartManagerApi from '../smartManagerApi'
const api = new smartManagerApi()

const actions = {
  getFolders() {
    api.getFoldersFromGql()
  }
}

export default actions