<template>
  <div class="access-denied">
    <h1>Access Denied</h1>
    <p>You do not have permission to view this page.</p>
    <router-link to="/Login">Login first here</router-link>
  </div>
</template>

<script>
export default {
  name: 'AccessDenied',
};
</script>

<style scoped>
  .access-denied {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 80vw;
    margin: 0 auto;
    text-align: center;
    margin-top: 50px;
    padding: 20px;
    /* background-color: #e0bfbf; */
    border-radius: 10px;
  }
  </style>