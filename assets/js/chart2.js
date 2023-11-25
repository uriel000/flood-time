// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

import {
  getDatabase,
  query,
  ref,
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
const streetsInDB = ref(database, "Sensors");
let listOfStreets = [];

// Keep track of ApexCharts instances
const chartInstances = {};

get(streetsInDB).then((snapshot) => {
  if (snapshot.exists()) {
    const locArray = Object.keys(snapshot.val());
    locArray.forEach((sensorID) => {
      listOfStreets.push(sensorID);
    });
  } else {
    console.log("No data available");
  }

  listOfStreets.forEach((station) => {
    const sensorsInDB = ref(database, `Sensors/${station}`);
    const latestQuery = query(sensorsInDB, orderByKey(), limitToLast(12));

    onValue(latestQuery, (snapshot) => {
      let floodData = [];
      let floodDate = [];

      if (snapshot.exists()) {
        let locArray = Object.entries(snapshot.val());

        locArray.forEach((arr) => {
          const sensorID = arr[0];
          const sensorData = arr[1]["height"];
          const sensorTime = arr[1]["date"];

          // Convert the timestamp to a Date object
          const today = new Date(sensorTime);
          //
          // Get the hours and minutes from the Date object
          const hour = today.getHours();
          const minutes = today.getMinutes();

          // Format the time
          const ampm = hour >= 12 ? "pm" : "am";
          const formattedDate = `${hour}:${
            minutes < 10 ? "0" : ""
          }${minutes}${ampm}`;
          //   console.log(sensorID, " : ", sensorData, " | ", formattedDate);

          floodData.push(sensorData);
          floodDate.push(formattedDate);
        });

        // Call printChart inside the onValue callback
        printChart(station, floodData, floodDate);
      } else {
        console.log("No data available for", station);
      }
    });
  });
});

// const resetTable = () => {
//   const table = document.getElementById("tableBody");
//   table.innerHTML = "";
// };

const printChart = (station, floodData, floodDate) => {
  const allChartsParent = document.querySelector("#all-charts");

  // Check if chart instance exists
  if (chartInstances[station]) {
    // Update the existing chart
    chartInstances[station].updateSeries([{ data: floodData }]);
    chartInstances[station].updateOptions({ xaxis: { categories: floodDate } });
  } else {
    // Create a new chart instance
    const childDiv = document.createElement("div");
    let newDiv = document.createElement("div");
    let newPTitle = document.createElement("p");
    newDiv.id = station;
    newDiv.className = "realtime-chart";
    childDiv.className = "realtime-chart-parent-div";
    newPTitle.className = "charts-title";
    newPTitle.innerText = `${station} realtime chart`;

    var options = {
      chart: {
        height: 320,
        type: "area",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
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

    var chart = new ApexCharts(newDiv, options);
    childDiv.append(newPTitle);
    childDiv.append(newDiv);
    allChartsParent.append(childDiv);
    chart.render();

    // Save the chart instance
    chartInstances[station] = chart;
  }
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
