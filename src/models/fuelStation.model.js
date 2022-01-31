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
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [<Long>, <Lat>]
            default: [0,0],
        }
    },
    fuel_price: {
        type: Number
    }

});

StationsSchema.index({location: "2dsphere"});

const Stations = mongoose.model('Stations', StationsSchema);

module.exports = Stations;

// x_coordinate: {
//     type: Number
// },
// y_coordinate: {
//     type: Number
// },
