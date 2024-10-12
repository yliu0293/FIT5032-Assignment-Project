<template>
  <div class="container-fluid bg-lightblue py-5 d-flex flex-column justify-content-center align-items-center" style="margin-top: 30px;">
    <div class="EventView card shadow-sm p-4 mt-4">
      <h1 class="mb-4">Checkout our Community Events!</h1>

      <div class="d-flex justify-content-between mb-3 flex-wrap">
        <div v-for="(field, index) in filterFields" :key="index" class="p-2">
          <input
            v-model="filters[field]"
            @input="filterTable"
            class="form-control"
            :placeholder="'Search by ' + field"
          />
        </div>
      </div>

      <DataTable
        :value="filteredEvents"
        paginator
        :rows="10"
        class="mt-4 table table-hover"
        striped-rows
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        current-page-report-template="Showing {first} to {last} of {totalRecords} events"
        :rows-per-page-options="[5, 10, 20]"
        showGridlines
      >
        <Column field="event_name" header="Event Name" filter header-style="background-color: #e0f7fa;"></Column>
        <Column header="Event Date" sortable header-style="background-color: #e0f7fa;">
          <template #body="slotProps">
            {{ slotProps.data.event_date ? formatDate(slotProps.data.event_date) : 'Invalid Date' }}
          </template>
        </Column>
        <Column field="address" header="Address" filter header-style="background-color: #e0f7fa;"></Column>
        <Column field="city" header="City" filter header-style="background-color: #e0f7fa;"></Column>
        <Column field="phone" header="Phone" filter header-style="background-color: #e0f7fa;"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DOMPurify from 'dompurify';

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

const sanitizeFilter = (filterValue) => {
  return DOMPurify.sanitize(filterValue);
};

const filterTable = () => {
  filteredEvents.value = events.value.filter(event => {
    return Object.keys(filters.value).every((key) => {
      const sanitizedFilter = sanitizeFilter(filters.value[key]);
      return event[key].toString().toLowerCase().includes(sanitizedFilter.toLowerCase());
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
.bg-lightblue {
  background-color: #e0f7fa;
}

.EventView {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
}

.container-fluid {
  max-width: 80vw;
  margin: 0 auto;
  margin-top: 50px;
}

.card {
  border: none;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

input.form-control {
  max-width: 250px;
  border-radius: 8px;
}

.DataTable {
  width: 100%;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.table-hover tbody tr {
  transition: background-color 0.3s ease;
}

.paginator {
  margin-top: 20px;
}

.DataTable .paginator .paginator-template {
  font-size: 1rem;
}

.p-datatable-thead > tr > th {
  text-align: center;
  font-weight: bold;
}

.DataTable .p-datatable-header {
  background-color: #e0f7fa;
}

.p-datatable-tbody > tr:nth-child(odd) {
  background-color: #f9f9f9;
}
</style>
