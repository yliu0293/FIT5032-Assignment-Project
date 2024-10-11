<template>
  <div class="container-fluid bg-light d-flex flex-column justify-content-center align-items-center" style="margin-top: 30px;">
    <div class="EventView">
      <h1>Checkout our Community Events!</h1>

      <div class="d-flex justify-content-between mb-3">
        <div v-for="(field, index) in filterFields" :key="index" class="p-2">
          <input
            v-model="filters[field]"
            @input="filterTable"
            class="form-control"
            :placeholder="'Search by ' + field"
          />
        </div>
      </div>

      <DataTable :value="filteredEvents" paginator :rows="10" class="mt-4">
        <Column field="event_name" header="Event Name" filter></Column>
        <!-- make the date sortable -->
        <Column header="Event Date" sortable>
          <template #body="slotProps">
            {{ slotProps.data.event_date ? formatDate(slotProps.data.event_date) : 'Invalid Date' }}
          </template>
        </Column>
        <Column field="address" header="Address" filter></Column>
        <Column field="city" header="City" filter></Column>
        <Column field="phone" header="Phone" filter></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const db = getFirestore();

const events = ref([]);
const filteredEvents = ref([]);
const filters = ref({
  event_name: '',
  event_date: '',
  address: '',
  city: '',
  phone: ''
});

const filterFields = ['event_name', 'event_date', 'address', 'city', 'phone'];

const fetchEvents = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'events'));
    snapshot.forEach((doc) => {
      const data = doc.data();
      data.event_date = new Date(data.event_date);
      events.value.push(data);
    });
    filteredEvents.value = events.value;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

const filterTable = () => {
  filteredEvents.value = events.value.filter(event => {
    return Object.keys(filters.value).every((key) => {
      return event[key].toString().toLowerCase().includes(filters.value[key].toLowerCase());
    });
  });
};

const formatDate = (date) => {
  if (!(date instanceof Date)) return 'Invalid Date';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped>
.EventView {
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
