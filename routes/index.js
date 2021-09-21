const express = require('express');
const router = express.Router();
const controller = require('../resources/controller')

router.get('/', controller.renderForm);

router.post('/', controller.weatherApi)
module.exports = router;