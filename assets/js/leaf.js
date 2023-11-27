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

function createButton(label, container) {
  var btn = L.DomUtil.create("button", "", container);
  btn.setAttribute("type", "button");
  btn.classList.add("btn", "btn-primary", "map-btn");
  btn.innerHTML = label;
  return btn;
}

var control = L.Routing.control({
  waypoints: [
    L.latLng(14.563586035304027, 120.99475618985656),
    L.latLng(14.57031533402106, 120.99156564740088),
  ],
  show: true,
  position: "topright",
  showAlternatives: true,
  lineOptions: {
    styles: [
      { color: "black", opacity: 1, weight: 9 },
      { color: "white", opacity: 0.8, weight: 6 },
      { color: "#8fd400", opacity: 1, weight: 8 }, // Adjust the weight property for thickness
    ],
  },
  altLineOptions: {
    styles: [
      { color: "black", opacity: 1, weight: 9 },
      { color: "white", opacity: 0.8, weight: 6 },
      { color: "#00ccff", opacity: 1, weight: 8 },
    ],
  },
  geocoder: L.Control.Geocoder.nominatim(),
}).addTo(map);

map.on("click", function (e) {
  var container = L.DomUtil.create("div"),
    startBtn = createButton("Start from this location", container),
    destBtn = createButton("Go to this location", container);

  L.popup().setContent(container).setLatLng(e.latlng).openOn(map);

  L.DomEvent.on(startBtn, "click", function () {
    control.spliceWaypoints(0, 1, e.latlng);
    map.closePopup();
  });

  L.DomEvent.on(destBtn, "click", function () {
    control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
    map.closePopup();
  });
});

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
  if (snapshot.exists()) {
    let sensorsArray = Object.keys(snapshot.val());

    sensorsArray.forEach((stationName) => {
      // console.log(stationName);
      const stations = ref(database, `Sensors/${stationName}`);
      const latestQuery = query(stations, orderByKey(), limitToLast(1));
      onValue(latestQuery, (snap) => {
        if (snap.exists()) {
          let stationArray = Object.entries(snap.val());

          stationArray.map((arr) => {
            arr.push(stationName);
            allFloodSensor.push(arr);
          });
        } else {
          console.log("Wala");
        }
      });
    });
  } else {
    console.log("failed");
  }
  safetyRouteMap(allFloodSensor);
});

// Create the user table
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
            let path = arr[1]["stringPath"];
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

    message = `${station}`;
  } else if (height >= 33.02 && height < 66.04) {
    statusColor = "#fdfd96";
    message = `${station}`;
  } else if (height >= 66.04) {
    statusColor = "#ff6347";
    message = `${station}`;
  } else {
    statusColor = "#87ceeb";
    message = `${station}`;
  }
  let poly = L.polyline([path], {
    color: statusColor,
    weight: 30,
    opacity: 0.6,
  });
  poly.addTo(map);
  L.tooltip(flattenedCoordinates, {
    content: message,
    permanent: true,
  })
    .setContent(message)
    .addTo(map);
};
