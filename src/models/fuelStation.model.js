const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Schema
const StationsSchema = new Schema({
    station_name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    location: {
        type: [Number], // [<Long>, <Lat>]
        index: '2d'
    },
    fuel_price: {
        type: Number
    }

});

const Stations = mongoose.model('Stations', StationsSchema);

module.exports = Stations;

// x_coordinate: {
//     type: Number
// },
// y_coordinate: {
//     type: Number
// },
