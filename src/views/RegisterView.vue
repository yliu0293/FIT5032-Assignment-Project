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
            v-model="formData.username"
            id="username"
            class="form-control form-control-lg"
            placeholder="Username"
            @blur="() => validateName(true)"
            @input="() => validateName(false)"
          />
          <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
        </div>

        <div class="form-group mb-3">
          <label for="formData.password" class="sr-only">Password</label>
          <input
            type="password"
            v-model="password"
            id="password"
            class="form-control form-control-lg"
            placeholder="Password"
            @blur="() => validatePassword(true)"
            @input="() => validatePassword(false)"
          />
          <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
        </div>

        <p class="text-muted my-2">Password must be at least 8 character with minimum one number, one uppercase letter, one lowercase letter and one special character. </p>

        <div class="form-group mb-3">
          <label for="confirmpassword" class="sr-only">Confirm Password</label>
          <input
            type="confirmpassword"
            id="confirmpassword"
            v-model="formData.confirmPassword"
            class="form-control form-control-lg"
            placeholder="Confirm Password"
            @blur="() => validateConfirmPassword(true)"
          />
          <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
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
      formData: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      errors: {
        username: null,
        password: null,
        confirmPassword: null,
      },
    };
  },
  
  methods: {
    ...mapActions(['registerUser']), // Ensure 'registerUser' action exists in the store

    validateName(blur) {
      if (this.formData.username.length < 3) {
        if (blur) this.errors.username = 'Name must be at least 3 characters'
      } else {
        this.errors.username = null
      }
    },

    validateConfirmPassword(blur) {
      if (this.formData.password !== this.formData.confirmPassword) {
        if (blur) this.errors.confirmPassword = 'Passwords do not match.'
      } else {
        this.errors.confirmPassword = null
      }
    },

    validatePassword(blur) {
      const password = this.formData.password
      const minLength = 8
      const hasUppercase = /[A-Z]/.test(password)
      const hasLowercase = /[a-z]/.test(password)
      const hasNumber = /\d/.test(password)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

      if (password.length < minLength) {
        if (blur) this.errors.password = `Password must be at least ${minLength} characters long.`
      } else if (!hasUppercase) {
        if (blur) this.errors.password = 'Password must contain at least one uppercase letter.'
      } else if (!hasLowercase) {
        if (blur) this.errors.password = 'Password must contain at least one lowercase letter.'
      } else if (!hasNumber) {
        if (blur) this.errors.password = 'Password must contain at least one number.'
      } else if (!hasSpecialChar) {
        if (blur) this.errors.password = 'Password must contain at least one special character.'
      } else {
        this.errors.password = null
      }
    },

    handleRegister() {
      this.validateName(true)
      this.validatePassword(true)
      this.validateConfirmPassword(true)
      if (!errors.username && !this.errors.password && !this.errors.confirmPassword) {
        this.registerUser({ username: this.formData.username, password: this.formData.password });
        this.$router.push({ name: 'Login' }); // Redirect to login page after successful registration
      }
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