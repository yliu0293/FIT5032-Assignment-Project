<template>
    <div class="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
      <div class="text-center">
        <h1 class="mb-3">Welcome back!</h1>
        <a href="#" class="text-decoration-none">Signup</a>
        <p class="text-muted my-2">or sign in to your account</p>
  
        <form @submit.prevent="handleLogin" class="w-100" style="max-width: 300px;">
          <div class="form-group mb-3">
            <label for="email" class="sr-only">Email</label>
            <input
              type="email"
              id="email"
              class="form-control form-control-lg"
              placeholder="Email"
              required
            />
          </div>
  
          <div class="form-group mb-3">
            <label for="password" class="sr-only">Password</label>
            <input
              type="password"
              id="password"
              class="form-control form-control-lg"
              placeholder="Password"
              required
            />
          </div>
  
          <button type="submit" class="btn btn-outline-secondary btn-lg btn-block">Sign in</button>
        </form>
  
        <a href="#" class="d-block mt-3 text-muted">Administrator sign in</a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    methods: {
      handleLogin() {
        // Handle login logic here
        console.log('Login button clicked');
      },
    },
  };
  </script>
  
  <style scoped>
  /* Optional custom styles */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  </style>
  