//GIVEN a weather dashboard with form inputs
//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history
//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
//WHEN I view the UV index
//THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
//WHEN I view future weather conditions for that city
//THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
//WHEN I click on a city in the search history
//THEN I am again presented with current and future conditions for that city
//WHEN I open the weather dashboard
//THEN I am presented with the last searched city forecast
//Local storage
var inputEl = document.querySelector("city-input");
var clearEl = document.querySelector("clear-history");
var historyEl = document.querySelector("history");
var searchHist = JSON.parse(localStorage.getItem(inputEl)) || [];

$("#search-button").click(function (event) {
  event.preventDefault();
  var citySearch = $("#city-input").val();
  // console.log(citySearch);
  // if (citySearch != "") {

  
  var APIKey = "&APPID=166a433c57516f51dfab1f7edaed8413";

  // Here we are building the URL we need to query the database
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&units=imperial" + APIKey;

  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET",
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function (response) {
      // Log the queryURL
      console.log(queryURL);

      // Log the resulting object
      console.log(response);

      // Transfer content to HTML

      $("#city-name").html("<h1>" + response.name + " Weather Details</h1>");
      $("#wind-speed").text("Wind Speed: " + response.wind.speed);
      $("#humidity").text("Humidity: " + response.main.humidity);

      // Convert the temp to fahrenheit
      var tempF = (response.main.temp - 273.15) * 1.8 + 32;

      // add temp content to html
      $("#temperature").text("Temperature (F) " + response.main.temp);
      // $("#temperature").text("Temperature (F): " + tempF.toFixed(2));

      //add date to current weather
      const currentDate = new Date(response.dt * 1000);
      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();
      var dateHeader = month + "/" + day + "/" + year;
      $("#current-date").text(dateHeader);
      console.log(dateHeader);

      //weather icon

      var weatherIcon = response.weather[0].icon;
      var imageURL = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
      var currentPic = $("#current-pic").attr("src", imageURL, "alt", "weather icon");
      $("#current-pic").append(currentPic);
      console.log(currentPic);
      // weather description

      var descriptionTag = response.weather[0].description;
      var descripT = $("#description").html(descriptionTag);
      $(".description").append(descripT);
      // UV index
      var latt = response.coord.lat;
      var lon = response.coord.lon;

      var UVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
        latt +
        "&lon=" +
        lon +
        APIKey;
      console.log(UVQueryURL);

      $.ajax({
        url: UVQueryURL,
        method: "GET",
      }).then(function (uvIndex) {
        console.log(uvIndex);

        var uvIndexDisplay = $("<button>");
        uvIndexDisplay.addClass("btn btn-danger");

        $("#UV-index").text("UV Index: ");
        $("#UV-index").append(uvIndexDisplay.text(uvIndex[0].value));
        console.log(uvIndex[0].value);
      });
      fiveDay(citySearch);
      //     // }else {
      //     // $("#error").html(" field cannot be empty");
    });
});

//Five day forcast
function fiveDay(citySearch) {
  var queryFiveDayURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    citySearch +
    "&units=imperial&APPID=166a433c57516f51dfab1f7edaed8413";

  $.ajax({
    url: queryFiveDayURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    var fiveDayForcastEls = document.querySelectorAll(".fiveday");
    for (var i = 0; i < fiveDayForcastEls.length; i++) {
      fiveDayForcastEls[i].innerHTML = "";
      var castIndex = i * 8 + 4;
      var forcastDate = new Date(response.list[castIndex].dt * 1000);
      var forcastDay = forcastDate.getDate();
      var forcastMonth = forcastDate.getMonth() + 1;
      var forcastYear = forcastDate.getFullYear();
      var forcastHeader = forcastMonth + "/" + forcastDay + "/" + forcastYear;
      var forcastDateEl = document.createElement("p");
      forcastDateEl.setAttribute("class", "mt-3 mb-0 forcast-date");
      forcastDateEl.innerHTML = forcastHeader;
      fiveDayForcastEls[i].append(forcastDateEl);
      var forecastWeatherEl = document.createElement("img");
      forecastWeatherEl.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + response.list[castIndex].weather[0].icon + "@2x.png"
      );
      forecastWeatherEl.setAttribute("alt", response.list[castIndex].weather[0].description);
      fiveDayForcastEls[i].append(forecastWeatherEl);
      var forecastTempEl = document.createElement("p");
      forecastTempEl.innerHTML = "Temp: " + response.list[castIndex].main.temp + " &#176F";
      fiveDayForcastEls[i].append(forecastTempEl);
      var forecastHumidityEl = document.createElement("p");
      forecastHumidityEl.innerHTML = "Humidity: " + response.list[castIndex].main.humidity + "%";
      fiveDayForcastEls[i].append(forecastHumidityEl);
    }
  });
}

