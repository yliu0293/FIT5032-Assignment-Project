<template>
  <h1>Sign in</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="signin">Sign in via Firebase</button></p>
</template>

<script setup>
import { ref } from 'vue'
import db from '../firebase/init.js'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const email = ref("")
const password = ref("")
const router = useRouter()
const auth = getAuth()

const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Firebase Login Successful!")
      const user = userCredential.user
      console.log("User UID: ", user.uid);

      // Fetch user role from Firestore
      const db = getFirestore()

      getDoc(doc(db, "users", user.uid)).then((docSnap) => {
        if (docSnap.exists()) {
          const role = docSnap.data().role
          console.log("User role: ", role)
          //redirect based on role
          if (role === "admin") {
            router.push("/")
          } else {
            router.push("/")
          }
          console.log(auth.currentUser)
        } else {
          console.log("invalid user")
        }
      }).catch((error) => {
        console.error("Error fetching role: ", error)
      })

    })
    .catch((error) => {
      console.log(error.code)
    })
}

</script>
