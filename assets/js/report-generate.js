let button = document.getElementById("button");
button.addEventListener("click", function () {
  let doc = new jsPDF("p", "mm", "a4");
  let makePDF = document.querySelector("#makepdf");

  // fromHTML Method
  doc.fromHTML(makePDF);
  doc.save("output.pdf");
});
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getDatabase,
  query,
  ref,
  set,
  get,
  remove,
  update,
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

(async () => {
  try {
    const snapshot = await get(streetsInDB);

    resetTable();

    if (snapshot.exists()) {
      let locArray = Object.entries(snapshot.val());

      for (const [sensorLoc, sensorData] of locArray) {
        let sensorCoordinates = sensorData["coordinates"];
        let sensorName = sensorData["location"];
        let sensorPath = sensorData["stringPath"];
        sensorsArray.push({
          sensorN: sensorLoc,
          sensor: sensorName,
          sensorCoords: sensorCoordinates,
          sensorP: sensorPath,
        });

        const stations = ref(database, `Sensors/${sensorLoc}`);
        const latestQuery = query(stations, orderByKey(), limitToLast(1));
        const snap = await get(latestQuery);

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
              sensorCoordinates,
              sensorName,
              floodHeight,
              date
            );
          });
        } else {
          createFloodTable(
            sensorLoc,
            sensorLoc,
            sensorCoordinates,
            sensorName,
            "No Data",
            null
          );
        }
      }
    } else {
      console.log("failed");
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
})();

const exportExcel = document.querySelector("#export_excel");
exportExcel.addEventListener("click", () => {
  tableToExcel();
});

const tableToExcel = () => {
  var table2excel = new Table2Excel();
  table2excel.export(document.querySelectorAll("table.table"));
};

const resetTable = () => {
  const table = document.getElementById("tableBody");
  table.innerHTML = "";
  console.log("This was executed");
};

const createFloodTable = (
  sensorID,
  sensorLoc,
  sensorCoordinates,
  sensorName,
  floodHeight,
  date
) => {
  const table = document.getElementById("tableBody");

  let newRow = table.insertRow();
  let nameCell = newRow.insertCell(0);
  let locCell = newRow.insertCell(1);
  let coordCell = newRow.insertCell(2);
  let waterCell = newRow.insertCell(3);
  let dateCell = newRow.insertCell(4);
  let statusCell = newRow.insertCell(5);
  let manageCell = newRow.insertCell(6);

  // newRow.id = sensorID;
  // newRow.setAttribute("flood-level-data-row", "flood-level-data");

  nameCell.innerHTML = sensorLoc;
  locCell.innerHTML = sensorName;
  coordCell.innerHTML = `Latitude: ${sensorCoordinates[0]}<br/>Longitude: ${sensorCoordinates[1]}`;
  waterCell.innerHTML = floodHeight;
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

    let timeDifference = `${dayDiffString}<br/>${hoursDiffString}<br/>${minsDiffString} ago`;
    dateCell.innerHTML = convertDateTime(date);

    // console.log(timeDifference);
    statusCell.innerHTML = `${
      difference["days"] >= 1 || difference["hours"] >= 12
        ? "Inactive"
        : "Active"
    }`;
    statusCell.style.backgroundColor =
      difference["days"] >= 1 || difference["hours"] >= 12
        ? "#e34234"
        : "#77dd77";
    manageCell.innerHTML = timeDifference;
  } else {
    dateCell.innerHTML = "No data";
    manageCell.innerHTML = "No data";
    statusCell.innerHTML = "Inactive";
    statusCell.style.backgroundColor = "#e34234";
  }
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

const dateToday = document.querySelector("#time-today");
dateToday.innerHTML = convertDateTime(Date.now());
