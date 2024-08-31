<template>
    <div>
      <!-- Navbar based on bootstrap https://getbootstrap.com/docs/4.0/components/navbar/-->
      <nav class="navbar navbar-expand-lg navbar-light bg-white  shadow-sm">
        <div class="container">
          <router-link to="/" class="navbar-brand">
            <img src="@/assets/logo.png" alt="SeniorCare Direct" style="max-height: 60px;" />
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
          <!-- NavBar content -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item-Home">
                <router-link to="/" class="nav-link">Home</router-link>
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
              <!-- diplay admin page navigation when admin logged in -->
              <li class="nav-item" v-if="userType === 'admin'">
                <router-link to="/admin-view" class="nav-link">Admin View</router-link>
              </li>
              <!-- diplay login logout based on login statues -->
              <li class = "nav-item" v-if="!isAuthenticated">
                <a class="btn btn-primary" href="/Login" >Login</a>
              </li>
              <li v-else>
                <!-- <router-link to="/logout" class="nav-link" active-class="active">Logout</router-link> -->
                <a href="#" class="btn btn-dark" @click.prevent="handleLogout">Logout</a>
              </li>
              <li class="nav-item" v-if="!isAuthenticated">
                <a class="btn btn-dark" href="/Register">Register</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'NavBar',

    computed: {
      ...mapState(['isAuthenticated', 'userType']),
    },

    methods: {
      ...mapActions(['logout']),
      handleLogout() {
        this.logout(); 
        this.$router.push({ name: 'Login' }); // Redirect to Home after logout
      },
   }
  };
  </script>
  
  <style scoped>

  </style>
  