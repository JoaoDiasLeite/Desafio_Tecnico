const axios = require('axios').default;
const winston = require('winston');

require('dotenv').config();

let api_rapid_key = process.env.API_RAPID_KEY;
let api_rapid_host = process.env.API_RAPID_HOST;
let api_geo_key = process.env.GEO_KEY;

const apiUrl = 'https://community-open-weather-map.p.rapidapi.com/weather'
const rapid_key = api_rapid_key;
const rapid_host = api_rapid_host;
const geo_key = api_geo_key;



async function getValues(city){

    const weatherValues = await axios({
        method: 'get',
        url: apiUrl,
        params: {
            q: city,
            units: 'metric', 
            lang:'pt',
        },
        headers: {
            'x-rapidapi-key': rapid_key,
            'x-rapidapi-host': rapid_host
        }
    })
    return weatherValues
}

async function getTimeValues (city){
  
     const timeValues = await axios({
        method:'get',
        url: 'https://api.ipgeolocation.io/astronomy',
        params:{
            apiKey: geo_key, 
            location:city,
        }
       })
    return timeValues
}

async function apiWeather (cities){
  
    const js = {city: cities}
    const apiValue = await axios.post( 'http://localhost:8081/api', js)
      
      
   return apiValue
}


module.exports = {
    getValues,
    getTimeValues,
    apiWeather,
    
    
}