<template>
  <div class="container-fluid bg-light py-5 d-flex align-items-center justify-content-center">
    <div class="text-center">
      <h1 class="mb-3">Confirm logout</h1>

      <div v-if="currentUser" class="user-details my-4">
        <p><strong>Email:</strong> {{ currentUser.email }}</p>
        <p><strong>Role:</strong> {{ userRole }}</p>
      </div>

      <div v-else class="text-muted">
        <p>No user is currently logged in.</p>
      </div>

      <div v-if="onLine" class="alert alert-success">
        You are currently online.
      </div>

      <div v-else class="alert alert-danger">
        You are currently offline.
      </div>

      <div v-if="showBackOnline" class="alert alert-info">
        You are back online!
      </div>

      <button @click="logout" class="btn btn-outline-danger btn-lg mt-3">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, onBeforeMount } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const auth = getAuth();
const db = getFirestore();
const router = useRouter();
const currentUser = ref(null);
const userRole = ref('');

const onLine = ref(navigator.onLine);
const showBackOnline = ref(false);

const fetchUserRole = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      userRole.value = userDocSnap.data().role;
    } else {
      console.log('No document for the user.');
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
  }
};

const logout = () => {
  signOut(auth)
    .then(() => {
      console.log('User logged out successfully!');
      currentUser.value = null;
      userRole.value = '';
      router.push({ name: 'Home' });
    })
    .catch((error) => {
      console.error('Logout error:', error);
    });
};

onAuthStateChanged(auth, (user) => {
  currentUser.value = user;
  if (user) {
    fetchUserRole(user.uid);
  }
});

const updateOnlineStatus = (e) => {
  const { type } = e;
  onLine.value = type === 'online';
};

watch(onLine, (newStatus) => {
  if (newStatus) {
    showBackOnline.value = true;
    setTimeout(() => {
      showBackOnline.value = false;
    }, 3000);
  }
});

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onBeforeMount(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});

</script>

<style scoped>
.container-fluid {
  background-color: #f8f9fa; 
}

.user-details {
  font-size: 1.6rem;
}

.text-muted {
  font-size: 1rem;
}

.btn-outline-danger {
  padding: 10px 30px;
}
</style>
