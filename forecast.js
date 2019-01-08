// Function to append a forecast to the page
function appendForecast(forecast, currentTable) {
  // Get rows from the current table
  const timeRow = currentTable.querySelector('.time');
  const iconRow = currentTable.querySelector('.icon');
  const tempRow = currentTable.querySelector('.temp');
  const windRow = currentTable.querySelector('.wind');

  // Add forecast time to the table
  const newTimeElement = document.createElement('TD');
  newTimeElement.textContent = forecast.time;
  timeRow.appendChild(newTimeElement);

  // Add forecast icon to the table
  const newIconElement = document.createElement('TD');
  newIconElement.innerHTML = forecast.icon;
  iconRow.appendChild(newIconElement);

  // Add forecast temperature to the table
  const newTempElement = document.createElement('TD');
  newTempElement.textContent = forecast.temp;
  tempRow.appendChild(newTempElement);

  // Add wind details to the table
  const newWindElement = document.createElement('TD');

  const windSpeedElement = document.createElement('DIV');
  windSpeedElement.classList.add('windspeed', 'container');
  windSpeedElement.textContent = forecast.wind.speed;

  const windDirElement = document.createElement('IMG');
  windDirElement.src = 'img/arrow.svg';
  windDirElement.style.transform = 'rotate(' + forecast.wind.direction + 'deg)';

  newWindElement.appendChild(windSpeedElement);
  newWindElement.appendChild(windDirElement);
  windRow.appendChild(newWindElement);
}

// Function to determine the id, which is the number of days ahead the forecast is
function dayId(forecastDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const forecastDay = new Date(forecastDate);
  forecastDay.setHours(0, 0, 0, 0);

  return Math.round(Math.abs((today - forecastDay) / (24 * 60 * 60 * 1000)));
}

// Make first forecast active
function makeActive() {
  const firstForecast = document.querySelector('.forecast.container td').parentNode.parentNode.parentNode; // Finds the first forecast by searching for the first td element and travesing up the dom
  const firstForecastTabId = 'tab' + firstForecast.id.slice(3);
  const firstForecastTab = document.getElementById(firstForecastTabId);

  // Disable any previous active tab or active table if there are any
  if (document.querySelector('.forecast.container table.active')) {
    document.querySelector('.forecast.container table.active').classList.remove('active');
  }

  if (document.querySelector('.tab.container li.active')) {
    document.querySelector('.tab.container li.active').classList.remove('active');
  }

  firstForecast.classList.add('active');
  firstForecastTab.classList.add('active');
}

// Hide empty tabs
function hideEmpty() {
  const tabs = document.querySelectorAll('.tab.container li');

  tabs.forEach((tab) => {
    if (!tab.textContent) {
      tab.style.flexGrow = 0;
    }
  });
}

// Function to add an icon, based on the icon code from Open Weather Map
function weatherIcon(code) {
  switch (code) {
    case '01d':
      return '<i class="wi wi-day-sunny"></i>';
    case '01n':
      return '<i class="wi wi-night-clear"></i>';
    case '02d':
      return '<i class="wi wi-day-cloudy"></i>';
    case '02n':
      return '<i class="wi wi-night-alt-cloudy"></i>';
    case '03d':
      return '<i class="wi wi-cloud"></i>';
    case '03n':
      return '<i class="wi wi-cloud"></i>';
    case '04d':
      return '<i class="wi wi-cloudy"></i>';
    case '04n':
      return '<i class="wi wi-cloudy"></i>';
    case '09d':
      return '<i class="wi wi-day-rain"></i>';
    case '09n':
      return '<i class="wi wi-night-alt-rain"></i>';
    case '10d':
      return '<i class="wi wi-rain"></i>';
    case '10n':
      return '<i class="wi wi-rain"></i>';
    case '11d':
      return '<i class="wi wi-thunderstorm"></i>';
    case '11n':
      return '<i class="wi wi-thunderstorm"></i>';
    case '13d':
      return '<i class="wi wi-snow"></i>';
    case '13n':
      return '<i class="wi wi-snow"></i>';
    case '50d':
      return '<i class="wi wi-fog"></i>';
    case '50n':
      return '<i class="wi wi-fog"></i>';
    default:
      return '<i class="wi wi-na"></i>';
  }
}

// Format the fetched json data
function formatData(forecast, forecastDate) {
  const formattedData = {
    time: forecastDate.getHours().pad(2) + ':' + forecastDate.getMinutes().pad(2),
    icon: weatherIcon(forecast.weather[0].icon),
    temp: Math.round(forecast.main.temp) + '°C',
    wind: {
      speed: Math.round(forecast.wind.speed * 2.23694),
      direction: forecast.wind.deg,
    },
  };
  return formattedData;
}

// Function to name individual tabs
function nameTab(todayDate, forecastDate) {
  const tabId = 'tab' + dayId(forecastDate);
  const tabButton = document.getElementById(tabId);
  const dayName = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  if (!tabButton.textContent) {
    tabButton.textContent = dayName[forecastDate.getDay()];
  }

  // Change the tab name to today if it represents today
  if (tabButton.textContent === dayName[todayDate.getDay()]) {
    tabButton.textContent = 'Today';
  }
}


// Main function to generate and append a weather forecast
function getWeather(location) {

  // Construct api query for Open Weather Map
  const apiKey = '4d5128da40eb9555a11cfde0c4a093c8';
  const apiEndpoint = 'http://api.openweathermap.org/data/2.5/forecast?';
  const latitude = location.latitude;
  const longitude = location.longitude;
  const units = 'metric';
  const apiQuery = apiEndpoint + 'lat=' + latitude + '&lon=' + longitude + '&units=' + units + '&appid=' + apiKey;

  // Fetch data from Open Weather Map
  fetch(apiQuery)
    .then(response => response.json())
    .then((jsonResponse) => {

      // Loop through all forecast data and append to the document
      for (let i = 0; i < jsonResponse.list.length; i++) {
        const forecast = jsonResponse.list[i];
        const todayDate = new Date();
        const forecastDate = new Date(forecast.dt_txt);
        const tableId = 'day' + dayId(forecastDate);
        const currentTable = document.getElementById(tableId);

        // Formate and append data to the document
        appendForecast(formatData(forecast, forecastDate), currentTable);

        // Add the day to the tab bar if it is not there already
        nameTab(todayDate, forecastDate);
      }

      // Append the forecast location to the page
      document.getElementById('location').textContent = jsonResponse.city.name;

      // Make first forecast active
      makeActive();

      // Hide any empty tabs
      hideEmpty();
    });
}

// Get location of user and call the getWeather function
function getLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    getWeather(location);
  });
}

// Change tabs
function changeTabs() {
  const tabContainer = document.querySelector('.tab.container');
  const forecastTables = document.querySelectorAll('.forecast.container table');

  // Add event listener to the tab container
  tabContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      const targetForecast = 'day' + e.target.id.slice(3);

      // Switch active content
      forecastTables.forEach((forecast) => {
        if (forecast.id === targetForecast) {
          forecast.classList.add('active');
        } else {
          forecast.classList.remove('active');
        }
      });

      // Switch active tab
      tabContainer.querySelectorAll('li').forEach((tab) => {
        if (tab === e.target) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }
  });
}

// Remove forecasts
function removeForecasts() {
  const tableRows = document.querySelectorAll('tr');
  tableRows.forEach((row) => {
    while (row.firstChild) {
      row.removeChild(row.firstChild);
    }
  });
}

// Search bar function
function locationSearch(event) {
  // Prevent the page reloading on submit event
  event.preventDefault();

  // Format the submitted string
  const address = event.target[0].value.replace(/ /g, '+');

  // Construct the api query
  const apiEndpoint = 'https://maps.googleapis.com/maps/api/geocode/';
  const responseType = 'json';
  const apiKey = 'AIzaSyBe7EjTqrbp3_mnZYoBiZMb7DMpEsONjf0';
  const region = 'uk';
  const apiQuery = apiEndpoint + responseType + '?region=' + region + '&address=' + address + '&key=' + apiKey;

  // Fetch data from google geolocate api and format
  fetch(apiQuery)
    .then(response => response.json())
    .then((jsonResponse) => {
      const location = {
        latitude: jsonResponse.results[0].geometry.location.lat,
        longitude: jsonResponse.results[0].geometry.location.lng,
      };

      // Remove previous forecast data
      removeForecasts();

      // Get new forecast
      getWeather(location);
    });

  // Reset the form input box
  const searchBar = event.target[0];
  searchBar.value = '';
}

// Function to pad numbers
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

// Event listeners

document.addEventListener('DOMContentLoaded', getLocation());
document.addEventListener('DOMContentLoaded,', changeTabs());
document.querySelector('.search.container').addEventListener('submit', event => locationSearch(event));
