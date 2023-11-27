const map = L.map("map").setView([14.57031533402106, 120.99156564740088], 13);
const attribution = "";

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 25,
  attribution: "© OpenStreetMap",
}).addTo(map);

var map2 = L.map("mapContainer").setView(
  [14.57031533402106, 120.99156564740088],
  13
);
var map3 = L.map("mapContainer2").setView(
  [14.57031533402106, 120.99156564740088],
  13
);

document.addEventListener("DOMContentLoaded", function () {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map3);

  $("#exampleModal").on("shown.bs.modal", function () {
    map2.invalidateSize();
    map3.invalidateSize();
  });

  // Close the map modal when the modal is closed
  $("#exampleModalLabel").on("hidden.bs.modal", function () {});
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getDatabase,
  query,
  ref,
  set,
  remove,
  update,
  get,
  limitToLast,
  onValue,
  orderByKey,
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
const streetsInDB = ref(database, `SensorLocations`);
let sensorsArray = [];

get(streetsInDB).then((snapshot) => {
  resetTable();

  if (snapshot.exists()) {
    let locArray = Object.entries(snapshot.val());

    // Use Promise.all to wait for all asynchronous operations to complete
    Promise.all(
      locArray.map((arr) => {
        let sensorCoordinates = arr[1]["coordinates"];
        createMarker(sensorCoordinates);
        let sensorLoc = arr[0];
        let sensorName = arr[1]["location"];
        let sensorPath = arr[1]["stringPath"];
        sensorsArray.push({
          sensorN: sensorLoc,
          sensor: sensorName,
          sensorCoords: sensorCoordinates,
          sensorP: sensorPath,
        });

        const stations = ref(database, `Sensors/${sensorLoc}`);
        const latestQuery = query(stations, orderByKey(), limitToLast(1));

        // Use get method instead of onValue
        return get(latestQuery).then((snap) => {
          if (snap.exists()) {
            let stationArray = Object.entries(snap.val());
            stationArray.forEach((sensor) => {
              const sensorID = sensor[0];
              const floodHeight = sensor[1]["height"];
              const indication = sensor[1]["indication"];
              const date = sensor[1]["date"];
              createFloodTable(
                sensorID,
                sensorLoc,
                sensorName,
                floodHeight,
                date
              );
            });
          } else {
            createFloodTable(sensorLoc, sensorLoc, sensorName, "No Data", null);
          }
        });
      })
    ).then(() => {
      // All asynchronous operations are completed
      const allDeleteBtn = document.querySelectorAll(".table-delete-btn");
      allDeleteBtn.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", () => {
          removeSensor(deleteBtn.getAttribute("data-sensor-id"));
        });
      });

      const allEditBtn = document.querySelectorAll(".table-edit-btn");
      allEditBtn.forEach((editBtn) => {
        editBtn.addEventListener("click", () => {
          editSensor(editBtn.getAttribute("data-sensor-id"), sensorsArray);
        });
      });
    });
  } else {
    console.log("failed");
  }
});

const exportExcel = document.querySelector("#export_excel");
exportExcel.addEventListener("click", () => {
  tableToExcel();
});

const tableToExcel = () => {
  var table2excel = new Table2Excel();
  table2excel.export(document.querySelectorAll("table.export-table"));
};

const removeSensor = (sensorid) => {
  const confirmModal = document.querySelector("#confirmSensorDelete");

  confirmModal.addEventListener("click", () => {
    const extractSensorInDb = ref(database, `SensorLocations/${sensorid}`);
    remove(extractSensorInDb)
      .then(() => {
        console.log(`Sensor: ${sensorid} is deleted`);
      })
      .catch((e) => {
        console.log(e.message);
      });
    const extractSensorDataInDb = ref(database, `Sensors/${sensorid}`);
    remove(extractSensorDataInDb)
      .then(() => {
        location.reload();
        console.log(`Sensor: ${sensorid} is deleted`);
      })
      .catch((e) => {
        console.log(e.message);
      });
  });
};

const editSensor = (sensorid, sensorsArray) => {
  const foundSensor = sensorsArray.find(
    (sensor) => sensor.sensorN === sensorid
  );

  if (foundSensor) {
    const editButton = document.querySelector("#editButtonModal");
    const nameInput = document.querySelector("#editnameInput");
    let locationInput = document.querySelector("#editlocationInput");
    let latitudeInput = document.querySelector("#editlatitude");
    let longitudeInput = document.querySelector("#editlongitude");
    // let stringPathInput = document.querySelector("#editstringPath");

    // Set initial values
    nameInput.value = foundSensor.sensorN;
    locationInput.value = foundSensor.sensor;
    latitudeInput.value = foundSensor.sensorCoords[0];
    longitudeInput.value = foundSensor.sensorCoords[1];
    // stringPathInput.value = foundSensor.sensorP;

    editButton.addEventListener("click", () => {
      // Update values when the button is clicked
      const updatedLocation = locationInput.value;
      const updatedLatitude = latitudeInput.value;
      const updatedLongitude = longitudeInput.value;
      // const updatedStringPath = stringPathInput.value;

      if (
        updatedLocation !== "" &&
        updatedLatitude !== "" &&
        updatedLongitude !== ""
        // updatedStringPath !== ""
      ) {
        const updatedSensorData = {
          coordinates: [[updatedLatitude], [updatedLongitude]],
          location: updatedLocation,
        };
        editToDatabase(nameInput.value, updatedSensorData);
        // Update the sensor in the database with updatedSensor
        // addToDatabase(updatedSensor, nameInput.value);
        // clearInputBoxes();
      }
    });
  }
};

// Adds the input to the database
const editToDatabase = (editSensorid, editInput) => {
  const stationsInDB = ref(database, `SensorLocations/${editSensorid}`);
  update(stationsInDB, editInput)
    .then(() => {
      console.log(`Data updated under ${nameInput}`);
    })
    .catch((error) => {
      console.error("Error updating data:", error);
    });
};

const createMarker = (sensorCoordinates) => {
  let flattenedCoordinates = sensorCoordinates.map((innerArray) =>
    innerArray[0].toString()
  );
  L.marker(flattenedCoordinates).addTo(map);
};

const resetTable = () => {
  const table = document.querySelector("#tableBody");
  table.innerHTML = "";
};

const createFloodTable = (
  sensorID,
  sensorLoc,
  sensorName,
  floodHeight,
  date
) => {
  const table = document.getElementById("tableBody");

  let newRow = table.insertRow();
  let nameCell = newRow.insertCell(0);
  let locCell = newRow.insertCell(1);
  let waterCell = newRow.insertCell(2);
  let dateCell = newRow.insertCell(3);
  let statusCell = newRow.insertCell(4);
  let manageCell = newRow.insertCell(5);

  // newRow.id = sensorID;
  // newRow.setAttribute("flood-level-data-row", "flood-level-data");

  nameCell.textContent = sensorLoc;
  locCell.textContent = sensorName;
  waterCell.textContent = floodHeight;
  if (date !== null) {
    let difference = getTimeDifference(date);
    let dayDiffString = `${difference["days"]} ${
      difference["days"] <= 1 ? `day` : `days`
    }`;
    let hoursDiffString = `${difference["hours"]} ${
      difference["hours"] <= 1 ? `hr` : `hrs`
    }`;
    let minsDiffString = `${difference["minutes"]} ${
      difference["minutes"] <= 1 ? `min` : `mins`
    }`;

    let timeDifference = `${dayDiffString} ${hoursDiffString} ${minsDiffString} ago`;
    dateCell.textContent = timeDifference;

    // console.log(timeDifference);
    statusCell.textContent = `${
      difference["days"] >= 1 || difference["hours"] >= 12
        ? "Inactive"
        : "Active"
    }`;
    statusCell.style.backgroundColor =
      difference["days"] >= 1 || difference["hours"] >= 12
        ? "#e34234"
        : "#77dd77";
  } else {
    dateCell.textContent = "No data";
    statusCell.textContent = "Inactive";
    statusCell.style.backgroundColor = "#e34234";
  }

  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  editButton.textContent = "Edit";
  deleteButton.textContent = "Delete";

  editButton.classList.add("btn", "btn-primary", "table-edit-btn");
  deleteButton.classList.add("btn", "btn-primary", "table-delete-btn");
  editButton.setAttribute("data-bs-toggle", "modal");
  editButton.setAttribute("data-bs-target", "#editModal");
  deleteButton.setAttribute("data-bs-toggle", "modal");
  deleteButton.setAttribute("data-bs-target", "#deleteModal");
  editButton.setAttribute("data-sensor-id", sensorLoc);
  deleteButton.setAttribute("data-sensor-id", sensorLoc);
  manageCell.appendChild(editButton);
  manageCell.appendChild(deleteButton);
};

const convertDateTime = (time) => {
  const today = new Date(time);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Get the hours and minutes from the Date object
  var hour = today.getHours();
  var minutes = today.getMinutes();

  // Format the time
  var ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  hour = hour ? hour : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const exactDate = `${formattedDate} ${hour}:${minutes}${ampm}`;
  return exactDate;
};

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

let marker2 = null; // Variable to store the marker on map2

map2.on("click", (e) => {
  const latitude = (document.querySelector("#latitude").value = e.latlng.lat);
  const longitude = (document.querySelector("#longitude").value = e.latlng.lng);

  if (marker2) {
    map2.removeLayer(marker2);
  }
  marker2 = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map2);
});

let allLocations = []; // Variable to store the marker on map2

map3.on("click", (e) => {
  allLocations.push([e.latlng.lat, e.latlng.lng]);
  const stringPath = (document.querySelector("#stringPath").value =
    allLocations);
  L.marker([e.latlng.lat, e.latlng.lng]).addTo(map3);
});

const addButton = document.querySelector("#addButtonModal");

addButton.addEventListener("click", () => {
  const nameInput = document.querySelector("#nameInput").value;
  const locationInput = document.querySelector("#locationInput").value;
  const latitude = document.querySelector("#latitude").value;
  const longitude = document.querySelector("#longitude").value;
  const stringPath = document.querySelector("#stringPath").value;
  if (
    nameInput !== "" &&
    locationInput !== "" &&
    latitude !== "" &&
    longitude !== "" &&
    stringPath !== ""
  ) {
    const newSensor = {
      coordinates: [[latitude], [longitude]],
      location: locationInput,
      stringPath: allLocations,
    };
    addToDatabase(newSensor, nameInput);
    clearInputBoxes();
  }
});

// Adds the input to the database
const addToDatabase = (newSensor, nameInput) => {
  const stationsInDB = ref(database, `SensorLocations/${nameInput}`);
  set(stationsInDB, newSensor)
    .then(() => {
      console.log(`Data added under ${nameInput}`);
    })
    .catch((error) => {
      console.error("Error adding data:", error);
    });
};

const clearInputBoxes = () => {
  document.querySelector("#nameInput").value = "";
  document.querySelector("#locationInput").value = "";
  document.querySelector("#latitude").value = "";
  document.querySelector("#longitude").value = "";
  document.querySelector("#stringPath").value = "";
};
