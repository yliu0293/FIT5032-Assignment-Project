// store.js
import { createStore } from 'vuex';
//crypto-js https://www.npmjs.com/package/crypto-js
import CryptoJS from 'crypto-js';

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
    addUser(state, user) {
      state.user.push(user);
    },
  },
  actions: {
    //normal user login https://stackoverflow.com/questions/49786525/extract-username-from-localstorage-typescript-javascript
    loginUser({ commit }, credentials) {
      let users = [];
      try { // Try to obtain users data from localStorage
        users = JSON.parse(localStorage.getItem('users')) || [];
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
        users = []; 
      }

      const hashedPassword = CryptoJS.SHA256(credentials.password).toString(); // Hash the password

      const validUser = users.find(
        user => user.username === credentials.username && user.password === hashedPassword
      );

      if (validUser) {
        commit('setAuthentication', true);
        commit('setUser', { username: credentials.username });
        commit('setUserType', 'user'); 
        return true;
      } else {
        alert('Invalid username or password');
        return false;
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
        commit('setUser', { username: credentials.adminUsername });
        commit('setUserType', 'admin'); // Set user type as 'admin'
      } else {
        alert('Invalid username or password for admin.');
      }
    },
    // register https://www.geeksforgeeks.org/how-to-make-localstorage-reactive-in-vue-js/
    // https://v2.vuejs.org/v2/cookbook/client-side-storage
    registerUser({ commit }, {username, password}) {
      let users = [];

      try {
        // Try to parse users from localStorage
        users = JSON.parse(localStorage.getItem('users')) || [];
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
        users = [];
      }

      const existingUser = users.find(user => user.username === username);
      if (existingUser) {
        alert('Username already exist');
        return;
      }

      const hashedPassword = CryptoJS.SHA256(password).toString();

      const newUser = ({ username, password: hashedPassword }); // Add new user
      users.push(newUser); 

      localStorage.setItem('users', JSON.stringify(users)); //save users to localStorage

      commit('addUser', newUser)

      alert('registration successful, please login');
    },

    logout({ commit }) {
      commit('setAuthentication', false);
      commit('setUser', null);
      commit('setUserType', null);
    },
  },
});