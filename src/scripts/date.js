export function displayEuropeanDateTime() {
  const now = new Date();
  const dateString = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  const timeString = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return dateString + ", " + timeString;
  //   console.log("Current Date and Time: " + dateString + ", " + timeString);
}

export function getDayName(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  return date.toLocaleDateString("en-US", { weekday: "long" }); // Returns the name of the day
}


