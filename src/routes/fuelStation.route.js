const express = require('express');

const router = express.Router();

const StationController = require('../controllers/fuelStation.controller');

// creating routes

// route to get all stations
router.get('/', StationController.getStationsList);

// route to post station
router.post('/', StationController.createStation);

// route update fuel price
router.put('/:id', StationController.updateFuelPrice);

// route to delete station
router.delete('/:id?', StationController.deleteStation);


// route to get nearest stations route
router.get('/find/:lat?/:long?', StationController.getNearestStations);

module.exports = router;


