import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import dict from './modules/dict'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'
import droneStatus from './modules/droneStatus'
import changeStatus from './modules/changeStatus'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer (state) {
        return {
          deviceSN: droneStatus.state.deviceSN
        }
      }
    })
  ],
  modules: {
    app,
    dict,
    user,
    tagsView,
    permission,
    settings,
    droneStatus,
    changeStatus
  },
  getters
})

export default store
