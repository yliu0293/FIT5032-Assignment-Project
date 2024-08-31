<template>
  <div class="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
    <div class="text-center">
      <h1 class="mb-3">Admin Login</h1>
      <div style="margin-bottom: 50px;"></div>

      <form @submit.prevent="handleAdminLogin" class="w-100" style="max-width: 300px;">
        <div class="form-group mb-3">
          <label for="adminUsername" class="sr-only">Username</label>
          <input
            type="text"
            v-model="username"
            id="adminUsername"
            class="form-control form-control-lg"
            placeholder="Username"
            required
          />
        </div>

        <div class="form-group mb-3">
          <label for="adminPassword" class="sr-only">Password</label>
          <input
            type="password"
            v-model="password"
            id="adminPassword"
            class="form-control form-control-lg"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" class="btn btn-outline-secondary btn-lg btn-block">Sign in</button>
      </form>

      <a href="/Login" class="d-block mt-3 text-muted">Normal user sign in</a>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AdminLoginView',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    ...mapActions(['loginAdmin']), // Ensure 'loginAdmin' action exists in the store
    handleAdminLogin() {
      const admin = { adminUsername: this.username, adminPassword: this.password };
      this.loginAdmin(admin);
      this.$router.push({ name: 'AdminView' }); // Redirect to Admin view after login
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
