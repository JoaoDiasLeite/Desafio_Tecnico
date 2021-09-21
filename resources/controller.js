const method = require('./methods')
const validationError = require('../utils/error/validationError');

const winston = require('winston')
const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
    
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log', leve: 'info'}),
    ],
  });

async function weatherData(req, res, next) {
   var cities = req.body.city;
   winstonLogger.info(req);
   
    try {
        var weather = [];
        for( var i = 0 ; i < cities.length; i++ ) {
        try {
            const weatherData = await method.getValues(cities[i]);
            try{
                const weatherTime = await method.getTimeValues(cities[i]);
            try { 
                weather.push({
                    city: weatherData.data.name,  
                    description:  weatherData.data.weather[0].description,
                    temp: weatherData.data.main.temp,
                    sunrise: weatherTime.data.sunrise,
                    sunset: weatherTime.data.sunset
                })
    
            } catch (error) { 
                return next(new validationError(400, 'Bad Request'));      
            }      
            }catch(error){
                return next(new validationError(400, 'Bad Request')); 
            }              
        } catch (error) {
            return next(new validationError(400, 'Bad Request')); 
        }
    }
    
            res.json(weather)
    } catch(error){
        return next(new validationError(400, 'Bad Request')); 
    }  
    
  
}

async function renderForm(req, res, next) {
    res.render('index', {
        message: ''
    })
};

async function weatherApi(req, res, next) {
    
    var cities = req.body.city;
    
     try {
        const apiResult = await method.apiWeather(cities);
        const row = html => `<tr role="row">\n${html}</tr>\n`,
        datarow = object => row(Object.values(object).reduce((html, value) => (html + `<td style="text-align: center;">${value}</td>`), ''));

    async function htmlTable(dataList) {    
        return `
         ${dataList.reduce((html, object) => (html + datarow(object)), '')}
        
        `   
}         
        var arrCity =  [];
        var arrTemp = [];

        for( var i = 0; i < apiResult.data.length; i++){
             arrCity.push(apiResult.data[i].city);
             arrTemp.push(apiResult.data[i].temp )
            
             
        }
           res.render('table', {table: await htmlTable(apiResult.data), citychar : arrCity, temps : arrTemp })
     }catch(error){
         console.error(error);
         return res.send("Eroo no pedido" + "<br>" + '<input type="button" value="Go Back From Whence You Came!" onclick="history.back(-1)" />');
     }  
 };


module.exports={
    renderForm,
    weatherData,
    weatherApi

}
