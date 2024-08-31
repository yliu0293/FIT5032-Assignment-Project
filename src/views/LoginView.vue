<!-- 
 https://getbootstrap.com/docs/5.0/components/dropdowns/#accessibility
 https://getbootstrap.com/docs/5.0/forms/form-control/ 
 -->

<template>
    <div class="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
      <div class="text-center">
        <h1 class="mb-3">Welcome back!</h1>
        <a href="/Register" class="text-decoration-none">Signup</a>
        <p class="text-muted my-2">or sign in to your account</p>
  
        <form @submit.prevent="handleUserLogin" class="w-100" style="max-width: 300px;">
          <div class="form-group mb-3">
            <label for="username" class="sr-only">Username</label>
            <input
              type="text"
              v-model="username"
              id="username"
              class="form-control form-control-lg"
              placeholder="Username"
              required
            />
          </div>
  
          <div class="form-group mb-3">
            <label for="password" class="sr-only">Password</label>
            <input
              type="password"
              v-model="password"
              id="password"
              class="form-control form-control-lg"
              placeholder="Password"
              required
            />
          </div>
  
          <button type="submit" class="btn btn-outline-secondary btn-lg btn-block">Sign in</button>
        </form>
  
        <a href="/admin-login" class="d-block mt-3 text-muted">Administrator sign in</a>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';

  export default {
    name: 'LoginView',
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      ...mapActions(['loginUser']), // Ensure 'loginUser' action exists in the store
      handleUserLogin() {
        const user = { username: this.username, password: this.password };
        this.loginUser(user);
        this.$router.push({ name: 'Home' }); // Redirect to Home after login
      },
    },
    };
  </script>
  
  <style scoped>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
  }
  </style>
  