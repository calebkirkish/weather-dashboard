// Current Weather elements
var wLocation = $(".selected-location");
var wIcon = $(".current-icon");
var wTemp = $(".temp");
var wHumidity = $(".humidity");
var wWind = $(".wind-speed");
var wUVI = $(".uv-index");
var infoP = $(".info-text");
const apiKey = "49d82133a18c21e234624d6c9573bfe7";

var theWeather = {
  location: "",
  windSpeed: "",
  description: "",
  humidity: "",
  iconURL: "",
  uvi: "",
};

var theForecast = [
  {
    day: 1,
    date: "",
    icon: "",
    temp: "",
    humidity: "",
  },
  {
    day: 2,
    date: "",
    icon: "",
    temp: "",
    humidity: "",
  },
  {
    day: 3,
    date: "",
    icon: "",
    temp: "",
    humidity: "",
  },
  {
    day: 4,
    date: "",
    icon: "",
    temp: "",
    humidity: "",
  },
  {
    day: 5,
    date: "",
    icon: "",
    temp: "",
    humidity: "",
  },
];

var recentSearches = [];

// location variables
var defaultLocation = "seattle";
var searchLocation = "";
var currentLocation = "";

// Status variables
var useCurrent = false;
var searchClick = false;

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  useCurrent = true;
  currentLocation =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    apiKey +
    "&units=imperial";
  infoP.css("display", "none");
  // console.log(currentLocation);
  weatherStuff(currentLocation);
}

function error() {
  infoP.text("Unable to retrieve your location");
}

function searchList() {
  if (!recentSearches.includes(searchLocation) && searchLocation) {
    recentSearches.unshift(searchLocation);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));

    makeButtons();
  }
}

function makeButtons() {
  var searchBtns = $("#recent-searches");
  searchBtns.empty();
  recentSearches.forEach((item) => {
    var newBtn = $("<button>");
    newBtn.addClass("btn btn-secondary");
    newBtn.attr("type", "button");
    newBtn.text(item);

    searchBtns.append(newBtn);
  });
}

function weatherStuff(location) {
  useCurrent
    ? (theWeather.location = "Your Location")
    : (theWeather.location = location);
  var lat = "";
  var lon = "";
  var query = location; // Text from search or default or current
  var queryURL = "";

  useCurrent
    ? (queryURL = currentLocation)
    : (queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        query +
        "&appid=" +
        apiKey +
        "&units=imperial");

  var forecastURL = "";

  $.get(queryURL, function (weatherData) {
    //   console.log(weatherData);
    theWeather.temp = Math.round(weatherData.main.temp);
    theWeather.windSpeed = weatherData.wind.speed;
    theWeather.humidity = weatherData.main.humidity;
    theWeather.description = weatherData.weather[0].description;
    var icon = weatherData.weather[0].icon;
    theWeather.iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

    lat = weatherData.coord.lat;
    //   console.log(lat);
    lon = weatherData.coord.lon;

    // Set html with values
    wLocation.text(theWeather.location);
    wTemp.text(theWeather.temp);
    wHumidity.text(theWeather.humidity);
    wIcon.attr("src", theWeather.iconURL);
    wWind.text(theWeather.windSpeed);

    //   console.log(lon);

    forecastURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=hourly,minutely&appid=" +
      apiKey +
      "&units=imperial";

    $.get(forecastURL, function (forecastData) {
      // console.log(forecastData);
      theWeather.uvi = forecastData.current.uvi;
      wUVI.text(theWeather.uvi);

      for (var i = 0; i < 5; i++) {
        var day = forecastData.daily[i + 1];
        // console.log(day);
        var date = moment.unix(day.dt).format("ddd, MM/DD");
        // console.log(theForecast[i]);
        theForecast[i]["date"] = date;
        theForecast[i]["temp"] = Math.round(day.temp.day);
        theForecast[i]["humidity"] = day.humidity;
        var iconID = day.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + iconID + "@2x.png";
        theForecast[i]["icon"] = iconURL;
        // console.log(theForecast); // returns object
      }

      var forecastTile = $(".tile");
      forecastTile.each(function (i, element) {
        $(element).find(".date").text(theForecast[i].date);
        $(element).find(".future-temp").text(theForecast[i].temp);
        $(element).find(".future-humidity").text(theForecast[i].humidity);
        $(element).find(".fas").css("display", "none");
        $(element).find(".weather-icon").attr("src", theForecast[i].icon);
      });
    });
  })
    .done(function () {
      // console.log("found");
      infoP.css("display", "none");

      // Wont log search if it it was for current location
      if (searchClick) {
        searchList();
        searchClick = false;
      }
    })
    // if search location cant be found or there is no text in search field
    .fail(function () {
      if (searchLocation) {
        infoP.text("Could not find " + searchLocation);
        infoP.css("display", "block");
      } else {
        infoP.text("Please enter a location");
        infoP.css("display", "block");
      }
      searchClick = false;
      failure = true;
      // console.log("Failure to search");
    });
}

$(document).ready(function () {
  if (localStorage.getItem("recentSearches")) {
    recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    makeButtons();
    // Use most recent search if present
    weatherStuff(recentSearches[0]);
  } else {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    weatherStuff(defaultLocation);
  }
  // Default location on load is Seattle

  $("#recent-searches").on("click", "button", function () {
    useCurrent = false;
    var recentLocation = $(this).text();
    weatherStuff(recentLocation);
  });

  // Current Location Button
  $("#current-btn").on("click", function () {
    $("#city-search").val("");
    infoP.css("display", "block");
    if (!navigator.geolocation) {
      infoP.text("Geolocation is not supported by your browser");
    } else {
      infoP.text("Locating…");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  });

  // Search Button
  $("#search-btn").on("click", function () {
    searchClick = true;
    useCurrent = false;
    infoP.css("display", "none");

    searchLocation = $("#city-search").val().trim();
    $("#city-search").val("");
    // console.log(searchLocation);
    // console.log(recentSearches);

    weatherStuff(searchLocation);
  });

  // Enter on search. triggers click event on button
  $("#city-search").on("keypress", function (e) {
    if (e.which == 13) {
      $("#search-btn").click();
    }
  });
});
