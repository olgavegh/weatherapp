import { debugLog } from "./debug.js";
import { getDayName } from "./date.js";

const apiKeyForecast = "1a50f325d8e1c0c0ea967f6f55ae412d";
const urlForecast = "https://api.openweathermap.org/data/2.5/forecast?";

// trigger
http: document.addEventListener("cityUpdated", (event) => {
  getForecast(event.detail);
});

async function getForecast(city) {
  const queryParams = `q=${city}&units=metric&appid=${apiKeyForecast}`; // Include city, metric units, and API key
  const fullUrl = urlForecast + queryParams; // Build the full API URL

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    const forecastData = await response.json();
    debugLog(forecastData);
    const dailyData = {};

    // Filter the global list, only one max/min temperature per day
    const todayDate = new Date().toISOString().split("T")[0];

    forecastData.list.forEach((forecast) => {
      const date = forecast.dt_txt.split(" ")[0]; // Extract the date

      if (date !== todayDate) {
        if (!dailyData[date]) {
          dailyData[date] = {
            maxTemp: forecast.main.temp_max,
            minTemp: forecast.main.temp_min,
            dayName: getDayName(forecast.dt),
            icon: forecast.weather[0].icon,
          };
        } else {
          if (forecast.main.temp_max > dailyData[date].maxTemp) {
            dailyData[date].maxTemp = forecast.main.temp_max;
          }
          if (forecast.main.temp_min < dailyData[date].minTemp) {
            dailyData[date].minTemp = forecast.main.temp_min;
          }
        }
      }
    });

    // Log the weather data if in debug mode

    updateForecast(dailyData);
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function updateForecast(forecastData) {
  const container = document.getElementById("weather-forecast");
  container.innerHTML = ""; // Clear existing content

  debugLog(forecastData);

  Object.keys(forecastData).forEach((date) => {
    const previewDiv = document.createElement("div");
    previewDiv.className = "weather-forecast-preview grow";
    container.appendChild(previewDiv);

    const timeDiv = document.createElement("div");
    timeDiv.className = "forecast-day";
    timeDiv.textContent = `${forecastData[date].dayName}`;
    previewDiv.appendChild(timeDiv);

    const imgDiv = document.createElement("img");
    imgDiv.className = "icon";
    imgDiv.src = `https://openweathermap.org/img/wn/${forecastData[date].icon}@2x.png`;
    previewDiv.appendChild(imgDiv);

    const tempDiv = document.createElement("div");
    tempDiv.className = "forecast-temperature";
    tempDiv.innerHTML = `<strong class="forecast-temperature-max">${Math.round(
      forecastData[date].maxTemp
    )}°</strong><strong class="forecast-temperature-min">${Math.round(
      forecastData[date].minTemp
    )}°</strong>`;
    previewDiv.appendChild(tempDiv);
  });
}
