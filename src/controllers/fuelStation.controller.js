const StationModel = require('../models/fuelStation.model');
const Stations = require('../models/fuelStation.model')


// handling get route to get all fuel stations
exports.getStationsList = async (req, res) => {

    try {
        const stations = await Stations.find({});
        let stationsObject = [];
        stationsObject = stations.map(i => {
            const newObj = {
                station_name : i.station_name,
                x_coordinate : i.location.coordinates[0],
                y_coordinate : i.location.coordinates[1],
                fuel_price : i.fuel_price,
            }
            return newObj;
        })
        console.log(stationsObject);
        res.status(200).send(stationsObject);
    }catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

// handling post route to add new fuel station
exports.createStation = async (req, res) => {
    // console.log('create new station');

    // trimming co-ordinates till 4 decimal
    const newLat = parseFloat(req.body.y_coordinate.toFixed(4));
    const newLong = parseFloat(req.body.x_coordinate.toFixed(4));

    // creating an object with trimmed co-ordinates along with original body of name & price
    const stationObj = {
        station_name: req.body.station_name,
        location: {coordinates: [newLong, newLat]},
        fuel_price: req.body.fuel_price
    };

    // passing data to Station Model Constructor
    const stationReqData = new StationModel(stationObj);

    // validating if input in not undefined
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({success: false, message: 'Please fill all fields'})
    }

    // validating station name must not be number
    if (!isNaN(req.body.station_name)) {
        return res.status(400).send({success: false, message: 'Station name can only be string!'})
    }

    // validating x co-ordinate
    if ((req.body.x_coordinate < -180) || (req.body.x_coordinate > 180)) {
        return res.status(400).send({success: false, message: 'X co-ordinate is not valid'});
    }
    // validating y co-ordinate
    if ((req.body.y_coordinate < -90) || (req.body.y_coordinate > 90)) {
        return res.status(400).send({success: false, message: 'Y co-ordinate is not valid'});
    }

    if (req.body.fuel_price < 0) {
        return res.status(400).send({success: false, message: 'fuel price can not be negative'});
    }

    // sending data to model to save in db
    else {
        console.log('valid data')
        try {
            const stationData = await Stations.create(stationReqData);
            return res.status(201).send({message: 'Station inserted successfully', data: stationData});
        } catch (err) {
            if (err.code === 11000) {
                console.log("Name Exist!!")
                return res.status(400).send('Station Name already exist');
            }
            return console.log(err);
        }

    }
}


// handling put route to update fuel price
exports.updateFuelPrice = async (req, res) => {
    // validating if input empty
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        return res.status(400).send({success: false, message: 'please fill fuel price field'})
    }

    const { station_name, x_coordinate, y_coordinate, fuel_price } = req.body;

    // validating for only fuel price can be updated
    if (fuel_price && req.params.id) {
        if (station_name || x_coordinate || y_coordinate) {
            return res.status(400).send({success: false, message: 'only fuel price can be updated! '});
        }
        if (fuel_price < 0) {
            return res.status(400).send({success: false, message: 'fuel price can not be negative'});
        }
        else {
            try {
                console.log(req.body)
                const updatedFuelPrice = await Stations.updateOne(
                    {
                        "_id": req.params.id,
                    },
                    req.body
                )
                return res.status(200).send({success: true, message: 'fuel price has been updated successfully', data: updatedFuelPrice});
            } catch (err) {
                console.log(err);
                return res.status(500).send(err);

            }

        }
    }
}


// handling delete route to update fuel price
exports.deleteStation = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({success: false, message: 'Please provide station id'});
    }

    try {
        const deletedStation = await Stations.remove({_id: req.params.id});
        return res.status(200).send({success: true, message: 'Station has been deleted successfully', data: deletedStation});
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}


// TO DO
// handling get route to fetch top 3 nearby stations from user location
exports.getNearestStations = async (req, res) => {
    if (!req.params.long || !req.params.lat) {
        return res.status(400).send({message: 'Please provide latitude and longitude both'});
    }
    // validating x co-ordinate
    if ((req.params.long < -180) || (req.params.long > 180)) {
        return res.status(400).send({success: false, message: 'X co-ordinate is not valid'});
    }
    // validating y co-ordinate
    if ((req.params.lat < -90) || (req.params.lat > 90)) {
        return res.status(400).send({success: false, message: 'Y co-ordinate is not valid'});
    }
    const x_cordinate = req.params.long; // x -> Longitude
    const y_cordinate = req.params.lat; // y -> Latitude

    // split str cords to = then parse 1st index to float
    const xCordinateNumber = parseFloat(x_cordinate.split("=").pop());
    const yCordinateNumber = parseFloat(y_cordinate.split("=").pop());
    // console.log(yCordinateNumber);
    // pass these cordinates to model method to get results
    try {
        const data = await Stations.find({
            location: {
                $near: {
                    $maxDistance: 5000,
                    $geometry: {
                        type: "Point",
                        coordinates: [xCordinateNumber, yCordinateNumber]
                    },
                },
            },
        });
        console.log(data);
        return res.status(200).send({success: true, message: 'Station has been fetched successfully', data: data});

    } catch (err) {
        console.log(err);
        return res.status(400).send({message: 'Unknown error', error: err})
    }


    // StationModel.findNearbyStations(xCordinateNumber, yCordinateNumber, (err, stations) => {
    //     if (err) {
    //         return res.status(500).send(err);
    //     }
    //     // trimming the distance from stations object of data upto 2 decimal point
    //     let trimmedDistanceStaions = stations.map((i) => {
    //         i.distance = parseFloat(i.distance.toFixed(2))
    //         return i;
    //     })
    //     console.log(trimmedDistanceStaions);
    //     res.status(200).send({success: true, message: 'Station has been deleted successfully', data: trimmedDistanceStaions});
    // })
}

