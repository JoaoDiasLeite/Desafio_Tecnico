const express = require('express');
const router = express.Router();
const controller = require('../resources/controller')

router.post('/', controller.weatherData);

module.exports = router;