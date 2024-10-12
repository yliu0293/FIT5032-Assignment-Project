<template>
  <div class="container-fluid bg-lightblue py-5">
    <div class="container mt-5">
      <div class="text-center">
        <h1 class="mb-4">Receive our Stay Healthy Booklet Today!</h1>
        <p class="lead">At SeniorCareDirect, we empower seniors to stay healthy. Enter your email below to receive our "Stay Healthy" booklet with useful tips for elder living.</p>
        <img src="@/assets/stayhealthy.jpg" alt="Stay Healthy Image" class="img-fluid rounded mb-4">
      </div>

      <form @submit.prevent="sendBooklet" class="mx-auto w-75">
        <div class="mb-3">
          <label for="email" class="form-label">Input your email to explore your Golden Age to the full potential</label>
          <input type="email" class="form-control form-control-lg" id="email" v-model="recipientEmail" placeholder="Enter your email here" required />
        </div>
        <button type="submit" class="btn btn-primary btn-lg w-100">Send Booklet</button>
      </form>

      <!-- Sending popup -->
      <div v-if="isSendingEmail" class="modal fade show d-block">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body text-center">
              <p class="mb-0">Sending your email...</p>
              <div class="spinner-border text-primary mt-3" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success or Failure Message -->
      <div v-if="notificationMessage" class="alert mt-4" :class="notificationType">
        {{ notificationMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      recipientEmail: '',
      isSendingEmail: false,
      notificationMessage: '',
      notificationType: '',
    };
  },
  methods: {
    async sendBooklet() {
      this.isSendingEmail = true;
      this.notificationMessage = '';
      this.notificationType = '';

      try {
        const response = await axios.post('https://sendemail-bqwwbbooaq-uc.a.run.app', {
          email: this.recipientEmail,
        });

        this.notificationMessage = response.data.result;
        this.notificationType = 'alert alert-success';
      } catch (error) {
        this.notificationMessage = 'Failed to send email';
        this.notificationType = 'alert alert-danger';
        console.error(error);
      } finally {
        this.isSendingEmail = false;
      }
    },
  },
};
</script>

<style scoped>
.bg-lightblue {
  background-color: #e0f7fa;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border-radius: 10px;
  padding: 20px;
  background-color: white;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.alert-success {
  color: #28a745;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #dc3545;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

form {
  margin-top: 40px;
}

.form-control {
  font-size: 1.2rem;
}

.form-label {
  font-size: 1.1rem;
  color: #333;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
