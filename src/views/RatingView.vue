<template>
  <div class="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">  
    <div class="RatingView">
      <h1>Please leave a rating!</h1>
      <div class="card border-light mb-3">
        <div class="StarRating">
          <svg 
            v-for = "star in 5"
            :key = "star"
            xmlns="http://www.w3.org/2000/svg" 
            width="50" height="50" fill="currentColor" 
            class="bi bi-star-fill" 
            :class="{ 
              'text-warning': star <= hoverStar || star <= rating, 
              'text-secondary': star > hoverStar && star > rating 
            }"
            viewBox="0 0 16 16"
            @mouseover="hoverRating(star)"
            @mouseleave="hoverRating(0)"
            @click="submitRating(star)"
            style="cursor: pointer;">

            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
        </div>
        <div class="mt-3">
          <div class="AverageRating">
            <h4>Average Rating: {{ averageRating.toFixed(1) }} /5 </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RatingView',
  data() {
    return {
      rating: 0,
      hoverStar: 0,
      allRatings: [],
    };
  },
 
  computed: { //https://stackoverflow.com/questions/54511657/take-the-average-of-an-array-items
    averageRating() { //Calculate the average rating
      if (this.allRatings.length === 0) return 0;
      const sum = this.allRatings.reduce((acc, rating) => acc + rating, 0);
      return sum / this.allRatings.length;
    },
  },

  methods: {
    hoverRating(star) {
      this.hoverStar = star;
    },
    submitRating(star) {
      this.rating = star;

      let ratings = JSON.parse(localStorage.getItem('ratings')) || [];

      ratings.push(this.rating);

      localStorage.setItem('ratings', JSON.stringify(ratings));

      this.allRatings = ratings;

      alert('Rating submitted!');
    },
  },
  created() { //https://www.geeksforgeeks.org/how-to-make-localstorage-reactive-in-vue-js/
    const storedRatings = JSON.parse(localStorage.getItem('ratings')) || [];
    this.allRatings = storedRatings; // Initialize the ratings array from localStorage
  },
};

</script>

<style scoped>
.RatingView {
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