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
      data: [0, 10, 11, 25, 30, 37, 48, 20, 56, 45, 70, 127],
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

var options = {
  series: [
    {
      data: [20.32, 25.4, 33.02, 48.26, 66.04, 93.98, 114.3, 152.4, 240],
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

var today = new Date();

// Get the current date in various formats
var year = today.getFullYear(); // 4-digit year (e.g., 2023)
var month = today.getMonth() + 1; // Month (0-11, so add 1 to get the correct month)
var day = today.getDate(); // Day of the month (1-31)
var dayOfWeek = today.getDay();

document.querySelector(".charts-card .chart-title").innerHTML =
  month + " - " + day + " - " + year;
