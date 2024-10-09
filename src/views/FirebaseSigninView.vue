<template>
  <div class="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
    <div class="text-center">
      <h1 class="mb-3">Welcome back!</h1>
      <a href="/Fireregister" class="text-decoration-none">Signup</a>
      <p class="text-muted my-2">or sign in to your account</p>

      <form @submit.prevent="signin" class="w-100" style="max-width: 300px;">
        <div class="form-group mb-3">
          <label for="email" class="sr-only">Email</label>
          <input
            type="email"
            v-model="email"
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
            v-model="password"
            id="password"
            class="form-control form-control-lg"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" class="btn btn-outline-secondary btn-lg btn-block">Sign in</button>
      </form>

      <!-- <a href="/admin-login" class="d-block mt-3 text-muted">Administrator sign in</a> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const email = ref("");
const password = ref("");
const router = useRouter();
const auth = getAuth();

const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Firebase Login Successful!");
      const user = userCredential.user;

      getDoc(doc(db, "users", user.uid)).then((docSnap) => {
        if (docSnap.exists()) {
          const role = docSnap.data().role;
          console.log("User role: ", role);

          if (role === "admin") {
            router.push("/admin-view");
          } else {
            router.push({ name: 'Home' }); 
          }
        } else {
          console.log("Invalid user");
        }
      }).catch((error) => {
        console.error("Error fetching role: ", error);
      });
    })
    .catch((error) => {
      console.log(error.code);
    });
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
