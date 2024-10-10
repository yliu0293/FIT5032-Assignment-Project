<template>
  <div class="text-center mt-4">
    <h1 class="mb-4">Find nearby support</h1>
    <p class="lead">Enter starting address to see directions.</p>
  </div>

  <div id="layout">
    <!-- Search input for original location (origin) -->
    <div class="search-bar">
      <div class="search-input-container">
        <input
          v-model="origin"
          @input="fetchOriginResults"
          type="text"
          placeholder="Enter starting location..."
          class="input-box"
        />
        <button @click="clearRoute" class="action-button-clear">Clear</button> <!-- Clear button displayed here -->
      </div>

      <ul v-if="originResults.length" class="search-results">
        <li v-for="(result, index) in originResults" :key="index" @click="selectOrigin(result)">
          {{ result.place_name }}
        </li>
      </ul>

      <!-- Display the "Get Directions" button only when the origin is set and the destination is hidden -->
      <button v-if="originCoords && !showDestination" @click="showDestinationInput" class="action-button">
        Get Directions
      </button>

      <!-- Destination input appears after clicking "Get Directions" -->
      <div v-if="showDestination">
        <input
          v-model="destination"
          @input="fetchDestinationResults"
          type="text"
          placeholder="Enter destination location..."
          class="input-box"
        />
        <ul v-if="destinationResults.length" class="search-results">
          <li v-for="(result, index) in destinationResults" @click="selectDestination(result)">
            {{ result.place_name }}
          </li>
        </ul>

        <!-- Show route button -->
        <div>
          <button @click="getDirections" class="action-button">Show Route</button>
        </div>
      </div>
    </div>

    <div ref="mapContainer" class="map-container"></div> <!-- Map container here -->
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoieWxpdTAyOTMiLCJhIjoiY20yMzNydHJ1MDFxYzJqb2h1bnQ0a2czYiJ9.GD7GpyS0vfCnw3YF-c3stA';

export default {
  data() {
    return {
      map: null, // Mapbox map instance
      origin: '', // User input for origin
      destination: '', // User input for destination
      originResults: [], // Search results for origin
      destinationResults: [], // Search results for destination
      originCoords: null, // Coordinates for origin
      destinationCoords: null, // Coordinates for destination
      originMarker: null, // Marker for origin location
      destinationMarker: null, // Marker for destination location
      directionsLayer: null, // Layer to display directions
      showDestination: false, // Control visibility of destination input
    };
  },
  mounted() {
    // Initialize the Mapbox map
    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [144.9631, -37.8136], // Melbourne as the default center
      zoom: 9,
    });

    // Add navigation controls
    this.map.addControl(new mapboxgl.NavigationControl());
  },
  methods: {
    // Fetch search results for origin
    fetchOriginResults() {
      if (!this.origin) {
        this.originResults = [];
        return;
      }

      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.origin}.json?access_token=${mapboxgl.accessToken}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.features) {
            this.originResults = data.features;
          } else {
            this.originResults = [];
          }
        })
        .catch(err => {
          console.error('Error fetching origin search results:', err);
        });
    },
    // Fetch search results for destination
    fetchDestinationResults() {
      if (!this.destination) {
        this.destinationResults = [];
        return;
      }

      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.destination}.json?access_token=${mapboxgl.accessToken}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.features) {
            this.destinationResults = data.features;
          } else {
            this.destinationResults = [];
          }
        })
        .catch(err => {
          console.error('Error fetching destination search results:', err);
        });
    },
    // Select the origin and set marker
    selectOrigin(result) {
      const [lng, lat] = result.center;
      this.originCoords = [lng, lat];
      this.origin = result.place_name; // Set full location name in input

      // Fly to the origin location
      this.map.flyTo({ center: this.originCoords, zoom: 12 });

      // Add origin marker
      if (this.originMarker) {
        this.originMarker.remove();
      }
      this.originMarker = new mapboxgl.Marker({ color: 'blue' })
        .setLngLat(this.originCoords)
        .addTo(this.map);

      this.originResults = []; // Clear search results
    },
    // Select the destination and set marker
    selectDestination(result) {
      const [lng, lat] = result.center;
      this.destinationCoords = [lng, lat];
      this.destination = result.place_name; // Set full location name in input

      // Fly to the destination location
      this.map.flyTo({ center: this.destinationCoords, zoom: 12 });

      // Add destination marker
      if (this.destinationMarker) {
        this.destinationMarker.remove();
      }
      this.destinationMarker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(this.destinationCoords)
        .addTo(this.map);

      this.destinationResults = []; // Clear search results
    },
    // Show the destination input box
    showDestinationInput() {
      this.showDestination = true;
    },
    // Get directions between origin and destination
    getDirections() {
      if (!this.originCoords || !this.destinationCoords) {
        alert("Please select both a starting location and a destination.");
        return;
      }

      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.originCoords[0]},${this.originCoords[1]};${this.destinationCoords[0]},${this.destinationCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      fetch(directionsUrl)
        .then(response => response.json())
        .then(data => {
          const route = data.routes[0].geometry;

          // Remove previous directions layer if it exists
          if (this.directionsLayer) {
            this.map.removeLayer('route');
            this.map.removeSource('route');
          }

          // Add new source for route
          this.map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route,
            },
          });

          // Add new layer for route
          this.map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
            },
          });

          // Fit map to the route
          const bounds = new mapboxgl.LngLatBounds();
          route.coordinates.forEach(coord => bounds.extend(coord));
          this.map.fitBounds(bounds, { padding: 50 });
        })
        .catch(err => {
          console.error('Error fetching directions:', err);
        });
    },
    // Clear the route, markers, and reset inputs
    clearRoute() {
      // Remove markers if they exist
      if (this.originMarker) this.originMarker.remove();
      if (this.destinationMarker) this.destinationMarker.remove();

      // Remove directions layer if it exists
      if (this.map.getSource('route')) {
        this.map.removeLayer('route');
        this.map.removeSource('route');
      }

      // Reset input fields and state
      this.origin = '';
      this.destination = '';
      this.originCoords = null;
      this.destinationCoords = null;
      this.showDestination = false;
    },
  },
};
</script>

<style scoped>
#layout {
  display: flex;
  position: relative;
  height: 100vh;
}

.input-box {
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: calc(100% - 80px); /* Adjust to allow the button to fit */
  margin-bottom: 4px;
}

.search-input-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-button-clear {
  padding: 10px 16px;
  font-size: 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

.action-button {
  padding: 10px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%; /* Ensure buttons take full width */
  margin-bottom: 10px; /* Space between buttons */
}

.search-bar input {
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 4px;
}

.search-results {
  list-style-type: none;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.search-results li {
  padding: 10px;
  cursor: pointer;
}

.search-results li:hover {
  background-color: #f0f0f0;
}

.map-container {
  flex: 1;
  height: 100vh;
}

.text-center {
  margin-top: 20px;
}
</style>
