// Weather Elements
let weatherLocation = $(".selected-location");
let weatherIcon = $(".current-icon");
let weatherTemp = $(".temp");
let weatherhumidity = $(".humidity");
let weatherUVI = $(".uv-index");
let weatherWind = $(".wind-speed");
let infoP = $(".info-text");
const apiKey = "49d82133a18c21e234624d6c9573bfe7";

let weather = {
  location: "",
  windSpeed: "",
  description: "",
  humidity: "",
  iconURL: "",
  uvi: "",
};

let forecast = [
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

let recentSearches = [];
let searchLocation = "";
let currentLocation = "";

let useCurrent = false;
let searchClick = false;

function success(postion) {
  const longitude = postion.coords.longitude;
  const latitude = position.coords.latitude;
  useCurrent = true;
  currentLocation =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    apiKey +
    "&units=imperial";
}

var requestURL =
  "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" +
  city +
  "&appid=" +
  apiKey;

$.ajax({
  url: requestURL,
  method: "GET",
}).then(function (response) {
  console.log(response);
});
