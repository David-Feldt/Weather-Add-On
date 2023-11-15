const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');
const { OAuth2Client } = require('google-auth-library');
const descriptionObject = require('./weathercode.json');
// Create and configure the app
const app = express();

// Trust GCPs front end to for hostname/port forwarding
app.set("trust proxy", true);

count = 0
app.get('/', asyncHandler(async (req, res) => {
    const hourlyWeather = await hourlyWeatherAPI();
    const dailyWeather = await dailyWeatherAPI();
    console.log(dailyWeather);
    const weatherList = buildHourlyWeather(hourlyWeather);
    res.send(`New Test`);
  }));

  async function hourlyWeatherAPI() {
    try {
        const apiUrl = 'https://api.open-meteo.com/v1/gem?latitude=43.4831&longitude=-80.5339&hourly=temperature_2m,weathercode,is_day&timezone=America%2FNew_York&past_days=1&forecast_days=2'
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
      throw new Error('An error occurred while calling the API.');
    }
  }
  async function dailyWeatherAPI() {
    try {
        const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=43.4831&longitude=-80.5339&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FNew_York'
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
      throw new Error('An error occurred while calling the API.');
    }
}

  function buildHourlyWeather(hourlyWeather){
    const myTimes = hourlyWeather.hourly.time;
    const myTemps = hourlyWeather.hourly.temperature_2m;
    const myCode = hourlyWeather.hourly.weathercode;
    const myDay = hourlyWeather.hourly.is_day;
    const myLength = myTimes.length;
    const weatherList = {
        header: 'Weekly Weather',
        widgets: [],
        collapsible: true
    };
    
    const now = new Date();
    now.setMinutes(0); // Reset minutes to 0 to round to the nearest hour
    now.setSeconds(0); // Reset seconds to 0
    now.setMilliseconds(0); // Reset milliseconds to 0
    const otherTimestamp = now.toISOString().slice(0, 16);
    now.setHours(now.getHours() - 6)
    const currentTimestamp = now.toISOString().slice(0, 16);
    


    const currentIndex = myTimes.indexOf(currentTimestamp)
    // console.log("current index:", currentIndex)
    // console.log("Future Timestamp", myTimes[currentIndex + 12])
    // console.log("Timestamps: " + myTimes[0])

    for (let i = 0; i < myLength; i++) {
        const currentTimeAMPM = new Date(myTimes[i]).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        const weatherData = descriptionObject[myCode[i]]
        let myImage = "";
        let myDescript = "";
        if(myDay[i]){
            myImage = weatherData['day'].image;
            myDescript = weatherData['day'].description;
        } else{
            myImage = weatherData['night'].image;
            myDescript = weatherData['night'].description;
        }
        weatherList.widgets.push(
            {
                "decoratedText": {
                    "topLabel": `${currentTimeAMPM}`,
                    "text": `${myTemps[i]} C - ${myDescript}`,
                    "startIcon": {
                    "altText": "test",
                    "imageType": "CIRCLE",
                    "iconUrl": `${myImage}`
                    },
                    "bottomLabel": ""
                    }
            }
        )
    }
    return weatherList;
}
// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

function convertGMTtoEST(gmtDate) {
    const estOffset = -5 * 60 * 60 * 1000; // EST is 5 hours behind GMT
    return new Date(new Date(gmtDate).getTime() + estOffset);
  }

