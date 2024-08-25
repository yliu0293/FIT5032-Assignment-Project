<template>
    <div>
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
          <router-link to="/Home" class="navbar-brand">
            <img src="@/assets/logo.png" alt="SeniorCare Direct" style="max-height: 50px;" />
          </router-link>
          <!--add a button for collapse navi bar-->
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <!-- Collapsible content -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <router-link to="/Home" class="nav-link">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/About" class="nav-link">What We Do</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/" class="nav-link">Get Support</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/" class="nav-link">Stay Healthy</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/" class="nav-link">Join the Community</router-link>
              </li>
              <li class="nav-item">
                <a class="btn btn-outline-dark me-2" href="/Login">Sign in</a>
              </li>
              <li class="nav-item">
                <a class="btn btn-dark" href="#">Register</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  
      <!-- Route View -->
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Layout',
  };
  </script>
  
  <style scoped>
  /* Additional styling if needed */
  </style>
  