const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const asyncHandler = require('express-async-handler');
const { OAuth2Client } = require('google-auth-library');

// Create and configure the app
const app = express();

// Trust GCPs front end to for hostname/port forwarding
app.set("trust proxy", true);

count = 0
// Initial route for the add-on
// app.post('/', asyncHandler(async (req, res) => {
//     const event = req.body;
//     const hourlyWeather = await hourlyWeatherAPI();
//     console.log("Hello");
//     hourOne = hourlyWeather.list[0].main.temp
//     condOne = hourlyWeather.list[0].weather[0].description
//     const card = {
//         sections: [{
//             "header": "Weekly Weather",
//             "widgets": [
//                 {
//                 "decoratedText": {
//                     "topLabel": "Day 1",
//                     "text": "WDay 1",
//                     "startIcon": {
//                     "altText": "test",
//                     "imageType": "CIRCLE",
//                     "iconUrl": "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png"
//                     },
//                     "bottomLabel": ""
//                     }
//                 },
//                 {
//                     "decoratedText": {
//                         "topLabel": "Day 2",
//                         "text": "Weather Day 2",
//                         "startIcon": {
//                         "altText": "test",
//                         "imageType": "CIRCLE",
//                         "iconUrl": "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png"
//                         },
//                         "bottomLabel": ""
//                         }
//                 }
//             ],
//             "collapsible": true
//         },
//         {
//             "header": "Hourly Weather",
//             "widgets": [
//                 {
//                 "decoratedText": {
//                     "topLabel": "Hour 1",
//                     "text": "Weather Hour 1",
//                     "startIcon": {
//                     "altText": "test",
//                     "imageType": "CIRCLE",
//                     "iconUrl": "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png"
//                     },
//                     "bottomLabel": ""
//                 }
//                 }
//             ],
//             "collapsible": true
//         },
//         {
//             "header": "Test Ouput",
//             "widgets": [
//                 {
//                     textParagraph: {
//                         text: `Weather: ${hourOne} and ${condOne}`
//                     }
//                 },
//             ],
//             "collapsible": true
//         },
    
//     ]
//     };
//       const renderAction = {
//                  action: {
//                      navigations: [{
//                          pushCard: card
//                      }]
//                  }
//              };
//     res.json(renderAction);
// }));
app.get('/', asyncHandler(async (req, res) => {
    const hourlyWeather = await hourlyWeatherAPI();
    const weatherList = buildHourlyWeather(hourlyWeather);
    console.log(weatherList)
    res.send(`New Test`);
  }));

async function hourlyWeatherAPI() {
    try {
        const lat = 43.46;
        const lon = -80.52;
        const apiUrl = `https://api.open-meteo.com/v1/gem?latitude=43.4831&longitude=-80.5339&hourly=temperature_2m,weathercode&timezone=America%2FNew_York&forecast_days=1`;
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.log(error);
      throw new Error('An error occurred while calling the API.');
    }
  }

  function buildHourlyWeather(hourlyWeather){
    const myTimes = hourlyWeather.hourly.time;
    const myTemps = hourlyWeather.hourly.temperature_2m;
    const myCode = hourlyWeather.hourly.weathercode;
    const myLength = myTimes.length;
    const weatherList = {
        header: 'Weekly Weather',
        widgets: [],
        collapsible: true
    };
    for (let i = 0; i < myLength; i++) {
        weatherList.widgets.push(
            {
                "decoratedText": {
                    "topLabel": `${myTimes[i]}`,
                    "text": `${myTemps[i]} C - ${myCode[i]}`,
                    "startIcon": {
                    "altText": "test",
                    "imageType": "CIRCLE",
                    "iconUrl": "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png"
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

