// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getDatabase,
  set,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpr-1EERV53eqD-jKDGBCNLYeW4GwbBSs",
  authDomain: "flood-watch-614bb.firebaseapp.com",
  projectId: "flood-watch-614bb",
  storageBucket: "flood-watch-614bb.appspot.com",
  messagingSenderId: "917331455641",
  appId: "1:917331455641:web:6f7bd1c3974ec667d71208",
  databaseURL:
    "https://flood-watch-614bb-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const sensorsInDB = ref(database, "Sensors/SensosData-Loc1");

onValue(sensorsInDB, (snapshot) => {
  if (snapshot.exists()) {
    let sensorsArray = Object.entries(snapshot.val());

    console.log(sensorsArray);
    // sensorsArray.map((arr) => {
    //   const sensorID = arr[0];
    //   const floodHeight = arr[1]["height"];
    //   const indication = arr[1]["indication"];
    //   const date = arr[1]["date"];
    // });
  }
});
