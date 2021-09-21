const express = require('express');
const app = express()
const path = require('path')
const winston = require('winston');
const ErrorsHandler = require('./utils/error/errors-handler');

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
  
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log', leve: 'info'}),
  ],
});
 
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api')

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")));
app.use("/views", express.static('views'));

app.use('/', indexRouter)
app.use('/api', apiRouter)

app.use('/', function(req, res, next) {
    winstonLogger.info(`${req.url}. Body: ${JSON.stringify(req.body)}. Params: ${JSON.stringify(req.params)}`);
    return next();
});

app.use(function(req, res) {
    const err = "404 Route Not Found";
    res.status(404).end(err);
});

app.use(ErrorsHandler);

app.listen(8081, function() {
    console.log("Servidor a funcionar na porta 8081!")
});
module.exports = app