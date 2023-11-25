// Polyline mapping
const map = L.map("map").setView([14.57031533402106, 120.99156564740088], 17);
const attribution = "";

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

var latlngs = [
  [14.563586035304027, 120.99475618985656],
  [14.57031533402106, 120.99156564740088],
  [14.576564715923581, 120.98806937928339],
  [14.582535058815736, 120.98462986820749],
];

const polyline = L.polyline(latlngs, { color: "green" }).addTo(map);

// zoom the map to the polyline
map.fitBounds(polyline.getBounds());

const temperature = document.querySelector(
  ".home-container .weather-data .temperature .temp"
);
const description = document.querySelector(
  ".home-container .weather-data .temperature .desc"
);

const maxtemperature = document.querySelector(
  ".home-container .weather-data .max-temperature .temp"
);

const mintemperature = document.querySelector(
  ".home-container .weather-data .min-temperature .temp"
);

fetch(
  "https://api.openweathermap.org/data/2.5/weather?q=Manila&appid=dc68862ea6931926eadd7ba3744280cd"
)
  .then((response) => response.json())
  .then((data) => {
    // console.log(data);
    const location = data["name"];
    const tempeValue = data["main"]["temp"] - 273.15;
    const descValue = data["weather"][0]["description"];
    const maxTemp = data["main"]["temp_max"] - 273.15;
    const minTemp = data["main"]["temp_max"] - 273.15;
    temperature.innerHTML = Math.round(tempeValue);
    maxtemperature.innerHTML = Math.round(maxTemp) + "°C";
    mintemperature.innerHTML = Math.round(minTemp) + "°C";
    description.innerHTML = descValue;
  })
  .catch((err) => console.log(err));

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getDatabase,
  query,
  ref,
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
const sensorsInDB = ref(database, "Sensors/");
let allFloodSensor = [];

onValue(sensorsInDB, (snapshot) => {
  resetTable();

  if (snapshot.exists()) {
    let maxFloodHeight = -1;
    let maxFloodSensor = null;

    let sensorsArray = Object.keys(snapshot.val());

    sensorsArray.forEach((stationName) => {
      // console.log(stationName);
      const stations = ref(database, `Sensors/${stationName}`);
      const latestQuery = query(stations, orderByKey(), limitToLast(1));
      onValue(latestQuery, (snap) => {
        if (snap.exists()) {
          let stationArray = Object.entries(snap.val());

          stationArray.map((arr) => {
            const sensorID = arr[0];
            const floodHeight = arr[1]["height"];
            const indication = arr[1]["indication"];
            const date = arr[1]["date"];
            arr.push(stationName);
            allFloodSensor.push(arr);
            // console.log(stationName);
            // console.log(arr);
            if (floodHeight > maxFloodHeight) {
              maxFloodHeight = floodHeight;
              maxFloodSensor = {
                stationName,
                sensorID,
                floodHeight,
                indication,
                date,
              };
            }
            createFloodTable(
              stationName,
              sensorID,
              floodHeight,
              indication,
              date
            );
          });
        } else {
          console.log("Wala");
        }
      });
    });
    // console.log(maxFloodSensor);
    createFloodAdvisory(maxFloodSensor);
  } else {
    console.log("failed");
  }
  safetyRouteMap(allFloodSensor);

  // console.log(allFloodSensor);
});

const resetTable = () => {
  const table = document.getElementById("tableBody");
  table.innerHTML = "";
};

const createFloodAdvisory = (maxFloodSensor) => {
  const ptag = document.querySelector("#flood-advisory");
  const leveltag = document.querySelector("#flood-advisory-water-level");
  const datetag = document.querySelector("#datetime");
  const indication = maxFloodSensor["indication"];
  const level = maxFloodSensor["floodHeight"];
  const time = maxFloodSensor["date"];
  const station = maxFloodSensor["stationName"];
  const datetimee = convertDateTime(time);

  ptag.textContent = `There's ${indication} water level in ${station}`;
  leveltag.textContent = `${level} CM`;
  datetag.textContent = datetimee;
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

// Create the user table
const createFloodTable = (
  stationName,
  sensorID,
  floodHeight,
  indication,
  date
) => {
  const table = document.getElementById("tableBody");

  let newRow = table.insertRow();
  let locCell = newRow.insertCell(0);
  let cmCell = newRow.insertCell(1);
  let inchCell = newRow.insertCell(2);
  let depthCell = newRow.insertCell(3);
  let statusCell = newRow.insertCell(4);
  newRow.id = sensorID;
  // newRow.setAttribute("flood-level-data-row", "flood-level-data");

  locCell.innerHTML = stationName;
  cmCell.innerHTML = Math.ceil(floodHeight);
  inchCell.innerHTML = Math.ceil(floodHeight / 2.54);
  depthCell.innerHTML = indication;
  let statusIndication = "";
  if (floodHeight >= 20.32 && floodHeight < 33.02) {
    statusCell.style.backgroundColor = "#d0f0c0";
    statusIndication = "PATV";
  } else if (floodHeight >= 33.02 && floodHeight < 66.04) {
    statusCell.style.backgroundColor = "#fdfd96";
    statusIndication = "NPLV";
  } else if (floodHeight >= 66.04) {
    statusCell.style.backgroundColor = "#ff6347";
    statusIndication = "NPATV";
  } else {
    statusCell.style.backgroundColor = "#87ceeb";
    statusIndication = "Safe";
  }
  statusCell.innerHTML = statusIndication;
};

const safetyRouteMap = (allSensors) => {
  allSensors.forEach((oneSensorArray) => {
    // console.log(allSensors);
    const streetsInDB = ref(database, `SensorLocations`);
    onValue(streetsInDB, (snapshot) => {
      if (snapshot.exists()) {
        let locArray = Object.entries(snapshot.val());

        locArray.map((arr) => {
          // console.log(arr[0]);
          // console.log(oneSensorArray);
          if (oneSensorArray.includes(arr[0])) {
            let station = arr[0];
            let path = JSON.parse(arr[1]["stringPath"]);
            let coord = arr[1]["coordinates"];
            let height = oneSensorArray[1]["height"];
            createPolyline(station, path, height, coord);
          }
        });
      } else {
        console.log("failed");
      }
    });
  });
};

const createPolyline = (station, path, height, coord) => {
  let statusColor = null;
  let message = "";
  const flattenedCoordinates = coord.map((innerArray) =>
    innerArray[0].toString()
  );
  if (height >= 20.32 && height < 33.02) {
    statusColor = "#d0f0c0";

    message = `${station}:<br/><span style="color:#2e8b57">It is safe to travel here.<br/>Light flooding.</span>`;
  } else if (height >= 33.02 && height < 66.04) {
    statusColor = "#fdfd96";
    message = `${station}:<br/><span style="color:#ffd800">It is not safe to travel here<br/> for light vehicles.<br/>Moderately high flooding.</span>`;
  } else if (height >= 66.04) {
    statusColor = "#ff6347";
    message = `${station}:<br/><span style="color:#ff6347">It is not safe to travel here.<br/> High level of flooding.</span>`;
  } else {
    statusColor = "#87ceeb";
    message = `${station}:<br/><span style="color:#87ceeb">It is safe to travel here. <br/> No flooding.</span>`;
  }
  let poly = L.polyline([path], {
    color: statusColor,
    weight: 20,
    opacity: 1,
  });
  poly.addTo(map);
  L.tooltip(flattenedCoordinates, {
    className: "my-tooltip",
    content: message,
    permanent: true,
  })
    .setContent(message)
    .addTo(map);
};
