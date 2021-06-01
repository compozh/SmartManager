import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  state: {
    comments: null
  },

  mutations: {
    SET_COMMENTS (state, comments) {
      state.comments = comments
    }
  },

  getters: {
    comments: (state, getters, rootState) => {
      return state.comments.map(comment => {
        const user = rootState.app.users.find(user => {
          return user.userId === comment.userId
        })
        return {
          ...comment,
          userPhoto: user?.photo
        }
      })
    }
  },

  actions: {
    async getComments ({ commit }, { type, id }) {
      const objType = type === 'CASE' ? type : 'TASK'
      try {
        const response = await api.getCommentsFromGql(objType, id)
        const comments = response.data.smtasks.comments
        if (comments) {
          commit('SET_COMMENTS', comments)
        } else {
          commit('SET_NOTIFY', {
            text: i18n.t('notify.commentsGetFail'),
            color: 'error'
          })
        }
      } catch (e) {
        console.log(e.message)
        commit('SET_NOTIFY', {
          text: i18n.t('notify.commentsGetError'),
          color: 'error'
        })
      }
    },

    async addComment ({ dispatch, commit }, { comment, params }) {
      const paramsJson = JSON.stringify(params)
      try {
        const response = await api.addCommentToGql(comment, paramsJson)
        const result = response.data.smtasksMutation.addComment
        if (result.success) {
          await dispatch('getComments', {
            type: params.type,
            id: params.id
          })
        } else {
          commit('SET_NOTIFY', {
            text: i18n.t('notify.commentAddFail'),
            color: 'error'
          })
        }
        return result
      } catch (e) {
        console.log(e.message)
        commit('SET_NOTIFY', {
          text: i18n.t('notify.commentAddError'),
          color: 'error'
        })
      }
    }
  }
}
