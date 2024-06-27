const express = require('express');
const router = express.Router();
const { createVaccine, getAllVaccines } = require('../controllers/vaccine-controller');

router.route('/').post(createVaccine).get(getAllVaccines);

module.exports = router;