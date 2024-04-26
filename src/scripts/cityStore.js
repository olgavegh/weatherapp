let currentCity = "Budapest"; // Set Budapest as the default city
let targetErr = document.getElementById("error");

export function setCity(city) {
  currentCity = city;
  // Trigger the weather update whenever the city is set or updated
  document.dispatchEvent(
    new CustomEvent("cityUpdated", { detail: currentCity })
  );
  targetErr.textContent = "";
}

export function getCity() {
  return currentCity;
}

// Initialize the form listener and the default city trigger in this module
document.addEventListener("DOMContentLoaded", () => {
  // Fetch weather for the default city on initial load
  setCity(currentCity); // This will also trigger the cityUpdated event

  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const input = document.getElementById("cityInput");
    const city = input.value.trim();
    if (city) {
      setCity(city); // This sets the new city and triggers the update via setCity
      input.value = ""; // Clear the input after submission
    }
  });
});
