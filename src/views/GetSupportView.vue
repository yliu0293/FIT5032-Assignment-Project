<!-- https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-vue/ -->
<template>
  <div class="text-center mt-5">
    <h1 class="mb-4">Find nearby support</h1>
    <p class="lead">Search by location name and address.</p>
    <p class="lead">Select a location first to get direction from another location of your choice.</p>
  </div>

  <div id="layout">
    <!-- Location 1 Search -->
    <div class="search-bar">
      <input
        v-model="startPoint"
        @input="searchStart"
        type="text"
        placeholder="Enter starting location..."
        class="input-box"
      />

      <ul v-if="startOptions.length" class="search-results">
        <li v-for="(place, idx) in startOptions" :key="idx" @click="pickStart(place)">
          {{ place.place_name }}
        </li>
      </ul>

      <!-- Button for Directions -->
      <button v-if="startCoords && !showEndSearch" @click="toggleEndSearch" class="action-button">
        Get Directions
      </button>

      <!-- Destination Input appears after clicking Get Directions -->
      <div v-if="showEndSearch">
        <input
          v-model="endPoint"
          @input="searchEnd"
          type="text"
          placeholder="Enter destination location..."
          class="input-box"
        />
        <ul v-if="endOptions.length" class="search-results">
          <li v-for="(place, idx) in endOptions" @click="pickEnd(place)">
            {{ place.place_name }}
          </li>
        </ul>

        <!-- Show Route and Clear Buttons -->
        <div>
          <button @click="drawRoute" class="action-button">Show Route</button>
          <button @click="resetMap" class="action-button-clear">Clear</button> 
        </div>
      </div>
    </div>

    <div ref="mapContainer" class="map-container"></div> <!-- Map goes here -->
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoieWxpdTAyOTMiLCJhIjoiY20yMzNydHJ1MDFxYzJqb2h1bnQ0a2czYiJ9.GD7GpyS0vfCnw3YF-c3stA';

export default {
  data() {
    return {
      map: null, 
      startPoint: '', // Starting point search input
      endPoint: '', // Destination point search input
      startOptions: [], // Options for start point search results
      endOptions: [], // Options for end point search results
      startCoords: null, // Coordinates for starting point
      endCoords: null, // Coordinates for destination
      startPin: null, // Marker for start point
      endPin: null, // Marker for end point
      routePath: null, // Path for the route on the map
      showEndSearch: false, // Toggle for destination input
    };
  },
  mounted() {
    // Initialize Mapbox Map
    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [144.9631, -37.8136], // Default is Melbourne
      zoom: 9,
    });

    this.map.addControl(new mapboxgl.NavigationControl());
  },
  methods: {
    // Search for starting location
    searchStart() {
      if (!this.startPoint) {
        this.startOptions = [];
        return;
      }

      let searchURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.startPoint}.json?access_token=${mapboxgl.accessToken}`;
      
      fetch(searchURL)
        .then(response => response.json())
        .then(data => {
          if (data.features) {
            this.startOptions = data.features;
          } else {
            this.startOptions = [];
          }
        })
        .catch(err => {
          console.error('Error while searching start location:', err);
        });
    },
    // Search for destination location
    searchEnd() {
      if (!this.endPoint) {
        this.endOptions = [];
        return;
      }

      let searchURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.endPoint}.json?access_token=${mapboxgl.accessToken}`;
      
      fetch(searchURL)
        .then(response => response.json())
        .then(data => {
          if (data.features) {
            this.endOptions = data.features;
          } else {
            this.endOptions = [];
          }
        })
        .catch(err => {
          console.error('Error while searching destination:', err);
        });
    },
    // Select starting location
    pickStart(place) {
      const [lng, lat] = place.center;
      this.startCoords = [lng, lat];
      this.startPoint = place.place_name;

      this.map.flyTo({ center: this.startCoords, zoom: 12 });

      if (this.startPin) {
        this.startPin.remove();
      }
      this.startPin = new mapboxgl.Marker({ color: 'blue' })
        .setLngLat(this.startCoords)
        .addTo(this.map);

      this.startOptions = [];
    },
    // Select destination location
    pickEnd(place) {
      const [lng, lat] = place.center;
      this.endCoords = [lng, lat];
      this.endPoint = place.place_name;

      this.map.flyTo({ center: this.endCoords, zoom: 12 });

      if (this.endPin) {
        this.endPin.remove();
      }
      this.endPin = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(this.endCoords)
        .addTo(this.map);

      this.endOptions = [];
    },
    // Toggle destination search box visibility
    toggleEndSearch() {
      this.showEndSearch = true;
    },
    // Fetch directions between locations
    drawRoute() {
      if (!this.startCoords || !this.endCoords) {
        alert("Both locations must be selected.");
        return;
      }

      if (this.startPin) this.startPin.remove();
      if (this.endPin) this.endPin.remove();

      if (this.map.getSource('routePath')) {
        this.map.removeLayer('routePath');
        this.map.removeSource('routePath');
      }

      this.startPin = new mapboxgl.Marker({ color: 'blue' })
        .setLngLat(this.startCoords)
        .addTo(this.map);

      this.endPin = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(this.endCoords)
        .addTo(this.map);

      const routeURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.startCoords[0]},${this.startCoords[1]};${this.endCoords[0]},${this.endCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      fetch(routeURL)
        .then(response => response.json())
        .then(data => {
          const path = data.routes[0].geometry;

          this.map.addSource('routePath', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: path,
            },
          });

          this.map.addLayer({
            id: 'routePath',
            type: 'line',
            source: 'routePath',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
            },
          });

          const routeBounds = new mapboxgl.LngLatBounds();
          path.coordinates.forEach(coord => routeBounds.extend(coord));
          this.map.fitBounds(routeBounds, { padding: 50 });
        })
        .catch(err => {
          console.error('Error fetching directions:', err);
        });
    },
    // Clear everything and reset
    resetMap() {
      if (this.startPin) this.startPin.remove();
      if (this.endPin) this.endPin.remove();

      if (this.map.getSource('routePath')) {
        this.map.removeLayer('routePath');
        this.map.removeSource('routePath');
      }

      this.startPoint = '';
      this.endPoint = '';
      this.startCoords = null;
      this.endCoords = null;
      this.showEndSearch = false;
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
  width: 100%;
  margin-bottom: 4px;
}

.search-bar {
  position: absolute;
  top: 10px;
  left: 20px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 400px;
}

.action-button {
  padding: 10px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 10px;
}

.action-button-clear {
  padding: 10px 16px;
  font-size: 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
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
