<template>
  <div class="container-fluid bg-lightblue py-5 d-flex flex-column justify-content-center align-items-center" style="margin-top: 30px;">
    <div class="AdminView">
      <h1>Admin Page</h1>
      <p>This page is for admin only</p>
      <p>You have logged in as admin</p>

      <div class="d-flex justify-content-between mb-3">
        <div v-for="(field, index) in filterFields" :key="index" class="p-2">
          <input
            v-model="filters[field]"
            @input="filterUsers"
            class="form-control"
            :placeholder="'Search by ' + field"
          />
        </div>
      </div>

      <DataTable :value="filteredUsers" paginator :rows="10" striped-rows  class="mt-4" selectionMode="multiple" v-model:selection="selectedUsers">
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="email" header="User Email"></Column>
        <Column field="role" header="User Role"></Column>
      </DataTable>
    </div>

    <button class="btn btn-primary mb-3" @click="sendBulkEmails" :disabled="selectedUsers.length === 0">
      Send Bulk Email
    </button>

    <div v-if="isSendingEmail" class="modal">
      <div class="modal-content">
        <p>Sending your email...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const db = getFirestore();

const users = ref([]);
const filteredUsers = ref([]);
const selectedUsers = ref([]);
const filters = ref({
  email: '',
  role: ''
});
const isSendingEmail = ref(false); // State to track email sending

const filterFields = ['email', 'role'];

const fetchUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.value.push(data);
    });
    filteredUsers.value = users.value;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const filterUsers = () => {
  filteredUsers.value = users.value.filter(user => {
    return Object.keys(filters.value).every((key) => {
      return user[key]?.toString().toLowerCase().includes(filters.value[key].toLowerCase());
    });
  });
};

const sendBulkEmails = async () => {
  const emails = selectedUsers.value.map(user => user.email);
  isSendingEmail.value = true; // Show the modal popup

  try {
    await axios.post('https://sendbulkemails-bqwwbbooaq-uc.a.run.app', { emails });
    alert(`Bulk email sent to ${emails.length} users`);
  } catch (error) {
    console.error('Error sending bulk emails:', error);
    alert('Failed to send bulk emails');
  } finally {
    isSendingEmail.value = false; // Hide the modal popup
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.AdminView {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
}

.bg-lightblue {
  background-color: #e0f7fa;
}

.container-fluid {
  max-width: 80vw;
  margin: 0 auto;
  margin-top: 50px;
}

.modal {
  display: block; 
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
