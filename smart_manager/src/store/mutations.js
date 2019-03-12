import * as jsonpatch from '../patching'

const mutations = {
  /** Загрузка хранилища */
  setAppData(state, data){
    state.appData = data
  },
  /** Загрузка Layout приложения */    
  setAppLayout(state, data){
    state.appLayout = data
  },
  /** Обновить данные патчем */
  updateData(state, patchlist){
    jsonpatch.applyPatchList(state.appData, patchlist);
  },
  /** Обновить Layout патчем */
  updateLayout(state, patchlist){
    jsonpatch.applyPatchList(state.appLayout, patchlist);
  }
};
 
export default mutations