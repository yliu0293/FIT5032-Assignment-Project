<template>
  <div class="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
    <div class="text-center">
      <h1 class="mb-3">Welcome!</h1>
      <p class="text-muted my-2">Please register below</p>
      <a href="/login" class="text-decoration-none">Or sign in</a>
      <div style="margin-bottom: 10px;"></div>

      <form @submit.prevent="handleRegister" class="w-100" style="max-width: 300px;">
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

        <p class="text-muted my-2">Password must be at least 8 character with minimum one number, one upper letter and one special character. </p>

        <div class="form-group mb-3">
          <label for="confirmpassword" class="sr-only">Confirm Password</label>
          <input
            type="confirmpassword"
            id="confirmpassword"
            class="form-control form-control-lg"
            placeholder="Confirm Password"
            required
          />
        </div>

        <button type="submit" class="btn btn-outline-secondary btn-lg btn-block">Register</button>
      </form>

    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    ...mapActions(['registerUser']), // Ensure 'registerUser' action exists in the store
    handleRegister() {
      this.registerUser({ username: this.username, password: this.password });
      this.$router.push({ name: 'Login' }); // Redirect to login page after successful registration
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