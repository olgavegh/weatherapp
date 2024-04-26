import { debugLog } from "./debug.js";
import { displayEuropeanDateTime } from "./date.js";

const targetErr = document.getElementById("error");

// trigger
http: document.addEventListener("cityUpdated", (event) => {
  getWeather(event.detail);
});

const apiKey = "1a50f325d8e1c0c0ea967f6f55ae412d";
const url = "https://api.openweathermap.org/data/2.5/weather?";

async function getWeather(city) {
  const queryParams = `q=${city}&units=metric&appid=${apiKey}`; // Include city, metric units, and API key
  const fullUrl = url + queryParams; // Build the full API URL

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      targetErr.textContent = "* Not valid city name!";
      throw new Error("Network response was not ok: " + response.statusText);
    }
    const data = await response.json(); // Parse JSON response
    debugLog(data); // Log the weather data if in debug mode

    const city = data.name;
    const dateTime = displayEuropeanDateTime();
    const description = data.weather[0].description;
    const humidity = data.main.humidity + " %";
    const windSpeed = data.wind.speed + " km/h";
    const temp = Math.round(data.main.temp);
    const iconSrc = data.weather[0].icon;

    // Create the HTML content using template literals
    const weatherHTML = `
    <div class="grow">
        <h2 id="city">${city}</h2>
        <ul>
            <li><span id="date-time">${dateTime}</span></li>
            <li>Humidity: <strong id="humidity">${humidity}</strong>, Wind: <strong id="wind">${windSpeed}</strong></li>
        </ul>
    </div>
    <div class="grow">
        <div class="temperature-container">
            <img class="icon" src="https://openweathermap.org/img/wn/${iconSrc}@2x.png" alt="Weather icon">
            <h1>${temp}<sup>°C</sup></h1>
        </div>
        <div id="desc">${description}</div>
    </div>
`;

    const container = document.getElementById("weather-current");
    container.innerHTML = weatherHTML;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}
