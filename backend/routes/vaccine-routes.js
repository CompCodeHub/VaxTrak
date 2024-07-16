const express = require('express');
const router = express.Router();
const { createVaccine, getAllVaccines } = require('../controllers/vaccine-controller');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').post(adminAuth, createVaccine).get(adminAuth, getAllVaccines);

module.exports = router;