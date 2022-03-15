$(document).ready(function () {

    // FUNCTIONS
    function show(data) {
        return "<h3>" + data.name + moment().format(' (MM/DD/YYYY)') + "</h3>" +
            `
        <p><strong>Temperature</strong>: ${data.main.temp} °F</p>
        <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
        <p><strong>Wind Speed</strong>: ${data.wind.speed} MPH</p>`
    }
    function showUV(data) {
        return `
        <p><strong>UV Index:</strong>:${data.value}</p>
        `
    }

    function displayCities(cityList) {
        $('.city-list').empty();
        var list = localStorage.getItem("cityList");
        cityList = (JSON.parse(list));

        if (list) {
            for (var i = 0; i < cityList.length; i++) {
                var container = $("<div class=card></div>").text(cityList[i]);
                container.click(function(target) {
                    getWeatherForecast(target.target.innerText);
                });

                $('.city-list').prepend(container);
            }
        }
    }
    function getWeatherForecast(city) {
      
        cityList.push(city);
       
        localStorage.setItem("cityList", JSON.stringify(cityList));
      
        displayCities(cityList);
        if (city != '') {

            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather?q=' 
                + city + "&units=imperial" + 
                "&APPID=48bc438037e2bdcc406efdc80b46134e",
                type: "GET",
                success: function (data) {
                    var display = show(data);
                    $("#currentW").html(display);
                    console.log(data);
                    console.log("call the ajax");
                    $.ajax({
                        url: 'https://api.openweathermap.org/data/2.5/uvi?' + "APPID=48bc438037e2bdcc406efdc80b46134e" + "&lat=" + data.coord.lat + "&lon=" + data.coord.lon,
                        type: "GET",
                        success: function (data) {
                            var uvDisplay = showUV(data);
                            console.log(uvDisplay);
                            $("#currentW").append(uvDisplay);
                        }
                });
            
            }});

            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=48bc438037e2bdcc406efdc80b46134e",
                type: "GET",
                success: function (data) {
                    var forecastDisplay = showForecast(data)
                    // add to page
                }
            });

        } else {
            $('#error').html('Please insert a city name:');
        }
    }

    function showForecast(data) {
        var forecast = data.list; // [{},{},{}]
        
        var currentForecast = [];
        for (var i = 0; i < forecast.length; i++) {

            var currentObject = forecast[i];
          
            var dt_time = currentObject.dt_txt.split(' ')[1] 
            if (dt_time === "12:00:00") {
        
                var main = currentObject.main;

                var temp = main.temp;

                var humidity = main.humidity;
                var date = moment(currentObject.dt_txt).format('l'); 
                var icon = currentObject.weather[0].icon;
                var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";

                let htmlTemplate = `
            <div class="col-sm currentCondition">
            <div class="card">
                <div class="card-body 5-day">
                    <p><strong>${date}</strong></p>
                    <div><img src=${iconurl} /></div>
                    <p>Temp: ${temp} °F</p>
                    <p>Humidity: ${humidity}%</p>
                </div>
            </div> 
        </div>`;
                currentForecast.push(htmlTemplate);
            }
        }
        $("#5-day-forecast").html(currentForecast.join(''));
    }
    var stored = localStorage.getItem("cityList")
    if (stored) {
        cityList = JSON.parse(stored)
    } else {
        cityList = []
    }
   
    $('#submitCity').click(function (event) {
        event.preventDefault();
        var city = $('#city').val();
        getWeatherForecast(city);
    });
    
displayCities(cityList);

});
