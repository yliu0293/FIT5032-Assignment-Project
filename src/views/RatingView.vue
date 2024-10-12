<template>
  <div class="container bg-lightblue d-flex flex-column align-items-center py-5">
    <div class="rating-container shadow-sm p-4 mb-5 bg-white rounded w-100">
      <h1 class="text-center mb-4">Your Feedback Matters!</h1>
      <div v-for="(category, i) in categories" :key="i" class="rating-card mb-4">
        <div class="card p-3 shadow-sm">
          <h4>{{ category }}</h4>
          <div class="stars d-flex justify-content-center mb-2">
            <svg 
              v-for="star in 5"
              :key="star"
              xmlns="http://www.w3.org/2000/svg" 
              width="40" height="40" fill="currentColor" 
              class="bi bi-star-fill mx-1"
              :class="{ 'active': star <= hoverStarsStatuses[i] || star <= ratings[i] }"
              viewBox="0 0 16 16"
              @mouseover="hoverStars(star, i)"
              @mouseleave="hoverStars(0, i)"
              @click="setRating(star, i)"
              style="cursor: pointer; transition: fill 0.2s ease;"
            >
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
          </div>
          <p class="text-center">Your Rating: {{ ratings[i] }} | Avg: {{ avgRatings[ratingMapping[category]]?.toFixed(2) || 'N/A' }}</p>
        </div>
      </div>

      <div class="form-group mt-3 w-75 mx-auto">
        <textarea 
          v-model="comment"
          class="form-control shadow-sm" 
          placeholder="Let us know what you think..." 
          rows="3"
          required>
        </textarea>
      </div>

      <button @click="submitForm" class="btn btn-primary btn-lg mt-3 w-50 mx-auto shadow-sm">Submit Feedback</button>

      <div class="mt-5 w-100">
        <h2 class="mb-4 text-center">All Feedback</h2>

        <input
          v-model="selectedEmails"
          @input="searchEmail"
          class="form-control mb-3 w-50 mx-auto shadow-sm"
          placeholder="Filter by email"
        />

        <div class="d-flex justify-content-around w-100 mb-4">
          <div class="w-25">
            <label for="website-filter">Website</label>
            <select v-model="selectedFilters.website" id="website-filter" @change="filterRatings" class="form-select shadow-sm">
              <option value="">Any</option>
              <option v-for="num in 5" :key="num" :value="num">{{ num }}</option>
            </select>
          </div>

          <div class="w-25">
            <label for="navigation-filter">Navigation</label>
            <select v-model="selectedFilters.navigation" id="navigation-filter" @change="filterRatings" class="form-select shadow-sm">
              <option value="">Any</option>
              <option v-for="num in 5" :key="num" :value="num">{{ num }}</option>
            </select>
          </div>

          <div class="w-25">
            <label for="event-filter">Event Finder</label>
            <select v-model="selectedFilters.eventFinder" id="event-filter" @change="filterRatings" class="form-select shadow-sm">
              <option value="">Any</option>
              <option v-for="num in 5" :key="num" :value="num">{{ num }}</option>
            </select>
          </div>

          <div class="w-25">
            <label for="map-filter">Map</label>
            <select v-model="selectedFilters.map" id="map-filter" @change="filterRatings" class="form-select shadow-sm">
              <option value="">Any</option>
              <option v-for="num in 5" :key="num" :value="num">{{ num }}</option>
            </select>
          </div>
        </div>

        <div class="table-responsive-md table-bordered shadow-sm">
          <DataTable :value="filteredRatings" paginator :rows="10" striped-rows class="custom-datatable">
            <Column field="userEmail" header="User" sortable header-style="background-color: #e0f7fa;"></Column>
            <Column field="averageRating" header="Avg Rating" sortable header-style="background-color: #e0f7fa;"></Column>
            <Column field="overall" header="Website" sortable header-style="background-color: #e0f7fa;"></Column>
            <Column field="navigation" header="Navigation" sortable header-style="background-color: #e0f7fa;"></Column>
            <Column field="eventFinder" header="Event Finder" sortable header-style="background-color: #e0f7fa;"></Column>
            <Column field="map" header="Map" sortable header-style="background-color: #e0f7fa;"></Column>
            <Column field="comment" header="Comment" header-style="background-color: #e0f7fa;"></Column>
            <Column field="timestamp" header="Date" sortable :formatter="timestampDisplay" header-style="background-color: #e0f7fa;"></Column>
          </DataTable>
        </div>

        <div class="chart-container mt-5 w-100 bg-white shadow p-4 rounded">
          <h2 class="mb-4 text-center">Average Ratings Graph</h2>
          <canvas id="feedbackChart"></canvas>
        </div>
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
import DOMPurify from 'dompurify';
import {
  Chart,
  BarController, 
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const db = getFirestore();
const auth = getAuth();

const categories = ['How was your experience using the Website?', 'How would you rate the navigation between the webpages?', 'How was your experience with the Event Finder?', 'How was your experience using the map?'];
const ratings = ref([0, 0, 0, 0]);
const hoverStarsStatuses = ref([0, 0, 0, 0]);
const comment = ref('');
const selectedEmails = ref('');
const filteredRatings = ref([]);
const selectedFilters = ref({
  website: '',
  navigation: '',
  eventFinder: '',
  map: ''
});

const ratingMapping = {
  'How was your experience using the Website?': 'overall',
  'How would you rate the navigation between the webpages?': 'navigation',
  'How was your experience with the Event Finder?': 'eventFinder',
  'How was your experience using the map?': 'map',
};

const allRatings = ref([]);

const avgRatings = ref({
  overall: 0,
  navigation: 0,
  eventFinder: 0,
  map: 0,
});

let currentEmail = ref(null);

const hoverStars = (num, idx) => {
  hoverStarsStatuses.value[idx] = num;
};

const setRating = (num, idx) => {
  ratings.value[idx] = num;
};

const submitForm = async () => {
  if (ratings.value.includes(0) || !comment.value) {
    alert('Please rate all categories and leave a comment.');
    return;
  }

  const avgRating = ratings.value.reduce((sum, rating) => sum + rating, 0) / ratings.value.length;

  try {
    const sanitizedComment = DOMPurify.sanitize(comment.value);
    await addDoc(collection(db, 'ratings'), {
      userEmail: currentEmail.value,
      overall: ratings.value[0],
      navigation: ratings.value[1],
      eventFinder: ratings.value[2],
      map: ratings.value[3],
      averageRating: avgRating.toFixed(2),
      comment: sanitizedComment,
      timestamp: new Date(),
    });
    alert('Thanks for your feedback!');
    comment.value = '';
    ratings.value = [0, 0, 0, 0];
    fetchRatings();
  } catch (error) {
    console.error("Submission failed:", error);
  }
};

const fetchAvgRatings = async () => {
  try {
    const res = await axios.get('https://calculateaverageratings-bqwwbbooaq-uc.a.run.app');
    avgRatings.value = {
      overall: parseFloat(res.data.overall),
      navigation: parseFloat(res.data.navigation),
      eventFinder: parseFloat(res.data.eventFinder),
      map: parseFloat(res.data.map),
    };
    updateAVGChart(avgRatings.value);
  } catch (err) {
    console.error("Failed to fetch averages:", err.message);
  }
};

const fetchRatings = async () => {
  try {
    const response = await axios.get('https://us-central1-yugong-liu-assignment-project.cloudfunctions.net/getRatings');
    allRatings.value = response.data.ratings.map((rating) => {
      if (rating.timestamp && rating.timestamp._seconds) {
        // Convert Firestore timestamp to JavaScript Date
        rating.timestamp = new Date(rating.timestamp._seconds * 1000);
      }
      return rating;
    });
    filteredRatings.value = allRatings.value;
    fetchAvgRatings();
  } catch (error) {
    console.error("Error fetching ratings:", error);
  }
};

const timestampDisplay = (value) => {
  if (value instanceof Date) {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();

    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    const seconds = String(value.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  return 'Invalid Date';
};

const filterRatings = () => {
  filteredRatings.value = allRatings.value.filter((rating) => {
    const sanitizedEmail = selectedEmails.value ? selectedEmails.value.toLowerCase() : '';
    const matchEmail = selectedEmails.value
      ? rating.userEmail.toLowerCase().includes(sanitizedEmail)
      : true;
    const matchWebsite = selectedFilters.value.website
      ? rating.overall === parseInt(selectedFilters.value.website)
      : true;
    const matchNavigation = selectedFilters.value.navigation
      ? rating.navigation === parseInt(selectedFilters.value.navigation)
      : true;
    const matchEventFinder = selectedFilters.value.eventFinder
      ? rating.eventFinder === parseInt(selectedFilters.value.eventFinder)
      : true;
    const matchMap = selectedFilters.value.map
      ? rating.map === parseInt(selectedFilters.value.map)
      : true;

    return matchEmail && matchWebsite && matchNavigation && matchEventFinder && matchMap;
  });
};

const searchEmail = () => {
  filterRatings();
};


let avgRatingChart = null;

const updateAVGChart = (averages) => {
  const ctx = document.getElementById('feedbackChart').getContext('2d');
  
  if (avgRatingChart) {
    avgRatingChart.destroy();
  }

  avgRatingChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Website Experience Rating', 'Navigation Rating', 'Event Finder Rating', 'Map Feature Rating'],
      datasets: [{
        label: 'Average Ratings',
        data: [averages.overall, averages.navigation, averages.eventFinder, averages.map],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'],
        borderColor: '#fff',
        borderWidth: 2,
        barThickness: 50,
        borderRadius: 8, 
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Average Ratings for Site Features',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: '#fff',
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 14,
              weight: 'bold',
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            stepSize: 1,
            font: {
              size: 12,
            },
          },
        },
      },
    },
  });
};

onMounted(() => {
  fetchRatings();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentEmail.value = user.email;
    }
  });
});
</script>

<style scoped>
.bg-lightblue {
  background-color: #e0f7fa;
}

.rating-container {
  max-width: 80vw;
  text-align: center;
  padding: 20px;
}

.custom-datatable .p-datatable-thead > tr > th {
  background-color: #e0f7fa;
  color: #333;
  text-align: center;
  font-weight: bold;
}

.custom-datatable .p-datatable-tbody > tr:nth-child(even) {
  background-color: #f9f9f9;
}

.custom-datatable .p-datatable-tbody > tr:hover {
  background-color: #e0f7fa;
  transition: background-color 0.3s ease;
}

.table-responsive-md {
  margin-top: 20px;
  border-radius: 10px;
}

.form-control, .form-select {
  border-radius: 10px;
  padding: 10px;
}

.shadow-sm {
  box-shadow: 0 50px 50px rgba(0, 0, 0, 0.1);
}

.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 50px;
  margin-bottom: 50px;
}

.container-fluid {
  max-width: 100vw;
  margin: 50px;
}

.custom-datatable {
  width: 100%;
}

.custom-datatable .p-datatable-thead > tr > th {
  background-color: #e0f7fa;
  color: #333;
  text-align: center;
  font-weight: bold;
}

.custom-datatable .p-datatable-tbody > tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.custom-datatable .p-datatable-tbody > tr:hover {
  background-color: #f1f1f1;
  transition: background-color 0.3s ease;
}

.custom-datatable .p-paginator {
  margin-top: 20px;
}

.custom-datatable .p-paginator .paginator-template {
  font-size: 1rem;
}

.custom-datatable .p-datatable-header {
  background-color: #e0f7fa;
}

.stars svg {
  fill: #ccc;
}

.stars svg.active {
  fill: #FFD700;
}

.stars svg:hover {
  fill: #FFD700;
}

.stars {
  display: flex;
  justify-content: center;
}
</style>
