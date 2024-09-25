<template>
  <div>
    <h1>Logout Page</h1>
    <div v-if="currentUser">
      <p><strong>Email:</strong> {{ currentUser.email }}</p>
      <p><strong>Role:</strong> {{ userRole }}</p>
    </div>
    <div v-else>
      <p>No user is currently logged in.</p>
    </div>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import db from '../firebase/init.js'; // Use the existing Firestore initialization

// Initialize Firebase Authentication
const auth = getAuth();

// Reactive references to store current user and user role
const currentUser = ref(null);
const userRole = ref('');

// Function to fetch user role from Firestore
const fetchUserRole = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      userRole.value = userDocSnap.data().role;
      console.log('User role:', userRole.value);
    } else {
      console.log('No such document for the user!');
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
  }
};

// Logout function
const logout = () => {
  signOut(auth)
    .then(() => {
      console.log('User logged out successfully!');
      currentUser.value = null; // Clear user information after logging out
      userRole.value = ''; // Clear user role
    })
    .catch((error) => {
      console.error('Logout error:', error);
    });
};

// Monitor authentication state changes
onAuthStateChanged(auth, (user) => {
  currentUser.value = user; // Update currentUser when authentication state changes
  if (user) {
    console.log('Current user:', user); // Display current user in developer mode
    fetchUserRole(user.uid); // Fetch the user role when the user is logged in
  } else {
    console.log('No user is currently logged in.');
  }
});
</script>
