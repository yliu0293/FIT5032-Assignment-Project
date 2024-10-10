<template>
  <div class="container-fluid bg-light d-flex flex-column justify-content-center align-items-center" style="margin-top: 50px;">
    <div class="RatingView">
      <h1>Please leave a rating!</h1>
      <div class="card border-light mb-3" v-for="(type, index) in ratingTypes" :key="index" style="margin-top: 30px;">
        <div class="StarRating">
          <h4>{{ type }}</h4>
          <div>
            <svg 
              v-for="star in 5"
              :key="star"
              xmlns="http://www.w3.org/2000/svg" 
              width="50" height="50" fill="currentColor" 
              class="bi bi-star-fill" 
              :class="{ 
                'text-warning': star <= hoverStars[index] || star <= ratings[index], 
                'text-secondary': star > hoverStars[index] && star > ratings[index] 
              }"
              viewBox="0 0 16 16"
              @mouseover="hoverRating(star, index)"
              @mouseleave="hoverRating(0, index)"
              @click="setRating(star, index)"
              style="cursor: pointer;">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
          </div>
          <p class="mt-2">
            Your rating: {{ ratings[index] }} |
            Average rating: {{ typeof averageRatings[ratingTypeToKey[type]] === 'number' ? averageRatings[ratingTypeToKey[type]].toFixed(2) : 'N/A' }}
          </p>
        </div>
      </div>

      <div class="form-group mt-3">
        <textarea 
          v-model="comment"
          class="form-control" 
          placeholder="Please say something about your experience (required)" 
          rows="3"
          required>
        </textarea>
      </div>

      <button @click="submitAll" class="btn btn-outline-primary mt-3">Submit All</button>

      <div class="mt-5">
        <h1 class="mb-4">All Ratings</h1>

        <!-- filter by email -->
        <input
          v-model="searchEmail"
          @input="filterByEmail"
          class="form-control mb-3"
          placeholder="Search by User Email"
        />

        <DataTable :value="filteredRatings" paginator :rows="10">
          <Column field="userEmail" header="User" sortable filter filterPlaceholder="Search by User"></Column>
          <Column field="averageRating" header="Average Rating" sortable></Column>
          <Column field="overall" header="Website" sortable></Column>
          <Column field="navigation" header="Navigation" sortable></Column>
          <Column field="eventFinder" header="Event Finder" sortable></Column>
          <Column field="map" header="Map" sortable></Column>
          <Column field="comment" header="Comment" sortable></Column>
          <Column field="timestamp" header="Submitted At" sortable :formatter="formatTimestamp"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const db = getFirestore();
const auth = getAuth();

// Rating state
const ratingTypes = ['Please rate your overall experience with this website', 'The ease of use of navigation', 'The ease of use of event finder', 'The ease of use of map function'];
const ratings = ref([0, 0, 0, 0]);
const hoverStars = ref([0, 0, 0, 0]);
const comment = ref('');
const searchEmail = ref('');
const filteredRatings = ref([]);

const ratingTypeToKey = {
  'Please rate your overall experience with this website': 'overall',
  'The ease of use of navigation': 'navigation',
  'The ease of use of event finder': 'eventFinder',
  'The ease of use of map function': 'map'
};

// Displaying all ratings
const allRatings = ref([]);
const averageRatings = ref({
  overall: 0,
  navigation: 0,
  eventFinder: 0,
  map: 0,
});

let userEmail = ref(null);

const hoverRating = (star, index) => {
  hoverStars.value[index] = star;
};

const setRating = (star, index) => {
  ratings.value[index] = star;
};

// submission control
const submitAll = async () => {
  if (ratings.value.includes(0) || !comment.value) {
    alert('Please provide a rating for all categories and leave a comment.');
    return;
  }

  const averageRating = ratings.value.reduce((acc, rating) => acc + rating, 0) / ratings.value.length;

  try {
    await addDoc(collection(db, 'ratings'), {
      userEmail: userEmail.value,
      overall: ratings.value[0],
      navigation: ratings.value[1],
      eventFinder: ratings.value[2],
      map: ratings.value[3],
      averageRating: averageRating.toFixed(2),
      comment: comment.value,
      timestamp: new Date(),
    });
    alert('All ratings and comment submitted!');
    comment.value = '';
    ratings.value = [0, 0, 0, 0];
    fetchRatings();
  } catch (error) {
    console.error("Error submitting ratings: ", error);
  }
};

// Fetch average ratings function
const fetchAverageRatings = async () => {
  try {
    const response = await axios.get('https://calculateaverageratings-bqwwbbooaq-uc.a.run.app');
    console.log('Average Ratings Response:', response.data); // Log the response

    // Convert the string values to numbers
    const averages = {
      overall: parseFloat(response.data.overall),
      navigation: parseFloat(response.data.navigation),
      eventFinder: parseFloat(response.data.eventFinder),
      map: parseFloat(response.data.map)
    };

    averageRatings.value = averages; // Store the converted averages
  } catch (error) {
    console.error("Error fetching average ratings:", error.message);
  }
};

// Fetch all ratings from Firestore
const fetchRatings = async () => {
  const querySnapshot = await getDocs(collection(db, 'ratings'));
  allRatings.value = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.timestamp = data.timestamp.toDate(); // Convert Firestore Timestamp to Date
    allRatings.value.push(data);
  });

  filteredRatings.value = allRatings.value;
  fetchAverageRatings();
};

const formatTimestamp = (value) => {
  if (value instanceof Date) {
    return value.toLocaleString('en-US', { timeZoneName: 'long' });
  }
  return value;
};

// Filter by user email
const filterByEmail = () => {
  filteredRatings.value = allRatings.value.filter((rating) =>
    rating.userEmail.toLowerCase().includes(searchEmail.value.toLowerCase())
  );
};

// Get the email of current logged-in user
onAuthStateChanged(auth, (user) => {
  if (user) {
    userEmail.value = user.email;
  }
});

onMounted(fetchRatings);
</script>

<style scoped>
.RatingView {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
}

.container-fluid {
  max-width: 80vw;
  margin: 0 auto;
  margin-top: 50px; /* Moves the content down */
}

.vh-100 {
  height: 100vh;
}
</style>
