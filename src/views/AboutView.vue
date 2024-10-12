<template>
  <div class="container-fluid bg-lightblue py-5">
    <div class="container mt-5">
      <div class="text-center">
        <h1 class="mb-4">What We Do</h1>
        <p class="lead">At SeniorCareDirect, we strive to empower seniors by providing access to health resources, social connections, and tools that support an independent and fulfilling life. Whether you're looking for trusted health advice or ways to stay engaged in your community, we're here to help you make the most of your golden years.</p>
      </div>

      <div class="row text-center mt-5">
        <div class="col-md-4 d-flex">
          <div class="card shadow-sm p-3 mb-5 bg-white rounded d-flex flex-column card-hover">
            <div class="card-body d-flex flex-column">
              <h2 class="card-title h5">Health and Wellness</h2>
              <p class="card-text flex-grow-1">We provide easy access to reliable health information, wellness tips, and resources to help you maintain your physical and mental well-being. Stay informed and make the best choices for your health.</p>
              <a href="/stayhealthy" class="mt-auto text-decoration-none link-hover">Check out our Stay Healthy Booklet here</a>
            </div>
          </div>
        </div>

        <div class="col-md-4 d-flex">
          <div class="card shadow-sm p-3 mb-5 bg-white rounded d-flex flex-column card-hover">
            <div class="card-body d-flex flex-column">
              <h2 class="card-title h5">Community and Connection</h2>
              <p class="card-text flex-grow-1">Staying socially active is key to a fulfilling life. Discover resources on local events, volunteer opportunities, and ways to engage with others in your community.</p>
              <a href="/event" class="mt-auto text-decoration-none link-hover">Click here for our community event table</a>
            </div>
          </div>
        </div>

        <div class="col-md-4 d-flex">
          <div class="card shadow-sm p-3 mb-5 bg-white rounded d-flex flex-column card-hover">
            <div class="card-body d-flex flex-column">
              <h2 class="card-title h5">Support and Guidance</h2>
              <p class="card-text flex-grow-1">From financial planning to caregiver support, we offer guidance to help you navigate the complexities of aging. Get compassionate and practical support for yourself or a loved one.</p>
              <a href="/getsupport" class="mt-auto text-decoration-none link-hover">Use our map here to search for places</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.bg-lightblue {
  background-color: #e0f7fa;
}

.card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card-title {
  color: #34495e;
}

.card-text {
  font-size: 1rem;
  color: #7f8c8d;
}

.link-hover {
  font-weight: bold;
  color: #3498db;
  transition: color 0.2s ease;
}

.link-hover:hover {
  color: #2980b9;
  text-decoration: underline;
}

.mt-5 {
  margin-top: 3rem;
}
</style>