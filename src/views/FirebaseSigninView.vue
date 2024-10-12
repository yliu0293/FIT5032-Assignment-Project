<template>
  <div class="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
    <div class="text-center">
      <h1 class="mb-3">Welcome back!</h1>
      <a href="/Fireregister" class="text-decoration-none">Signup</a>
      <p class="text-muted my-2">or sign in to your account</p>

      <form @submit.prevent="signinWithEmail" class="w-100" style="max-width: 300px;">
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

      <button @click="signinWithGoogle" class="btn btn-outline-primary btn-lg mt-3">
        Sign in with Google
      </button>

      <!-- <a href="/admin-login" class="d-block mt-3 text-muted">Administrator sign in</a> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const email = ref("");
const password = ref("");
const router = useRouter();
const auth = getAuth();
const db = getFirestore();

const signinWithEmail = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Firebase Email Login Successful!");
      const user = userCredential.user;

      getDoc(doc(db, "users", user.uid))
        .then((docSnap) => {
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
        })
        .catch((error) => {
          console.error("Error fetching role: ", error);
        });
    })
    .catch((error) => {
      console.error("Firebase Email login error: ", error); // Log the full error object
    });
};

// Google auth
const signinWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Google Login Successful!");
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      getDoc(userRef)
        .then((docSnap) => {
          if (!docSnap.exists()) {
            // If user doesn't exist, set default role as 'user'
            setDoc(userRef, {
              email: user.email,
              role: 'user'
            }).then(() => {
              console.log("New user document created with role: user");
            }).catch((error) => {
              console.error("Error creating user document: ", error);
            });
          } else {
            console.log("User already exists in Firestore");
          }

          const role = docSnap.exists() ? docSnap.data().role : 'user';
          console.log("User role: ", role);

          if (role === 'admin') {
            router.push("/admin-view");
          } else {
            router.push({ name: 'Home' });
          }
        })
        .catch((error) => {
          console.error("Error fetching user: ", error);
        });
    })
    .catch((error) => {
      console.error("Google login error: ", error);
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
