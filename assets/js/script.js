
        function init() {
          const cityInput = document.getElementById("cityInput");
          const searchBtn = document.getElementById("searchBtn");
          const city = document.getElementById("cityName");
          const currentIcon = document.getElementById("current-pic");
          const clearBtn = document.getElementById("clearHistory");
          const temp = document.getElementById("temp");
          const windSpd = document.getElementById("wind");
          const humidity = document.getElementById("humidity");
          const uv = document.getElementById("uv");
          const historyEl = document.getElementById("history");
          let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
        
          const APIKey = "167b57c505929b8da0a5d19017f6b443";
        
          function getWeather(cityName) {
            //calls to API to get weather data from cityInput
            let queryURL =
              "https://api.openweathermap.org/data/2.5/weather?q=" +
              cityName +
              "&appid=" +
              APIKey;
            axios.get(queryURL).then(function (response) {
              console.log(response);
        
              const date = new Date(response.data.dt * 1000);
              console.log(date);
              const day = date.getDate();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
        
              //sets search to page
              city.innerHTML =
                response.data.name + " (" + month + "/" + day + "/" + year + ") ";
              let weatherIcon = response.data.weather[0].icon;
              console.log(weatherIcon);
              currentIcon.setAttribute(
                "src",
                "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
              );
              currentIcon.setAttribute("alt", response.data.weather[0].description);
              temp.innerHTML =
                "Temperature: " + kTof(response.data.main.temp) + " &#176F";
        
              windSpd.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
              humidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
        
              let lat = response.data.coord.lat;
              let lon = response.data.coord.lon;
              let UVQueryURL =
                "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
                lat +
                "&lon=" +
                lon +
                "&appid=" +
                APIKey +
                "&cnt=1";
        
              axios.get(UVQueryURL).then(function (response) {
                let uvIndex = document.createElement("span");
                uvIndex.setAttribute("class", "badge badge-danger");
                uvIndex.innerHTML = response.data[0].value;
                uv.innerHTML = "UV Index: ";
                uv.append(uvIndex);
              });
        
              //  Using saved city name, execute a 5-day forecast get request from open weather map api
              let cityID = response.data.id;
              let forecastQueryURL =
                "https://api.openweathermap.org/data/2.5/forecast?id=" +
                cityID +
                "&appid=" +
                APIKey;
              axios.get(forecastQueryURL).then(function (response) {
                const forecastEls = document.querySelectorAll(".forecast");
                for (i = 0; i < forecastEls.length; i++) {
                  forecastEls[i].innerHTML = "";
                  const forecastIndex = i * 8 + 4;
                  const forecastDate = new Date(
                    response.data.list[forecastIndex].dt * 1000
                  );
                  const forecastDay = forecastDate.getDate();
                  const forecastMonth = forecastDate.getMonth() + 1;
                  const forecastYear = forecastDate.getFullYear();
                  const forecastDateEl = document.createElement("p");
                  forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                  forecastDateEl.innerHTML =
                    forecastMonth + "/" + forecastDay + "/" + forecastYear;
                  forecastEls[i].append(forecastDateEl);
                  const forecastWeatherEl = document.createElement("img");
                  forecastWeatherEl.setAttribute(
                    "src",
                    "https://openweathermap.org/img/wn/" +
                      response.data.list[forecastIndex].weather[0].icon +
                      "@2x.png"
                  );
                  forecastWeatherEl.setAttribute(
                    "alt",
                    response.data.list[forecastIndex].weather[0].description
                  );
                  forecastEls[i].append(forecastWeatherEl);
                  const forecastTempEl = document.createElement("p");
                  forecastTempEl.innerHTML =
                    "Temp: " +
                    kTof(response.data.list[forecastIndex].main.temp) +
                    " &#176F";
                  forecastEls[i].append(forecastTempEl);
                  const forecastWindEl = document.createElement("p");
                  forecastWindEl.innerHTML =
                    "Wind: " + response.data.list[forecastIndex].main.humidity + "MPH";
                  forecastEls[i].append(forecastWindEl);
                  const forecastHumidityEl = document.createElement("p");
                  forecastHumidityEl.innerHTML =
                    "Humidity: " +
                    response.data.list[forecastIndex].main.humidity +
                    "%";
                  forecastEls[i].append(forecastHumidityEl);
                }
              });
              //closing for OG API call//
            });
          }
        
          searchBtn.addEventListener("click", function () {
            if (cityInput.value.length == 0) {
              alert("Please Enter a City");
              console.log(city.value.length);
            } else {
              const search = cityInput.value;
              getWeather(search);
              searchHistory.push(search);
              localStorage.setItem("search", JSON.stringify(searchHistory));
              renderSearchHistory();
            }
          });
          function kTof(k) {
            return Math.floor((k - 273.15) * 1.8 + 32);
          }
        
          clearBtn.addEventListener("click", function () {
            searchHistory = [];
            renderSearchHistory();
          });
        
          function renderSearchHistory() {
            historyEl.innerHTML = "";
            for (let i = 0; i < searchHistory.length; i++) {
              const historyItem = document.createElement("input");
              historyItem.setAttribute("type", "text");
              historyItem.setAttribute("readonly", true);
              historyItem.setAttribute("class", "form-control d-block mb-2");
              historyItem.setAttribute("value", searchHistory[i]);
              historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
              });
              historyEl.append(historyItem);
            }
          }
        
          renderSearchHistory();
          if (searchHistory.length > 0) {
            getWeather(searchHistory[searchHistory.length - 1]);
          }
        }
        
        init();