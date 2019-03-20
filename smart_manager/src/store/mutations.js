import * as jsonpatch from '../patching'
import Vue from 'vue'

const mutations = {
  /** Загрузка хранилища */
  setAppData(state, payload) {
    Vue.set(state.appData, payload.key, payload.data)
  },
  /** Загрузка Layout приложения */
  setAppLayout(state, payload) {
    Vue.set(state.appLayout, payload.key, payload.data)
  },
  /** Обновить данные патчем */
  updateData(state, {
    key,
    patchlist
  }) {
    jsonpatch.applyPatchList(state.appData[key], patchlist);
  },
  /** Обновить Layout патчем */
  updateLayout(state, {
    key,
    patchlist
  }) {
    jsonpatch.applyPatchList(state.appLayout[key], patchlist);
  }
};

export default mutations