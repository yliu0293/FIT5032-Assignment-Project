import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGun-QNLS9zNxqBFg7GZu4T79ZA88KSSw",
  authDomain: "yugong-liu-assignment-project.firebaseapp.com",
  projectId: "yugong-liu-assignment-project",
  storageBucket: "yugong-liu-assignment-project.appspot.com",
  messagingSenderId: "292686952758",
  appId: "1:292686952758:web:28a9a22068fd3efb2a5b97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Your mock data
const mockData = [
  {"event_name":"Ms","event_date":"12/19/2022","address":"806 Anzinger Lane","city":"Tohong","phone":"556-729-9066"},
  {"event_name":"Mrs","event_date":"3/27/2022","address":"6 Autumn Leaf Park","city":"Dzerzhinskiy","phone":"600-676-7842"},
  {"event_name":"Rev","event_date":"2/11/2022","address":"9 Carberry Way","city":"Aquidauana","phone":"909-701-6548"},
  {"event_name":"Mrs","event_date":"7/11/2022","address":"3506 Saint Paul Terrace","city":"KitakyÅ«shÅ«","phone":"654-591-2972"},
  {"event_name":"Mr","event_date":"10/16/2022","address":"4726 Warrior Pass","city":"Pengandonan","phone":"190-573-1648"},
  {"event_name":"Mr","event_date":"12/13/2022","address":"8 Stoughton Terrace","city":"Tumpang","phone":"479-587-1779"},
  {"event_name":"Rev","event_date":"7/7/2022","address":"47 Steensland Avenue","city":"Kristinehamn","phone":"561-589-3840"},
  {"event_name":"Honorable","event_date":"11/13/2022","address":"67090 6th Street","city":"Heshi","phone":"942-926-6403"},
  {"event_name":"Ms","event_date":"12/12/2022","address":"5995 Westerfield Court","city":"Porsgrunn","phone":"791-816-4687"},
  {"event_name":"Dr","event_date":"3/3/2022","address":"75297 Summer Ridge Trail","city":"Kenarilang","phone":"205-848-3644"},
  {"event_name":"Ms","event_date":"2/18/2022","address":"10 Mosinee Avenue","city":"Ngchesar Hamlet","phone":"653-163-5224"},
  {"event_name":"Ms","event_date":"1/7/2022","address":"20 Drewry Crossing","city":"ShÄhÄ«n Shahr","phone":"781-645-3345"},
  {"event_name":"Rev","event_date":"1/24/2022","address":"2 Valley Edge Road","city":"Namboongan","phone":"584-460-6793"},
  {"event_name":"Mr","event_date":"3/10/2022","address":"40488 Clemons Hill","city":"Bungkulan","phone":"808-597-1676"},
  {"event_name":"Mr","event_date":"11/12/2022","address":"4 Alpine Park","city":"MorazÃ¡n","phone":"787-759-5107"}
];

// Upload mock data to Firestore
const uploadMockData = async () => {
  try {
    for (const data of mockData) {
      // Add each document to the 'events' collection
      await addDoc(collection(db, 'events'), data);
    }
    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading data: ', error);
  }
};

// Call the function to upload the data
uploadMockData();
