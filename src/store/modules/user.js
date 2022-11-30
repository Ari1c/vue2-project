import {getInfo, login} from '@/api/index'
import {removeToken, setToken} from '@/utils/auth'

const user = {
  state: {
    user: undefined,
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    }
  },

  actions: {
    // 登录
    Login({commit}, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      return new Promise((resolve, reject) => {
        login(username, password, code).then(res => {
          setToken(res.data.accessToken)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          commit('SET_USER', res.data)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        removeToken()
        resolve()
      })
    }
  }
}

export default user
