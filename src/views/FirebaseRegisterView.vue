<template>
  <h1>Create an Account</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="register">Save to Firebase</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const email = ref("")
const password = ref("")
const router = useRouter()
const auth = getAuth()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Firebase Register Successful!")
      const user = userCredential.user
      
      //Firestore to save user roles
      const db = getFirestore()

      setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user" //default role as 'user'
      }).then(() => {
        console.log("Registered as user")
        router.push("/FireLogin")
      }).catch((error) => {
        console.error("Error saving role: ", error)
      })
    })
    .catch((error) => {
      console.log(error.code)
    })
}

</script>

