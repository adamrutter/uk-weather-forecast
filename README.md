# Weather Forecast

A small web page providing UK weather forecasts, built as a beginner JavaScript project.

It uses the Google Geolocation API to locate the user, the Google Geocoding API to provide a search functionality, and the Open Weather Map API to provide forecasts.

## Locating the user

We need to know where the user wants a forecast for; there are two methods used for this.

Geolocation is used to provide a forecast for the user's current location, and Geocoding is used to allow the user to search for other locations.

In both cases we are returned an object that we can take a latitude and longitude from.

### Geolocation

This is used for the initial forecast. Once the DOM has loaded, the location of the user is requested using the Geolocation API.

### Geocoding

Used to find the forecast for a searched location. We take the content from the submitted search form, and use it to query the Geolocation API to find its latitude and longitude.

## Getting the forecast

Once we have the location, we can query the Open Weather Map API using the provided latitude and longitude. The API returns us an object containing the forecast for the closest possible location.

## Formatting and appending the forecast

We can now loop through the 3 hourly forecasts, format them, and append them to the document.

### Formatting

#### Time

Open Weather Map provides the date and time as a single string, so we need to extract the hours/minutes and ensure they are padded with 0s.

#### Icon

We choose the correct icon with a `switch` statement, using the code that Open Weather Map provides with the forecast. We take that code and switch it with an HTML element that provides the icon.

#### Temperature

We round the provided temperature and add the '°C' unit to it.

#### Wind

Open Weather Map provides wind direction and speed. We round the speed and convert it from m/s to mph.

### Appending

Each day of the 5 day forecast is separated into its own tab. We need to determine the correct tab by how many days ahead of the current day the forecast is.

Once we have the correct tab we add the time, the icon, the temperature and the wind speed.

We use the provided wind direction to rotate the icon that now contains the wind speed, to indicate wind direction visually.
