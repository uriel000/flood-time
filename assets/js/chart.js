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
      data: [100, 110, 90, 120, 140, 135, 160, 150, 170, 180, 190, 200],
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
    categories: [
      "12am",
      "2am",
      "4am",
      "6am",
      "8am",
      "10am",
      "12pm",
      "2pm",
      "4pm",
      "6pm",
      "8pm",
      "10pm",
    ],
  },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();

var today = new Date();

// Get the current date in various formats
var year = today.getFullYear(); // 4-digit year (e.g., 2023)
var month = today.getMonth() + 1; // Month (0-11, so add 1 to get the correct month)
var day = today.getDate(); // Day of the month (1-31)
var dayOfWeek = today.getDay();

document.querySelector(".charts-card .chart-title").innerHTML =
  month + " - " + day + " - " + year;
