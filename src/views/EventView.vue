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
        <Column field="event_date" header="Event Date" sortable header-style="background-color: #e0f7fa;">
          <template #body="slotProps">
            {{ slotProps.data.event_date ? formatDate(slotProps.data.event_date) : 'Invalid Date' }}
          </template>
        </Column>
        <Column field="address" header="Address" filter header-style="background-color: #e0f7fa;"></Column>
        <Column field="city" header="City" filter header-style="background-color: #e0f7fa;"></Column>
        <Column field="phone" header="Phone" filter header-style="background-color: #e0f7fa;"></Column>
      </DataTable>
      <button @click="exportAsCSV" class="btn btn-primary mt-3">Export filterd events as CSV</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DOMPurify from 'dompurify';

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
    const response = await fetch('https://us-central1-yugong-liu-assignment-project.cloudfunctions.net/getEvents');
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    const eventsData = data.events.map(event => ({
      ...event,
      event_date: new Date(event.event_date),
    }));

    events.value = eventsData;
    filteredEvents.value = eventsData;
  } catch (error) {
    console.error('Error fetching events:', error.message);
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
  return `${day}/${month}/${year}`;
};

onMounted(() => {
  fetchEvents();
});

//data export
const exportAsCSV = () => {
  const headers = ['Event Name', 'Event Date', 'Address', 'City', 'Phone'];
  const csvRows = [];

  csvRows.push(headers.join(','));

  filteredEvents.value.forEach(event => {
    const row = [
      event.event_name,
      formatDate(event.event_date),
      event.address,
      event.city,
      event.phone,
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'events.csv';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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
