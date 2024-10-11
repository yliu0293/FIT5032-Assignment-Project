<template>
  <div class="container-fluid bg-light d-flex flex-column justify-content-center align-items-center" style="margin-top: 30px;">
    <div class="RatingView">
      <h1>Please tell us about your experience!</h1>

      <!-- Rating Cards -->
      <div class="card border-light mb-3" v-for="(label, idx) in ratingCategories" :key="idx" style="margin-top: 30px;">
        <div class="StarRating">
          <h4>{{ label }}</h4>
          <div>
            <svg 
              v-for="starNum in 5"
              :key="starNum"
              xmlns="http://www.w3.org/2000/svg" 
              width="50" height="50" fill="currentColor" 
              class="bi bi-star-fill" 
              :class="{ 
                'text-warning': starNum <= starHover[idx] || starNum <= rateChoices[idx], 
                'text-secondary': starNum > starHover[idx] && starNum > rateChoices[idx] 
              }"
              viewBox="0 0 16 16"
              @mouseover="hoverStars(starNum, idx)"
              @mouseleave="hoverStars(0, idx)"
              @click="setRate(starNum, idx)"
              style="cursor: pointer;">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
          </div>
          <p class="mt-2">
            Your rating: {{ rateChoices[idx] }} |
            Avg rating: {{ typeof ratingAverages[categoryKeyMap[label]] === 'number' ? ratingAverages[categoryKeyMap[label]].toFixed(2) : 'N/A' }}
          </p>
        </div>
      </div>

      <!-- Comment Box -->
      <div class="form-group mt-3">
        <textarea 
          v-model="userComment"
          class="form-control" 
          placeholder="Say something about your experience (required)" 
          rows="3"
          required>
        </textarea>
      </div>

      <!-- Submit Button -->
      <button @click="submitEverything" class="btn btn-outline-primary mt-3">Submit All</button>

      <!-- Filters and Results Section -->
      <div class="mt-5">
        <h1 class="mb-4">Check out All Ratings</h1>

        <!-- Email Filter -->
        <input
          v-model="emailSearch"
          @input="searchByEmail"
          class="form-control mb-3"
          placeholder="Search by User Email"
        />

        <!-- Dropdown Filters -->
        <div class="d-flex justify-content-around">
          <div>
            <label for="website-filter">Website</label>
            <select v-model="selectedFilters.website" id="website-filter" @change="filterRatings" class="form-select">
              <option value="">Any</option>
              <option v-for="num in 5" :key="num" :value="num">{{ num }}</option>
            </select>
          </div>

          <div>
            <label for="navigation-filter">Navigation</label>
            <select v-model="selectedFilters.navigation" id="navigation-filter" @change="filterRatings" class="form-select">
              <option value="">Any</option>
              <option v-for="num in 5" :key="num" :value="num">{{ num }}</option>
            </select>
          </div>

          <div>
            <label for="event-filter">Event Finder</label>
            <select v-model="selectedFilters.eventFinder" id="event-filter" @change="filterRatings" class="form-select">
              <option value="">Any</option>
              <option v-for="num in 5" :key="num" :value="num">{{ num }}</option>
            </select>
          </div>

          <div>
            <label for="map-filter">Map</label>
            <select v-model="selectedFilters.map" id="map-filter" @change="filterRatings" class="form-select">
              <option value="">Any</option>
              <option v-for="num in 5" :key="num" :value="num">{{ num }}</option>
            </select>
          </div>
        </div>

        <!-- Data Table -->
        <DataTable :value="visibleRatings" paginator :rows="10" class="mt-4">
          <Column field="userEmail" header="User" sortable filter filterPlaceholder="Search by User"></Column>
          <Column field="averageRating" header="Avg Rating" sortable></Column>
          <Column field="overall" header="Website" sortable></Column>
          <Column field="navigation" header="Navigation" sortable></Column>
          <Column field="eventFinder" header="Event Finder" sortable></Column>
          <Column field="map" header="Map" sortable></Column>
          <Column field="comment" header="Comment" sortable></Column>
          <Column field="timestamp" header="Submitted At" sortable :formatter="formatDate"></Column>
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

// Firestore & Auth Setup
const db = getFirestore();
const auth = getAuth();

// Rating state
const ratingCategories = ['Please rate your experience with our website', 'Please Rate the website navigation experience', 'Rate your experience using the event finder', 'Rate the map feature'];
const rateChoices = ref([0, 0, 0, 0]);
const starHover = ref([0, 0, 0, 0]);
const userComment = ref('');
const emailSearch = ref('');
const visibleRatings = ref([]);
const selectedFilters = ref({
  website: '',
  navigation: '',
  eventFinder: '',
  map: ''
});

// Mapping category labels to Firestore keys
const categoryKeyMap = {
  'Please rate your experience with our website': 'overall',
  'Please Rate the website navigation experience': 'navigation',
  'Rate your experience using the event finder': 'eventFinder',
  'Rate the map feature': 'map'
};

// Rating data for averages
const allRatings = ref([]);
const ratingAverages = ref({
  overall: 0,
  navigation: 0,
  eventFinder: 0,
  map: 0,
});

// Current user email
let currentUserEmail = ref(null);

// Handle star hover effect
const hoverStars = (num, idx) => {
  starHover.value[idx] = num;
};

// Set rating for each category
const setRate = (num, idx) => {
  rateChoices.value[idx] = num;
};

// Handle submission of ratings
const submitEverything = async () => {
  if (rateChoices.value.includes(0) || !userComment.value) {
    alert('Fill out all ratings and the comment.');
    return;
  }

  const avgRating = rateChoices.value.reduce((sum, num) => sum + num, 0) / rateChoices.value.length;

  try {
    await addDoc(collection(db, 'ratings'), {
      userEmail: currentUserEmail.value,
      overall: rateChoices.value[0],
      navigation: rateChoices.value[1],
      eventFinder: rateChoices.value[2],
      map: rateChoices.value[3],
      averageRating: avgRating.toFixed(2),
      comment: userComment.value,
      timestamp: new Date(),
    });
    alert('Ratings submitted!');
    userComment.value = '';
    rateChoices.value = [0, 0, 0, 0];
    getAllRatings();
  } catch (error) {
    console.error("Error submitting:", error);
  }
};

// Fetch average ratings via Cloud Function
const getAverageRatings = async () => {
  try {
    const response = await axios.get('https://calculateaverageratings-bqwwbbooaq-uc.a.run.app');
    console.log('Average Ratings:', response.data);

    const averages = {
      overall: parseFloat(response.data.overall),
      navigation: parseFloat(response.data.navigation),
      eventFinder: parseFloat(response.data.eventFinder),
      map: parseFloat(response.data.map)
    };

    ratingAverages.value = averages;
  } catch (error) {
    console.error("Error getting averages:", error.message);
  }
};

// Get all ratings from Firestore
const getAllRatings = async () => {
  const snapshot = await getDocs(collection(db, 'ratings'));
  allRatings.value = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    data.timestamp = data.timestamp.toDate();
    allRatings.value.push(data);
  });

  visibleRatings.value = allRatings.value;
  getAverageRatings();
};

// Format timestamp
const formatDate = (val) => {
  if (val instanceof Date) {
    return val.toLocaleString('en-US', { timeZoneName: 'short' });
  }
  return val;
};

// Filter by email and ratings
const searchByEmail = () => {
  filterRatings();
};

const filterRatings = () => {
  visibleRatings.value = allRatings.value.filter((rating) => {
    return (
      (selectedFilters.value.website === '' || rating.overall === parseInt(selectedFilters.value.website)) &&
      (selectedFilters.value.navigation === '' || rating.navigation === parseInt(selectedFilters.value.navigation)) &&
      (selectedFilters.value.eventFinder === '' || rating.eventFinder === parseInt(selectedFilters.value.eventFinder)) &&
      (selectedFilters.value.map === '' || rating.map === parseInt(selectedFilters.value.map)) &&
      rating.userEmail.toLowerCase().includes(emailSearch.value.toLowerCase())
    );
  });
};

// Get logged-in user's email
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserEmail.value = user.email;
  }
});

onMounted(getAllRatings);
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
  margin-top: 50px;
}
</style>
