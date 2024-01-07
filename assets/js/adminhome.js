import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
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
const usersInDB = ref(database, "Users/");

// Display all users
onValue(usersInDB, (snapshot) => {
  if (snapshot.exists()) {
    let usersArray = Object.entries(snapshot.val());
    let usernum = document.querySelector("#user_count");
    usernum.innerHTML = usersArray.length;
  }
});

const sensorsInDB = ref(database, "SensorLocations/");

// Display all users
onValue(sensorsInDB, (snapshot) => {
  if (snapshot.exists()) {
    let sensorsArray = Object.entries(snapshot.val());
    let sensorNum = document.querySelector("#sensor_count");
    let locationNum = document.querySelector("#location_count");
    sensorNum.innerHTML = sensorsArray.length;
    locationNum.innerHTML = sensorsArray.length;
  }
});

const getTimeDifference = (timestamp) => {
  const now = new Date();
  const previousDate = new Date(timestamp);

  const timeDifference = now - previousDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days: days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  };
};
