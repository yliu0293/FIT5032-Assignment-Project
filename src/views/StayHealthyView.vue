<template>
  <div class="container mt-5">
    <div class="text-center">
      <h1 class="mb-4">Receive our Stay Healthy Booklet Today!</h1>
      <p class="lead">At SeniorCareDirect, we empower seniors to stay healthy. Enter your email below to receive our "Stay Healthy" booklet with useful tips for elder living.</p>
    </div>
    <form @submit.prevent="sendBooklet">
      <div class="mb-3">
        <label for="email" class="form-label">Recipient Email</label>
        <input type="email" class="form-control" id="email" v-model="recipientEmail" required />
      </div>
      <button type="submit" class="btn btn-primary">Send Booklet</button>
    </form>

    <!-- Modal Popup -->
    <div v-if="isSendingEmail" class="modal">
      <div class="modal-content">
        <p>Sending your email...</p>
      </div>
    </div>

    <!-- Success or Failure Message -->
    <div v-if="notificationMessage" class="alert" :class="notificationType">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      recipientEmail: '',  // The email entered by the user
      isSendingEmail: false,  // Tracks if the email is currently being sent
      notificationMessage: '',     // Message to display after email is sent
      notificationType: '', // Class to apply based on success or failure
    };
  },
  methods: {
    async sendBooklet() {
      this.isSendingEmail = true; // Show "Sending email" modal
      this.notificationMessage = '';   // Clear previous notifications
      this.notificationType = '';

      try {
        // Send POST request to the Firebase function
        const response = await axios.post('https://sendemail-bqwwbbooaq-uc.a.run.app', {
          email: this.recipientEmail,
        });

        // Show success message
        this.notificationMessage = response.data.result;
        this.notificationType = 'alert-success'; // Bootstrap success class
      } catch (error) {
        // Show failure message
        this.notificationMessage = 'Failed to send email';
        this.notificationType = 'alert-danger'; // Bootstrap danger class
        console.error(error);
      } finally {
        this.isSendingEmail = false; // Hide "Sending email" modal
      }
    },
  },
};
</script>

<style scoped>
/* Modal style */
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

/* Alert styles */
.alert-success {
  color: green;
  margin-top: 20px;
}

.alert-danger {
  color: red;
  margin-top: 20px;
}
</style>
