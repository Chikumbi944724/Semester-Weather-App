const apikey = "2e6d7443c97d290f49e2b49310f53081";
const weburl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const submit = document.querySelector(".searchBtn");
const search = document.querySelector(".searchInput");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(cityName) {
    try {
        const response = await fetch(weburl + cityName + `&appid=${apikey}`);
        
        if (response.status == 404) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".container").style.display = "none";
            document.querySelector(".forecast").style.display = "none";
        } else {
            const data = await response.json();
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".windy").innerHTML = data.wind.speed + "km/h";
            document.querySelector(".cityName").textContent = data.name;
            
            updateWeatherIcon(data.weather[0].main);
            
            document.querySelector(".container").style.display = "block";
            document.querySelector(".error").style.display = "none";
            
            // Fetch and display forecast
            getForecast(cityName);
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

async function getForecast(cityName) {
    try {
        const response = await fetch(forecastUrl + cityName + `&appid=${apikey}`);
        const data = await response.json();
        
        if (response.ok) {
            const forecastContainer = document.querySelector(".forecast-container");
            forecastContainer.innerHTML = "";
            
            // Get one forecast per day (every 8th item as the API returns 3-hour forecasts)
            const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
            
            dailyForecasts.forEach(day => {
                const date = new Date(day.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                const forecastDay = document.createElement('div');
                forecastDay.className = 'forecast-day';
                forecastDay.innerHTML = `
                    <h3>${dayName}</h3>
                    <img src="img/${getWeatherIcon(day.weather[0].main)}" alt="${day.weather[0].main}">
                    <p>${Math.round(day.main.temp)}°C</p>
                `;
                
                forecastContainer.appendChild(forecastDay);
            });
            
            document.querySelector(".forecast").style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

function updateWeatherIcon(weatherMain) {
    const iconMap = {
        'Clouds': 'clouds.png',
        'Clear': 'clear.png',
        'Drizzle': 'drizzle.png',
        'Mist': 'mist.png',
        'Snow': 'snow.png',
        'Rain': 'rain.png'
    };
    
    weatherIcon.src = `img/${iconMap[weatherMain] || 'rain.png'}`;
}

function getWeatherIcon(weatherMain) {
    const iconMap = {
        'Clouds': 'clouds.png',
        'Clear': 'clear.png',
        'Drizzle': 'drizzle.png',
        'Mist': 'mist.png',
        'Snow': 'snow.png',
        'Rain': 'rain.png'
    };
    
    return iconMap[weatherMain] || 'rain.png';
}

submit.addEventListener("click", () => {
    const cityName = search.value.trim();
    if (cityName) {
        checkWeather(cityName);
    }
});

// Add enter key support
search.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const cityName = search.value.trim();
        if (cityName) {
            checkWeather(cityName);
        }
    }
});