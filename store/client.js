import Web3 from 'web3'

import app from '~/plugins/app'

const loginMethod = localStorage.getItem('loggedInWith') || null
const lastAddresses = localStorage.getItem('address') || null

export default {
  namespaced: true,

  state: () => {
    return {
      loggedIn: false,
      loggedInWith: loginMethod,
      address: lastAddresses || null,
    }
  },

  mutations: {
    loggedIn(state, payload) {
      state.loggedIn = payload.loggedIn
    },
    loggedInWith(state, payload) {
      state.loggedInWith = payload.loggedInWith
      localStorage.setItem('loggedInWith', state.loggedInWith)
    },
    address(state, payload) {
      state.address = payload.address
      localStorage.setItem('address', state.address)
    },
    web3Client(state, payload) {
      state.web3Client = payload
      window.web3Client = state.web3Client
    },
  },

  getters: {
    loggedIn(state) {
      return state.loggedIn
    },
    loggedInWith(state) {
      return state.loggedInWith
    },
    address(state) {
      return state.address
    },
    web3Client(state) {
      return state.web3Client
    },
  },

  actions: {
    logout({ state, commit, dispatch }) {
      commit('loggedIn', { loggedIn: false })
      commit('loggedInWith', { loggedInWith: null })
      commit('address', { address: null })
      localStorage.removeItem('address')
      localStorage.removeItem('loggedInWith')
    },
    doLogin({ commit }, payload) {
      if (
        !payload ||
        !payload.address ||
        !payload.loggedInWith ||
        !payload.web3
      ) {
        // console.log('web3, User address and wallet is required for login')
        return
      }
      commit('web3Client', payload.web3)
      if (payload.address) {
        commit('address', { address: payload.address })
        commit('loggedInWith', { loggedInWith: payload.loggedInWith })
        commit('loggedIn', { loggedIn: true })
      } else {
        commit('address', { address: null })
      }
    },

    initweb3({ state, commit, dispatch }) {
      try {
        const web3 = new Web3(
          Web3.givenProvider ||
            Web3.providers.HttpProvider(app.uiconfig.rpc_url)
        )
        commit('web3Client', web3)
      } catch (error) {}
    },
  },
}
