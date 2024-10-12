<template>
  <div>
    <!-- header -->
    <div class="container-fluid bg-lightblue py-5">
      <div class="container text-center">
        <h1 class="display-4 fw-bold">Empowering Your Golden Years</h1>
        <p class="lead mt-3">Health Resources and Community Support for a Fulfilling and independent Life</p>
        <a href="/About" class="btn btn-primary btn-lg mt-4">Learn More</a>
      </div>
    </div>

    <div class="container-fluid bg-white py-5">
      <div class="container d-flex align-items-center">
        <div class="col-md-6">
          <img src="@/assets/Homepage.jpg" alt="HomePage Image" class="img-fluid rounded">
        </div>
        <div class="col-md-6">
          <h2 class="fw-bold">We Are Here to Help!</h2>
          <p class="mt-3">Our platform is designed to provide seniors with the necessary tools and resources to lead a healthy, independent, and fulfilling life. Explore our services and get the support you need to enjoy your golden years.</p>
          <a href="/firelogin" class="text-decoration-none fw-bold text-primary">Login to explore your golden age</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style scoped>
.bg-lightblue {
  background-color: #e0f7fa;
}

.container-fluid.bg-white {
  padding-top: 50px;
  padding-bottom: 50px;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

.container.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

@media (max-width: 768px) {
  .container.d-flex {
    flex-direction: column;
    text-align: center;
  }

  .col-md-6 {
    margin-bottom: 20px;
  }
}
</style>
