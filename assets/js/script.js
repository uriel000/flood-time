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
    console.log(data);
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

var today = new Date();

var year = today.getFullYear();
var month = today.getMonth() + 1;
var day = today.getDate();
var dayOfWeek = today.getDay();
var hour = today.getHours();
var minutes = today.getMinutes();
var ampm = hour >= 12 ? "PM" : "AM";

hour = hour % 12;
hour = hour ? hour : 12;

minutes = minutes < 10 ? "0" + minutes : minutes;

document.querySelector(".datetime").innerHTML =
  month + "/" + day + "/" + year + " " + hour + ":" + minutes + " " + ampm;

// Change the background color based on the flood level status
const td = document.querySelectorAll(
  ".flood-level-table table tr td:nth-of-type(5)"
);

td.forEach((element) => {
  const content = element.textContent;
  if (content === "PATV") {
    element.style.backgroundColor = "#d0f0c0";
  } else if (content === "NPLV") {
    element.style.backgroundColor = "#fdfd96";
  } else if (content === "NPATV") {
    element.style.backgroundColor = "#ff6347";
  }
});

document.querySelector(".flood-level-table p .time").textContent =
  hour + " " + ampm;
