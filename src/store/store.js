// store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    isAuthenticated: false,
    user: null,
    userType: null,
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status;
    },
    setUser(state, user) {
      state.user = user;
    },
    setUserType(state, userType) {
      state.userType = userType;
    },
  },
  actions: {
    //normal user login
    loginUser({ commit }, credentials) {
      //Validate credentials
      const isValidUser = checkUserCredentials(credentials);

      if (isValidUser) {
        commit('setAuthentication', true);
        commit('setUser', { username: credentials.username });
        commit('setUserType', 'user'); 
      } else {
        alert('Invalid username or password');
      }
    },
    //Admin login
    loginAdmin({ commit }, credentials) {
      const adminUsername = 'admin';
      const adminPassword = 'admin123';

      if (
        credentials.adminUsername === adminUsername &&
        credentials.adminPassword === adminPassword
      ) {
        commit('setAuthentication', true);
        commit('setUser', { username: credentials.adminusername });
        commit('setUserType', 'admin'); // Set user type as 'admin'
      } else {
        alert('Invalid username or password for admin.');
      }
    },
    logout({ commit }) {
      commit('setAuthentication', false);
      commit('setUser', null);
      commit('setUserType', null);
    },
  },
});