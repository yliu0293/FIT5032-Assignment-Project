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
                <router-link to="/getsupport" class="nav-link">Get Support</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/" class="nav-link">Stay Healthy</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/" class="nav-link">Join the Community</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/rating" class="nav-link">Rating</router-link>
              </li>
              <!-- diplay admin page navigation when admin logged in -->
              <li class="nav-item" v-if="userRole === 'admin'">
                <router-link to="/admin-view" class="nav-link">Admin View</router-link>
              </li>
              <!-- diplay login logout based on login statues -->
              <li class = "nav-item" v-if="!isAuthenticated">
                <router-link to="/Firelogin" class="btn btn-primary">Login</router-link>
              </li>
              <li class="nav-item" v-else>
                <!-- <router-link to="/logout" class="nav-link" active-class="active">Logout</router-link> -->
                <router-link to="/logout" class="nav-link" active-class="active">Logout</router-link>
              </li>
              <li class="nav-item" v-if="!isAuthenticated">
                <router-link to="/Fireregister" class="btn btn-dark">Register</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { getFirestore, doc, getDoc } from "firebase/firestore"; 

  export default {
    name: 'NavBar',

    data() {
      return {
        isAuthenticated: false,
        userRole: null,
      };
    },

    created() {
      const auth = getAuth();
      const db = getFirestore();

      // Check if user is authenticated
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.isAuthenticated = true;

          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            this.userRole = userDoc.data().role;
          } else {
            console.error('No such document!');
          }
        } else {
          this.isAuthenticated = false;
          this.userRole = null;
        }
      });
    },
  };
  </script>
  
  <style scoped>

  </style>
  