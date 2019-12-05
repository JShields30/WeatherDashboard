$(document).ready(function () {

    // FUNCTIONS
    function show(data) {
        return "<h2>" + data.name + moment().format(' (MM/DD/YYYY)') + "</h2>" +
            `
        <p><strong>Temperature</strong>: ${data.main.temp} °F</p>
        <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
        <p><strong>Wind Speed</strong>: ${data.wind.speed} MPH</p>`
    }
    function showUV(data) {
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        console.log(uvDisplay);
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
                $('.city-list').prepend(container);
            }
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
});
