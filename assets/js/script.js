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

// temperature.innerHTML = 26;
// maxtemperature.innerHTML = 27 + "°C";
// mintemperature.innerHTML = 24 + "°C";
// description.innerHTML = "Mist";
