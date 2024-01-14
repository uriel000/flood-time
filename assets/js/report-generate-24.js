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
  remove,
  update,
  limitToLast,
  get,
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
const streetsInDB = ref(database, `Sensors`);

const dropdown = document.querySelector("#streets");

onValue(streetsInDB, (snapshot) => {
  dropdown.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "none";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = "Choose a street";

  dropdown.appendChild(defaultOption);
  if (snapshot.exists()) {
    let locArray = Object.keys(snapshot.val());

    locArray.map((arr) => {
      const sensorID = arr;
      let option = document.createElement("option");
      option.text = sensorID;
      option.value = sensorID;
      dropdown.add(option);
    });
  } else {
    console.log("failed");
  }
});

const streetOptions = document.querySelector("#streets");

streetOptions.addEventListener("change", async () => {
  resetTable();
  const sensorsInDB = ref(database, `Sensors/${streetOptions.value}`);
  document.querySelector(
    "#headerTitle"
  ).textContent = `${streetOptions.value}'s 24 hour Flood Data`;

  const currentTime = new Date(); // Current time

  try {
    const snapshot = await get(query(sensorsInDB, orderByKey()));

    if (snapshot.exists()) {
      let locArray = Object.entries(snapshot.val());

      locArray.forEach((arr) => {
        const sensorID = arr[0];
        const sensorData = arr[1]["height"];
        const sensorTime = new Date(arr[1]["date"]);
        const indication = arr[1]["indication"];
        const dispersion = arr[1]["dispersion"];

        // Calculate the time difference in milliseconds
        const timeDifference = currentTime - sensorTime;

        // Check if the entry is within the last 24 hours (86400000 milliseconds)
        if (timeDifference <= 86400000) {
          createFloodTable(
            sensorID,
            streetOptions.value,
            sensorData,
            indication,
            sensorTime.toString(),
            dispersion
          );
        }
      });
    } else {
      console.log("No data available.");
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
});

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
};

const createFloodTable = (
  sensorID,
  streetName,
  sensorData,
  indication,
  sensorTime,
  dispersion
) => {
  const table = document.getElementById("tableBody");

  let newRow = table.insertRow();
  let nameCell = newRow.insertCell(0);
  let waterCell = newRow.insertCell(1);
  let waterCellInch = newRow.insertCell(2);
  let indicationCell = newRow.insertCell(3);
  let statusCell = newRow.insertCell(4);
  let dateCell = newRow.insertCell(5);
  let dispersionCell = newRow.insertCell(6);
  let accuracy = newRow.insertCell(7);

  // newRow.id = sensorID;
  // newRow.setAttribute("flood-level-data-row", "flood-level-data");

  nameCell.innerHTML = streetName;
  waterCell.innerHTML = sensorData;
  let toInches = sensorData * 0.393701;
  waterCellInch.innerHTML = Number(toInches.toFixed(2));
  indicationCell.innerHTML = indication;
  dispersionCell.innerHTML = dispersion.toFixed(2);
  accuracy.innerHTML = dispersion >= 2 ? "Inaccurate" : "Accurate";

  dateCell.innerHTML = convertDateTime(sensorTime);

  let statusIndication = "";
  if (sensorData >= 20.32 && sensorData < 33.02) {
    statusCell.style.backgroundColor = "#d0f0c0";
    statusIndication = "PATV";
  } else if (sensorData >= 33.02 && sensorData < 66.04) {
    statusCell.style.backgroundColor = "#fdfd96";
    statusIndication = "NPLV";
  } else if (sensorData >= 66.04) {
    statusCell.style.backgroundColor = "#ff6347";
    statusIndication = "NPATV";
  } else {
    statusCell.style.backgroundColor = "#87ceeb";
    statusIndication = "Safe";
  }
  statusCell.innerHTML = statusIndication;
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
