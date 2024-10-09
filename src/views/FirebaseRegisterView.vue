<template>
  <div class="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
    <div class="text-center">
      <h1 class="mb-3">Welcome!</h1>
      <p class="text-muted my-2">Please register below</p>
      <a href="/FireLogin" class="text-decoration-none">Or sign in</a>
      <div style="margin-bottom: 10px;"></div>

      <form @submit.prevent="register" class="w-100" style="max-width: 300px;">
        <div class="form-group mb-3">
          <label for="email" class="sr-only">Email</label>
          <input
            type="email"
            v-model="formData.email"
            id="email"
            class="form-control form-control-lg"
            placeholder="Email"
            @blur="() => validateEmail(true)"
            @input="() => validateEmail(false)"
            required
          />
          <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
        </div>

        <div class="form-group mb-3">
          <label for="password" class="sr-only">Password</label>
          <input
            type="password"
            v-model="formData.password"
            id="password"
            class="form-control form-control-lg"
            placeholder="Password"
            @blur="() => validatePassword(true)"
            @input="() => validatePassword(false)"
            required
          />
          <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
        </div>

        <p class="text-muted my-2">Password must be at least 8 characters long, with one number, one uppercase letter, and one special character.</p>

        <div class="form-group mb-3">
          <label for="confirmpassword" class="sr-only">Confirm Password</label>
          <input
            type="password"
            v-model="formData.confirmPassword"
            id="confirmpassword"
            class="form-control form-control-lg"
            placeholder="Confirm Password"
            @blur="() => validateConfirmPassword(true)"
            @input="() => validateConfirmPassword(false)"
            required
          />
          <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
        </div>

        <button type="submit" class="btn btn-outline-secondary btn-lg btn-block">Register</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

// Initialize references
const formData = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  email: null,
  password: null,
  confirmPassword: null
})

const auth = getAuth()
const db = getFirestore()
const router = useRouter()

// Validation Methods
const validateEmail = (blur) => {
  const email = formData.value.email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    if (blur) errors.value.email = 'Please enter a valid email address'
  } else {
    errors.value.email = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

// Registration Method
const register = () => {
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)

  if (!errors.value.email && !errors.value.password && !errors.value.confirmPassword) {
    createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password)
      .then((userCredential) => {
        console.log("Firebase Register Successful!")
        const user = userCredential.user

        // Save user in Firestore with role "user"
        setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user" // Assign default role
        }).then(() => {
          console.log("User registered with role: user")
          router.push("/FireLogin") // Redirect to login
        }).catch((error) => {
          console.error("Error saving role: ", error)
        })
      })
      .catch((error) => {
        console.log("Firebase registration error: ", error.code)
      })
  } else {
    alert('Please fix the validation errors before proceeding.')
  }
}
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
