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
const streetsInDB = ref(database, "Sensors");
// const latestQuery = query(sensorsInDB, orderBy(), limitToLast(5));

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

// const resetTable = () => {
//   const table = document.getElementById("tableBody");
//   table.innerHTML = "";
// };

const streetOptions = document.querySelector("#streets");

streetOptions.addEventListener("change", () => {
  const sensorsInDB = ref(database, `Sensors/${streetOptions.value}`);
  const latestQuery = query(sensorsInDB, orderByKey(), limitToLast(12));

  onValue(latestQuery, (snapshot) => {
    let floodData = [];
    let floodDate = [];

    if (snapshot.exists()) {
      let locArray = Object.entries(snapshot.val());

      locArray.map((arr) => {
        const sensorID = arr[0];
        const sensorData = arr[1]["height"];
        const sensorTime = arr[1]["date"];
        // Convert the timestamp to a Date object
        const today = new Date(sensorTime);

        // Get the hours and minutes from the Date object
        var hour = today.getHours();
        var minutes = today.getMinutes();

        // Format the time
        var ampm = hour >= 12 ? "pm" : "am";
        hour = hour % 12;
        hour = hour ? hour : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        const exactDate = `${hour}:${minutes}${ampm}`;
        console.log(sensorID, " : ", sensorData, " | ", exactDate);
        floodData.push(sensorData);
        floodDate.push(exactDate);
      });
    } else {
      console.log("failed");
    }

    // Call printChart inside the onValue callback
    printChart(floodData, floodDate);
  });
});
let defaultFloodData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let defaultFloodDate = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const printChart = (floodData, floodDate) => {
  var options = {
    chart: {
      height: 500,
      type: "area",
      // toolbar: {
      //   show: false,
      // },
    },
    dataLabels: {
      enabled: true,
    },
    series: [
      {
        name: "cm",
        data: floodData,
      },
    ],
    colors: ["#FF0080"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      theme: "dark",
    },
    xaxis: {
      categories: floodDate,
    },
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
};

var options = {
  series: [
    {
      data: [20.32, 25.4, 33.02, 48.26, 66.04, 93.98, 114.3, 152.4, 200],
    },
  ],
  chart: {
    height: 400,
    type: "bar",
    events: {
      click: function (chart, w, e) {
        // console.log(chart, w, e)
      },
    },
  },
  colors: [
    "#E0E0AD",
    "#BCBC85",
    "#f2bb05",
    "#C49D1A",
    "#124e78",
    "#194563",
    "#1F3645",
    "#d74e09",
    "#AF4C1B",
    "#904925",
  ],
  plotOptions: {
    bar: {
      columnWidth: "80%",
      distributed: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: [
      ["Gutter", "Level"],
      ["Half", "Knee", "Level"],
      ["Half", "Tire", "Level"],
      ["Knee", "Level"],
      ["Tire", "Level"],
      ["Waist", "Level"],
      ["Chest", "Level"],
      ["Head", "Level"],
      ["Above", "human", "Level"],
    ],
    labels: {
      style: {
        colors: ["black"],
        fontSize: "12px",
      },
    },
  },
};

var chart = new ApexCharts(document.querySelector("#chart2"), options);
chart.render();

var today = new Date(Date.now());

// Get the current date in various formats
var year = today.getFullYear(); // 4-digit year (e.g., 2023)
var month = today.getMonth() + 1; // Month (0-11, so add 1 to get the correct month)
var day = today.getDate(); // Day of the month (1-31)
var dayOfWeek = today.getDay();

document.querySelector(".charts-card .chart-title").innerHTML =
  month + " - " + day + " - " + year;

printChart(defaultFloodData, defaultFloodDate);
