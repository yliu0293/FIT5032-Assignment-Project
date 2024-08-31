<template>
  <div class="AdminView">
    <h1>Admin Page</h1>
    <p>This page is for admin only</p>
    <p>You have logged in as admin</p>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
};
</script>

<style scoped>
  .AdminView {
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