import * as jsonpatch from '../patching'
import Vue from 'vue'

const mutations = {

  /** Описание приложения */
  SetAppDescription(state, application) {
    state.applicationDescription = application;
  },

  /** Загрузка хранилища */
  setAppData(state, payload) {
    Vue.set(state.appData, payload.key, payload.data)
  },
  /** Установка текущего пользователя */
  setCurrentUser(state, userInfo) {
    state.currentUser = userInfo;
  },
  /** Установка данных пользователя */
  setUserData(state, userInfo) {
    state.userData = userInfo;
  },
  /** Установка массива с svg */
  setExistedIcons(state, payload) {
    state.existedIcons = payload;
  }
  // /** Загрузка Layout приложения */
  // setAppLayout(state, payload) {
  //   Vue.set(state.appLayout, payload.key, payload.data)
  // },
  // /** Обновить данные патчем */
  // updateData(state, {
  //   key,
  //   patchlist
  // }) {
  //   jsonpatch.applyPatchList(state.appData[key], patchlist);
  // },
  // /** Обновить Layout патчем */
  // updateLayout(state, {
  //   key,
  //   patchlist
  // }) {
  //   jsonpatch.applyPatchList(state.appLayout[key], patchlist);
  // }
};

export default mutations